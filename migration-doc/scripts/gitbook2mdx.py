#!/usr/bin/env python3
"""Convert the legacy GitBook export (legacy-gitbook/) to Docusaurus MDX pages (docs/).

Idempotent: every run regenerates all converted pages. Prints a report of anything it could not
convert (unknown template tags, unresolved links, endpoints without an operationId, tables kept as
HTML) and exits non-zero when errors remain. Conversion rules: migration-doc/PLAN.md → "Converter".
"""
from __future__ import annotations

import html
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'legacy-gitbook'
DST = ROOT / 'docs'
SPEC = ROOT / 'api' / 'hem-api-1.2.2.yaml'

errors: list[str] = []
warnings: list[str] = []

# ----------------------------------------------------------------------------- helpers

def slugify(text: str) -> str:
    """Docusaurus/github-slugger style heading slug."""
    text = re.sub(r'<[^>]+>', '', text)
    text = text.replace('`', '')
    text = re.sub(r'[^\w\s-]', '', text.lower(), flags=re.UNICODE)
    text = re.sub(r'\s+', '-', text.strip())
    return text


def strip_md(text: str) -> str:
    text = re.sub(r'^#+\s*', '', text.strip())
    text = re.sub(r'[*_]{1,3}([^*_]+)[*_]{1,3}', r'\1', text)
    return text.strip()


