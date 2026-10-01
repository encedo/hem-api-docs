# Maintaining the Encedo HEM API documentation

Instructions for a maintainer or an AI agent updating this repository. Read this file first.
Setup and deployment are described in `README.md`.

## 1. Repository map and commands

| Path | Purpose |
|---|---|
| `api/hem-api-<version>.yaml` | OpenAPI 3.0 description of the firmware API, **the source of truth for API facts**. One file per API/firmware version. It is a copy of `docs/openapi.yaml` from the `encedo_firmware` repository at the release tag (that repository is canonical), **with the DIAG-build-only operations removed** (§2, item 3). |
| `docs/` | The documentation pages (Markdown/MDX). `docs/reference/api-reference/**` holds the hand-written API reference, one page per topic, one block per operation. |
| `sidebars.ts` | Sidebar (mirrors the original GitBook table of contents). |
| `scripts/check-api-docs.mjs` | Compares the API pages with the OpenAPI file. Run it before and after every change to the API reference. |
| `scripts/strip-diag-spec.mjs` | Removes DIAG-build-only operations (tag `diag`) from a spec file. Run it on every spec copied from the firmware repository. |
| `scripts/check-api-docs.known-gaps.json` | Reviewed and accepted differences between pages and spec (reported as "accepted", not as errors). |
| `src/components/api/` | Components used by the API pages (`Endpoint`, `Req`, `Roles`, `Scope`, `ResponseCodes`, `ResponseCode`). |
| `docusaurus.config.ts` | Site configuration: `apiVersion`, the docs instance, the API tester (Scalar), search, redirects. |

```bash
npm ci                                            # install (Node 24, see .nvmrc)
npm run lint:spec                                 # validate api/*.yaml (Redocly)
npm run check:api                                 # spec ↔ pages report (add --strict to fail on errors)
npm run typecheck                                 # TypeScript config files
node scripts/strip-diag-spec.mjs api/<file>.yaml  # remove DIAG-only operations from a freshly copied spec
npm run build                                     # full build; fails on broken links/anchors
npm run serve -- --host 0.0.0.0 --port 3000       # preview the build on a headless server
npm start                                         # dev server on 0.0.0.0:3000
```

## 2. Invariants

1. **The OpenAPI file is the source of truth for API facts** (paths, methods, parameters, body fields, required flags, enum values, response codes, required scope). The pages add explanations, examples, log entries and conventions. When they disagree, fix the page, or fix the spec upstream in `encedo_firmware` and copy it here.
2. **Every operation of the spec has exactly one `<Endpoint … operationId="…" />` block** in `docs/reference/api-reference/**`. The checker matches blocks to operations by `operationId`.
3. **DIAG-build-only endpoints are never published.** The firmware's OpenAPI description contains endpoints that exist only in diagnostic firmware builds (tag `diag`: `/api/diag/*` and the bootloader upgrade endpoints). When a spec is copied or generated from the firmware repository, remove them before committing: `node scripts/strip-diag-spec.mjs api/hem-api-<version>.yaml`. The checker reports an error for any operation still tagged `diag`, and no page documents them.
4. **Links between pages are relative file links** (`../key-management/create-a-key.mdx#possible-type-values`), never absolute site URLs, so they resolve inside the current variant.
5. **Page template** (§3) is mandatory for API pages; the checker depends on it.
6. Commit messages: short imperative title plus bullets. No `Co-Authored-By` trailers.

## 3. API page template

