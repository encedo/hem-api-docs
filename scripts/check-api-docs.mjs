#!/usr/bin/env node
/**
 * Compares the hand-written API reference pages (docs/reference/api-reference/**\/*.mdx) with the
 * OpenAPI file (api/hem-api-<version>.yaml), the single source of truth for API facts.
 *
 *   node scripts/check-api-docs.mjs [--spec api/hem-api-1.2.2.yaml] [--docs docs]
 *                                   [--only <operationId>] [--json] [--markdown] [--strict]
 *
 * Exit code is 0 unless --strict is given and errors remain. CI runs it as an informational step.
 * Page conventions it relies on are documented in AGENTS.md.
 */
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';
import {parse as parseYaml} from 'yaml';

// ----------------------------------------------------------------------------- arguments
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
};
const ROOT = resolve(new URL('..', import.meta.url).pathname);
const DOCS = resolve(ROOT, opt('--docs', 'docs'));
const API_DIR = join(DOCS, 'reference', 'api-reference');
const SPEC_PATH = resolve(ROOT, opt('--spec', latestSpec()));
const ONLY = opt('--only', null);

function latestSpec() {
  const files = readdirSync(join(ROOT, 'api')).filter((f) => /^hem-api-.*\.ya?ml$/.test(f));
  files.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
  if (!files.length) throw new Error('no api/hem-api-*.yaml found');
  return join('api', files[files.length - 1]);
}

// ----------------------------------------------------------------------------- spec model
const spec = parseYaml(readFileSync(SPEC_PATH, 'utf8'));

function deref(node, seen = new Set()) {
  if (!node || typeof node !== 'object') return node;
  if (node.$ref) {
    if (seen.has(node.$ref)) return {};
    seen.add(node.$ref);
    const target = node.$ref.replace(/^#\//, '').split('/').reduce((o, k) => (o ? o[k] : undefined), spec);
    if (!target) throw new Error(`unresolved $ref ${node.$ref}`);
    return deref(target, seen);
  }
  return node;
}

function schemaProps(schema) {
  schema = deref(schema);
  if (!schema) return {props: {}, required: []};
  let props = {};
  let required = [];
  for (const part of schema.allOf ?? []) {
    const p = schemaProps(part);
    props = {...props, ...p.props};
    required = [...required, ...p.required];
  }
  for (const part of schema.oneOf ?? schema.anyOf ?? []) {
    const p = schemaProps(part);
    props = {...props, ...p.props};
  }
  for (const [name, prop] of Object.entries(schema.properties ?? {})) {
    const d = deref(prop);
    props[name] = {enum: d.enum ?? deref(d.items)?.enum ?? null, description: d.description ?? ''};
  }
  required = [...required, ...(schema.required ?? [])];
  return {props, required: [...new Set(required)]};
}

const scopeTokens = (text) => [...String(text ?? '').matchAll(/[a-z]+:[a-z0-9:<>\[\]|_.-]+/gi)].map((m) => m[0]);
const scopeBase = (t) => t.toLowerCase().replace(/<kid>|<n>|\[.*$|<.*$/g, '').replace(/:+$/, '');

const ops = [];
for (const [path, item] of Object.entries(spec.paths)) {
  const shared = (item.parameters ?? []).map((x) => deref(x));
  for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
    const op = item[method];
    if (!op) continue;
    const params = [...shared, ...(op.parameters ?? []).map((x) => deref(x))];
    const content = op.requestBody ? deref(op.requestBody).content ?? {} : {};
    const json = content['application/json'];
    const body = json ? schemaProps(json.schema) : null;
    ops.push({
      operationId: op.operationId,
      method: method.toUpperCase(),
      path,
      tags: op.tags ?? [],
      summary: op.summary ?? '',
      scope: op['x-required-scope'] ?? '',
      security: op.security ?? spec.security ?? [],
      pathParams: params.filter((p) => p.in === 'path').map((p) => p.name),
      headerParams: params.filter((p) => p.in === 'header').map((p) => p.name),
      queryParams: params.filter((p) => p.in === 'query').map((p) => p.name),
      bodyProps: body ? body.props : null,
      bodyRequired: body ? body.required : [],
      bodyBinary: !json && Object.keys(content).length > 0,
      responses: Object.keys(op.responses ?? {}),
    });
  }
}
const opsById = new Map(ops.map((o) => [o.operationId, o]));

// ----------------------------------------------------------------------------- page model
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.mdx?$/.test(name)) out.push(p);
  }
  return out.sort();
}

