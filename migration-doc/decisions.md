# Decisions log

Cross-milestone decisions, newest at the bottom. Each entry: date, decision, reason, owner milestone.

## 2026-09-27 — planning (agreed with the user before M0)

| Topic | Decision | Reason |
|---|---|---|
| Renderer | `docusaurus-plugin-openapi-docs` + `docusaurus-theme-openapi-docs` v5 | One page per operation grouped by tag mirrors GitBook's per-endpoint pages; built-in multi-version support; renders `x-required-scope` |
| Hand-written API pages (38) | Gap analysis → fold missing facts into the spec → prove parity → delete | Spec must be the single source of truth without losing Log-entries / Allowed-users content |
| Site URL | `https://encedo.github.io/hem-api-docs/` (`baseUrl /hem-api-docs/`) | Repo is under the `encedo` user account; custom domain deferred, switch documented |
| Visual verification | GitHub Pages after the user pushes + `docusaurus serve --host 0.0.0.0` | Headless server, no localhost, no browser |
| API versioning | Ship 1.2.2 only; plugin `versions` structure and README recipe prepared | No older spec exists; only PQC endpoints differ across 1.0.0–1.2.2 |
| Spec file name | `api/hem-api-1.2.2.yaml` (flat, one file per version) | Version visible in the name; easy to diff and reference |
| Generated MDX | Generated at build time (`prebuild`), gitignored | No drift between spec and pages; small diffs |
| `diag` endpoints | Included in the published site | User decision; spec already carries the DIAG-only warning |
| Deployment | GitHub Actions → GitHub Pages (source "GitHub Actions"); triggers `main` + `docusaurus` during migration | Test on `docusaurus`, merge to `main` when stable |
| Tooling | npm + lockfile, TypeScript config, docs-only mode | yarn/pnpm absent; matches Docusaurus defaults |
| Interim layout | GitBook sources moved to `legacy-gitbook/` in M1 | Frees root `README.md` for the maintainer manual; stable converter input; single folder to delete |
| Commits | `M<N>: <title>` + bullets; Claude commits, user pushes; never `Co-Authored-By` | User instruction |

## Open items (owner milestone)

- `info.title` "Encedo nGINE REST API" vs "Encedo HEM API" — M2 (recommend keep; the firmware is nGINE and the docs already say "Encedo nGINE v.1.0")
- Canonical home of the spec going forward: docs repo or `encedo_firmware/docs/openapi.yaml` — M4/M6 (recommend docs repo canonical, firmware repo copies)
- Keep the "Send API Request" panel — M2 review
- Is the raw `x-required-scope` code block acceptable, or render the scope as a sentence — M2 review
- Two operations tagged `[system, diag]` appear under both categories — M2 review
- Redirects from old GitBook paths — M6 (recommend defer until a custom domain)
- Certified-revision links point at GitBook and break if the space is deleted — M3/M6 (archive as PDF?)
