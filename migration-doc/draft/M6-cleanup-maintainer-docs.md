# M6 — Cleanup + maintainer docs

State: draft

## Goal
Remove all GitBook leftovers, finish the root `README.md` as the single maintainer manual, decide redirects, run the final verification.

## Deliverables
- `git rm -r legacy-gitbook/`.
- Final root `README.md` sections: Live site; Repository layout; **GitHub configuration** (Pages source = GitHub Actions, environment branch rule, Actions enabled, what to check when a deploy fails); **How to update the documentation** (edit `docs/**.md`; MDX gotchas; admonitions, tabs, `ContentRef`; commit to `main` → CI deploys); **How to update the API reference** (edit only `api/hem-api-<ver>.yaml`; `npm run lint:spec && npm run build`; conventions: `x-required-scope`, `x-displayName`, `x-enumDescriptions`, "Allowed roles" line, "Audit log entries" table; sync with `encedo_firmware`); **How to add a new API version** (copy `api/hem-api-<new>.yaml`; make it the base `specPath`/`version`/`label`; move the previous version into `versions` with `outputDir: docs/reference/api/<old>`, `baseUrl`, `downloadUrl`; switch `gen-api` to `--all-versions`; import the old sidebar slice and add `versionSelector`/`versionCrumb`; update the footer version line; non-API pages are not versioned); **Switching to a custom domain** (two constants; DNS CNAME `docs.encedo.com → encedo.github.io`; Pages custom domain + Enforce HTTPS; `/hem-api/` prefix redirects; disconnect GitBook Git Sync); **Local / headless preview**.
- Optional `@docusaurus/plugin-client-redirects` list generated from the M4 endpoint map (old GitBook paths → new operation routes); recommended to ship the list in the README and enable only when a custom domain arrives.
- Dry run of the "add a new API version" recipe with a copy of the same spec, then revert, to prove the instructions work.
- `.gitignore`, scripts and dependencies reviewed; `npm audit` glance.

## Steps
1. Delete `legacy-gitbook/`; build.
2. Write the README; execute each procedure once exactly as written.
3. Generate the redirects list; add or park it per the user's decision.
4. Commit `M6: remove GitBook sources, complete maintainer README`.

## Acceptance criteria
- `git ls-files | grep -i gitbook` is empty.
- `npm run lint:spec && npm run build && npm run typecheck` pass.
- README procedures verified by dry run; Pages reflects the final state after push.

## Verification
- Automated: lint, build, typecheck, grep.
- User: README read-through, full click-through of the site, redirect decision.

## Open questions
- Enable client redirects now or defer until a custom domain (recommended: defer)?
- Should the firmware repo's `docs/openapi.yaml` be replaced by a pointer to this repo?

## Conclusions & hand-over
_(filled when done)_
