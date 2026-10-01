import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Where the site is served. GitHub Pages for a project repository serves it under
// https://<owner>.github.io/<repo>/. To move to a custom domain, change these two
// values (e.g. url 'https://docs.encedo.com', baseUrl '/'); see README → Deployment.
const url = 'https://encedo.github.io';
const baseUrl = '/hem-api-docs/';

// Current API version. api/hem-api-<version>.yaml is the single source of truth for the API
// reference (hand-written pages are kept in sync with it, see AGENTS.md) and feeds the
// interactive API tester.
const apiVersion = '1.2.2';
const specFile = `hem-api-${apiVersion}.yaml`;

// "Edit this page" links point at the docs/ folder on the main branch.
const editUrl = ({docPath}: {docPath: string}) => `https://github.com/encedo/hem-api-docs/edit/main/docs/${docPath}`;

const config: Config = {
  title: 'Encedo HEM API Developer Manual',
  tagline: 'REST API documentation for the Encedo HEM hardware security module',
  favicon: 'img/favicon.png',

  // Self-hosted fonts (src/fonts.ts).
  clientModules: ['./src/fonts.ts'],

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

  // Serve the OpenAPI files as static assets: the API tester loads the spec from there and
  // readers can download it.
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
          editUrl,
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
    [
      // The previous GitBook site lived under docs.encedo.com/hem-api/…: keep every page of the
      // default reference reachable under that prefix (client-side redirects), so old links keep
      // working once a custom domain points at this site.
      '@docusaurus/plugin-client-redirects',
      {
        createRedirects(existingPath: string) {
          if (existingPath === '/') {
            return ['/hem-api'];
          }
          // Not for the tester, the search page or the 404 page.
          if (/^\/(api-tester|search|404\.html)(\/|$)/.test(existingPath) || existingPath.startsWith('/hem-api')) {
            return undefined;
          }
          return [`/hem-api${existingPath}`];
        },
      },
    ],
    [
      // Interactive API tester rendering the OpenAPI file.
      '@scalar/docusaurus',
      {
        label: 'API tester',
        route: '/api-tester', // served at <baseUrl>/api-tester
        showNavLink: false, // the navbar item is declared explicitly below
        // The renderer is loaded from this CDN at runtime; pinned for reproducible builds.
        // To upgrade: check https://www.npmjs.com/package/@scalar/api-reference and bump the version.
        cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.72.1',
        configuration: {
          url: `${baseUrl}${specFile}`,
          // The device is reached over the local USB network link from the reader's browser;
          // Scalar's public proxy could never reach it, so requests go directly.
          proxyUrl: '',
          hideModels: true,
          authentication: {preferredSecurityScheme: 'bearerAuth'},
        },
      },
    ],
  ],

  themes: [
    [
      // Offline full-text search (index built at build time, no external service).
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsRouteBasePath: '/',
        indexBlog: false,
        indexPages: false,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      // Light by default (user decision); the toggle stays available.
      defaultMode: 'light',
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Encedo HEM API',
      logo: {
        alt: 'Encedo',
        src: 'img/encedo-logo.png',
      },
      items: [
        {
          // API version switch. One entry today; AGENTS.md "Procedure B" adds entries for older
          // versions when a new firmware version is documented.
          type: 'dropdown',
          label: `v${apiVersion}`,
          position: 'left',
          items: [{label: apiVersion, to: '/', activeBaseRegex: `^${baseUrl}(?!api-tester(/|$))`}],
        },
        {to: '/api-tester', label: 'API tester', position: 'left'},
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
      links: [
        {
          title: 'Encedo',
          items: [
            {label: 'encedo.com', href: 'https://encedo.com'},
            {label: 'Report a security issue', to: '/security/report-an-issue'},
            {label: 'API examples on GitHub', href: 'https://github.com/encedo/hem-api-examples'},
          ],
        },
      ],
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