def yaml_str(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


# SUMMARY.md → labels, ordered page list
def load_summary() -> dict[str, str]:
    labels: dict[str, str] = {}
    for line in (SRC / 'SUMMARY.md').read_text().split('\n'):
        m = re.match(r'^\s*\* \[(.+?)\]\((.+?)\)\s*$', line)
        if m:
            labels[m.group(2)] = m.group(1)
    return labels


LABELS = load_summary()

# OpenAPI → (METHOD, path) → operationId
SPEC_DOC = yaml.safe_load(SPEC.read_text())
OPS: dict[tuple[str, str], str] = {}
for _path, _item in SPEC_DOC['paths'].items():
    for _m, _op in _item.items():
        if _m in ('get', 'post', 'put', 'patch', 'delete'):
            OPS[(_m.upper(), _path)] = _op['operationId']


def normalise_path(url: str) -> str:
    path = url.replace('https://my.ence.do', '')
    path = path.replace(':offset/:limit', '{offset}/{count}')
    path = re.sub(r':kid\b', '{kid}', path)
    path = re.sub(r':offset\b', '{offset}', path)
    path = re.sub(r':id\b', '{file}', path)
    return path


# Renamed headings (so the checker can map enum tables to fields) + anchor map for links.
HEADING_ALIASES = {
    'Possible `key` type': 'Possible `type` values',
    'Possible key `type`': 'Possible `type` values',
    'Possible key `mode` (for NIST ECC keys only)': 'Possible `mode` values (NIST ECC keys only)',
    'Possible `pubkey` type': 'Possible `pubkey` values',
}
ANCHOR_ALIASES = {slugify(k): slugify(v) for k, v in HEADING_ALIASES.items()}

RESPONSE_TITLE_FIXES = [
    (r'\bsuccsessful\b', 'successful'),
    (r"^(Bad Request|Unauthorized|Forbidden|Not Acceptable|Conflict|I'm a Teapot)\s+(?=\S)", ''),
    (r'\s{2,}', ' '),
]

# Tags we emit or keep; any other `<Word` in prose is escaped for MDX.
KNOWN_TAGS = ('br', 'Req', 'Endpoint', 'ContentRef', 'Roles', 'Scope', 'ResponseCodes', 'ResponseCode', 'Tabs',
              'TabItem', 'DocCardList', 'div', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'code', 'em',
              'strong', 'p', 'a', 'sup', 'span', 'var')


# ----------------------------------------------------------------------------- output paths

def is_api_page(rel: Path) -> bool:
    return rel.parts[:2] == ('reference', 'api-reference')


def out_rel(rel: Path) -> Path:
    """Output path (relative to docs/) for a legacy path (relative to legacy-gitbook/)."""
    name = 'index' if rel.name == 'README.md' else rel.stem
    ext = '.mdx' if is_api_page(rel) else '.md'
    return rel.with_name(name + ext)


def resolve_legacy(from_rel: Path, target: str) -> Path | None:
    """Resolve a legacy relative link target (file, dir or README) to a legacy path."""
    base = (SRC / from_rel).parent
    cand = (base / target).resolve()
    if cand.is_dir():
        cand = cand / 'README.md'
    if cand.is_file():
        return cand.relative_to(SRC)
    return None


def rel_link(from_rel: Path, to_rel: Path) -> str:
    """Relative link from one output file to another (both relative to docs/)."""
    import os
    return os.path.relpath(out_rel(to_rel), out_rel(from_rel).parent).replace('\\', '/')


# ----------------------------------------------------------------------------- HTML tables

class TableParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=False)
        self.rows: list[list[str]] = []
        self.cur: list[str] | None = None
        self.cell: list[str] | None = None
        self.header_rows = 0
        self.in_thead = False

    def handle_starttag(self, tag, attrs):
        if tag == 'thead':
            self.in_thead = True
        elif tag == 'tr':
            self.cur = []
        elif tag in ('td', 'th'):
            self.cell = []
        elif self.cell is not None:
            if tag == 'br':
                self.cell.append('<br />')
            elif tag == 'code':
                self.cell.append('`')
            elif tag == 'em':
                self.cell.append('_')
            elif tag == 'strong':
                self.cell.append('**')
            elif tag in ('p', 'span'):
                pass
            else:
                self.cell.append(f'<{tag}>')

    def handle_endtag(self, tag):
        if tag == 'thead':
            self.in_thead = False
        elif tag == 'tr' and self.cur is not None:
            self.rows.append(self.cur)
            if self.in_thead:
                self.header_rows += 1
            self.cur = None
        elif tag in ('td', 'th') and self.cell is not None and self.cur is not None:
            self.cur.append(''.join(self.cell))
            self.cell = None
        elif self.cell is not None:
            if tag == 'code':
                self.cell.append('`')
            elif tag == 'em':
                self.cell.append('_')
            elif tag == 'strong':
                self.cell.append('**')
            elif tag == 'p':
                self.cell.append('<br />')
            elif tag in ('span', 'br'):
                pass
            else:
                self.cell.append(f'</{tag}>')

    def handle_data(self, data):
        if self.cell is not None:
            self.cell.append(data)

    def handle_entityref(self, name):
        if self.cell is not None:
            self.cell.append(html.unescape(f'&{name};'))

    def handle_charref(self, name):
        if self.cell is not None:
            self.cell.append(html.unescape(f'&#{name};'))


def table_to_gfm(line: str, where: str) -> str:
    p = TableParser()
    p.feed(line)
    rows = p.rows
    if not rows:
        errors.append(f'{where}: unparsable table')
        return line
    ncol = max(len(r) for r in rows)

    def clean(cell: str) -> str:
        cell = re.sub(r'(<br />)+$', '', cell.strip())
        cell = re.sub(r'^(<br />)+', '', cell)
        cell = cell.replace('|', '\\|')
        cell = re.sub(r'\s+', ' ', cell).strip()
        return cell

    rows = [[clean(c) for c in r] + [''] * (ncol - len(r)) for r in rows]
    leftover = [c for r in rows for c in r if re.search(r'</?(?!br\b)[a-z]+', c)]
    if leftover:
        warnings.append(f'{where}: table kept as HTML (unsupported inline tags: {leftover[:2]})')
        return line.replace('<br>', '<br />')
    header = rows[0] if p.header_rows else [''] * ncol
    body = rows[1:] if p.header_rows else rows
    out = ['| ' + ' | '.join(header) + ' |', '|' + '---|' * ncol]
    out += ['| ' + ' | '.join(r) + ' |' for r in body]
    return '\n'.join(out)


