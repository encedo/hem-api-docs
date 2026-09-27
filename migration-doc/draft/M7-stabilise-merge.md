# M7 — Stabilise + merge to main

State: draft

## Goal
Freeze the content, merge `docusaurus` into `main`, narrow CI to `main`, tidy the repository and GitHub settings.

## Deliverables
- `deploy.yml` with `branches: [main]` only.
- Merge of `docusaurus` into `main` (done by the user on GitHub).
- README migration pointer removed; `migration-doc/` deleted by the user.

## Steps
1. User: disable GitBook Git Sync for this repository first (otherwise GitBook may push `GITBOOK-*` commits to `main` or wipe the space after the merge).
2. Claude: narrow `deploy.yml` to `main`; commit `M7: deploy from main only`.
3. User: push; open PR `docusaurus → main`; `pr-check` must be green; merge with a merge commit (keeps milestone history).
4. User: confirm the deploy from `main` is green and the Pages content is identical; Settings → Environments → `github-pages`: remove `docusaurus` from the allowed branches; optionally protect `main`.
5. User: delete `migration-doc/` and the `docusaurus` branch. Claude: remove the README migration pointer in a final commit if still present.
6. Optional: tags `docs-v1.7b`, `api-1.2.2`.

## Acceptance criteria
- `main` builds and deploys green; site identical to the last `docusaurus` deploy.
- No `migration-doc/` in `main`; no GitBook sync active.

## Verification
- Automated: pr-check and deploy workflows.
- User: GitHub settings review, final site check.

## Open questions
- Merge strategy: merge commit (recommended) or squash?
- Tag the release?

## Conclusions & hand-over
_(filled when done)_