function parseAttrs(tag) {
  const attrs = {};
  const re = /(\w+)(?:=(?:"((?:[^"\\]|\\.)*)"|\{([^}]*)\}))?/g;
  let m;
  while ((m = re.exec(tag))) {
    const [, name, str, expr] = m;
    if (str !== undefined) attrs[name] = str;
    else if (expr !== undefined) {
      try {
        attrs[name] = JSON.parse(expr);
      } catch {
        attrs[name] = expr;
      }
    } else attrs[name] = true;
  }
  return attrs;
}

function parseTable(lines, start) {
  const rows = [];
  let i = start;
  while (i < lines.length && lines[i].trim().startsWith('|')) {
    const line = lines[i].trim();
    if (!/^\|\s*:?-{3,}/.test(line)) {
      const cells = line
        .slice(1, line.endsWith('|') ? -1 : undefined)
        .split(/(?<!\\)\|/)
        .map((c) => c.trim().replace(/\\\|/g, '|'));
      rows.push(cells);
    }
    i++;
  }
  return {rows: rows.slice(1), header: rows[0] ?? [], end: i};
}

const cellName = (cell) => cell.replace(/<Req\s*\/>/, '').replace(/`/g, '').replace(/\\_/g, '_').trim();
const cellRequired = (cell) => /<Req\s*\/>/.test(cell);

function parsePage(file) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const page = {file: relative(ROOT, file), roles: null, scope: null, groups: []};
  let group = null;
  let section = null;
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const t = line.trim();
    let m;
    if ((m = t.match(/^<Roles\b(.*)\/>$/))) (group ?? page).roles = parseAttrs(m[1]);
    else if ((m = t.match(/^<Scope\b(.*)\/>$/))) (group ?? page).scope = parseAttrs(m[1]);
    else if ((m = t.match(/^<Endpoint\b(.*)\/>$/))) {
      const a = parseAttrs(m[1]);
      const ep = {method: a.method, path: a.path, operationId: a.operationId, line: i + 1};
      if (group && group.fresh) group.endpoints.push(ep);
      else {
        group = {endpoints: [ep], fresh: true, sections: {}, responses: [], enums: {}};
        page.groups.push(group);
      }
      section = null;
    } else if (group) {
      if (t && !t.startsWith('<Endpoint')) group.fresh = false;
      if ((m = t.match(/^####\s+(.*)$/))) {
        section = m[1].trim();
        const em = section.match(/^Possible `([^`]+)` values/);
        if (em) section = `enum:${em[1]}`;
      } else if (t.startsWith('|') && section) {
        const table = parseTable(lines, i);
        i = table.end - 1;
        if (section.startsWith('enum:')) {
          group.enums[section.slice(5)] ??= table.rows.map((r) => cellName(r[0] ?? ''));
        } else {
          group.sections[section] ??= table.rows.map((r) => ({name: cellName(r[0] ?? ''), required: cellRequired(r[0] ?? '')}));
        }
      } else if ((m = t.match(/^<ResponseCode\b(.*?)\/?>$/))) {
        const a = parseAttrs(m[1]);
        if (a.code) group.responses.push(String(a.code));
      }
    }
  }
  return page;
}

// ----------------------------------------------------------------------------- comparison
const findings = [];
const add = (severity, page, op, message) => findings.push({severity, page, operationId: op, message});
const CONVENTIONAL_HEADERS = new Set(['authorization', 'content-type', 'expect', 'content-length']);

const pages = walk(API_DIR).map(parsePage);
for (const page of pages) {
  page.enums = Object.assign({}, ...page.groups.map((g) => g.enums));
}
const seen = new Map(); // operationId → page

