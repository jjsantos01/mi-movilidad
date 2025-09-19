# Repository Guidelines

## Project Structure & Module Organization
- Root single-page app: `index.html`, `styles.css`.
- JS modules live under `src/` with module entrypoint `src/index.js` (loaded in `index.html` via `<script type="module" src="src/index.js"></script>`).
- Legacy `script.js` exists but is no longer loaded; new work should target the `src/` modules.
- Static assets: `images/`, map layers in `maps/`, sample/local data in `datos/` (git-ignored).
- Local dev server: `server.py` (simple CORS-enabled HTTP server).
- Misc: `.env` for local keys (should be ignored), `.gitignore` configured for `.env*` and notebooks.

### JS Modules Overview (src/)
- `src/index.js`: App orchestrator. Wires UI events, data processing, charts, maps, and section rendering. Performs lazy loading for heavy/optional features.
- `src/state.js`: Minimal app state store and registry (`state`, setters, `registerChart`, `mapInstances`). Avoid globals; use this module.
- `src/ui/`: DOM-only logic (collapsible sections, modal, downloads, table rendering).
- `src/io/`: File I/O (drag & drop bindings, Excel parsing via XLSX; see `excel.js`).
- `src/data/`: Pure data transforms, metrics and domain helpers (normalize, metrics, inconsistencias, ecobici, metro-stats).
- `src/charts/`: Chart/visualization builders (pie, line, stacked-by-day, by-hour, by-momento, heatmap, saldo-final, metro-top10, ecobici-heatmap, ecobici-animation) usando helpers en `charts/common.js`.
- `src/maps/`: Leaflet map helpers (`base.js`) and map-specific modules (`metro.js`, `ecobici.js`).
- `src/utils/`: Small shared utilities (dates, strings).
- `src/config/constants.js`: App-wide constants (colors, selectors, line colors, prod flag).

## Build, Test, and Development Commands
- Serve locally (Python 3): `python server.py 8000` then open `http://localhost:8000`.
- Alternative quick server: `python -m http.server 8000` (no CORS tweaks).
- No build step or package manager; keep the site static and CDN-free.
- Note: `type="module"` requires serving over HTTP(S); opening `index.html` directly from the filesystem will break imports. Use one of the servers above.

## Coding Style & Naming Conventions
- JavaScript: ES2015+, 2-space indentation, `camelCase` for variables/functions, `SCREAMING_SNAKE_CASE` only for true constants. Keep code modular with small helpers; avoid global leakage.
- CSS: 2-space indentation. Prefer class-based styles; use clear, hyphenated names (e.g., `.chart-container`).
- Files/paths: lowercase with hyphens for new assets; keep existing names stable.
- Python (`server.py`): follow PEP 8; 4-space indentation.
- Comments and UI copy are primarily Spanish; keep language consistent when editing existing content.

### Module Conventions
- Use standard ES modules with explicit file extensions in imports (e.g., `import { fn } from './utils/date.js'`).
- Prefer named exports; keep modules small and single-purpose.
- UI code that touches the DOM lives under `src/ui/` (or `src/maps/`/`src/charts/` for visualizations). Keep `src/data/` and `src/utils/` free of DOM access.
- Import direction should generally flow: `utils/config` → `data` → `charts/ui/maps` → `index.js`. Avoid circular dependencies.
- Avoid adding globals. If needed for backwards compatibility, attach only via `state` (e.g., `window.mapInstances = state.mapInstances` as in `src/index.js`).
- Prefer dynamic import for optional/heavy features (see `src/index.js` lazy load of `charts/ecobici-heatmap.js`).

## Testing Guidelines
- No automated tests yet. Do a quick manual pass before PRs:
  - Load home page; verify charts render and maps load.
  - Test drag-and-drop/file inputs and filters with sample data in `datos/`.
  - Check in Chrome and Firefox; review console for errors.
- If adding tests, prefer lightweight browser checks (e.g., Playwright) or JS unit tests (Vitest). Keep them optional and fast.

### Manual Checks Specific to Modules
- Confirm `src/index.js` is loaded as a module and imports resolve (no CORS or MIME errors in console).
- Validate section toggling and rendering paths (`metroSection`, `metrobusSection`, `ecobiciSection`).
- Verify lazy features load as expected (Ecobici heatmaps) without blocking initial render.

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
- Preserve public API/DOM hooks expected by `index.html` and existing CSS (IDs/classes referenced across `src/ui/*`, `src/charts/*`, `src/maps/*`). If changing an ID/class, update all affected modules.
- Update `README.md` if commands or user flows change.

### Adding or Changing Functionality
- Place new logic under the appropriate `src/` subfolder and export named functions.
- Import and wire from `src/index.js` (or a relevant feature module) rather than adding new script tags.
- Reuse helpers in `src/charts/common.js`, `src/state.js`, and `src/utils/*` to keep code consistent.
- Keep public DOM surface area stable. Prefer adding new containers over renaming existing ones.
