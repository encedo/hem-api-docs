# M5 — Visual style

State: draft

## Goal
Encedo branding and a GitBook-like feel: logo and favicon, `#9B34DB` purple palette (light, plus a lighter dark-mode ramp), self-hosted Inter and IBM Plex Mono, uppercase sidebar section headers, link cards, navbar and footer, local search, dark mode.

## Deliverables
- `static/img/encedo-logo.png` (downloaded with curl from the public GitBook CDN URL recorded in PLAN.md) and `static/img/favicon.png` (resized via `npx sharp-cli`, or the logo reused).
- Dependencies: `@easyops-cn/docusaurus-search-local` (`docsRouteBasePath: '/'`, `hashed: true`, `indexBlog: false`), `@fontsource-variable/inter` (or `@fontsource/inter`), `@fontsource/ibm-plex-mono`.
- `src/css/custom.css`: Infima primary ramp for light and dark, font variables, `.sidebar-heading`, `.doc-subtitle`, DocCard hover, checks of the openapi theme's method badges and explorer panel in dark mode.
- `docusaurus.config.ts`: navbar (logo, title "Encedo HEM API", links "encedo.com" and "GitHub"), footer (Encedo links, Report a security issue, Examples repo, copyright "Encedo Limited" + manual version line), search theme.

## Steps
1. Download logo; derive favicon; wire `favicon` and navbar logo.
2. Add fonts and palette CSS; verify both colour modes.
3. Style sidebar section headers (small caps, muted) and the subtitle.
4. Add local search; build; test queries.
5. Commit `M5: Encedo branding, fonts, sidebar sections, local search`.

## Acceptance criteria
- Build passes; fonts served from `build/assets/fonts/` (no Google Fonts request).
- Palette applied in light and dark; purple links legible on dark.
- Search returns hits for "keymgmt:gen" and "Hall of fame".
- Sidebar section headers are non-collapsible labels like GitBook's.

## Verification
- Automated: build; grep for `fonts.googleapis` in `build/` is empty; search index files present.
- User: resemblance to docs.encedo.com in light and dark, logo size, contrast, search UX.

## Open questions
- Default colour mode: follow system (recommended) or force light?
- Footer wording ("Powered by Docusaurus" kept or removed)?

## Conclusions & hand-over
_(filled when done)_
