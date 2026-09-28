# M4 — Update pages from the spec + new endpoint pages + checker + agent instructions (revised)

State: draft

## Goal
The hand-written API pages agree with `api/hem-api-1.2.2.yaml` (source of truth); spec-only endpoints are documented in the same style; a checker script reports spec ↔ pages drift; a future agent has complete, validated instructions.

## Deliverables
- `scripts/check-api-docs.mjs` (Node ESM; devDependency `yaml@^2`; script `check:api`): flags `--spec`, `--docs`, `--json`, `--markdown`, `--strict`, `--only`; compares operations (via `<Endpoint … operationId />`), method/path, header/body/path params and required flags, response codes, enum tables ("Possible `x` values"), `<Scope>` tokens vs `x-required-scope`, `<Roles master={false}>` vs "role M denied". Exit 0 unless `--strict`. CI step (both workflows) `node scripts/check-api-docs.mjs --markdown >> "$GITHUB_STEP_SUMMARY"` with `continue-on-error: true`.
- Page updates driven by the checker report: path-param names (`{kid}`, `{offset}/{count}`, `{file}`), missing response codes (texts from `components.responses`), missing body fields and enum values, roles/scope reconciliation, typos ("CURVE4ECC", "succsessful").
- New content: `docs/reference/api-reference/diagnostics/index.mdx` (DIAG-builds-only warning), `diagnostics/fault-injection.mdx` (test, test_trng, break_temp, break_trng, break_tls, disable_selftest, wipe_config), `diagnostics/memory-and-repository.mdx` (memdump, corrupt_repo), `diagnostics/bootloader-upgrade.mdx` (install_bl, upload_bootldr; one-sentence note on the Firmware page without a link); `storage.mdx` gains `/api/storage/unlock/rw` and `/ro`; `list-the-keys.mdx` documents `/list`, `/list/{offset}`, `/list/{offset}/{count}` as an Endpoint group; `audit-log.mdx` gains `/api/logger/list`.
- Spec edits (source of truth): per-operation `security: [{bearerAuth: []}]` on protected operations (Scalar then shows the Authorization input); decisions on fields present on pages but absent from the spec (user decides: add to spec or drop from pages).
- `AGENTS.md` (commands, invariants, page template, component reference, Procedure A "spec changed", Procedure B "new firmware version", validation checklist, limitations), `CLAUDE.md` (one-line pointer), README section "Maintaining the documentation".
- `git rm -r legacy-gitbook/reference`.

## Inputs from M3
- Pages live in `docs/` (`.mdx` under `reference/api-reference/`, `.md` elsewhere); every endpoint block is `<Endpoint method path operationId />`, roles/scope are `<Roles>`/`<Scope>` rows, response codes are `<ResponseCodes>`/`<ResponseCode code title>`, required markers are `<Req />`, enum tables use the heading "Possible `x` values".
- 16 spec operations have no page section: `diagTest`, `diagTestTrng`, `diagWipeConfig`, `diagBreakTemp`, `diagBreakTrng`, `diagBreakTls`, `diagDisableSelftest`, `diagCorruptRepo`, `diagMemdump`, `upgradeInstallBootloader`, `uploadBootloader`, `storageUnlockRw`, `storageUnlockRo`, `listKeys`, `listKeysOffset`, `listLogFiles`.
- `sidebars-diag-items.json` currently holds one doc item (`reference/api-reference/diagnostics/index`); turn it into a category with the new Diagnostics pages. Diagnostics pages must not be linked from non-diag pages (the default instance excludes them).
- Link anchors of renamed headings are already mapped (`possible-type-values`, `possible-mode-values-nist-ecc-keys-only`).
- The converter is idempotent but M4 edits the generated pages by hand: do **not** re-run `gitbook2mdx.py` after M4 starts (it would overwrite the edits).

## Steps
1. Write the checker first; run it to get the work list.
2. Update existing pages; write the new pages; edit the spec (`security`); re-run until 0 errors.
3. Write AGENTS.md / CLAUDE.md / README section; add the CI step.
4. `npm run lint:spec && npm run typecheck && npm run build && npm run check:api`; remove `legacy-gitbook/reference`; commit `M4: pages reconciled with the OpenAPI spec; checker; agent instructions`.

## Acceptance criteria
- `npm run check:api` reports 0 errors (remaining warnings justified in AGENTS.md); lint/typecheck/build pass.
- `legacy-gitbook/reference/` deleted; `grep -rn ':kid\|:offset\|:limit' docs/` empty.

## Verification
- Automated: checker, lint, typecheck, build.
- User: reviews the Diagnostics pages (Diag variant), create-a-key, configuration, list-the-keys, storage; decides the legacy-only field list; confirms the spec's canonical home (this repo vs firmware repo) for the README.

## Open questions
- Canonical home of the spec going forward (recommended: this repo; firmware repo copies).
- Legacy-only fields (config POST `tls`, `gen_csr`, `emp`, `key`, `crt`, …): add to the spec or drop from the pages?

## Conclusions & hand-over
_(filled when done)_
