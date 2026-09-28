import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
import base from './sidebars';
import diagItems from './sidebars-diag-items.json';

// Sidebar of the "Diag" docs instance (/diag): the default sidebar plus the Diagnostics
// pages, appended to the "API Reference" category. Keep all shared structure in sidebars.ts;
// list Diagnostics pages only in sidebars-diag-items.json (scripts/sync-diag-docs.mjs reads it too).

const baseDocs = base.docs;
if (!Array.isArray(baseDocs)) {
  throw new Error('sidebars.ts: the "docs" sidebar must be an array of items');
}
const docs = structuredClone(baseDocs);
type Item = (typeof docs)[number];
type Category = Extract<Item, {type: 'category'}>;

const apiRef = docs.find(
  (item): item is Category =>
    typeof item === 'object' &&
    item !== null &&
    (item as {type?: string}).type === 'category' &&
    (item as {label?: string}).label === 'API Reference',
);
if (!apiRef) {
  throw new Error('sidebars.ts: "API Reference" category not found (sidebars-diag.ts needs it)');
}
if (!Array.isArray(apiRef.items)) {
  throw new Error('sidebars.ts: "API Reference" category items must be an array');
}
apiRef.items.push(...(diagItems as unknown as Item[]));

const sidebars: SidebarsConfig = {docs};

export default sidebars;
