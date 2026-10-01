#!/usr/bin/env node
/**
 * Removes DIAG-build-only operations from an OpenAPI file, in place.
 *
 *   node scripts/strip-diag-spec.mjs api/hem-api-<version>.yaml
 *
 * The firmware's OpenAPI description documents endpoints that exist only in diagnostic firmware
 * builds (tag `diag`, incl. the bootloader upgrade endpoints). They are not part of the published
 * API: run this after copying a spec from the firmware repository. It deletes every operation tagged
 * `diag`, paths left without operations, the `diag` tag object and the "DIAG build only" paragraph of
 * the global conventions. Comments and formatting of the YAML file are preserved.
 */
import {readFileSync, writeFileSync} from 'node:fs';
import {parseDocument, isMap} from 'yaml';

const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/strip-diag-spec.mjs <openapi.yaml>');
  process.exit(2);
}
const doc = parseDocument(readFileSync(file, 'utf8'));
const paths = doc.get('paths');
let removedOps = 0;
let removedPaths = 0;
for (const pair of [...paths.items]) {
  const item = pair.value;
  if (!isMap(item)) continue;
  for (const opPair of [...item.items]) {
    const op = opPair.value;
    const tags = isMap(op) ? op.get('tags') : null;
    const list = tags ? tags.toJSON() : [];
    if (Array.isArray(list) && list.includes('diag')) {
      item.delete(opPair.key);
      removedOps++;
    }
  }
  const hasOp = item.items.some((p) => ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(String(p.key)));
  if (!hasOp) {
    paths.delete(pair.key);
    removedPaths++;
  }
}
const tags = doc.get('tags');
let removedTags = 0;
if (tags) {
  for (const t of [...tags.items]) {
    if (isMap(t) && t.get('name') === 'diag') {
      tags.delete(tags.items.indexOf(t));
      removedTags++;
    }
  }
}
const info = doc.get('info');
const desc = info?.get('description');
if (typeof desc === 'string' && /DIAG build only/.test(desc)) {
  // Drop the bullet that starts with "- Paths marked **DIAG build only**" (up to the next bullet or blank line),
  // keeping the "MSC build only" sentence if it shares the bullet.
  const cleaned = desc.replace(/- Paths marked \*\*DIAG build only\*\*[^\n]*(\n(?![-\n])[^\n]*)*\n?/, (m) => {
    const msc = m.match(/Paths marked\s+\*\*MSC build only\*\*[\s\S]*$/);
    return msc ? `- ${msc[0].replace(/\s+/g, ' ').trim()}\n` : '';
  });
  info.set('description', cleaned);
}
writeFileSync(file, doc.toString({lineWidth: 0}));
console.log(`${file}: removed ${removedOps} diag operations, ${removedPaths} empty paths, ${removedTags} tag(s)`);