# ----------------------------------------------------------------------------- block conversion

def parse_tabs(lines: list[str], i: int) -> tuple[list[tuple[str, list[str]]], int]:
    """lines[i] == '{% tabs %}'. Returns [(title, content_lines)], index after '{% endtabs %}'."""
    tabs: list[tuple[str, list[str]]] = []
    i += 1
    cur_title: str | None = None
    cur: list[str] = []
    while i < len(lines):
        line = lines[i]
        m = re.match(r'\{% tab title="([^"]*)" %\}\s*$', line)
        if m:
            cur_title, cur = m.group(1).strip(), []
        elif line.strip() == '{% endtab %}':
            tabs.append((cur_title or '', cur))
            cur_title = None
        elif line.strip() == '{% endtabs %}':
            return tabs, i + 1
        elif cur_title is not None:
            cur.append(line)
        i += 1
    errors.append('unterminated {% tabs %}')
    return tabs, i


def content_text(lines: list[str]) -> str:
    return '\n'.join(l for l in lines).strip()


def role_value(text: str) -> str:
    t = strip_md(text)
    if t.lower() == 'allowed':
        return ''  # boolean true → bare attribute
    if t.lower() in ('not allowed', 'not-allowed', 'denied'):
        return '={false}'
    return '=' + json.dumps(t, ensure_ascii=False)


def emit_roles(tabs) -> str:
    attrs = []
    names = {'user': 'user', 'master': 'master', 'extauth': 'ext', 'ext': 'ext'}
    seen: set[str] = set()
    for title, content in tabs:
        key = names.get(title.lower().replace(' ', ''))
        if not key and 'master' not in seen:
            key = 'master'  # legacy GitBook typo: the Master tab is titled "Alternative" on a few pages
            warnings.append(f'Roles: tab {title!r} treated as Master')
        if not key:
            warnings.append(f'Roles: unknown tab {title!r}')
            continue
        seen.add(key)
        attrs.append(f'{key}{role_value(content_text(content))}')
    return f'<Roles {" ".join(attrs)} />'


SCOPE_RE = re.compile(r'^[a-z_]+:[A-Za-z0-9:<>\[\]|_.-]+$')


def emit_scope(tabs) -> list[str]:
    """Returns the <Scope/> line followed by any prose the tabs carried (kept as markdown)."""
    main: list[str] = []
    alt: list[str] = []
    extra: list[str] = []
    for title, content in tabs:
        lines = [l for l in content if l.strip() != '&#x20;']
        picked: list[str] = []
        rest: list[str] = []
        for l in lines:
            m = re.match(r'^`([^`]+)`\s*$', l.strip())
            code = m.group(1) if m else None
            is_main = title.lower().startswith('main')
            if code and SCOPE_RE.match(code) and ((is_main and not picked) or not is_main):
                picked.append(code)
            else:
                rest.append(l)
        if title.lower().startswith('main'):
            main += picked
        else:
            if not title.lower().startswith('alt'):
                warnings.append(f'Scope: unknown tab {title!r} treated as Alternative')
            alt += picked
        rest_text = '\n'.join(rest).strip('\n')
        if rest_text:
            # demote headings that GitBook allowed inside tabs to plain paragraphs
            rest_text = re.sub(r'^#+\s*', '', rest_text, flags=re.M)
            extra += ['', rest_text]

    def attr(name, values):
        if not values:
            return ''
        if len(values) == 1:
            return f' {name}={json.dumps(values[0], ensure_ascii=False)}'
        return f' {name}={{{json.dumps(values, ensure_ascii=False)}}}'

    return [f'<Scope{attr("main", main)}{attr("alt", alt)} />', *extra]


