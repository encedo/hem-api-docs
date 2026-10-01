# M6 — Cleanup + maintainer docs (revised)

State: in-progress (accepted 2026-09-28)

## Goal
Remove all GitBook leftovers; finish the root README as the human setup manual (AGENTS.md holds the agent procedures); final verification.

## Deliverables
- `git rm -r legacy-gitbook/`; converter script stays in `migration-doc/` until M7.
- Final `README.md`: live site; repository layout (incl. `docs-diag/` copy, variants, tester); prerequisites; build/preview on a headless server; deployment + GitHub configuration; how to update the documentation (short, pointing to AGENTS.md for the API reference procedures); how to add a new API version (summary, details in AGENTS.md Procedure B); switching to a custom domain (two constants, DNS CNAME, Pages settings, `/hem-api/` prefix redirects, disconnect GitBook Git Sync); license.
- Dry run of AGENTS.md Procedure B with a copy of the same spec, then revert, to prove the instructions work.
- Optional `@docusaurus/plugin-client-redirects` list (old GitBook paths → new pages) generated from the page map; recommended to ship the list in the README and enable only with a custom domain.
- Dependencies/scripts review; `npm audit` glance.

## Acceptance criteria
- `git ls-files | grep -i gitbook` is empty; `npm run lint:spec && npm run typecheck && npm run build && npm run check:api` pass; Pages reflects the final state after push.

## Verification
- Automated: the commands above.
- User: README read-through; full click-through (both variants, tester); redirect decision.

## Inputs from M4/M5
- The firmware repository is canonical for the spec: the README describes copying `encedo_firmware/docs/openapi.yaml` into `api/hem-api-<version>.yaml`; `migration-doc/upstream-spec-notes.md` must be handed over before `migration-doc/` is deleted (M7).
- `AGENTS.md` already holds Procedures A/B and the validation checklist; the README only points to it.
- Fonts are self-hosted (`src/fonts.ts`), search is local (`@easyops-cn/docusaurus-search-local`), the API tester renderer is loaded from a pinned CDN URL (`cdn` in `docusaurus.config.ts`).

## Open questions
- Redirects: resolved 2026-09-28 → **add now** (`@docusaurus/plugin-client-redirects`, every default-variant route also served under the old `/hem-api/` prefix, ready for the custom-domain switch).

## Conclusions & hand-over
Implemented 2026-09-28; awaiting the user's README read-through and acceptance.

- `legacy-gitbook/` removed (the converter `migration-doc/scripts/gitbook2mdx.py` stays until M7 for reference; it cannot be re-run without the legacy sources, which remain in git history).
- README rewritten as the human setup manual: layout, prerequisites, build/preview on a headless server (incl. `sync:diag`), site structure (variants, API tester notes on the pinned CDN renderer and device CORS/TLS, search, redirects), maintaining the documentation (spec copied from the canonical `encedo_firmware` repo; Procedures A/B in AGENTS.md), deployment and the one-time GitHub configuration, custom-domain switch (two constants, DNS, Pages, GitBook sync), license.
- Redirects: `@docusaurus/plugin-client-redirects` maps every default-variant page to the old GitBook prefix `/hem-api/<path>` (plus `/hem-api` → `/`); Diag, tester, search and the 404 route are excluded. Generated as `<path>/index.html`, which GitHub Pages serves for extensionless URLs.
- **Procedure B dry run (AGENTS.md §5) passed**: `docs:version 1.2.2` → `sync:diag` mirrored `versioned_docs`/`versions.json`/`versioned_sidebars` to `diag_*` with the Diagnostics category appended → config with `lastVersion: 'current'` and version paths for both instances → build produced `/1.2.2/` (44 pages, no diagnostics) and `/diag/1.2.2/` (48 pages, 4 diagnostics) with working dropdown entries → reverted (config restored from git, generated folders deleted).
- Final verification: lint valid, checker 0 errors / 0 warnings / 7 accepted, typecheck OK, build OK; no GitBook leftovers outside `migration-doc/`; no legacy syntax in `docs/`.
- `npm audit`: 22 advisories (21 moderate, 1 high) inside Docusaurus' own dependency tree; `npm audit fix --force` would downgrade/upgrade Docusaurus packages, so nothing was changed. They affect the build toolchain only (the published site is static HTML/JS). Re-check after future Docusaurus upgrades.
- Lesson recorded for AGENTS.md: commit before a dry run that reverts files with `git checkout` (the redirects config was lost once that way and re-added).
- **Diag section removed (2026-10-01, user's change of plans at the M6 review):** Diagnostics pages, the second docs instance, `docs-diag/`, `scripts/sync-diag-docs.mjs`, `sidebars-diag*` and all related config (exclude, sitemap/search ignores, redirect exclusion, dropdown entry) deleted; `scripts/strip-diag-spec.mjs` removed the 11 DIAG-only operations and the `diag` tag from `api/hem-api-1.2.2.yaml` (58 operations remain; lint valid); the checker now errors on any `diag`-tagged operation; README and AGENTS.md describe the rule ("when generating the OpenAPI, diag must not be part of it") and the strip step in Procedures A and B. The dropdown stays with one entry for future versions.
- Hand-over to M7: hand `migration-doc/upstream-spec-notes.md` to the firmware repository before deleting `migration-doc/`; remove the migration note from the README; narrow `deploy.yml` to `main`.
