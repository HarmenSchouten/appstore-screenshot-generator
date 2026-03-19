# Project History

This project started as a script-first screenshot generator and evolved into a
small full-stack app with a visual editor.

## Timeline

### 1) Script-first generator

Initial versions focused on config-driven HTML and PNG generation.

- Input: config files and assets
- Output: platform-specific screenshots

### 2) Inline UI and architecture exploration

The project explored UI options and architecture direction.

- See [001-UI_OPTIONS.md](001-UI_OPTIONS.md)
- See [002-ARCHITECTURE-REVIEW.md](002-ARCHITECTURE-REVIEW.md)

### 3) TSX modularization

The monolithic server/UI approach was split into modular routes, renderer
components, and typed models.

- See [003-TSX-REFACTOR.md](003-TSX-REFACTOR.md)

### 4) Vite + React migration and isomorphic rendering

The frontend moved to Vite + React while keeping server-side rendering for
generation.

- See [004-VITE-REACT-ANALYSIS.md](004-VITE-REACT-ANALYSIS.md)

### 5) Device preset maturity

Device presets were expanded and validated to improve generated output quality.

- See [005-DEVICE-PRESETS.md](005-DEVICE-PRESETS.md)

## Current shape

- Deno + Hono API and generation routes
- React + Vite editor UI
- Shared renderer components between preview and export
- Project-based assets/config/output structure