```mdx
---
title: Create a key
description: One-sentence summary shown as the page subtitle.
---

<Roles user master={false} ext />                          {/* page-level, or after an <Endpoint> for one block */}

<Scope main="keymgmt:gen" alt={["keymgmt:list"]} />        {/* codes as in x-required-scope; prose goes below as text */}

:::info
Remarks that apply to the whole page.
:::

## Create a new key                                        {/* one H2 per operation (H3 when a title line precedes it) */}

<Endpoint method="POST" path="/api/keymgmt/create" operationId="createKey" />

One paragraph describing the operation.

#### Headers

| Name | Type | Description |
|---|---|---|
| Authorization<Req /> | String | Bearer JWT\_TOKEN |
| Content-Type<Req /> | String | application/json |

#### Path Parameters                                        {/* only when the path has {parameters} */}

| Name | Type | Description |
|---|---|---|
| `kid`<Req /> | String | Key ID, 32 hex characters |

#### Request Body                                           {/* JSON bodies only; one row per top-level field */}

| Name | Type | Description |
|---|---|---|
| `label`<Req /> | String | Label of a key |
| `type`<Req /> | String | Type of key to create |

#### Response status code                                   {/* every code of the spec operation, ascending */}

<ResponseCodes>
<ResponseCode code="200" title="Operation successful">

```json
{ "kid": "09bd0958e1499ecfd51ea62a3f49a84c" }
```

</ResponseCode>
<ResponseCode code="400" title="Incorrect argument(s)" />
<ResponseCode code="401" title="Missing or invalid JWT_TOKEN" />
</ResponseCodes>

#### Possible `type` values                                 {/* one table per enum field, first column = the values */}

| Value | Description |
|---|---|
| SECP256R1 | NIST P-256 ECC key |

#### Response data for successful operation                 {/* free-form, not checked */}

| Name | Type | Description |
|---|---|---|
| `kid` | String | Key ID, 32 chars hex string |

#### Log entries                                            {/* free-form, not checked */}

| Event | Result | Source |
|---|---|---|
| LOG_TYPE_KEY_GENERATION | LOG_RESULT_OK | 200 |
```

Component reference (all available without imports):

| Component | Props | Notes |
|---|---|---|
| `<Endpoint />` | `method`, `path` (spec path, `{param}` style), `operationId`, `host?` | Renders the method badge and URL; the block boundary for the checker. Consecutive `<Endpoint>` lines form one block that documents several operations with shared sections (e.g. the three key-list variants). |
| `<Req />` | — | Red asterisk = required. Put it right after the name cell content. |
| `<Roles />` | `user`, `master`, `ext`: `true`/`false`/string | Before the first `<Endpoint>` = whole page; after an `<Endpoint>` = that block only. |
| `<Scope />` | `main`, `alt`: string or array; `note?` | Same placement rule. Use the exact tokens of `x-required-scope` (e.g. `keymgmt:use:<KID>`, `storage:disk<N>:rw`). |
| `<ResponseCodes>` / `<ResponseCode />` | `code`, `title?`, children | Renders tabs; a self-closing `<ResponseCode />` means "no body". Default titles come from `src/components/api/statusTexts.ts`. |
| `<ContentRef id="…" />` | doc id | GitBook-style link card to another page. |
| `<DocCardList />` | — | Cards for the child pages of the current sidebar category (section index pages). |

Other conventions: `.mdx` for API pages, `.md` for prose; section index pages are `index.mdx`; escape `<`, `{`, `}` outside code spans (`\<`), or wrap them in backticks; admonitions `:::info`, `:::warning`, `:::danger`.

## 4. Procedure A — the API changed within the same version

Use this when `encedo_firmware` changed the API and `docs/openapi.yaml` there was updated, without a new firmware version, or when a page is found to be wrong.

