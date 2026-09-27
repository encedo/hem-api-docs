# GitBook → Docusaurus migration plan for `encedo/hem-api-docs`

> Temporary migration bookkeeping. Milestone files live in `draft/`, `in-progress/`, `done/`; one-off tooling in `scripts/`; decisions in `decisions.md`. This folder is removed after M7.

## Status

| Milestone | Title | State | Commit |
|---|---|---|---|
| M0 | Bookkeeping: plan, decisions, drafts | done | (this commit) |
| M1 | Docusaurus skeleton + CI/CD to GitHub Pages | draft | |
| M2 | OpenAPI reference integration | draft | |
| M3 | Non-API content migration | draft | |
| M4 | API content reconciliation into the spec | draft | |
| M5 | Visual style | draft | |
| M6 | Cleanup + maintainer docs | draft | |
| M7 | Stabilise + merge to main | draft | |

States: `draft` → `in-progress` (finalized, accepted by the user) → `done` (implemented, verified, accepted).


## Context

`encedo/hem-api-docs` is a GitBook Git-Sync export (44 markdown pages, `SUMMARY.md` nav, `.gitbook/assets`, no build tooling) published today at `https://docs.encedo.com/hem-api` as the "Encedo HEM API Developer Manual". The `docusaurus` branch adds `api/openapi.yaml` (OpenAPI 3.0.3, 65 paths / 69 operations, firmware 1.2.2, hand-maintained alongside `Firmware/src/api.h` in `../encedo_firmware`; byte-identical to an untracked `docs/openapi.yaml` there).

Goal: rebuild the site on Docusaurus, deployed by GitHub Actions to GitHub Pages, keeping content and look as close to GitBook as practical, with the OpenAPI file as the single source of truth for the API reference (rendered, not hand-written). The migration is tracked in a temporary `migration-doc/` folder; milestone files move `draft/ → in-progress/ → done/` on user acceptance.

### Facts established during exploration

- Remote `git@github.com:encedo/hem-api-docs.git`, **user** account → Pages URL `https://encedo.github.io/hem-api-docs/`. Pages not enabled. No `.github/`, `package.json`, `.gitignore`. MIT license. `main` = GitBook content; `docusaurus` = `main` + one commit adding the spec.
- Non-API pages (7): `README.md` (Welcome: Unsplash `cover:`, 2 product photos, version blurb "1.7b (17.01.2026)" + certified GitBook revision link, disclaimer, 4 content-ref cards), `preliminary/quick-start.md`, `preliminary/general-information.md` (259 lines; 2 tabs blocks, 3 HTML tables, 10 code fences), `security/report-an-issue.md`, `security/advisory/README.md`, `security/advisory/hall-of-fame.md`, `reference/api-reference/README.md` (index, 6 cards).
- Hand-written API pages (38) under `reference/api-reference/**`, one template: Allowed-users tabs (User/Master/ExtAuth), Required-scope tabs, hints, `<mark>` method badge + URL, Headers/Body tables with red `*`, response-code tabs (200 has JSON example), HTML tables for response data / enums / **Log entries** (LOG_TYPE_* / LOG_RESULT_* / status).
- GitBook syntax totals: 105 `{% tabs %}`, 38 `{% hint %}` (info 32, warning 4, danger 2), 16 `{% content-ref %}`, 171 `<mark style>`, 87 HTML `<table>` (`<th width>`), `&#x20;` entities, ~7 absolute `docs.encedo.com/hem-api/...#anchor` links, one `endedo.com` typo.
- Spec vs markdown: spec is a superset of endpoints (adds 9 `diag/*`, `install_bl`, `upload_bootldr`, `storage/unlock/rw|ro`, list variants). Spec **lacks** per-endpoint Log-entries tables (0 `LOG_TYPE` hits) and encodes roles only via `x-required-scope` ("role M denied"). Path param names differ (`:kid`/`:offset/:limit`/`:id` vs `{kid}`/`{offset}/{count}`/`{file}`).
- Live branding: title "Encedo HEM API Developer Manual"; Encedo logo PNG (public GitBook CDN URL, 28 KB, HTTP 200); primary purple `rgb(155,52,219)` = `#9B34DB`; fonts Inter + IBM Plex Mono; light/dark/system toggle; sidebar section headers Preliminary / Security / Reference; "Powered by GitBook" footer; search.
- Environment: headless Linux, Node 24.21 / npm 11.19 (no yarn, `gh`, browser, ImageMagick, PIL; PyYAML available), npm registry reachable, Docker daemon inaccessible. Claude commits, user pushes. **Never add `Co-Authored-By` to commits.**
- Versions today: @docusaurus/core 3.10.2 (Node ≥20), docusaurus-plugin-openapi-docs / -theme-openapi-docs 5.2.0 (theme peer-depends on docusaurus-plugin-sass ^0.2.3 → 0.2.7), @redocly/cli 2.54.3, @easyops-cn/docusaurus-search-local 0.55.3, @fontsource/inter + ibm-plex-mono 5.3.0, @docusaurus/plugin-client-redirects 3.10.2. Plugin demo confirms `versions` config shape, `versionSelector`/`versionCrumb` helpers from `docusaurus-plugin-openapi-docs/lib/sidebars/utils`, and `x-displayName` for tag labels.

