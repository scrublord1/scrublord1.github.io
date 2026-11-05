# Portfolio site (scrublord1.github.io) — notes for Claude

"ECE workbench" portfolio for Pritam Kumar (embedded firmware / ECE).

## Stack
- React 19 + Vite 8 + Tailwind CSS 4 (`@tailwindcss/vite`), IBM Plex Sans/Mono via @fontsource.
- Source in `src/` (`App.jsx`, `components/`, `data/`, `hooks/`, `lib/`), static files in `public/`.
- Deploy: `.github/workflows/deploy.yml` builds on push to `main` (`npm ci && npm run build`) and publishes `dist/` to GitHub Pages. Every push to `main` goes live.

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build (run before pushing; a failed build = failed deploy)

## Rules
- Content (projects, skills, links) lives in `src/data/` — edit data, not components, for content changes.
- Keep the existing look (IBM Plex, workbench theme). Use the `frontend-design` skill for new UI.
- Use `webapp-testing` (Playwright) to check pages render before pushing big changes.
- Mobile first: check at 375px width.
- Commits: author Pritam Kumar only, no AI co-author lines.
