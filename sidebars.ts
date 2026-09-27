import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Explicit sidebar mirroring the original GitBook table of contents (SUMMARY.md).
// Section headers ("Preliminary", "Security", "Reference") are non-collapsible labels,
// as in GitBook: `html` items styled by `.sidebar-heading` in src/css/custom.css.
const sidebars: SidebarsConfig = {
  docs: [
    {type: 'doc', id: 'index', label: 'Welcome'},
    {type: 'html', value: 'Preliminary', className: 'sidebar-heading'},
    'preliminary/quick-start',
    {type: 'html', value: 'Reference', className: 'sidebar-heading'},
    {type: 'link', label: 'API tester', href: '/api-tester'},
  ],
};

export default sidebars;
