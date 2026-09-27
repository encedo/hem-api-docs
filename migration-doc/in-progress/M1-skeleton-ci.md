# M1 — Docusaurus skeleton + CI/CD to GitHub Pages

State: in-progress (accepted 2026-09-27)

## Goal
A working deploy loop (GitHub Actions → GitHub Pages) with placeholder content, so every later milestone can be reviewed at https://encedo.github.io/hem-api-docs/ and via `docusaurus serve` on the server.

## Deliverables
- `git mv` of all GitBook sources (`README.md`, `SUMMARY.md`, `preliminary/`, `security/`, `reference/`, `.gitbook/`) into `legacy-gitbook/` (deleted again in M4/M6).
- `package.json` + `package-lock.json`, `tsconfig.json`, `.nvmrc` (`24`), `.gitignore`.
- `docusaurus.config.ts`, `sidebars.ts`, `src/css/custom.css`.
- `docs/index.md` (placeholder Welcome, `slug: /`) and `docs/preliminary/quick-start.md` (placeholder, so the first section header has an item).
- `static/img/.gitkeep`.
- `.github/workflows/deploy.yml`, `.github/workflows/pr-check.yml`.
- Root `README.md` v1: live URL, GitHub configuration, headless preview, repository layout, pointer to `migration-doc/`.

## Steps
1. Scaffold in the scratchpad: `npx create-docusaurus@latest <scratch> classic --typescript --package-manager npm --skip-install`; copy only `package.json`, `tsconfig.json`, `docusaurus.config.ts`, `sidebars.ts`, `src/css/custom.css`. No blog, pages, tutorial docs or sample SVGs.
2. `git mv` the legacy sources into `legacy-gitbook/`.
3. Write `docusaurus.config.ts`: `title: 'Encedo HEM API Developer Manual'`; `url`/`baseUrl` as two constants at the top (custom-domain switch = two edits); `organizationName: 'encedo'`, `projectName: 'hem-api-docs'`; `trailingSlash: false`; `onBrokenLinks: 'throw'`, `onBrokenAnchors: 'throw'`, `markdown.hooks.onBrokenMarkdownLinks: 'throw'`; preset-classic `docs: { routeBasePath: '/', sidebarPath, editUrl }`, `blog: false`, `pages: false`; `colorMode.respectPrefersColorScheme: true`; prism `json`, `bash`, `http`.
4. `sidebars.ts`: explicit `docs` sidebar: Welcome, `{type:'html', value:'Preliminary', className:'sidebar-heading'}`, Quick Start.
5. `package.json` scripts: `start` = `docusaurus start --host 0.0.0.0 --port 3000`, `build`, `serve`, `clear`, `typecheck` = `tsc`. `engines.node >=20`.
6. `.gitignore`: `node_modules/`, `build/`, `.docusaurus/`, `.cache-loader/`, `.DS_Store`, `npm-debug.log*`, `*.local`.
7. `deploy.yml`: `on: push: branches: [main, docusaurus]` + `workflow_dispatch`; `concurrency: {group: pages, cancel-in-progress: false}`; build job: `actions/checkout@v4`, `actions/setup-node@v4` (node 24, `cache: npm`), `npm ci`, `npm run build`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3` (`path: build`); deploy job: `needs: build`, `permissions: {pages: write, id-token: write}`, `environment: github-pages`, `actions/deploy-pages@v4`.
8. `pr-check.yml`: `on: pull_request`; checkout, setup-node, `npm ci`, `npm run typecheck`, `npm run build`.
9. README v1 (see Deliverables). GitHub configuration the user must do: Settings → Pages → Source **GitHub Actions**; Settings → Environments → `github-pages` → deployment branches: add `docusaurus` (the auto-created rule allows only `main`; otherwise the deploy job fails with "not allowed to deploy to github-pages due to environment protection rules"); Actions enabled. Headless preview: `npm run build && npm run serve -- --host 0.0.0.0 --port 3000` → `http://<server-ip>:3000/hem-api-docs/`, or SSH tunnel `ssh -L 3000:127.0.0.1:3000 user@server`.
10. `npm install` (creates the lockfile), `npm run build`, `npm run typecheck`.
11. Commit `M1: Docusaurus skeleton and GitHub Pages workflow`.

## Acceptance criteria
- `npm ci && npm run build && npm run typecheck` pass locally with the three `throw` settings.
- `git status` clean; `legacy-gitbook/` holds every old source file; `main` untouched.
- After the user pushes: Actions run green; the Pages URL shows the placeholder Welcome; the sidebar shows Welcome, the "Preliminary" header and Quick Start; light/dark toggle present.

## Verification
- Automated: `npm run build`, `npm run typecheck`.
- User: perform the GitHub configuration, push `docusaurus`, confirm the Actions run and the URL. Optionally check `serve` on the server.

## Open questions
Resolved 2026-09-27:
- Preview access: direct to the server IP on port 3000 (`npm run serve -- --host 0.0.0.0 --port 3000` → `http://<server-ip>:3000/hem-api-docs/`); SSH tunnel documented as the alternative.
- `editUrl` points at `main`.

## Conclusions & hand-over
Implemented 2026-09-27 (awaiting the user's GitHub configuration, push and Pages check).

- Files: `package.json` + `package-lock.json`, `tsconfig.json`, `.nvmrc`, `.gitignore`, `docusaurus.config.ts`, `sidebars.ts`, `src/css/custom.css`, `docs/index.md`, `docs/preliminary/quick-start.md`, `static/.nojekyll`, `static/img/.gitkeep`, `.github/workflows/deploy.yml`, `.github/workflows/pr-check.yml`, root `README.md` v1. GitBook sources moved to `legacy-gitbook/`.
- Verified locally: `npm run build` (3 HTML pages: `/`, `/preliminary/quick-start`, `/404`; sitemap; assets under `/hem-api-docs/`), `npm run typecheck`, `npm run serve -- --host 0.0.0.0 --port 3000` → `http://192.168.0.153:3000/hem-api-docs/`.
- Deviation from the draft: Docusaurus 3.10 uses the Rspack "faster" bundler by default, so `@docusaurus/faster` is a required dependency (the build fails with `ERR_MODULE_NOT_FOUND` without it). Template pins `typescript ~6.0.2` with `ignoreDeprecations: "6.0"`. `input.txt` is ignored locally via `.git/info/exclude`, not the shared `.gitignore`.
- Hand-over to M2: the bundler is Rspack; the openapi-docs plugin demo runs with `faster` enabled, but verify the theme's SCSS builds under it (fallback: `future.faster: false`). Preview URL for reviews: `http://192.168.0.153:3000/hem-api-docs/`. The `github-pages` environment branch rule must allow `docusaurus` (README → GitHub configuration).
