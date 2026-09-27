# M3 — Non-API content migration

State: draft

## Goal
Convert the 6 non-API pages (Welcome, Quick Start, General information, Report an issue, Advisory, Hall of fame) to MDX with a scripted, idempotent converter; restore the `SUMMARY.md` structure; fix links; keep the GitBook look (subtitle, hints, tabs, cards). `reference/api-reference/README.md` is not converted as a page: its cards are superseded by the generated tag categories and its conventions text moves into `info.description` in M4.

## Deliverables
- `migration-doc/scripts/gitbook2mdx.py`: reads `legacy-gitbook/`, writes `docs/`, reports unconverted constructs and unresolved links, exits non-zero on either.
- `docs/index.md`, `docs/preliminary/quick-start.md`, `docs/preliminary/general-information.md`, `docs/security/report-an-issue.md`, `docs/security/advisory/index.md`, `docs/security/advisory/hall-of-fame.md`.
- `static/img/PGC_1323.jpg`, `static/img/PGC_1400.jpg` (`git mv` from `legacy-gitbook/.gitbook/assets/`).
- `src/components/ContentRef.tsx`: GitBook-style card wrapping `@theme/DocCard` so the description comes from doc metadata.
- `sidebars.ts` mirroring `SUMMARY.md`: Welcome; Preliminary (Quick Start, General information); Security (Report an issue, Advisory ▸ Hall of fame); Reference (API Reference ▸ tags). Section headers as `type: 'html'` items.
- `src/css/custom.css`: minimal `.doc-subtitle` and `.sidebar-heading` (finalized in M5).

## Steps
1. Write the converter as a per-file pipeline: frontmatter → block constructs (hint, tabs, content-ref, tables) → inline (`<mark>`, entities, emoji, escapes) → links (LINK_MAP built from `legacy-gitbook/SUMMARY.md` + API anchor map) → report.
2. Conversion rules (authoritative table in PLAN.md M3): `description` kept as meta + `sidebar_label` + `<p className="doc-subtitle">`; `cover` dropped; `{% hint %}` → admonitions; `{% tabs %}` → `<Tabs>/<TabItem>`; `{% content-ref %}` → `<ContentRef />`; folder `README.md` → `index.md`; `docs.encedo.com/hem-api/...#anchor` → internal routes (API anchors → generated operation routes; `~/revisions/...` links stay external); `endedo.com` → `encedo.com`; `&#x20;` removed, `&#x26;` → `&`; HTML tables → GFM when inline-only else cleaned HTML (`width` stripped, `<br>` → `<br />`); emoji span → emoji; heading anchor `<a>` dropped; images → `/img/...`; `javascript` fences holding JSON → `json` (`# header` style fences → `text`); bare `{ } <` in prose escaped for MDX v3.
3. Run the converter; `git mv` the photos; write `ContentRef.tsx`; complete `sidebars.ts`; build with the three `throw` settings; iterate until clean.
4. Commit `M3: migrate non-API pages to Docusaurus`.

## Acceptance criteria
- `npm run build` passes (links and anchors verified by Docusaurus).
- Sidebar order equals `SUMMARY.md`.
- Welcome renders the two photos and four cards; General information renders 2 tab groups, 3 tables, 10 code blocks; Quick Start renders the info admonition and both version tables; Hall of fame renders the emoji.
- Converter run reports zero unconverted constructs; `grep -rn '{%\|&#x20;\|\.gitbook' docs/` is empty.

## Verification
- Automated: build, converter report, grep.
- User: compare each of the 6 pages side by side with docs.encedo.com (content parity, subtitle placement, card look).

## Open questions
- Reproduce the Unsplash cover image on Welcome as a banner, or drop it (recommended: drop)?
- Keep the "Version: 1.7b (17.01.2026)" line and the certified-revision GitBook links on Welcome as-is?

## Conclusions & hand-over
_(filled when done)_
