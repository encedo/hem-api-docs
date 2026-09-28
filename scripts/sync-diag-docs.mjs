#!/usr/bin/env node
/**
 * Mirrors the documentation source for the "Diag" docs instance.
 *
 * The site publishes two variants of the reference from ONE source tree:
 *   - default instance: docs/            → /            (Diagnostics pages excluded via `exclude`)
 *   - diag instance:    docs-diag/       → /diag/       (everything, incl. Diagnostics pages)
 * Two docs-plugin instances cannot read the same folder, so this script copies docs/ to
 * docs-diag/ (gitignored) before `start` and `build`. When versioned docs exist it also mirrors
 * versioned_docs/, versions.json and versioned_sidebars/ to their diag_* counterparts, appending
 * the Diagnostics sidebar items (sidebars-diag-items.json) to each versioned sidebar.
 *
 * Usage: node scripts/sync-diag-docs.mjs [--watch]
 */
import {cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, watch, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'docs');
const DEST = join(root, 'docs-diag');
const DIAG_ITEMS = join(root, 'sidebars-diag-items.json');

function copyDir(from, to) {
  rmSync(to, {recursive: true, force: true});
  mkdirSync(dirname(to), {recursive: true});
  cpSync(from, to, {recursive: true});
}

/** Append the Diagnostics items to the "API Reference" category of a versioned sidebar JSON. */
function withDiagItems(sidebarsJson) {
  const diagItems = JSON.parse(readFileSync(DIAG_ITEMS, 'utf8'));
  const items = Array.isArray(diagItems) ? diagItems : [diagItems];
  const sidebars = JSON.parse(sidebarsJson);
  for (const sidebar of Object.values(sidebars)) {
    if (!Array.isArray(sidebar)) continue;
    const apiRef = sidebar.find((i) => typeof i === 'object' && i.type === 'category' && i.label === 'API Reference');
    if (apiRef) apiRef.items.push(...items);
  }
  return JSON.stringify(sidebars, null, 2) + '\n';
}

function sync() {
  copyDir(SRC, DEST);
  let msg = 'docs/ → docs-diag/';
  const versionsFile = join(root, 'versions.json');
  if (existsSync(versionsFile)) {
    writeFileSync(join(root, 'diag_versions.json'), readFileSync(versionsFile));
    copyDir(join(root, 'versioned_docs'), join(root, 'diag_versioned_docs'));
    const sbDir = join(root, 'versioned_sidebars');
    const outDir = join(root, 'diag_versioned_sidebars');
    rmSync(outDir, {recursive: true, force: true});
    mkdirSync(outDir, {recursive: true});
    for (const file of readdirSync(sbDir)) {
      writeFileSync(join(outDir, file), withDiagItems(readFileSync(join(sbDir, file), 'utf8')));
    }
    msg += ', versioned_docs/ → diag_versioned_docs/ (+ Diagnostics sidebar items)';
  }
  console.log(`[sync-diag-docs] ${msg}`);
}

sync();

if (process.argv.includes('--watch')) {
  let timer;
  watch(SRC, {recursive: true}, () => {
    clearTimeout(timer);
    timer = setTimeout(sync, 200);
  });
  console.log('[sync-diag-docs] watching docs/ for changes (Ctrl+C to stop)');
}
