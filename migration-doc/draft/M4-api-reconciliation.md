# M4 — API content reconciliation (spec = single source of truth)

State: draft

## Goal
Nothing documented in the 38 hand-written API pages is lost: fold missing facts into `api/hem-api-1.2.2.yaml`, prove parity with tooling, then delete `legacy-gitbook/reference/`.

## Deliverables
- `migration-doc/scripts/extract_gitbook_api.py` → `migration-doc/gap/gitbook-endpoints.json`: per documented endpoint (53 method+path badges): page, allowed users (User/Master/ExtAuth), required scopes (Main/Alternative), hints, headers, path params, body rows (name/type/required/description), response codes (+ title, + JSON example), named tables ("Response data", "Possible ...", "Log entries"), narrative blocks.
- `migration-doc/scripts/spec_inventory.py`: per operation from the YAML: params, body properties (+required, description, enum, `x-enumDescriptions`), response codes (+description, example present), `x-required-scope`, presence of "Allowed roles" line and "Audit log entries" table.
- `migration-doc/scripts/gap_report.py --strict` → `migration-doc/gap/REPORT.md`: per-operation checklist + "human review" column; exit 1 while machine-detectable gaps remain.
- `migration-doc/scripts/inject_audit_tables.py`: idempotent injection of the Allowed-roles line and the Audit-log table into operation descriptions.
- Edited `api/hem-api-1.2.2.yaml` (hand edits guided by REPORT.md); rewritten user-facing `info.description` (keep global conventions, drop firmware internals such as `MainCfg.Option_CORSOrigin`, add the `my.ence.do` and required-field conventions, the manual version line).
- `git rm -r legacy-gitbook/reference`; link map / anchors in `docs/` updated (e.g. `#fail-state-values-bitmasks` now resolves inside the status operation).

## Steps
1. Smoke test first: put one admonition, one markdown table and one `####` heading into a single operation description; build; confirm rendering and that the heading anchor is linkable.
2. Write and run the extractor and the spec inventory; write `gap_report.py`; read REPORT.md.
3. Path alias map: `:kid` ↔ `{kid}`; `/keymgmt/list/:offset/:limit` → `listKeys`/`listKeysOffset`/`listKeysPage`; `/logger/list/:offset` → `listLogFiles`/`listLogFilesOffset`; `/logger/:id` → `getLogFile`. Spec-only operations (diag ×9, `install_bl`, `upload_bootldr`, storage rw/ro, list variants) are reported as "no legacy content".
4. Fold, in this order: Allowed roles line + Audit-log tables via the injector; then by hand: hints → admonitions in descriptions; body/param rows → property descriptions/`required`; more specific response titles → inline response descriptions; 200 JSON → `responses.200.content.application/json.example`; response-data tables → schema property descriptions; enum tables → `enum` + `x-enumDescriptions`; endpoint narrative → operation description with its own `####` heading; group narrative and section READMEs → tag descriptions; cross-cutting text → `docs/preliminary/general-information.md`.
5. Rewrite `info.description`. Re-run `gap_report.py --strict` until it exits 0 and every human-review row is ticked with a target (operation / tag / page).
6. `npm run lint:spec`, `npm run build`; `git rm -r legacy-gitbook/reference`; update links; build again.
7. Commit `M4: fold hand-written API content into the OpenAPI spec`.

### Formats
- Allowed roles (first line of description): `**Allowed roles:** User, ExtAuth. **Not allowed:** Master.` (caveats appended, e.g. "ExtAuth: GET only"). Cross-checked against `x-required-scope` containing "role M denied".
- Audit log:
  ```markdown
  #### Audit log entries

  | Event | Result | Trigger |
  |---|---|---|
  | `LOG_TYPE_FAILED_SCOPE_CHECK` | `LOG_RESULT_FAILED` | 403 |
  | `LOG_TYPE_KEY_GENERATION` | `LOG_RESULT_OK` | 200 |
  ```
  Rationale: `showExtensions` renders vendor extensions as raw JSON inside a code block, whereas descriptions are compiled MDX and also render in Redoc/Swagger UI.

## Acceptance criteria
- `gap_report.py --strict` exits 0; REPORT.md fully ticked.
- `npm run lint:spec` exits 0; `npm run build` passes; spot-checked pages render admonitions/tables inside descriptions.
- `legacy-gitbook/reference/` deleted; `grep -rn 'api-reference' docs/ sidebars.ts` is empty.

## Verification
- Automated: gap report, lint, build.
- User: compare ~8 operation pages with the live GitBook pages (create-key, system status, auth init, storage lock/unlock, logger list, config POST, ML-KEM), plus tag pages and the info page.

## Open questions
- Canonical home of the spec going forward: this repo (recommended) or `encedo_firmware/docs/openapi.yaml`? Determines the README sync instructions in M6.
- Legacy typos to fix while folding (e.g. "CURVE4ECC", "succsessful")? Recommended: yes.

## Conclusions & hand-over
_(filled when done)_
