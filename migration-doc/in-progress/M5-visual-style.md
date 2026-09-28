# M5 — Visual style (revised)

State: in-progress (accepted 2026-09-28)

## Goal
Encedo branding and a GitBook-like feel across both variants and the tester: logo/favicon, `#9B34DB` palette (light + lighter dark ramp), self-hosted Inter and IBM Plex Mono, styled API components, sidebar section headers, cards, local search, footer.

## Deliverables
- `static/img/encedo-logo.png` (curl from the public GitBook CDN URL in PLAN.md) and `favicon.png`.
- Dependencies `@easyops-cn/docusaurus-search-local` (docs route `/`, `hashed: true`, exclude the `diag/` route from the index), `@fontsource-variable/inter` (or `@fontsource/inter`), `@fontsource/ibm-plex-mono`.
- `src/css/custom.css`: Infima primary ramp for light/dark, font variables, method badge colours (GET blue, POST green, DELETE red), red `<Req />`, `Roles`/`Scope` rows, `ResponseCodes` tabs, table header styling, `.sidebar-heading`, `.doc-subtitle`, DocCard hover, Scalar accent (`--scalar-color-accent`).
- `docusaurus.config.ts`: navbar logo + title, footer links (encedo.com, Report a security issue, Examples repo) and copyright with the manual version line, search theme.

## User's visual notes from the M3 review (2026-09-28)
- Encedo logo in the top-left corner of the navbar, next to "Encedo HEM API".
- **Light mode by default** (do not follow the system preference; `colorMode: {defaultMode: 'light', respectPrefersColorScheme: false}`; keep the toggle).
- Section index pages ("API Reference → System" etc.) list their child pages as cards: **remove the emoji icon** next to the page name (ugly, especially in dark mode) — on all such pages, i.e. `DocCardList` and `ContentRef` cards (eject `DocCard` and drop the icon).

## Acceptance criteria
- Build passes; fonts served from `build/assets/fonts/`; palette applied in both modes; search finds "keymgmt:gen" and "Hall of fame" once (no Diag duplicates); section headers are non-collapsible labels.

## Verification
- Automated: build; `grep -r fonts.googleapis build/` empty; search index present.
- User: resemblance to docs.encedo.com in light and dark, both variants and the tester; logo size; contrast.

## Open questions
- Default colour mode: resolved by the user's notes → light by default, toggle kept.
- Footer wording: resolved 2026-09-28 → "Copyright © <year> Encedo Limited." plus a links column (encedo.com, Report a security issue, API examples on GitHub); no framework credit.

## Conclusions & hand-over
_(filled when done)_