for (const page of pages) {
  for (const group of page.groups) {
    const groupOps = [];
    for (const ep of group.endpoints) {
      const op = ep.operationId ? opsById.get(ep.operationId) : null;
      if (!ep.operationId) add('error', page.file, null, `line ${ep.line}: <Endpoint> without operationId (${ep.method} ${ep.path})`);
      else if (!op) add('error', page.file, ep.operationId, `line ${ep.line}: operationId not in the spec`);
      else {
        if (seen.has(op.operationId)) add('error', page.file, op.operationId, `documented twice (also in ${seen.get(op.operationId)})`);
        seen.set(op.operationId, page.file);
        if (op.method !== ep.method || op.path !== ep.path) add('error', page.file, op.operationId, `endpoint is ${ep.method} ${ep.path}; spec says ${op.method} ${op.path}`);
        if (/:[a-z]/.test(ep.path)) add('error', page.file, op.operationId, `path uses ':name' style, use {name}`);
        groupOps.push(op);
      }
    }
    if (!groupOps.length) continue;
    const ids = groupOps.map((o) => o.operationId).join('+');
    if (ONLY && !groupOps.some((o) => o.operationId === ONLY)) continue;

    // path parameters: page rows must equal the union over the group
    const specPathParams = new Set(groupOps.flatMap((o) => o.pathParams));
    const pageParams = new Map((group.sections['Path Parameters'] ?? []).map((r) => [r.name, r]));
    for (const p of specPathParams) if (!pageParams.has(p)) add('error', page.file, ids, `path parameter {${p}} missing from "#### Path Parameters"`);
    for (const p of pageParams.keys()) if (!specPathParams.has(p)) add('error', page.file, ids, `"#### Path Parameters" lists {${p}} which no spec operation of this block has`);
    if (group.sections['Query Parameters']) {
      const specQuery = new Set(groupOps.flatMap((o) => o.queryParams));
      for (const r of group.sections['Query Parameters']) if (!specQuery.has(r.name)) add('error', page.file, ids, `query parameter ${r.name} not in the spec`);
    }

    // headers
    const headers = group.sections['Headers'] ?? [];
    const specHeaders = new Set(groupOps.flatMap((o) => o.headerParams.map((h) => h.toLowerCase())));
    for (const h of headers) {
      const n = h.name.toLowerCase();
      if (!CONVENTIONAL_HEADERS.has(n) && !specHeaders.has(n)) add('warn', page.file, ids, `header ${h.name} not in the spec`);
    }
    for (const h of specHeaders) if (!headers.some((r) => r.name.toLowerCase() === h)) add('warn', page.file, ids, `spec header parameter ${h} missing from "#### Headers"`);
    const auth = headers.find((r) => r.name.toLowerCase() === 'authorization');
    const secured = groupOps.some((o) => o.security.length > 0);
    if (auth?.required && !secured) add('warn', page.file, ids, `Authorization is required on the page but the spec declares no security for the operation(s)`);
    if (!auth && secured) add('warn', page.file, ids, `spec declares security but the page has no Authorization header row`);

    // body
    for (const op of groupOps) {
      if (op.bodyProps === null) {
        if (!op.bodyBinary && group.sections['Request Body']?.length) add('error', page.file, op.operationId, `page documents a request body but the spec operation has none`);
        continue;
      }
      const rows = new Map((group.sections['Request Body'] ?? []).map((r) => [r.name, r]));
      for (const [name] of Object.entries(op.bodyProps)) {
        if (!rows.has(name)) add('error', page.file, op.operationId, `body field \`${name}\` missing from "#### Request Body"`);
        else if (rows.get(name).required !== op.bodyRequired.includes(name)) add('error', page.file, op.operationId, `body field \`${name}\` required flag: page=${rows.get(name).required} spec=${op.bodyRequired.includes(name)}`);
      }
      for (const name of rows.keys()) if (!(name in op.bodyProps)) add('error', page.file, op.operationId, `page-only body field \`${name}\` (not in the spec: add it upstream or drop it)`);
      // enums
      for (const [name, prop] of Object.entries(op.bodyProps)) {
        if (!prop.enum) continue;
        const table = group.enums[name] ?? page.enums[name];
        if (!table) {
          add('warn', page.file, op.operationId, `field \`${name}\` has enum values in the spec but no "#### Possible \`${name}\` values" table`);
          continue;
        }
        for (const v of prop.enum) if (!table.includes(String(v))) add('warn', page.file, op.operationId, `enum value \`${v}\` of \`${name}\` missing from the page table`);
        for (const v of table) if (!prop.enum.map(String).includes(v)) add('warn', page.file, op.operationId, `page table lists \`${v}\` for \`${name}\` but the spec enum does not`);
      }
    }

    // response codes
    const specCodes = new Set(groupOps.flatMap((o) => o.responses));
    const pageCodes = new Set(group.responses);
    for (const c of specCodes) if (!pageCodes.has(c)) add('error', page.file, ids, `response code ${c} missing from <ResponseCodes>`);
    for (const c of pageCodes) if (!specCodes.has(c)) add('error', page.file, ids, `response code ${c} on the page but not in the spec`);

    // scope and roles (page-level)
    const scope = group.scope ?? page.scope;
    const roles = group.roles ?? page.roles;
    if (scope) {
      const pageTokens = [].concat(scope.main ?? [], scope.alt ?? []).map(scopeBase);
      const specTokens = groupOps.flatMap((o) => scopeTokens(o.scope)).map(scopeBase);
      for (const t of pageTokens) if (t && !specTokens.includes(t)) add('warn', page.file, ids, `scope \`${t}\` on the page is not in x-required-scope (${groupOps.map((o) => o.scope).join(' | ')})`);
      for (const t of specTokens) if (t && !pageTokens.includes(t)) add('warn', page.file, ids, `x-required-scope mentions \`${t}\` which the page <Scope> lacks`);
    }
    if (roles) {
      const denied = groupOps.some((o) => /role M denied/i.test(o.scope));
      const masterAllowed = roles.master !== false && roles.master !== undefined;
      if (denied && masterAllowed) add('warn', page.file, ids, `spec says "role M denied" but the page allows Master`);
      if (!denied && !masterAllowed && roles.master === false && groupOps.every((o) => o.scope)) add('warn', page.file, ids, `page denies Master but x-required-scope does not say "role M denied"`);
    }
  }
}

