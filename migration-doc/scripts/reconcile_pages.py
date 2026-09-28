#!/usr/bin/env python3
"""One-time, mechanical reconciliation of the hand-written API pages with the OpenAPI file.

Consumes `node scripts/check-api-docs.mjs --json` and applies the fixes where the spec is the
source of truth and no judgement is needed:
  - response codes missing from a block's <ResponseCodes>  → added (sorted), title from the spec
  - body fields missing from "#### Request Body"            → row added, description from the spec
  - required-flag mismatches                                → <Req /> added or removed
Everything else (page-only fields/codes, scope/role mismatches) is left for a human decision.
Idempotent; prints what it changed.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
SPEC = ROOT / 'api' / 'hem-api-1.2.2.yaml'
spec = yaml.safe_load(SPEC.read_text())

STATUS_TEXTS = {
    '200': 'Operation successful', '201': 'Created', '202': 'Accepted', '204': 'No content',
    '400': 'Incorrect argument(s)', '401': 'Missing or invalid JWT_TOKEN', '403': 'Incorrect access scope',
    '404': 'Not found', '406': 'Operation failed', '409': 'Incorrect internal state',
    '411': 'Protocol error - Content-Length required', '412': 'Protocol error - CORS validation failed',
    '413': 'Protocol error - request body too big', '418': 'TLS connection required', '500': 'Internal server error',
}
TYPE_NAMES = {'string': 'String', 'integer': 'Number', 'number': 'Number', 'boolean': 'Boolean', 'array': 'Array', 'object': 'Object'}


def deref(n):
    while isinstance(n, dict) and '$ref' in n:
        t = spec
        for k in n['$ref'].lstrip('#/').split('/'):
            t = t[k]
        n = t
    return n


OPS = {}
for path, item in spec['paths'].items():
    for m, op in item.items():
        if m in ('get', 'post', 'put', 'patch', 'delete'):
            OPS[op['operationId']] = op


def response_title(opid, code):
    if code in STATUS_TEXTS:
        return STATUS_TEXTS[code]
    r = deref(OPS[opid]['responses'][code])
    d = re.sub(r'^\d{3}\s*[—-]\s*', '', r.get('description', ''))
    d = d.split('. ')[0].rstrip('.').strip()
    return d[:90] if d else f'HTTP {code}'


def body_prop(opid, name):
    sch = deref(OPS[opid]['requestBody'])['content']['application/json']['schema']
    sch = deref(sch)
    prop = deref(sch['properties'][name])
    required = name in (sch.get('required') or [])
    desc = ' '.join(prop.get('description', '').split())
    return TYPE_NAMES.get(prop.get('type'), 'String'), required, desc


def groups_of(lines):
    """[(first_line_idx, last_line_idx_exclusive, [operationIds])] for consecutive <Endpoint> blocks."""
    starts = [i for i, l in enumerate(lines) if l.startswith('<Endpoint ')]
    groups = []
    for i in starts:
        opid = re.search(r'operationId="([^"]+)"', lines[i])
        if groups and i - groups[-1][1] <= 1 and all(not l.strip() for l in lines[groups[-1][1]:i]):
            groups[-1][1] = i + 1
            groups[-1][2].append(opid.group(1) if opid else None)
        else:
            groups.append([i, i + 1, [opid.group(1) if opid else None]])
    spans = []
    for k, (s, e, ids) in enumerate(groups):
        end = groups[k + 1][0] if k + 1 < len(groups) else len(lines)
        spans.append((s, end, ids))
    return spans


def find_group(lines, opid):
    for s, e, ids in groups_of(lines):
        if opid in ids:
            return s, e
    raise KeyError(opid)


def add_response_code(lines, opid, code):
    s, e = find_group(lines, opid)
    title = response_title(opid, code)
    entry = f'<ResponseCode code="{code}" title={json.dumps(title)} />'
    try:
        start = next(i for i in range(s, e) if lines[i].strip() == '<ResponseCodes>')
        end = next(i for i in range(start, e) if lines[i].strip() == '</ResponseCodes>')
    except StopIteration:
        # no block yet: insert a section before "#### Response data"/"#### Log entries" or at the block end
        pos = next((i for i in range(s, e) if re.match(r'#### (Response data|Log entries)', lines[i])), e)
        while pos > s and not lines[pos - 1].strip():
            pos -= 1
        lines[pos:pos] = ['', '#### Response status code', '', '<ResponseCodes>', entry, '</ResponseCodes>', '']
        return
    # insert keeping numeric order (by the first code >= new code)
    for i in range(start + 1, end):
        m = re.match(r'<ResponseCode code="(\d+)"', lines[i].strip())
        if m and int(m.group(1)) > int(code):
            lines.insert(i, entry)
            return
    lines.insert(end, entry)


def body_table(lines, opid):
    s, e = find_group(lines, opid)
    h = next(i for i in range(s, e) if lines[i].strip() == '#### Request Body')
    t = next(i for i in range(h, e) if lines[i].startswith('|'))
    u = t
    while u < e and lines[u].startswith('|'):
        u += 1
    return t, u


def add_body_field(lines, opid, name):
    t, u = body_table(lines, opid)
    typ, required, desc = body_prop(opid, name)
    lines.insert(u, f'| `{name}`{"<Req />" if required else ""} | {typ} | {desc} |')


def set_required(lines, opid, name, required):
    t, u = body_table(lines, opid)
    for i in range(t, u):
        cells = lines[i].split('|')
        if len(cells) > 1 and re.sub(r'<Req\s*/>|`', '', cells[1]).strip() == name:
            first = re.sub(r'<Req\s*/>', '', cells[1]).rstrip()
            cells[1] = first + ('<Req />' if required else '') + ' '
            lines[i] = '|'.join(cells)
            return
    raise KeyError(f'{opid}.{name}')


def main():
    out = subprocess.run(['node', 'scripts/check-api-docs.mjs', '--json'], cwd=ROOT, capture_output=True, text=True, check=True).stdout
    findings = json.loads(out)['findings']
    changes = 0
    by_page = {}
    for f in findings:
        if f['page']:
            by_page.setdefault(f['page'], []).append(f)
    for page, fs in by_page.items():
        p = ROOT / page
        lines = p.read_text().split('\n')
        for f in fs:
            msg, opid = f['message'], (f['operationId'] or '').split('+')[0]
            m = re.match(r'response code (\d+) missing from <ResponseCodes>', msg)
            if m:
                add_response_code(lines, opid, m.group(1)); changes += 1; print(f'{page}: +{m.group(1)} [{opid}]'); continue
            m = re.match(r'body field `(\w+)` missing from "#### Request Body"', msg)
            if m:
                add_body_field(lines, opid, m.group(1)); changes += 1; print(f'{page}: +field {m.group(1)} [{opid}]'); continue
            m = re.match(r'body field `(\w+)` required flag: page=(\w+) spec=(\w+)', msg)
            if m:
                set_required(lines, opid, m.group(1), m.group(3) == 'true'); changes += 1; print(f'{page}: required({m.group(1)})={m.group(3)} [{opid}]'); continue
        p.write_text('\n'.join(lines))
    print(f'{changes} changes')


if __name__ == '__main__':
    sys.exit(main())
