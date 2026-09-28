# M3 — Content migration (44 pages) + two docs instances + navbar dropdown (revised)

State: in-progress (accepted 2026-09-28)

## Goal
All 44 legacy GitBook pages converted to MDX in the GitBook style by a scripted, idempotent converter; sidebar mirroring `SUMMARY.md`; two variants of the reference ("1.2.2" at `/`, "1.2.2 Diag" at `/diag`) from one source folder; navbar version dropdown.

## Deliverables
- `migration-doc/scripts/gitbook2mdx.py` (Python 3.12 + PyYAML): reads `legacy-gitbook/`, writes `docs/`; reports unconverted constructs and unresolved links; non-zero exit on any.
- Components `src/components/api/{Endpoint,Req,Roles,Scope,ResponseCodes,ResponseCode}.tsx`, `src/components/ContentRef.tsx`, registered globally in `src/theme/MDXComponents.tsx`; ejected `src/theme/DocItem/Content/index.tsx` rendering `metadata.description` as `.doc-subtitle`.
- `docs/**`: 44 pages (`.mdx` for API pages, `.md` for prose; section `README.md` → `index.mdx`), `static/img/PGC_1323.jpg`, `static/img/PGC_1400.jpg`; placeholder `docs/reference/api-reference/diagnostics/index.mdx`.
- `sidebars.ts` (SUMMARY order, `html` section headers), `sidebars-diag-items.json`, `sidebars-diag.ts` (imports the base sidebar and appends the Diagnostics category), `tsconfig.json` `resolveJsonModule: true`.
- `scripts/sync-diag-docs.mjs` (copy `docs/` → `docs-diag/`; `--watch`), scripts `sync:diag`, `prebuild`, `prestart`; `.gitignore` `/docs-diag/`, `/diag_versioned_docs/`, `/diag_versioned_sidebars/`, `/diag_versions.json`.
- `docusaurus.config.ts`: default instance `exclude` Diagnostics pages + function `editUrl`; second instance `id: 'diag'`, `path: 'docs-diag'`, `routeBasePath: 'diag'`, `versions.current: {label: '1.2.2 Diag', noIndex: true}`; sitemap ignore for `diag/**`; navbar dropdown `v1.2.2` → "1.2.2" (`/`) and "1.2.2 Diag" (`/diag`) with `activeBaseRegex`.
- Minimal CSS for the components (final look in M5).

## Conversion rules
See `PLAN.md` → "Converter" table (authoritative). Key points: H1 removed (title from frontmatter, subtitle from description); `#### Allowed users` tabs → `<Roles user master={false} ext />`; `#### Required access scope` tabs → `<Scope main alt note />`; `<mark>METHOD</mark> URL` → `<Endpoint method path operationId />` with spec path-param names and operationId from a spec-derived map; adjacent duplicate H2s merged (`## A` + `### B`); response-code tabs → `<ResponseCodes>`/`<ResponseCode code title>`; red `*` → `<Req />`; hints → admonitions; other tabs → `<Tabs>`; content-refs → `<ContentRef id />`; single-line HTML tables → GFM when inline-only, else cleaned HTML; ```javascript JSON → ```json; absolute `docs.encedo.com` links → relative file links (certified-revision links stay external); `endedo.com` typo fixed; images → `/img/`; `&#x20;` removed; MDX escapes for bare `{ } <`; enum heading alias "Possible `key` type" → "Possible `type` values".

## Steps
1. Build the spec-derived method+path → operationId map; write the converter; run; iterate until the report is clean.
2. Components + MDXComponents + ejected Content; `git mv` photos.
3. Sidebars (base + diag), sync script, second instance, dropdown; build both variants.
4. Commit `M3: migrate all pages to Docusaurus; 1.2.2 and 1.2.2 Diag variants`.

## Acceptance criteria
- `npm run build` passes with the three `throw` settings; `npm run typecheck` passes.
- `grep -rn '{%\|&#x20;\|<mark\|\.gitbook' docs/` is empty; converter reports 0 unconverted constructs.
- `build/index.html` and `build/diag.html` exist; no `diagnostics` page under `build/reference/`; the Diagnostics category appears only in the Diag variant; the dropdown switches variants; edit links point at `docs/`.
- Sidebar order equals `SUMMARY.md`.

## Verification
- Automated: build, typecheck, greps, converter report.
- User: compare create-a-key, configuration, audit-log, external-authenticator/registration, Welcome and General information with docs.encedo.com on the preview (both variants).

## Open questions
Resolved 2026-09-28:
- Unsplash cover: **keep as a banner** (downloaded to `static/img/welcome-cover.jpg`, shown above the Welcome title).
- Version block ("Version: 1.7b (17.01.2026)" + certified-revision links) on Welcome and the API Reference index: **removed entirely**.

## Conclusions & hand-over
Implemented 2026-09-28; awaiting the user's review on the preview (`http://192.168.0.153:3000/hem-api-docs/`, Diag variant under `/diag`).

- Converter `migration-doc/scripts/gitbook2mdx.py` converts all 45 legacy files (44 SUMMARY pages incl. Welcome; section READMEs → `index.mdx`) with 0 errors; 3 warnings document a legacy typo (the Master roles tab titled "Alternative" on exdsa, ml-dsa, ml-kem → treated as Master). Rules as in PLAN.md, plus: scope tabs keep only the first code as `main` (all scope-like codes as `alt`) and any remaining prose is emitted as markdown under the `<Scope>` row; response-code titles normalised ("succsessful", HTTP reason-phrase prefixes, double spaces); all ```javascript fences hold JSON → ```json; `<` is escaped unless followed by whitespace or a known tag (e.g. `<[email](mailto:…)>`); JSX component lines are never escaped.
- Welcome: Unsplash cover downloaded (1800 px, 238 KB) and shown as a banner; the "version of this documentation" section removed; on the API Reference index the certified-revision paragraph and "Version: 1.7b" line removed, the conventions text kept.
- Components (`src/components/api/*`, `ContentRef`) are registered globally in `src/theme/MDXComponents.tsx`; `src/theme/DocItem/Content/index.tsx` renders the front-matter `description` as a subtitle (only an explicit description, never the excerpt).
- Variants: default instance excludes `reference/api-reference/diagnostics/**`; `diag` instance reads `docs-diag/` (copied by `scripts/sync-diag-docs.mjs` in `prebuild`/`prestart`), route `/diag`, `noIndex`, sitemap ignores `/diag/**`; navbar dropdown `v1.2.2` → "1.2.2" / "1.2.2 Diag". Two docs instances cannot share one folder (both MDX loaders would match the same files), hence the copy.
- Typing note: `sidebars.ts` item types are not exported by Docusaurus; `sidebars-diag.ts` narrows with `Array.isArray` and a type guard instead of `Extract<…>` (which does not filter the categories-shorthand union member).
- Hand-over to M4: 16 spec operations have no page section yet (9 diag, install_bl, upload_bootldr, storage rw/ro, keymgmt list without args and with offset only, logger list); `sidebars-diag-items.json` holds a single Diagnostics doc item to be turned into a category; the "Possible `x` values" heading convention is in place for enum tables; anchors of renamed headings are mapped (`possible-key-type` → `possible-type-values`, `possible-key-mode-for-nist-ecc-keys-only` → `possible-mode-values-nist-ecc-keys-only`).
