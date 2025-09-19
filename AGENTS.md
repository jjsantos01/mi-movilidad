# Repository Guidelines

## Project Structure & Module Organization
- Root single-page app: `index.html`, `styles.css`, `script.js`, `animation.js`.
- Static assets: `images/`, map layers in `maps/`, sample/local data in `datos/` (git-ignored).
- Local dev server: `server.py` (simple CORS-enabled HTTP server).
- Misc: `.env` for local keys (should be ignored), `.gitignore` configured for `.env*` and notebooks.

## Build, Test, and Development Commands
- Serve locally (Python 3): `python server.py 8000` then open `http://localhost:8000`.
- Alternative quick server: `python -m http.server 8000` (no CORS tweaks).
- No build step or package manager; keep the site static and CDN-free.

## Coding Style & Naming Conventions
- JavaScript: ES2015+, 2-space indentation, `camelCase` for variables/functions, `SCREAMING_SNAKE_CASE` only for true constants. Keep code modular with small helpers; avoid global leakage.
- CSS: 2-space indentation. Prefer class-based styles; use clear, hyphenated names (e.g., `.chart-container`).
- Files/paths: lowercase with hyphens for new assets; keep existing names stable.
- Python (`server.py`): follow PEP 8; 4-space indentation.
- Comments and UI copy are primarily Spanish; keep language consistent when editing existing content.

## Testing Guidelines
- No automated tests yet. Do a quick manual pass before PRs:
  - Load home page; verify charts render and maps load.
  - Test drag-and-drop/file inputs and filters with sample data in `datos/`.
  - Check in Chrome and Firefox; review console for errors.
- If adding tests, prefer lightweight browser checks (e.g., Playwright) or JS unit tests (Vitest). Keep them optional and fast.

## Commit & Pull Request Guidelines
- Use concise, conventional-style messages: `feat: …`, `fix: …`, `docs: …`, `chore: …`.
- PRs should include: clear description, steps to reproduce/verify, linked issue (if any), and before/after screenshots for UI changes.
- Keep diffs focused; avoid unrelated refactors.

## Security & Configuration Tips
- Never commit secrets. `.env*` is ignored; rotate any exposed keys immediately.
- The dev server enables `Access-Control-Allow-Origin: *`; use only for local development.
- Client-side only: do not add server-side collection of user data.

## Agent-Specific Instructions
- Maintain static hosting compatibility (GitHub Pages). Avoid heavy dependencies or bundlers unless discussed.
- Preserve public API/DOM hooks expected by `index.html` and existing CSS.
- Update `README.md` if commands or user flows change.

