import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Where the site is served. GitHub Pages for a project repository serves it under
// https://<owner>.github.io/<repo>/. To move to a custom domain, change these two
// values (e.g. url 'https://docs.encedo.com', baseUrl '/'); see README → Deployment.
const url = 'https://encedo.github.io';
const baseUrl = '/hem-api-docs/';

const config: Config = {
  title: 'Encedo HEM API Developer Manual',
  tagline: 'REST API documentation for the Encedo HEM hardware security module',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url,
  baseUrl,
  // GitHub Pages deployment config.
  organizationName: 'encedo',
  projectName: 'hem-api-docs',
  trailingSlash: false,

  // Fail the build on anything that would produce a dead link on the site.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          // Docs-only mode: the documentation is served from the site root.
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/encedo/hem-api-docs/edit/main/',
        },
        blog: false,
        pages: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Encedo HEM API',
      items: [
        {
          href: 'https://encedo.com',
          label: 'encedo.com',
          position: 'right',
        },
        {
          href: 'https://github.com/encedo/hem-api-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `Copyright © ${new Date().getFullYear()} Encedo Limited.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['json', 'bash', 'http'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
