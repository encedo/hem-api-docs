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

## Open questions
- Enable client redirects now or defer (recommended: defer)?
- Replace `encedo_firmware/docs/openapi.yaml` by a pointer to this repo?

## Conclusions & hand-over
_(filled when done)_