def emit_response_codes(tabs, where: str) -> list[str]:
    out = ['<ResponseCodes>']
    for title, content in tabs:
        m = re.match(r'^(\d{3})\s*:?\s*(.*)$', title)
        if not m:
            warnings.append(f'{where}: response tab without status code: {title!r}')
            code, text = '', title
        else:
            code, text = m.group(1), m.group(2)
        for pat, rep in RESPONSE_TITLE_FIXES:
            text = re.sub(pat, rep, text)
        text = text.strip()
        body = content_text(content)
        attrs = f'code="{code}"' + (f' title={json.dumps(text, ensure_ascii=False)}' if text else '')
        if body:
            out += [f'<ResponseCode {attrs}>', '', *content, '', '</ResponseCode>']
        else:
            out.append(f'<ResponseCode {attrs} />')
    out.append('</ResponseCodes>')
    return out


def emit_generic_tabs(tabs) -> list[str]:
    out = ['<Tabs>']
    for title, content in tabs:
        out += [f'<TabItem value={json.dumps(slugify(title))} label={json.dumps(title)}>', '', *content, '', '</TabItem>']
    out.append('</Tabs>')
    return out


def last_nonempty(out: list[str]) -> str:
    for l in reversed(out):
        if l.strip():
            return l
    return ''


def pop_heading(out: list[str], text: str) -> bool:
    """Remove the trailing heading `text` (and blank lines after it) if present."""
    j = len(out) - 1
    while j >= 0 and not out[j].strip():
        j -= 1
    if j >= 0 and out[j].strip() == text:
        del out[j:]
        return True
    return False


def convert_blocks(lines: list[str], rel: Path) -> tuple[list[str], str | None]:
    out: list[str] = []
    title: str | None = None
    i = 0
    in_fence = False
    last_h2: tuple[str, int] | None = None
    last_path: str | None = None
    where = str(rel)
    while i < len(lines):
        line = lines[i]
        if line.startswith('```'):
            if not in_fence:
                lang = line[3:].strip()
                if lang == 'javascript':
                    line = '```json'
            in_fence = not in_fence
            out.append(line)
            i += 1
            continue
        if in_fence:
            out.append(line)
            i += 1
            continue
        stripped = line.strip()
        # H1 → title
        if title is None and line.startswith('# '):
            title = line[2:].strip()
            i += 1
            continue
        # empty heading
        if re.match(r'^#+\s*$', stripped):
            i += 1
            continue
        # hints
        m = re.match(r'\{% hint style="(\w+)" %\}', stripped)
        if m:
            style = {'success': 'tip'}.get(m.group(1), m.group(1))
            out.append(f':::{style}')
            i += 1
            continue
        if stripped == '{% endhint %}':
            out.append(':::')
            i += 1
            continue
        # content-ref
        m = re.match(r'\{% content-ref url="([^"]*)" %\}', stripped)
        if m:
            target = resolve_legacy(rel, m.group(1))
            if target is None:
                errors.append(f'{where}: content-ref target not found: {m.group(1)}')
            else:
                out.append(f'<ContentRef id="{out_rel(target).with_suffix("").as_posix()}" />')
            while i < len(lines) and lines[i].strip() != '{% endcontent-ref %}':
                i += 1
            i += 1
            continue
        # tabs
        if stripped == '{% tabs %}':
            tabs, i = parse_tabs(lines, i)
            if pop_heading(out, '#### Allowed users'):
                out.append(emit_roles(tabs))
            elif pop_heading(out, '#### Required access scope'):
                out += emit_scope(tabs)
            elif pop_heading(out, '#### Response status code'):
                out.append('#### Response status code')
                out.append('')
                out += emit_response_codes(tabs, where)
            else:
                out += emit_generic_tabs(tabs)
            continue
        if '{%' in stripped:
            errors.append(f'{where}: unconverted template tag: {stripped[:60]}')
        # endpoint line
        m = re.match(r'<mark style="color:\w+;">`(\w+)`</mark> `([^`]+)`\s*$', stripped)
        if m:
            method, path = m.group(1), normalise_path(m.group(2))
            op = OPS.get((method, path))
            if not op:
                errors.append(f'{where}: no operationId for {method} {path}')
            last_path = path
            out.append(f'<Endpoint method="{method}" path="{path}"' + (f' operationId="{op}"' if op else '') + ' />')
            i += 1
            continue
        # headings: aliases, entities, adjacent duplicates
        if line.startswith('#'):
            hm = re.match(r'^(#+)\s+(.*?)\s*$', line)
            level, text = hm.group(1), hm.group(2)
            text = text.replace('&#x20;', '').strip()
            text = re.sub(r'<a href="#[^"]*" id="[^"]*"></a>', '', text).strip()
            text = HEADING_ALIASES.get(text, text)
            if level == '##':
                if last_h2 is not None and last_h2[1] == i - 2 and last_nonempty(out) == f'## {last_h2[0]}':
                    if text == last_h2[0]:
                        i += 1
                        continue
                    level = '###'
                else:
                    last_h2 = (text, i)
            if level == '####' and text == 'Query Parameters' and last_path and '{' in last_path:
                text = 'Path Parameters'
            out.append(f'{level} {text}')
            i += 1
            continue
        # HTML table (single line)
        if stripped.startswith('<table'):
            out.append(table_to_gfm(stripped, where))
            i += 1
            continue
        out.append(line)
        i += 1
    return out, title


