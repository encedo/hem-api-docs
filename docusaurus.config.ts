import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Where the site is served. GitHub Pages for a project repository serves it under
// https://<owner>.github.io/<repo>/. To move to a custom domain, change these two
// values (e.g. url 'https://docs.encedo.com', baseUrl '/'); see README → Deployment.
const url = 'https://encedo.github.io';
const baseUrl = '/hem-api-docs/';

// Current API version. The OpenAPI file api/hem-api-<version>.yaml is the single source of
// truth for the API reference; pages are generated from it at build time (see package.json
// "gen-api" and the README section "How to add a new API version").
const apiVersion = '1.2.2';

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

  // Serve the OpenAPI files as static assets, so the spec can be downloaded from the site.
  staticDirectories: ['static', 'api'],

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
          // Renders the generated API pages (falls back to the normal layout for other docs).
          docItemComponent: '@theme/ApiItem',
        },
        blog: false,
        pages: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    'docusaurus-plugin-sass',
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'openapi',
        docsPluginId: 'classic',
        config: {
          hem: {
            specPath: `api/hem-api-${apiVersion}.yaml`,
            outputDir: 'docs/reference/api', // generated at build time, gitignored
            downloadUrl: `${baseUrl}hem-api-${apiVersion}.yaml`,
            showExtensions: true, // renders x-required-scope on each operation
            hideSendButton: false,
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag',
              sidebarCollapsible: true,
              sidebarCollapsed: true,
            },
            version: apiVersion,
            label: `v${apiVersion}`,
            baseUrl: `${baseUrl}reference/api`,
            // Older API versions go here (see README "How to add a new API version"):
            // versions: {
            //   '1.2.1': {
            //     specPath: 'api/hem-api-1.2.1.yaml',
            //     outputDir: 'docs/reference/api/1.2.1',
            //     label: 'v1.2.1',
            //     baseUrl: `${baseUrl}reference/api/1.2.1`,
            //     downloadUrl: `${baseUrl}hem-api-1.2.1.yaml`,
            //   },
            // },
          } satisfies OpenApiPlugin.Options,
        },
      },
    ],
  ],

  themes: ['docusaurus-theme-openapi-docs'],

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
    // Code-sample languages offered on the generated API pages.
    languageTabs: [
      {language: 'curl'},
      {language: 'python'},
      {language: 'javascript'},
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
