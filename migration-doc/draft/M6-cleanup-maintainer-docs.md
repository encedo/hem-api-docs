# M6 — Cleanup + maintainer docs (revised)

State: draft

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
- Enable client redirects from the old GitBook paths now, or defer until a custom domain (recommended: defer; the list is generated and kept in the README)?

## Conclusions & hand-over
_(filled when done)_