## Decisions agreed with the user

| Topic | Decision |
|---|---|
| Renderer | `docusaurus-plugin-openapi-docs` + theme v5: page per operation, grouped by tag, `showExtensions` for `x-required-scope` |
| Hand-written API pages | Gap analysis → fold missing facts into the spec → prove parity → delete the 38 pages |
| Site URL | `https://encedo.github.io/hem-api-docs/`, `baseUrl '/hem-api-docs/'`; README documents the custom-domain switch |
| Visual verification | GitHub Pages after the user pushes, plus `docusaurus serve --host 0.0.0.0` on the server |
| API versions | Ship 1.2.2 only; plugin `versions` structure prepared; README recipe for adding a version |
| Spec naming | `api/hem-api-1.2.2.yaml` (flat, one file per version) |
| Generated MDX | Generated at build time (`prebuild`), gitignored |
| `diag` endpoints | Included in the published site |
| Deploy | GitHub Actions → Pages (source "GitHub Actions"); triggers `main` + `docusaurus` during migration, `main` only after merge; PR build-check workflow |
| Tooling | npm + lockfile, TypeScript config, docs-only mode (`routeBasePath: '/'`) |

Open (to settle when the owning milestone is finalized): `info.title` "Encedo nGINE REST API" vs "Encedo HEM API" (M2; recommend keep); which repo is canonical for the spec going forward, docs repo or firmware repo (M4/M6; recommend docs repo, firmware copies); keep the "Send API Request" panel (M2 review); old-URL redirects (M6, defer until a custom domain).

## Target repository layout (after M6)

```
.github/workflows/deploy.yml        build + deploy to Pages (push main/docusaurus; workflow_dispatch)
.github/workflows/pr-check.yml      lint + build on pull requests
api/hem-api-1.2.2.yaml              OpenAPI source of truth (one file per version)
docs/index.md                       Welcome (slug /)
docs/preliminary/{quick-start,general-information}.md
docs/security/report-an-issue.md, docs/security/advisory/{index,hall-of-fame}.md
docs/reference/api/                 GENERATED at build time (gitignored)
src/css/custom.css                  palette, fonts, sidebar headings, subtitle, cards
src/components/ContentRef.tsx       GitBook-style link card
static/img/{encedo-logo.png,favicon.png,PGC_1323.jpg,PGC_1400.jpg}
docusaurus.config.ts  sidebars.ts  redocly.yaml  package.json  package-lock.json
tsconfig.json  .gitignore  .nvmrc  README.md (maintainer manual)  LICENSE
migration-doc/                      TEMPORARY (user deletes after M7)
```

Interim: in M1 all GitBook sources (`README.md`, `SUMMARY.md`, `preliminary/`, `security/`, `reference/`, `.gitbook/`) are `git mv`'d to `legacy-gitbook/`. This frees the root `README.md` for the maintainer manual (needed in M1 for GitHub setup), keeps the Docusaurus root clean, and gives the M3 converter and M4 gap tooling a stable input path. M4 deletes `legacy-gitbook/reference/`, M6 deletes the rest.

## Milestone workflow

- `migration-doc/PLAN.md` = this plan plus a status table (milestone / state / commit).
- `migration-doc/decisions.md` = the decisions table above, appended as milestones conclude.
- One file per milestone `M<N>-<slug>.md`, fixed sections: Goal · Deliverables · Steps · Acceptance criteria · Verification (automated / user) · Open questions · Conclusions & hand-over (filled when done).
- Lifecycle per milestone: refresh the draft using conclusions of previous milestones → **user accepts** → `git mv` to `in-progress/` → implement, run verification, write conclusions → **user accepts** (visual/GitHub check where marked) → `git mv` to `done/`.
- `migration-doc/scripts/` holds one-off Python scripts (converter, gap analysis); `migration-doc/gap/` holds gap-analysis output.
- Commits: one per milestone step, message `M<N>: <title>` + bullets, no push, no `Co-Authored-By`.