# ----------------------------------------------------------------------------- inline + links

def rewrite_link(rel: Path, target: str) -> str:
    where = str(rel)
    if target.startswith('mailto:') or target.startswith('#'):
        return target
    target = target.replace('https://endedo.com', 'https://encedo.com')
    m = re.match(r'^https://docs\.encedo\.com/hem-api/(?!~/)([^#]*)(#.*)?$', target)
    if m:
        path, anchor = m.group(1).rstrip('/'), m.group(2) or ''
        legacy = resolve_legacy(Path('README.md'), path + '.md') or resolve_legacy(Path('README.md'), path + '/README.md')
        if legacy is None:
            errors.append(f'{where}: cannot map absolute link {target}')
            return target
        if anchor:
            anchor = '#' + ANCHOR_ALIASES.get(anchor[1:], anchor[1:])
        return rel_link(rel, legacy) + anchor
    if re.match(r'^[a-z]+://', target):
        return target
    if target.startswith('.gitbook/assets/'):
        return '/img/' + target.rsplit('/', 1)[1]
    path, _, anchor = target.partition('#')
    legacy = resolve_legacy(rel, path)
    if legacy is None:
        errors.append(f'{where}: unresolved relative link {target}')
        return target
    if anchor:
        anchor = ANCHOR_ALIASES.get(anchor, anchor)
    return rel_link(rel, legacy) + (f'#{anchor}' if anchor else '')


def convert_inline(line: str, rel: Path) -> str:
    # required marker
    line = line.replace('<mark style="color:red;">\\*</mark>', '<Req />')
    # entities and stray html
    line = line.replace('&#x20;', '').replace('&#x26;', '&')
    line = re.sub(r'<span data-gb-custom-inline[^>]*>([^<]*)</span>', r'\1', line)
    line = re.sub(r'<a href="#[^"]*" id="[^"]*"></a>', '', line)
    line = re.sub(r'<code>([^<]*)</code>', r'`\1`', line)
    line = line.replace('<br>', '<br />')
    line = re.sub(r'</?p>', '', line)
    # links
    line = re.sub(r'\]\(([^)\s]+)\)', lambda m: '](' + rewrite_link(rel, m.group(1)) + ')', line)
    # MDX escapes outside code spans (JSX component lines are left untouched)
    if not re.match(r'^\s*</?(' + '|'.join(KNOWN_TAGS) + r')\b', line):
        parts = re.split(r'(`[^`]*`)', line)
        for k, part in enumerate(parts):
            if part.startswith('`'):
                continue
            part = re.sub(r'<(?!\s|/?(?:' + '|'.join(KNOWN_TAGS) + r')\b)', r'\\<', part)
            part = re.sub(r'(?<!\\)([{}])', r'\\\1', part)
            parts[k] = part
        line = ''.join(parts)
    if '<mark' in line:
        errors.append(f'{rel}: leftover <mark>: {line[:60]}')
    return line.rstrip()


