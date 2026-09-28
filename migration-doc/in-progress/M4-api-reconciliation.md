# M4 — Update pages from the spec + new endpoint pages + checker + agent instructions (revised)

State: in-progress (accepted 2026-09-28)

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
Resolved 2026-09-28:
- Canonical home of the spec: **the firmware repository** (`encedo_firmware/docs/openapi.yaml`). This repo keeps a copy per firmware release as `api/hem-api-<version>.yaml`. Spec edits made here (e.g. per-operation `security`) must be upstreamed; M4 lists them for the user.
- Legacy-only fields (page documents a field the spec lacks): decided by the user from the checker report during M4.

## Conclusions & hand-over
Implemented 2026-09-28; awaiting the user's acceptance.

- `scripts/check-api-docs.mjs` (Node, `yaml`): matches `<Endpoint operationId>` blocks to spec operations (consecutive blocks share sections); checks method/path, path/query/header parameters, body fields and required flags, response codes, enum tables ("Possible `x` values", page-level), scope tokens and the Master role; page-level or per-block `<Roles>`/`<Scope>`; `--json`, `--markdown`, `--strict`, `--only`; `scripts/check-api-docs.known-gaps.json` downgrades reviewed findings to "accepted". `npm run check:api`; both workflows run it as an informational step into the job summary.
- Initial report: 201 errors / 25 warnings. `migration-doc/scripts/reconcile_pages.py` applied 164 mechanical fixes from the spec (missing response codes with titles, 411/412/413/500 on almost every operation; missing body fields `ctx`, `note`; required flags `msg`, `alg`, `ct`, `label`). Hand fixes: path parameters `{file}`, `{offset}/{count}` (the key-list variants are one block with a Path Parameters table instead of a wrong Request Body table); the firmware-install block had untitled response tabs (converted to `<ResponseCodes>`); configuration POST body: `emp`/`key`/`crt` moved to "Members of the `tls` object"; per-block `<Scope>` rows where one page-level row was wrong (configuration, firmware, management app, storage rw/ro, bootloader); derive-key scope `keymgmt:derive`; exact enum tables for derive/import from the spec (they differ from create-a-key).
- New pages/blocks for the 16 spec-only operations: `diagnostics/{index,fault-injection,memory-and-repository,bootloader-upgrade}.mdx` (Diag variant only; `sidebars-diag-items.json` is now a category), storage `/unlock/rw` + `/unlock/ro`, key list without arguments and with offset, audit-log list without offset.
- 12 remaining errors and 7 warnings were claims the pages made beyond the spec. Verified in the firmware (`encedo_firmware`, tag 1.2.2) — none of the extra response codes or the `exp` field exists in the code (removed); the Master-role denials on ext-auth and storage endpoints are real firmware behaviour the spec does not state (kept, accepted in `known-gaps.json`). Findings for the canonical spec and firmware bugs: `migration-doc/upstream-spec-notes.md`.
- Final: `npm run check:api` 0 errors, 0 warnings, 7 accepted; lint, typecheck, build pass (96 pages). `legacy-gitbook/reference/` removed; `AGENTS.md`, `CLAUDE.md` and the README "Maintaining the documentation" section written.
- Hand-over to M5: the user's visual notes are in the M5 draft (logo top-left, light mode default, no card icons). Hand-over to M6: README pointers to AGENTS.md exist; `migration-doc/upstream-spec-notes.md` must be handed to the firmware repository before `migration-doc/` is deleted.