## Milestones

### M0 — Bookkeeping (immediately after plan approval)
Create `migration-doc/PLAN.md`, `decisions.md`, `draft/M1..M7`, `scripts/.gitkeep`. Commit `M0: migration plan and milestone drafts`. Then finalize M1 and ask for acceptance.

### M1 — Docusaurus skeleton + CI/CD to GitHub Pages
**Goal**: working deploy loop with placeholder content, so every later milestone is reviewable on Pages.

**Deliverables**: `git mv` GitBook sources → `legacy-gitbook/`; `package.json` + lockfile, `tsconfig.json`, `.nvmrc` (24), `.gitignore`, `docusaurus.config.ts`, `sidebars.ts`, `src/css/custom.css`, `docs/index.md` (placeholder Welcome, `slug: /`), `static/img/.gitkeep`; `.github/workflows/deploy.yml`, `.github/workflows/pr-check.yml`; root `README.md` v1 (live URL, GitHub configuration, headless preview, layout, migration pointer).

**Key config** (`docusaurus.config.ts`): `title: 'Encedo HEM API Developer Manual'`, `url`/`baseUrl` as two constants at the top (custom-domain switch = edit two lines), `organizationName: 'encedo'`, `projectName: 'hem-api-docs'`, `trailingSlash: false`, `onBrokenLinks: 'throw'`, `onBrokenAnchors: 'throw'`, `markdown.hooks.onBrokenMarkdownLinks: 'throw'`; preset-classic with `docs: { routeBasePath: '/', sidebarPath, editUrl }`, `blog: false`, `pages: false`; `colorMode.respectPrefersColorScheme: true`; prism `json`, `bash`, `http`. Scaffold via `npx create-docusaurus@latest <scratch> classic --typescript --package-manager npm --skip-install` and copy only the needed files (no blog/pages/tutorial).

**Scripts**: `start` = `docusaurus start --host 0.0.0.0 --port 3000`, `build`, `serve`, `typecheck`.

**deploy.yml**: `on: push: branches: [main, docusaurus]` + `workflow_dispatch`; `concurrency: pages`; build job: `actions/checkout@v4`, `actions/setup-node@v4` (node 24, npm cache), `npm ci`, `npm run build`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3` (path `build`); deploy job: `permissions: pages: write, id-token: write`, `environment: github-pages`, `actions/deploy-pages@v4`. `pr-check.yml`: same build steps on `pull_request`, plus `typecheck`, no deploy.

**README v1 — GitHub configuration the user must do** (no `gh` here): Settings → Pages → Source **GitHub Actions**; Settings → Environments → `github-pages` → deployment branch rule: allow `docusaurus` too (auto-created rule allows only `main`; otherwise deploy fails with "not allowed to deploy to github-pages due to environment protection rules"); Actions enabled. Headless preview: `npm run build && npm run serve -- --host 0.0.0.0 --port 3000` → `http://<server-ip>:3000/hem-api-docs/` (or SSH tunnel `-L 3000:127.0.0.1:3000`).

**Acceptance**: `npm ci && npm run build && npm run typecheck` pass locally; after push, Actions green and Pages shows the placeholder with the sidebar section header. **User verifies**: Pages URL loads, README instructions sufficed.

**Pitfalls**: `baseUrl` needs leading and trailing slash; `pages: false` avoids a `src/pages/index` collision with the docs root; no `README.md` inside `docs/`; `serve` only answers under the baseUrl.

### M2 — OpenAPI reference integration
**Goal**: generated one-page-per-operation reference at `/reference/api/*`, grouped by tag with friendly labels, generated at build time, spec linted in CI, spec downloadable, versions structure ready.