# ----------------------------------------------------------------------------- page-specific edits

def drop_section(lines: list[str], heading: str) -> list[str]:
    out, skipping = [], False
    for l in lines:
        if l.startswith('## '):
            skipping = l.strip() == heading
        if not skipping:
            out.append(l)
    return out


def drop_version_lines(lines: list[str]) -> list[str]:
    out = []
    skip_until_blank = False
    for l in lines:
        if skip_until_blank:
            if not l.strip():
                skip_until_blank = False
            continue
        if l.startswith('The certified configuration version') or l.startswith('The certified version of this manual') or l.startswith('Version: 1.7b'):
            skip_until_blank = True
            continue
        if l.strip() == '\\':
            continue
        out.append(l)
    return out


# ----------------------------------------------------------------------------- main

def convert_file(src: Path) -> None:
    rel = src.relative_to(SRC)
    text = src.read_text()
    fm: dict = {}
    if text.startswith('---'):
        end = text.index('\n---', 3)
        fm = yaml.safe_load(text[3:end]) or {}
        text = text[end + 4:]
    lines = text.split('\n')
    if rel == Path('README.md'):
        lines = drop_section(lines, '## The version of this documentation')
    if rel == Path('reference/api-reference/README.md'):
        lines = drop_version_lines(lines)
    body, title = convert_blocks(lines, rel)
    body = [convert_inline(l, rel) if not l.startswith('```') else l for l in _outside_fences(body, rel)]
    # collapse 3+ blank lines
    joined = re.sub(r'\n{3,}', '\n\n', '\n'.join(body)).strip('\n')
    joined = joined.replace('```javascript', '```json')
    label = LABELS.get(rel.as_posix())
    if title is None:
        errors.append(f'{rel}: no H1 title')
        title = label or rel.stem
    front = ['---']
    if rel == Path('README.md'):
        front.append('slug: /')
    front.append(f'title: {yaml_str(title)}')
    if label and label != title:
        front.append(f'sidebar_label: {yaml_str(label)}')
    if fm.get('description'):
        front.append(f'description: {yaml_str(" ".join(str(fm["description"]).split()))}')
    front.append('---')
    extra = ''
    if rel == Path('README.md'):
        extra = '<div className="doc-cover">\n\n![Encedo HEM](/img/welcome-cover.jpg)\n\n</div>\n\n'
    if not joined.strip() and rel.name == 'README.md':
        extra = '<DocCardList />\n'
    dst = DST / out_rel(rel)
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text('\n'.join(front) + '\n\n' + extra + joined + '\n')


def _outside_fences(lines: list[str], rel: Path):
    """Yield lines; lines inside fences are returned untouched (marked by starting with ```)."""
    in_fence = False
    for l in lines:
        if l.startswith('```'):
            in_fence = not in_fence
            yield l
        elif in_fence:
            yield '```' + '\x00' + l  # marker; restored below
        else:
            yield l


def main() -> int:
    files = sorted(p for p in SRC.rglob('*.md') if p.name != 'SUMMARY.md')
    for f in files:
        convert_file(f)
    # restore fence markers
    for f in DST.rglob('*.md*'):
        t = f.read_text()
        if '```\x00' in t:
            f.write_text(t.replace('```\x00', ''))
    print(f'converted {len(files)} files → {DST}')
    for w in warnings:
        print('WARN ', w)
    for e in errors:
        print('ERROR', e)
    print(f'{len(warnings)} warnings, {len(errors)} errors')
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main())
