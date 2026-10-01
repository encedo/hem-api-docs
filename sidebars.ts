import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Explicit sidebar mirroring the original GitBook table of contents (legacy SUMMARY.md).
// Section headers ("Preliminary", "Security", "Reference") are non-collapsible labels, as in
// GitBook: `html` items styled by `.sidebar-heading` in src/css/custom.css.
const sidebars: SidebarsConfig = {
  docs: [
    {type: 'doc', id: 'index', label: 'Welcome'},
    {type: 'html', value: 'Preliminary', className: 'sidebar-heading'},
    {type: 'doc', id: 'preliminary/quick-start', label: 'Quick Start'},
    {type: 'doc', id: 'preliminary/general-information', label: 'General information'},
    {type: 'html', value: 'Security', className: 'sidebar-heading'},
    {type: 'doc', id: 'security/report-an-issue', label: 'Report an issue'},
    {
      type: 'category',
      label: 'Advisory',
      link: {type: 'doc', id: 'security/advisory/index'},
      items: [
        {type: 'doc', id: 'security/advisory/hall-of-fame', label: 'Hall of fame'},
      ],
    },
    {type: 'html', value: 'Reference', className: 'sidebar-heading'},
    {
      type: 'category',
      label: 'API Reference',
      link: {type: 'doc', id: 'reference/api-reference/index'},
      items: [
        {
          type: 'category',
          label: 'System',
          link: {type: 'doc', id: 'reference/api-reference/system/index'},
          items: [
            {type: 'doc', id: 'reference/api-reference/system/version-and-status', label: 'Version & Status'},
            {type: 'doc', id: 'reference/api-reference/system/checkin', label: 'Checkin'},
            {type: 'doc', id: 'reference/api-reference/system/configuration', label: 'Configuration'},
            {
              type: 'category',
              label: 'Upgrade',
              link: {type: 'doc', id: 'reference/api-reference/system/upgrade/index'},
              items: [
                {
                  type: 'category',
                  label: 'Firmware',
                  link: {type: 'doc', id: 'reference/api-reference/system/upgrade/firmware/index'},
                  items: [
                    {type: 'doc', id: 'reference/api-reference/system/upgrade/firmware/low-level-usb-mode', label: 'Low level USB mode'},
                  ],
                },
                {type: 'doc', id: 'reference/api-reference/system/upgrade/management-app', label: 'Management app'},
              ],
            },
            {type: 'doc', id: 'reference/api-reference/system/reboot', label: 'Reboot'},
            {type: 'doc', id: 'reference/api-reference/system/shutdown', label: 'Shutdown'},
            {type: 'doc', id: 'reference/api-reference/system/self-test', label: 'Self-test'},
          ],
        },
        {
          type: 'category',
          label: 'Authorization',
          link: {type: 'doc', id: 'reference/api-reference/authorization/index'},
          items: [
            {type: 'doc', id: 'reference/api-reference/authorization/initialisation', label: 'Initialisation'},
            {type: 'doc', id: 'reference/api-reference/authorization/user-authentication', label: 'User authentication'},
            {
              type: 'category',
              label: 'External authenticator',
              link: {type: 'doc', id: 'reference/api-reference/authorization/external-authenticator/index'},
              items: [
                {type: 'doc', id: 'reference/api-reference/authorization/external-authenticator/registration', label: 'Registration'},
                {type: 'doc', id: 'reference/api-reference/authorization/external-authenticator/authentication', label: 'Authentication'},
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Key Management',
          link: {type: 'doc', id: 'reference/api-reference/key-management/index'},
          items: [
            {type: 'doc', id: 'reference/api-reference/key-management/create-a-key', label: 'Create a key'},
            {type: 'doc', id: 'reference/api-reference/key-management/derive-a-key', label: 'Derive a key'},
            {type: 'doc', id: 'reference/api-reference/key-management/import-a-key', label: 'Import a key'},
            {type: 'doc', id: 'reference/api-reference/key-management/update-a-key', label: 'Update a key'},
            {type: 'doc', id: 'reference/api-reference/key-management/delete-a-key', label: 'Delete a key'},
            {type: 'doc', id: 'reference/api-reference/key-management/get-a-public-key', label: 'Get a public key'},
            {type: 'doc', id: 'reference/api-reference/key-management/list-the-keys', label: 'List the keys'},
            {type: 'doc', id: 'reference/api-reference/key-management/search-a-key', label: 'Search a key'},
          ],
        },
        {
          type: 'category',
          label: 'Cryptography operations',
          link: {type: 'doc', id: 'reference/api-reference/cryptography-operations/index'},
          items: [
            {type: 'doc', id: 'reference/api-reference/cryptography-operations/hmac', label: 'HMAC'},
            {type: 'doc', id: 'reference/api-reference/cryptography-operations/exdsa', label: 'ExDSA'},
            {type: 'doc', id: 'reference/api-reference/cryptography-operations/ecdh', label: 'ECDH'},
            {
              type: 'category',
              label: 'Encryption',
              link: {type: 'doc', id: 'reference/api-reference/cryptography-operations/encryption/index'},
              items: [
                {type: 'doc', id: 'reference/api-reference/cryptography-operations/encryption/encryption-decryption', label: 'Encryption/Decryption'},
                {type: 'doc', id: 'reference/api-reference/cryptography-operations/encryption/wrap-unwrap', label: 'Wrap/Unwrap'},
              ],
            },
            {
              type: 'category',
              label: 'Post-Quantum Cryptography',
              link: {type: 'doc', id: 'reference/api-reference/cryptography-operations/post-quantum-cryptography/index'},
              items: [
                {type: 'doc', id: 'reference/api-reference/cryptography-operations/post-quantum-cryptography/ml-dsa', label: 'ML-DSA'},
                {type: 'doc', id: 'reference/api-reference/cryptography-operations/post-quantum-cryptography/ml-kem', label: 'ML-KEM'},
              ],
            },
          ],
        },
        {type: 'doc', id: 'reference/api-reference/audit-log', label: 'Audit log'},
        {type: 'doc', id: 'reference/api-reference/storage', label: 'Storage'},
      ],
    },
    {type: 'link', label: 'API tester', href: '/api-tester'},
  ],
};

export default sidebars;