**Deliverables**: `git mv api/openapi.yaml api/hem-api-1.2.2.yaml` (update header comment: this file is the docs' source of truth); add `x-displayName` to the 7 tags and reorder `tags:` to GitBook order (system → System, auth → Authorization, keymgmt → Key management, crypto → Cryptography operations, logger → Audit log, storage → Storage, diag → Diagnostics (DIAG builds only)); deps `docusaurus-plugin-openapi-docs@^5.2`, `docusaurus-theme-openapi-docs@^5.2`, `docusaurus-plugin-sass@^0.2.7`, dev `@redocly/cli`; `redocly.yaml` (extends recommended; tune rules to zero errors); `.gitignore` += `docs/reference/api/`; workflows += `npm run lint:spec` before build.

**Config**:
```ts
staticDirectories: ['static', 'api'],            // serves /hem-api-docs/hem-api-1.2.2.yaml for download
presets: [['classic', { docs: { ..., docItemComponent: '@theme/ApiItem' } }]],
plugins: ['docusaurus-plugin-sass', ['docusaurus-plugin-openapi-docs', {
  id: 'openapi', docsPluginId: 'classic',
  config: { hem: {
    specPath: `api/hem-api-${apiVersion}.yaml`, outputDir: 'docs/reference/api',
    downloadUrl: `${baseUrl}hem-api-${apiVersion}.yaml`, showExtensions: true, hideSendButton: false,
    sidebarOptions: { groupPathsBy: 'tag', categoryLinkSource: 'tag', sidebarCollapsible: true, sidebarCollapsed: true },
    version: apiVersion, label: `v${apiVersion}`, baseUrl: `${baseUrl}reference/api`,
    // versions: { '<old>': { specPath, outputDir: 'docs/reference/api/<old>', label, baseUrl, downloadUrl } },
  } satisfies OpenApiPlugin.Options } }]],
themes: ['docusaurus-theme-openapi-docs'],
themeConfig.languageTabs: [{language:'curl'},{language:'python'},{language:'javascript'}],
```
`sidebars.ts` imports `./docs/reference/api/sidebar` (generated), filters out the info doc, and nests the slice under a category "API Reference" whose link is the info page. Scripts: `gen-api` = `docusaurus gen-api-docs all`, `clean-api`, `prebuild`/`prestart`/`pretypecheck` = `npm run gen-api`, `lint:spec` = `redocly lint`. Test whether `versions: {}` is harmless; if yes keep it live, else keep the commented template.

**Acceptance**: `lint:spec` 0 errors; build produces 69 operation + 7 tag + 1 info pages; `docs/reference/api/` untracked; info page shows `v1.2.2` badge and a working Download button; `x-required-scope` visible on e.g. `/reference/api/create-key`; CI green. **User verifies**: operation-page look, tag pages, whether the raw `x-required-scope` block is acceptable (fallback: render scope as a sentence in the description and turn `showExtensions` off), whether to keep "Send API Request", the two ops tagged `[system, diag]` appearing twice.

**Pitfalls**: sass plugin must be installed *and* listed in `plugins`; `sidebars.ts` imports a gitignored file, hence the `pre*` scripts; `downloadUrl` is used verbatim so it must include baseUrl; `gen-api-docs all` skips extra versions unless `--all-versions`; build may need `NODE_OPTIONS=--max-old-space-size=4096` in CI; don't enable `future.experimental_faster` until sass-loader compatibility is checked.

### M3 — Non-API content migration
**Goal**: convert the 6 non-API pages with a scripted, idempotent converter; restore `SUMMARY.md` structure; fix links; keep GitBook look (subtitle, hints, tabs, cards). `reference/api-reference/README.md` is not converted as a page: its cards are superseded by tag categories, its conventions text moves into `info.description` in M4.

**Deliverables**: `migration-doc/scripts/gitbook2mdx.py` (reads `legacy-gitbook/`, writes `docs/`, reports unconverted constructs and unresolved links, non-zero exit on either); `docs/index.md`, `docs/preliminary/*.md`, `docs/security/**`; `static/img/PGC_*.jpg` (git mv); `src/components/ContentRef.tsx` (wraps `@theme/DocCard` so description comes from doc metadata); full `sidebars.ts` mirroring `SUMMARY.md` with `type: 'html'` section headers (Preliminary / Security / Reference); minimal `.doc-subtitle` / `.sidebar-heading` CSS.

**Conversion rules**:

| GitBook | MDX |
|---|---|
| `description:` frontmatter | keep (meta) + `sidebar_label` from SUMMARY + `<p className="doc-subtitle">…</p>` after the H1 |
| `cover:`/`coverY:` | drop |
| `{% hint style="X" %}` | `:::info` / `:::warning` / `:::danger` / (`success`→`:::tip`) |
| `{% tabs %}{% tab title="X" %}` | `<Tabs><TabItem value label>` + imports from `@theme/Tabs`/`@theme/TabItem` |
| `{% content-ref url %}` | `<ContentRef … />` via a link map |
| folder `README.md` | `index.md` |
| `https://docs.encedo.com/hem-api/<path>#anchor` | internal route; API anchors → generated operation routes (`#get-device-status` → `/reference/api/get-system-status` etc.); `~/revisions/…` certified-version links stay external |
| `https://endedo.com` | `https://encedo.com` |
| `&#x20;` / `&#x26;` | delete / `&` |
| HTML `<table>` | GFM pipe table when cells are inline-only; else keep HTML, strip `width`, `<br>`→`<br />` |
| emoji `<span data-gb-custom-inline…>` | plain emoji |
| `<a href="#x" id="x"></a>` in heading | drop |
| `![](.gitbook/assets/f.jpg)` | `![](/img/f.jpg)` |
| `javascript` fences holding JSON | `json` (fences with `# header` comment lines → `text`) |
| bare `{ } <` in prose | escape for MDX v3 |

**Acceptance**: build passes with all three `throw` settings; sidebar order equals SUMMARY.md; Welcome shows 2 photos + 4 cards; General information shows 2 tab groups, 3 tables, 10 code blocks; `grep -rn '{%\|&#x20;\|\.gitbook' docs/` empty. **User verifies**: 6 pages side-by-side with docs.encedo.com.

### M4 — API content reconciliation (spec = single source of truth)
**Goal**: nothing from the 38 hand-written API pages is lost; fold into `api/hem-api-1.2.2.yaml`; prove parity; delete `legacy-gitbook/reference/`.

**Deliverables**: `scripts/extract_gitbook_api.py` → `gap/gitbook-endpoints.json` (per documented endpoint: allowed users, scopes, hints, params, body rows, response codes + examples, named tables incl. Log entries, narrative blocks); `scripts/spec_inventory.py` (per operation from YAML); `scripts/gap_report.py --strict` → `gap/REPORT.md` (per-operation checklist + "human review" column); `scripts/inject_audit_tables.py` (idempotent injection of Allowed-roles line + Audit-log table into descriptions); hand edits guided by REPORT.md; rewritten user-facing `info.description` (keep global conventions, drop firmware internals, add `my.ence.do` and required-field conventions, doc version line); `git rm -r legacy-gitbook/reference`; link map/anchors updated.

**Path alias map**: `:kid`↔`{kid}`; `/keymgmt/list/:offset/:limit` → `listKeys`/`listKeysOffset`/`listKeysPage`; `/logger/list/:offset` → `listLogFiles`/`listLogFilesOffset`; `/logger/:id` → `getLogFile`. Spec-only operations are reported as "no legacy content".

**Where legacy content goes**: Allowed users → first line of operation `description`: `**Allowed roles:** User, ExtAuth. **Not allowed:** Master.` (cross-checked with `x-required-scope`); Required scope → already `x-required-scope`, mismatches flagged; hints → `:::info/:::warning/:::danger` inside `description` (test one first); body/param rows → property `description`/`required`; response titles more specific than a shared `$ref` → inline `description`; 200 JSON → `responses.200.content.application/json.example`; response-data tables → schema property descriptions; enum tables → `enum` + `x-enumDescriptions` (theme renders a table); **Log entries** → markdown table under `#### Audit log entries` in `description` (`| Event | Result | Trigger |`); endpoint narrative → operation description with its own `####` heading (gives anchors); group narrative / section READMEs → tag `description`; cross-cutting → `general-information.md`. Rationale for description markdown over an `x-audit-log` extension: `showExtensions` renders extensions as raw JSON in a code block, while descriptions are compiled MDX and also render in Redoc/Swagger UI.

**Acceptance**: `gap_report.py --strict` exits 0 and every human-review row is ticked with a target; `lint:spec` and build pass; `legacy-gitbook/reference/` gone; `grep -rn 'api-reference' docs/ sidebars.ts` empty. **User verifies**: ~8 operation pages against live GitBook (create-key, system status, auth init, storage lock/unlock, logger list, config POST, ML-KEM), tag pages, info page. Also decide the sync direction with `encedo_firmware/docs/openapi.yaml`.

**Pitfalls**: use `description: |` block scalars; `{}` in inline code may show escaped (test); legacy pages have duplicated H2s and typos (e.g. "CURVE4ECC") — clean while folding.

### M5 — Visual style
**Goal**: Encedo branding and GitBook-like feel: logo/favicon, `#9B34DB` palette (light + lighter dark ramp), self-hosted Inter + IBM Plex Mono, uppercase sidebar section headers, cards, navbar/footer, local search.

**Deliverables**: `static/img/encedo-logo.png` (curl from the public GitBook URL) + `favicon.png` (resize via `npx sharp-cli` or reuse); deps `@easyops-cn/docusaurus-search-local` (`docsRouteBasePath: '/'`, `hashed: true`), `@fontsource-variable/inter` (or `@fontsource/inter`), `@fontsource/ibm-plex-mono`; `custom.css` with Infima primary ramp, font vars, `.sidebar-heading`, `.doc-subtitle`, DocCard hover, method-badge/dark-mode checks for the openapi theme; navbar (logo, "encedo.com", GitHub), footer (Encedo links, security page, examples repo, copyright + doc version line).

**Acceptance**: build passes; fonts served from `build/assets/fonts` (no Google Fonts request); palette applied in both modes; search finds "keymgmt:gen" and "Hall of fame". **User verifies**: resemblance to docs.encedo.com in light and dark, logo size, purple contrast on dark, search UX.

### M6 — Cleanup + maintainer docs
**Deliverables**: `git rm -r legacy-gitbook/`; final root `README.md`: live site, layout, **GitHub configuration**, **how to update docs** (MDX gotchas, admonitions/tabs/ContentRef), **how to update the API reference** (edit YAML only; conventions `x-required-scope`, `x-displayName`, `x-enumDescriptions`, "Audit log entries"; sync with firmware repo), **how to add a new API version** (copy `api/hem-api-<new>.yaml`, make it base `specPath/version/label`, move previous into `versions` with `outputDir docs/reference/api/<old>`, switch `gen-api` to `--all-versions`, import old sidebar slice + `versionSelector`, update footer line), **switching to a custom domain** (two constants, DNS CNAME, Pages settings, `/hem-api/` prefix redirects, disconnect GitBook Git Sync), **headless preview**; optional `@docusaurus/plugin-client-redirects` list generated from the M4 endpoint map (recommend deferring until a custom domain; ship the list in README); dry-run the "add a version" recipe with a copy of the same spec, then revert, to prove it works.

**Acceptance**: `git ls-files | grep -i gitbook` empty; lint/build/typecheck pass; Pages reflects final state. **User verifies**: README read-through, full click-through, redirect decision.

### M7 — Stabilise + merge to main
1. Disable GitBook Git Sync for this repo first (otherwise GitBook may push `GITBOOK-*` commits to `main` or wipe the space after the merge).
2. `deploy.yml` → `branches: [main]`; commit.
3. User pushes, opens PR `docusaurus → main`; `pr-check` green; merge (merge commit keeps milestone history).
4. Deploy from `main` green; remove `docusaurus` from the `github-pages` environment rule; optionally protect `main`.
5. User deletes `migration-doc/` and the `docusaurus` branch; final commit removes the README migration pointer. Optional tags `docs-v1.7b`, `api-1.2.2`.

## Verification matrix

| Check | Automated | User |
|---|---|---|
| Build with `onBrokenLinks/onBrokenAnchors/onBrokenMarkdownLinks: throw` | `npm run build` locally + both workflows | — |
| Spec validity | `npm run lint:spec` | — |
| TS config/sidebars | `npm run typecheck` | — |
| Generated page count (69 ops, 7 tags, 1 info) | `ls docs/reference/api/*.api.mdx \| wc -l` | — |
| Legacy syntax leftovers | `grep -rn '{%\|&#x20;\|\.gitbook' docs/` | — |
| API content parity | `gap_report.py --strict` | ~8 pages vs live GitBook |
| Non-API content parity | converter report clean | page-by-page |
| Style / dark mode / fonts / search | fonts in `build/assets/fonts`; index built | Pages or `serve` review |
| Deployment | Actions green | URL, Pages settings, environment rule |
| README procedures | M6 dry run | read-through |

## Risks
- `versions: {}` behaviour unverified (M2 test; fallback commented template).
- `showExtensions` renders a raw code block; fallback ready.
- Admonitions/anchors inside spec descriptions need a smoke test before mass folding (M4).
- Spec lives in two repos; sync direction to be decided (M4/M6).
- GitBook Git Sync must be disabled before merging to `main` (M7).
- First `docusaurus`-branch deploy will fail until the environment branch rule is relaxed (documented in M1 README).
- Certified-revision links point at GitBook and break if the space is deleted; flag to user (archive as PDF?).
- CI build time/memory for 69 heavy pages; mitigated with `NODE_OPTIONS`.
