# Encedo HEM API Developer Manual

Source of the developer documentation for the Encedo HEM REST API, built with
[Docusaurus](https://docusaurus.io/) and published with GitHub Pages.

- Live site: <https://encedo.github.io/hem-api-docs/>
- API tester (interactive OpenAPI rendering): <https://encedo.github.io/hem-api-docs/api-tester>
- Maintenance procedures for the API reference (also for AI agents): [`AGENTS.md`](AGENTS.md)

> **Migration note.** This repository was migrated from GitBook in September 2026. The temporary
> folder `migration-doc/` documents that migration and is removed once it is complete.

## Repository layout

| Path | Purpose |
|---|---|
| `docs/` | Documentation pages (Markdown/MDX). `docs/index.md` is the landing page; `docs/reference/api-reference/**` is the hand-written API reference, one `<Endpoint>` block per operation. |
| `api/hem-api-<version>.yaml` | OpenAPI 3.0 description of the API, one file per API/firmware version. **Source of truth for API facts.** A copy of `docs/openapi.yaml` from the `encedo_firmware` repository (which is canonical) at the release tag, with the DIAG-build-only endpoints removed. |
| `scripts/check-api-docs.mjs` | Compares the API pages with the OpenAPI file (`npm run check:api`). `scripts/check-api-docs.known-gaps.json` lists reviewed, accepted differences. |
| `scripts/strip-diag-spec.mjs` | Removes the DIAG-build-only endpoints (tag `diag`) from a spec copied from the firmware repository. |
| `src/components/api/`, `src/components/ContentRef.tsx` | Components used by the pages (endpoint line, method badge, roles, scope, response tabs, link cards). Registered globally in `src/theme/MDXComponents.tsx`. |
| `src/theme/` | Small theme overrides: page subtitle (`DocItem/Content`), card headings without icons (`DocCard/Heading`). |
| `src/css/custom.css`, `src/fonts.ts` | Styling (Encedo palette) and self-hosted fonts (Inter, IBM Plex Mono). |
| `static/img/` | Logo, favicon, product photos, cover image. |
| `docusaurus.config.ts` | Site configuration: URL and base path, `apiVersion`, the docs instance, the API tester, search, redirects. |
| `api-tester.config.ts` | API tester privacy settings: which Scalar external-service features are enabled and what they send. |
| `sidebars.ts` | Sidebar (mirrors the original GitBook table of contents). |
| `redocly.yaml` | Lint configuration for the OpenAPI files (`npm run lint:spec`). |
| `.github/workflows/` | CI: `deploy.yml` builds and deploys to GitHub Pages, `pr-check.yml` builds pull requests. |

## Prerequisites

- Node.js 24 (see `.nvmrc`; any Node ≥ 20 works) and npm.

## Build and preview

```bash
npm ci                 # install dependencies (uses package-lock.json)
npm run lint:spec      # validate the OpenAPI file(s) in api/ (Redocly)
npm run check:api      # compare the API pages with the OpenAPI file (report only)
npm run typecheck      # type-check the TypeScript config files
npm run build          # production build into build/ (fails on broken links or anchors)
```

### Preview on a headless server

The site is built with `baseUrl: /hem-api-docs/`, so the preview lives under that path.

```bash
npm run build
npm run serve -- --host 0.0.0.0 --port 3000
# open http://<server-ip>:3000/hem-api-docs/
```

`npm start` runs the development server with hot reload, also bound to `0.0.0.0:3000` (it does not
run the broken-link checks; use `npm run build` for that).

If port 3000 is not reachable, use an SSH tunnel instead:
`ssh -L 3000:127.0.0.1:3000 <user>@<server>` and open <http://localhost:3000/hem-api-docs/>.

## Site structure

- **Reference** at `/` (firmware 1.2.2, production endpoints). The navbar dropdown lists the API
  versions (one today).
- **DIAG-build-only endpoints are not published.** The firmware's OpenAPI description also covers
  endpoints that exist only in diagnostic firmware builds (`/api/diag/*`, bootloader upgrade). When a
  spec is copied or generated from the firmware repository, remove them before committing:
  `node scripts/strip-diag-spec.mjs api/hem-api-<version>.yaml` (the checker fails on any operation
  still tagged `diag`).
- **API tester** at `/api-tester`: [Scalar](https://scalar.com) renders `api/hem-api-<version>.yaml`
  and can send requests from the browser directly to a device. Notes:
  - requests go from the reader's browser to the device (no proxy), so the device's CORS `origin`
    setting must allow the site origin, and the device's TLS certificate must be trusted by the browser;
  - **[`api-tester.config.ts`](api-tester.config.ts)** lists every Scalar feature that contacts an
    external site (hosted "Open API Client", Ask AI, Generate MCP, Share/Deploy toolbar, request
    proxy, telemetry, the renderer CDN), what each sends where (including visitor data), and switches
    them on or off. All external features are off; requests are sent with the in-page client only
    (open an operation, press "Test Request", then "Send").
- **Search** is built into the site (no external service).
- **Redirects**: every page is also reachable under the old GitBook prefix `/hem-api/…`, so links from
  the previous site keep working once a custom domain points here.

## Maintaining the documentation

- Editing pages: `docs/**`. API reference pages follow the template in [`AGENTS.md`](AGENTS.md) §3.
- **The API changed** (same firmware version): copy the updated `docs/openapi.yaml` from the
  `encedo_firmware` repository over `api/hem-api-<version>.yaml`, strip the DIAG-only endpoints
  (`node scripts/strip-diag-spec.mjs …`), then follow Procedure A in [`AGENTS.md`](AGENTS.md)
  (lint → `npm run check:api` → fix pages → build).
- **A new firmware / API version**: follow Procedure B in [`AGENTS.md`](AGENTS.md) (new spec file,
  `docs:version` snapshot of the old reference, `apiVersion` and version settings in
  `docusaurus.config.ts`, navbar dropdown entries).
- Commit to `main`; CI deploys the site and prints the checker report in the job summary.

## Deployment

Every push to `main` (and, during the migration, to `docusaurus`) runs
`.github/workflows/deploy.yml`, which lints the spec, builds the site and publishes it to GitHub Pages.
Pull requests run `.github/workflows/pr-check.yml` (build only).

### GitHub configuration (one-time)

1. **Settings → Pages → Build and deployment → Source:** select **GitHub Actions**.
   Without this, the `deploy` job fails with an error such as
   `Error: Failed to create deployment ... Not Found` or `Get Pages site failed`.
2. **Settings → Environments → `github-pages` → Deployment branches and tags:**
   GitHub creates this environment automatically and usually allows only `main`.
   While the migration is deployed from the `docusaurus` branch, add `docusaurus`
   (or choose "No restriction"). Otherwise the `deploy` job fails with
   `Branch "docusaurus" is not allowed to deploy to github-pages due to environment protection rules`.
   Remove the extra branch again once the migration is merged into `main`.
3. **Settings → Actions → General:** Actions must be enabled for the repository.
   The default `GITHUB_TOKEN` permission can stay "Read repository contents"; the workflow
   requests `pages: write` and `id-token: write` itself.

If a deploy fails, open the run in the Actions tab: the `build` job shows lint, typecheck and build
errors; the `deploy` job shows Pages configuration problems (the two settings above).

### Switching to a custom domain (e.g. `docs.encedo.com`)

1. In `docusaurus.config.ts` change the two constants at the top: `url = 'https://docs.encedo.com'`,
   `baseUrl = '/'`. Everything else (spec download URL, tester, redirects) derives from them.
2. Add a DNS `CNAME` record `docs.encedo.com → encedo.github.io`, then set the custom domain in
   **Settings → Pages** and enable "Enforce HTTPS". (GitHub Pages serves a custom domain at its root,
   so the old `/hem-api/` prefix disappears; the built-in redirects map `/hem-api/…` to the new pages.)
3. Disconnect the GitBook Git Sync integration for this repository, if still active, so GitBook
   stops pushing to `main`.

## License

MIT, see [`LICENSE`](LICENSE).