1. Copy the new spec over `api/hem-api-<version>.yaml` (keep the header comment), run `node scripts/strip-diag-spec.mjs api/hem-api-<version>.yaml`, then `npm run lint:spec`; it must print "valid".
2. Run `npm run check:api`. Every line is either an **error** (page and spec disagree on a fact), a **warning** (worth a look: scope/role wording, missing enum table) or **accepted** (listed in `known-gaps.json`).
3. For each error, edit the page following the template:
   - *no page section for …* → add a `## …` block with `<Endpoint … operationId="…" />` on the page of the same topic (spec `tags` tell you which); a new topic gets a new page and an entry in `sidebars.ts`.
   - *operation is tagged "diag"* → the spec still contains DIAG-only endpoints: run `node scripts/strip-diag-spec.mjs api/hem-api-<version>.yaml`.
   - *response code N missing* → add `<ResponseCode code="N" title="…" />` in ascending order; titles: `statusTexts.ts` or the spec's response description.
   - *body field missing / required flag* → add the row or fix the `<Req />` marker; take the description from the spec.
   - *page-only field / response code* → the page claims something the spec does not. Verify against the firmware. Either remove it from the page, or fix the spec upstream (then copy it here), or, if it is a documented spec omission you cannot fix now, add an entry to `scripts/check-api-docs.known-gaps.json` with a reason.
   - *path parameter* → the page must use the spec's `{name}` and list it under `#### Path Parameters`.
4. Re-run `npm run check:api` until it reports 0 errors. Read the remaining warnings.
5. Update prose that the change affects (descriptions, examples, log entries, `docs/preliminary/general-information.md` for cross-cutting behaviour).
6. `npm run typecheck && npm run build` (the build fails on broken links or anchors). Preview if possible.
7. Commit; the user pushes. CI runs lint, typecheck, build and prints the checker report in the job summary.

## 5. Procedure B — a new firmware / API version (example: 1.3.0)

1. Add the new spec as `api/hem-api-1.3.0.yaml` (copy from `encedo_firmware/docs/openapi.yaml` at the release tag; set `info.version`; keep the header comment), run `node scripts/strip-diag-spec.mjs api/hem-api-1.3.0.yaml`, add `hem@1.3.0` to `redocly.yaml`, `npm run lint:spec`.
2. Snapshot the current reference as the old version: `npm run docusaurus -- docs:version 1.2.2`. This creates `versioned_docs/version-1.2.2/`, `versioned_sidebars/version-1.2.2-sidebars.json` and `versions.json`; commit them.
3. In `docusaurus.config.ts` set `apiVersion = '1.3.0'` and configure the versions of the docs instance, for example `lastVersion: 'current'`, `versions: {current: {label: '1.3.0', path: ''}, '1.2.2': {label: '1.2.2', path: '1.2.2'}}`; add a navbar dropdown item for `1.2.2` (`/1.2.2`). The API tester follows `apiVersion` (`configuration.url`); older specs remain downloadable at `/hem-api-docs/hem-api-1.2.2.yaml`.
4. Update `docs/` for 1.3.0 with Procedure A (`npm run check:api` uses the highest version in `api/` by default; check an old snapshot with `node scripts/check-api-docs.mjs --spec api/hem-api-1.2.2.yaml --docs versioned_docs/version-1.2.2`).
5. Update the firmware version mentioned in `docs/preliminary/quick-start.md` and elsewhere (`grep -rn "1\.2\.2" docs/`), and `README.md`.
6. `npm run typecheck && npm run build`; check `build/1.2.2/` and the dropdown; commit.

## 6. Validation checklist

```bash
npm run lint:spec && npm run check:api && npm run typecheck && npm run build
grep -rn '{%\|&#x20;\|<mark' docs/          # must print nothing (legacy GitBook syntax)
```

CI (`.github/workflows/*.yml`) runs the same commands; the checker's report is informational (it never fails the build) and appears in the job summary.

## 7. Trying a procedure without keeping it

Commit your work first. A dry run that ends with `git checkout -- <file>` restores the last
committed version and silently discards uncommitted edits to that file.

## 8. Known limitations

- The checker compares structure (operations, parameters, fields, required flags, enums, response codes, scope tokens, master role). It cannot judge prose, examples or log-entry tables.
- The API tester (Scalar) loads its renderer from a pinned CDN URL (`cdn` in `docusaurus.config.ts`) and sends requests directly from the browser: the device's CORS `origin` setting must allow the site origin and its TLS certificate must be trusted by the browser.
