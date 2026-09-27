# M2 — OpenAPI reference integration

State: in-progress (accepted 2026-09-27)

## Goal
Generated one-page-per-operation API reference at `/reference/api/*`, grouped by tag with friendly labels, generated at build time (gitignored), spec linted in CI, spec downloadable from the site, versions structure ready for a second API version.

## Deliverables
- `git mv api/openapi.yaml api/hem-api-1.2.2.yaml`; header comment updated (this file is the documentation's source of truth; hand-maintained alongside `Firmware/src/api.h`).
- Spec: `x-displayName` on the 7 tags; `tags:` reordered to GitBook order: system → "System", auth → "Authorization", keymgmt → "Key management", crypto → "Cryptography operations", logger → "Audit log", storage → "Storage", diag → "Diagnostics (DIAG builds only)".
- Dependencies: `docusaurus-plugin-openapi-docs@^5.2`, `docusaurus-theme-openapi-docs@^5.2`, `docusaurus-plugin-sass@^0.2.7`; dev `@redocly/cli`.
- `redocly.yaml` (extends `recommended`, rules tuned to zero errors; warnings reviewed).
- `.gitignore` += `docs/reference/api/`.
- `docusaurus.config.ts`: `staticDirectories: ['static', 'api']`, `docItemComponent: '@theme/ApiItem'`, plugin + theme config (see PLAN.md M2), `themeConfig.languageTabs` (curl, python, javascript).
- `sidebars.ts`: import the generated `./docs/reference/api/sidebar`, filter out the info doc, nest the slice in a category "API Reference" linked to the info page, under a "Reference" section header.
- `package.json` scripts: `gen-api` = `docusaurus gen-api-docs all`, `clean-api` = `docusaurus clean-api-docs all`, `prebuild`/`prestart`/`pretypecheck` = `npm run gen-api`, `lint:spec` = `redocly lint`.
- Workflows: `npm run lint:spec` step before build (both).

## Inputs from M1
- Docusaurus 3.10 builds with the Rspack "faster" bundler by default (`@docusaurus/faster` installed). The openapi-docs demo runs with it enabled, but verify the theme's SCSS builds; fallback `future.faster: false`.
- Preview URL for reviews: `http://192.168.0.153:3000/hem-api-docs/` (`npm run serve -- --host 0.0.0.0 --port 3000 --no-open`).

## Steps
1. Rename the spec, edit the header comment, add `x-displayName`, reorder tags. Run `npx @redocly/cli lint` and fix or rule-tune until zero errors.
2. Install deps; wire plugin, theme, sass plugin, `docItemComponent`, `staticDirectories`.
3. Add scripts and `.gitignore` entry; run `npm run gen-api`; inspect generated ids (`reference/api/<kebab operationId>`, tag pages `reference/api/<tag>`, info page `reference/api/<kebab info.title>`).
4. Write `sidebars.ts` import + filter; build; fix broken links/anchors.
5. Test `versions: {}` (empty) — if harmless keep it live so adding a version is additive; otherwise keep a commented template.
6. Update workflows; commit `M2: OpenAPI reference generated from api/hem-api-1.2.2.yaml`.

## Acceptance criteria
- `npm run lint:spec` exits 0.
- `npm run build` passes; `docs/reference/api/` contains 69 `*.api.mdx`, 7 `*.tag.mdx`, 1 `*.info.mdx` and is untracked.
- Sidebar: Reference → API Reference → System / Authorization / Key management / Cryptography operations / Audit log / Storage / Diagnostics, with method badges.
- Info page shows the `v1.2.2` badge and a Download button that serves the YAML.
- `x-required-scope` is visible on `/reference/api/create-key`.
- CI green after push; Pages updated.

## Verification
- Automated: lint, build, typecheck, page counts.
- User: look of an operation page (docs left, request/response explorer right), tag pages, info page, download link; decide the open questions below.

## Open questions
- ~~Keep `info.title` "Encedo nGINE REST API" or rename?~~ Resolved 2026-09-27: keep "Encedo nGINE REST API".
- Is the raw `x-required-scope` code block acceptable? Fallback: render the scope as a sentence in the description and set `showExtensions: false`.
- Keep the "Send API Request" panel (`hideSendButton: false`)?
- `install_bl` and `upload_bootldr` are tagged `[system, diag]` and appear twice; keep or single-tag them?

## Conclusions & hand-over
Implemented 2026-09-27; awaiting the user's review on the preview.

- Spec renamed to `api/hem-api-1.2.2.yaml`; header comment rewritten; `x-displayName` added; tags reordered (system, auth, keymgmt, crypto, logger, storage, diag). `info.title` kept ("Encedo nGINE REST API").
- `npm run lint:spec` (Redocly 2.x, `recommended`): valid, zero warnings after turning off `info-license` (no license object) and `operation-4xx-response` (diag endpoints answer only 200).
- `npm run gen-api` output: 69 `*.api.mdx`, 7 `*.tag.mdx`, 1 `*.info.mdx` plus per-operation JSON side files and `sidebar.ts`. Generated ids: operations `reference/api/<kebab operationId>` (e.g. `create-key`, `get-system-status`), tag pages `reference/api/<tag>`, info page `reference/api/encedo-ngine-rest-api`.
- `npm run build`: 80 HTML pages (77 API + Welcome + Quick Start + 404); the spec is served at `/hem-api-docs/hem-api-1.2.2.yaml`; the Rspack ("faster") bundler builds the openapi theme's SCSS without issues. `npm run typecheck` passes.
- Rendering checks in the built HTML: version badge "Version: 1.2.2" and download link on the info page; sidebar categories use the `x-displayName` labels; `x-required-scope` renders as a fenced code block (`x-required-scope: "keymgmt:gen (prefix match); role M denied"`) before the description; method badges (`api-method get/post/delete`) on sidebar items. The "Send API Request" panel renders client-side only (not visible in static HTML).
- `versions: {}` test: harmless (no crash, badge still shown) but it creates no `versions.json`, so the version selector cannot be wired until a real version entry exists. Decision: keep the commented `versions` template in `docusaurus.config.ts`; the README recipe (M6) must say "add the entry, run `npm run gen-api`, then import `versions.json` in `sidebars.ts`".
- `sidebars.ts` imports the generated slice, filters the info item out (it is the "API Reference" category link) and derives item types from `SidebarsConfig` (the item types are not exported publicly).
- Hand-over to M3/M4: legacy links to API pages map to `/reference/api/<kebab operationId>`; descriptions are compiled as MDX (markdown tables/admonitions should work; smoke-test in M4). Preview: `http://192.168.0.153:3000/hem-api-docs/reference/api/create-key`.