for (const op of ops) {
  if (ONLY && op.operationId !== ONLY) continue;
  if (!seen.has(op.operationId)) add('error', null, op.operationId, `no page section for ${op.method} ${op.path} (${op.tags.join(', ')})`);
}

// ----------------------------------------------------------------------------- accepted gaps
// scripts/check-api-docs.known-gaps.json lists findings that were reviewed and accepted, e.g. a
// response code the pages document but the spec omits (pending an upstream spec fix). Matching
// findings are reported as "info" and do not count as errors or warnings.
const GAPS_FILE = join(ROOT, 'scripts', 'check-api-docs.known-gaps.json');
let knownGaps = [];
try {
  knownGaps = JSON.parse(readFileSync(GAPS_FILE, 'utf8'));
} catch {
  /* no allowlist */
}
const used = new Set();
for (const f of findings) {
  const gap = knownGaps.find(
    (g) =>
      (!g.page || g.page === f.page) &&
      (!g.operationId || g.operationId === f.operationId) &&
      f.message.includes(g.match),
  );
  if (gap) {
    used.add(gap);
    f.severity = 'info';
    f.message += ` — accepted: ${gap.reason}`;
  }
}
for (const g of knownGaps) if (!used.has(g)) add('warn', g.page ?? null, g.operationId ?? null, `known-gaps entry no longer matches anything: "${g.match}"`);

// ----------------------------------------------------------------------------- output
const errors = findings.filter((f) => f.severity === 'error');
const warns = findings.filter((f) => f.severity === 'warn');
const infos = findings.filter((f) => f.severity === 'info');
const specName = relative(ROOT, SPEC_PATH);

if (flag('--json')) {
  console.log(JSON.stringify({spec: specName, operations: ops.length, pages: pages.length, errors: errors.length, warnings: warns.length, findings}, null, 2));
} else if (flag('--markdown')) {
  console.log(`## API docs check — ${specName}\n`);
  console.log(`${ops.length} operations, ${pages.length} pages, **${errors.length} errors**, ${warns.length} warnings, ${infos.length} accepted gaps\n`);
  if (findings.length) {
    console.log('| Severity | Page | Operation | Finding |\n|---|---|---|---|');
    for (const f of findings) console.log(`| ${f.severity} | ${f.page ?? '—'} | ${f.operationId ?? '—'} | ${f.message.replace(/\|/g, '\\|')} |`);
  }
} else {
  console.log(`check-api-docs: ${specName} vs ${relative(ROOT, API_DIR)} — ${ops.length} operations, ${pages.length} pages`);
  const byPage = new Map();
  for (const f of findings) {
    const k = f.page ?? '(spec operations without a page)';
    if (!byPage.has(k)) byPage.set(k, []);
    byPage.get(k).push(f);
  }
  for (const [pageName, list] of byPage) {
    console.log(`\n${pageName}`);
    for (const f of list) console.log(`  ${f.severity.toUpperCase().padEnd(5)} ${f.operationId ? `[${f.operationId}] ` : ''}${f.message}`);
  }
  console.log(`\n${errors.length} errors, ${warns.length} warnings, ${infos.length} accepted gaps`);
}
process.exit(flag('--strict') && errors.length ? 1 : 0);
