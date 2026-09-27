# M2 — OpenAPI reference integration

State: draft

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
- Keep `info.title` "Encedo nGINE REST API" (recommended) or rename to "Encedo HEM API"?
- Is the raw `x-required-scope` code block acceptable? Fallback: render the scope as a sentence in the description and set `showExtensions: false`.
- Keep the "Send API Request" panel (`hideSendButton: false`)?
- `install_bl` and `upload_bootldr` are tagged `[system, diag]` and appear twice; keep or single-tag them?

## Conclusions & hand-over
_(filled when done)_
