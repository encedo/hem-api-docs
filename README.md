# Encedo HEM API Developer Manual

Source of the developer documentation for the Encedo HEM REST API, built with
[Docusaurus](https://docusaurus.io/) and published with GitHub Pages.

- Live site: <https://encedo.github.io/hem-api-docs/>
- API specification (single source of truth for the API reference): [`api/`](api/)

> **Migration in progress.** This repository is being migrated from GitBook to Docusaurus.
> Plan, status and milestone notes live in [`migration-doc/`](migration-doc/) (temporary folder).
> The original GitBook sources are kept in `legacy-gitbook/` until the migration is complete.

## Repository layout

| Path | Purpose |
|---|---|
| `docs/` | Documentation pages (Markdown/MDX). `docs/index.md` is the landing page. |
| `api/` | OpenAPI specification files, one per API version (`hem-api-<version>.yaml`). Single source of truth for the API reference. |
| `redocly.yaml` | Lint configuration for the OpenAPI files (`npm run lint:spec`). |
| `src/css/custom.css` | Site styling. |
| `static/` | Static assets (images, favicon). |
| `docusaurus.config.ts` | Site configuration (title, URL, navbar, footer, plugins). |
| `sidebars.ts` | Sidebar structure. |
| `.github/workflows/` | CI: `deploy.yml` builds and deploys to GitHub Pages, `pr-check.yml` builds pull requests. |

## Prerequisites

- Node.js 24 (see `.nvmrc`; any Node ≥ 20 works) and npm.

## Build and preview

```bash
npm ci                 # install dependencies (uses package-lock.json)
npm run lint:spec      # validate the OpenAPI file(s) in api/ with Redocly
npm run build          # production build into build/ (fails on broken links or anchors)
npm run typecheck      # type-check the TypeScript config files
```

The OpenAPI file in `api/` is the single source of truth for the API. The interactive **API tester**
page (`/api-tester`) renders it directly; the hand-written reference pages are kept consistent with it
by `npm run check:api` (see [`AGENTS.md`](AGENTS.md) for the page template and the update procedures).

## Maintaining the documentation

- Editing pages: `docs/**`. API reference pages follow the template in [`AGENTS.md`](AGENTS.md).
- The API changed or a new firmware version was released: follow Procedure A or B in [`AGENTS.md`](AGENTS.md).
- Two variants are built from `docs/`: the default reference (`/`) and "Diag" (`/diag`, adds the
  DIAG-build-only endpoints under `docs/reference/api-reference/diagnostics/`).

### Preview on a headless server

The site is built with `baseUrl: /hem-api-docs/`, so the preview lives under that path.

```bash
npm run build
npm run serve -- --host 0.0.0.0 --port 3000
# open http://<server-ip>:3000/hem-api-docs/
```

`npm start` runs the development server with hot reload, also bound to `0.0.0.0:3000`
(it does not run the broken-link checks; use `npm run build` for that).

If port 3000 is not reachable, use an SSH tunnel instead:
`ssh -L 3000:127.0.0.1:3000 <user>@<server>` and open <http://localhost:3000/hem-api-docs/>.

## Deployment

Every push to `main` (and, during the migration, to `docusaurus`) runs
`.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
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

The site URL and base path are set once at the top of `docusaurus.config.ts`
(`url` and `baseUrl`). Switching to a custom domain later means changing those two values,
adding the DNS record and setting the custom domain in **Settings → Pages**.

## License

MIT, see [`LICENSE`](LICENSE).
