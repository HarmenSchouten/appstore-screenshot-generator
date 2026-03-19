# TSX UI Refactor

This document describes the architectural changes made to transition from a
monolithic inline HTML server to a modular Preact/TSX component system.

## Overview

The original `server.ts` was ~3,800 lines containing inline HTML generation, all
API routes, and business logic mixed together. This refactor:

- **Extracts the UI** into Preact TSX components (~4,300 lines across 28 files)
- **Modularizes server routes** into focused files (~1,000 lines across 7 files)
- **Consolidates type definitions** into a structured module (~500 lines across
  9 files)
- **Reduces server.ts** to ~280 lines (routing orchestration only)

## New Directory Structure

```
src/
├── server.ts           # Main server (now just routing orchestration)
├── renderer.ts         # Screenshot HTML rendering (unchanged)
├── projects.ts         # Project management (unchanged)
│
├── types/              # Consolidated type definitions
│   ├── index.ts        # Re-exports all types
│   ├── base.ts         # Platform, Language, Dimensions
│   ├── effects.ts      # GlowEffect, Shape, ShapeType
│   ├── components.ts   # PhoneFrame, Mascot, Typography
│   ├── screenshot.ts   # Screenshot, FeatureGraphic
│   ├── theme.ts        # ThemeConfig, ColorPalette
│   ├── config.ts       # PlatformConfig, LanguageConfig, ProjectConfig
│   ├── renderer.ts     # RenderOptions
│   └── generation.ts   # GenerationResult, AssetLists
│
├── routes/             # Server route modules
│   ├── index.ts        # Re-exports all route creators
│   ├── preview.ts      # /preview/* - HTML rendering for iframe
│   ├── config.ts       # /api/config/* - CRUD operations
│   ├── assets.ts       # /api/assets/* - File management
│   ├── projects.ts     # /api/projects/* - Project management
│   ├── generate.ts     # /api/generate/* - PNG export
│   └── static-ui.ts    # Serves compiled TSX bundle
│
├── lib/                # Shared utilities
│   └── index.ts        # Common exports
│
└── ui/                 # Preact TSX frontend
    ├── main.tsx        # Entry point
    ├── types.ts        # UI-specific type re-exports
    ├── styles.css      # Tailwind overrides
    ├── shell.ts        # HTML shell generator
    │
    ├── components/
    │   ├── App.tsx              # Main app state & coordination
    │   ├── Sidebar.tsx          # Navigation & selection
    │   ├── Preview.tsx          # Responsive iframe preview
    │   ├── CollapsibleSection.tsx
    │   │
    │   ├── editors/
    │   │   ├── ScreenshotEditor.tsx    # Full screenshot config
    │   │   ├── FeatureGraphicEditor.tsx
    │   │   ├── GlowEditorInline.tsx    # Background glows
    │   │   ├── ShapeEditorInline.tsx   # Decorative shapes
    │   │   └── MascotEditorInline.tsx
    │   │
    │   ├── inputs/
    │   │   ├── NumberInput.tsx
    │   │   ├── ColorInput.tsx    # With palette integration
    │   │   ├── Slider.tsx
    │   │   ├── ImageSelect.tsx   # Asset picker with upload
    │   │   └── LabeledColorInput.tsx
    │   │
    │   └── modals/
    │       ├── ProjectModal.tsx      # Project CRUD
    │       ├── GenerateModal.tsx     # Export progress
    │       ├── ThemeEditorModal.tsx  # Gradient & font config
    │       └── MediaManagerModal.tsx # Asset browser
    │
    └── utils/
        ├── api.ts       # Fetch wrappers
        └── routing.ts   # URL parsing/building

scripts/
├── build-ui.ts    # esbuild bundler
└── dev.ts         # Watch mode runner

dist/
├── app.js         # Compiled bundle (~79KB)
└── index.html     # Shell HTML
```

## Build System

### Tasks

```bash
deno task build:ui   # Build UI bundle once
deno task dev        # Watch mode (UI + server hot reload)
```

### Import Aliases

Configured in `deno.json`:

```json
{
  "imports": {
    "@types": "./src/types/index.ts",
    "@routes": "./src/routes/index.ts",
    "@lib": "./src/lib/index.ts",
    "@ui": "./src/ui/index.ts"
  }
}
```

### How It Works

1. `build-ui.ts` uses esbuild to bundle `src/ui/main.tsx` → `dist/app.js`
2. Server checks if `dist/` exists on startup
3. If yes: serves static bundle via `static-ui.ts` routes
4. If no: shows fallback "run build:ui" message

## Key Changes

### Server Routes

Routes are now **factory functions** that receive dependencies:

```typescript
// Before: inline in server.ts
app.get('/api/config', async (c) => { ... });

// After: in routes/config.ts
export function createConfigRoutes(
  getCurrentProjectId: () => string,
  getConfig: () => Promise<ProjectConfig>,
  setConfig: (config: ProjectConfig) => void
) {
  const routes = new Hono();
  routes.get('/', async (c) => { ... });
  return routes;
}

// In server.ts:
app.route('/api/config', createConfigRoutes(...));
```

### UI State Management

The `App.tsx` component manages:

- Current project, language, platform selection
- Config state with debounced auto-save
- Preview version counter for iframe refresh
- Modal visibility states

State flows down via props; updates flow up via callbacks.

### Preview Refresh

When config changes:

1. `saveConfig()` updates local state immediately
2. Debounced save (50ms) persists to server
3. After save completes, `previewVersion` increments
4. `Preview.tsx` detects version change, reloads iframe with cache-bust

## Migration Notes

### For Developers

- Import types from `@types` instead of inline definitions
- Add new routes in `src/routes/`, export from `index.ts`
- Add new UI components in appropriate `src/ui/components/` subfolder
- Run `deno task build:ui` after UI changes (or use `deno task dev`)

### Backwards Compatibility

- All API endpoints unchanged
- Project config format unchanged
- Asset paths unchanged
- Generated output unchanged

---

## Future Ideas

### Performance

- [ ] **Virtual scrolling** for screenshot list when projects have 50+
      screenshots
- [ ] **Lazy load modals** - only import modal code when first opened
- [ ] **Service worker** for offline asset caching
- [ ] **Image thumbnails** - generate small previews instead of loading full
      assets

### Features

- [ ] **Undo/Redo** - track config history for easy rollback
- [ ] **Keyboard shortcuts** - delete, duplicate, navigate screenshots
- [ ] **Drag & drop reorder** - screenshot order in sidebar
- [ ] **Batch operations** - apply changes to multiple screenshots at once
- [ ] **Screenshot templates** - save/load common configurations
- [ ] **Export presets** - save generation settings (quality, format, subset)
- [ ] **Dark/light theme** - user preference for editor UI
- [ ] **Localization** - translate editor UI (not just screenshot content)

### Developer Experience

- [ ] **Hot module replacement** - update UI without full page reload
- [ ] **Storybook** - component documentation and isolated testing
- [ ] **E2E tests** - Playwright tests for critical workflows
- [ ] **Type generation** - auto-generate types from JSON schema

### Architecture

- [ ] **State management library** - consider Zustand or Jotai if state grows
      complex
- [ ] **Form validation** - schema-based validation with Zod
- [ ] **Error boundaries** - graceful error handling in UI
- [ ] **Optimistic updates** - update UI before server confirms

### Integration

- [ ] **GitHub Action** - auto-generate screenshots on config changes
- [ ] **Figma plugin** - import designs directly as screenshots
- [ ] **CLI tool** - generate screenshots from command line without UI
- [ ] **API documentation** - OpenAPI spec for all endpoints
