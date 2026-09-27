# M2 — API tester (Scalar) + remove generated reference (revised)

State: in-progress (revision 2 accepted with the plan on 2026-09-27)

## History
The first M2 (commit `ad075c9`) generated the API reference with `docusaurus-plugin-openapi-docs`. The user rejected the look; the plugin, theme and sass plugin are removed by this revised milestone. Kept from the first M2: spec renamed to `api/hem-api-1.2.2.yaml` with a new header comment, `x-displayName` tag labels in GitBook order, `redocly.yaml` + `npm run lint:spec` (also in both workflows), `staticDirectories: ['static', 'api']` so the spec is downloadable from the site.

## Goal
A separate, interactive API tester page rendering the full OpenAPI file with Scalar at `/api-tester`, and a codebase free of the generated-reference wiring.

## Deliverables
- `npm uninstall docusaurus-plugin-openapi-docs docusaurus-theme-openapi-docs docusaurus-plugin-sass`; `npm i -E @scalar/docusaurus@0.8.44`.
- `docusaurus.config.ts`: remove the OpenApiPlugin import, `docItemComponent`, the sass/openapi plugin entries, `themes`, `languageTabs`; add the Scalar plugin entry (`label: 'API tester'`, `route: '/api-tester'`, `showNavLink: false`, `configuration: { url: baseUrl + specFile, proxyUrl: '', hideModels: true, authentication: { preferredSecurityScheme: 'bearerAuth' } }`) and a navbar item `{to: '/api-tester', label: 'API tester'}`.
- `package.json`: remove `gen-api`, `clean-api`, `prebuild`, `prestart`, `pretypecheck`.
- `.gitignore`: remove `/docs/reference/api/`; delete the untracked `docs/reference/api/`.
- `sidebars.ts`: static list (Welcome, Preliminary header, Quick Start, Reference header + placeholder link to the tester).
- Spec header comment: no mention of the plugin.
- README: replace the generated-pages paragraphs with the tester note.
- `migration-doc`: this file, `PLAN.md` (revision 2), `decisions.md`, drafts M3–M6 rewritten.

## Steps
1. Swap packages; fix scripts. 2. Strip config/sidebars/gitignore; remove generated folder. 3. Add Scalar entry + navbar item; read `node_modules/@scalar/docusaurus/dist/*.js` to confirm route normalisation and options. 4. `npm run lint:spec && npm run typecheck && npm run build`; check `build/api-tester.html`. 5. Serve on `0.0.0.0:3000`; commit `M2: Scalar API tester, generated reference removed`.

## Acceptance criteria
- lint, typecheck, build pass; `build/api-tester.html` exists; `grep -rn "openapi-docs\|plugin-sass" package.json docusaurus.config.ts sidebars.ts` is empty; `git status` clean.
- Tester loads the spec (7 tags, 69 operations), Authorization scheme visible, light/dark OK.

## Verification
- Automated: the commands above.
- User: open `http://192.168.0.153:3000/hem-api-docs/api-tester`; optionally send a request to a device (needs device CORS `origin` allowing the site origin and its TLS certificate trusted).

## Open questions
- None blocking. Scalar option names (`proxyUrl`, `hideModels`, dark-mode sync) are verified against the installed version during implementation.

## Conclusions & hand-over
Implemented 2026-09-27 (revision 2); awaiting the user's review of the tester on the preview.

- Removed `docusaurus-plugin-openapi-docs`, `docusaurus-theme-openapi-docs`, `docusaurus-plugin-sass` and all their wiring (config, `themes`, `languageTabs`, `docItemComponent`, `gen-api`/`clean-api`/`pre*` scripts, `.gitignore` entry, generated folder, generated-sidebar import). `sidebars.ts` is static again with an "API tester" link under the Reference header.
- Added `@scalar/docusaurus@0.8.44` (pinned). Facts verified in `node_modules/@scalar/docusaurus/dist/`: options are `label`, `route`, `cdn`, `showNavLink`, `configuration` (no `id`, single instance); the route is `normalizeUrl([baseUrl, route])`; `showNavLink: true` would push a navbar item, so we declare our own; the renderer is a **runtime CDN script** (`https://cdn.jsdelivr.net/npm/@scalar/api-reference`, unpinned by default) → pinned via `cdn: '…@scalar/api-reference@1.72.1'`; the configuration is serialized into the route module and executed client-side (`window.Scalar.createApiReference`), so the page is empty in static HTML and needs JavaScript + CDN access. Scalar has its own dark-mode toggle (no Docusaurus colour-mode sync) → left visible.
- Configuration: `url: /hem-api-docs/hem-api-1.2.2.yaml` (served from `api/` via `staticDirectories`), `proxyUrl: ''` (direct browser → device requests), `hideModels: true`, `authentication.preferredSecurityScheme: 'bearerAuth'`.
- `npm run lint:spec`, `npm run typecheck`, `npm run build` pass; pages: `/`, `/preliminary/quick-start`, `/api-tester`, `/404`; spec at `/hem-api-docs/hem-api-1.2.2.yaml`.
- Hand-over to M3/M4: the tester will only show an Authorization input for operations that declare `security: [{bearerAuth: []}]` (the spec currently has none → M4 spec edit). Requests from the browser to a device require the device CORS `origin` setting to allow the site origin and its TLS certificate to be trusted (document in AGENTS.md/README). Preview: `http://192.168.0.153:3000/hem-api-docs/api-tester`.
