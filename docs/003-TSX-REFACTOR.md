# ADR-003: TSX Component Extraction and Route Modularization

| | |
| --- | --- |
| **Date** | 2026-03-14
| **Status** | Implemented
| **Implements** | [ADR-002](002-ARCHITECTURE-REVIEW.md) (all three phases)

## Context

[ADR-002](002-ARCHITECTURE-REVIEW.md) decided on incremental modularization of
the monolithic `server.ts` (~4,400 lines). This ADR records the specific
structural decisions made during that migration.

The goals were:

1. Reduce `server.ts` to routing orchestration only.
2. Extract the inline Preact + HTM UI into typed TSX component files.
3. Consolidate duplicated type definitions into one canonical source.
4. Preserve all API contracts, config formats, and output behavior.

## Decision

### Route architecture

Adopt a **factory function pattern** for route modules. Each domain file exports
a function that receives its dependencies and returns a Hono sub-app:

```typescript
// src/routes/config.ts
export function createConfigRoutes(deps) {
  const routes = new Hono();
  routes.get("/", async (c) => { ... });
  return routes;
}

// src/server.ts
app.route("/api/config", createConfigRoutes(...));
```

Route modules created:

| Module            | Mount point       | Responsibility             |
| ----------------- | ----------------- | -------------------------- |
| `config.ts`       | `/api/config`     | CRUD operations            |
| `projects.ts`     | `/api/projects`   | Project management         |
| `assets.ts`       | `/api/assets`     | File upload/listing        |
| `generate.ts`     | `/api/generate`   | PNG export + streaming     |
| `static-ui.ts`    | `/`               | Serves compiled UI bundle  |

### Frontend architecture

- **Framework**: Preact TSX (later migrated to React TSX).
- **Build**: esbuild bundles `src/ui/main.tsx` → `dist/app.js`.
- **State**: `App.tsx` manages project/language/platform selection, config with
  debounced auto-save, preview version counter, and modal visibility. State
  flows down via props; updates flow up via callbacks. (Later migrated to
  Zustand slices.)
- **Preview refresh**: Config change → debounced save (50ms) → server persist
  → `previewVersion` increments → `Preview.tsx` reloads iframe with cache-bust.

### Type consolidation

All domain types moved to `src/types/` with a barrel `index.ts`. Duplicate
definitions in `renderer.ts` and `projects.ts` removed. Import alias `@types`
configured in `deno.json`.

### Import aliases

```json
{
  "@types": "./src/types/index.ts",
  "@routes": "./src/routes/index.ts",
  "@lib":   "./src/lib/index.ts",
  "@ui":    "./src/ui/index.ts"
}
```

## Consequences

### Metrics

| Metric                          | Before   | After                  |
| ------------------------------- | -------- | ---------------------- |
| `server.ts` lines              | ~4,400   | ~280                   |
| UI component files              | 0        | ~28                    |
| Route files                     | 1        | 7                      |
| Type definition files           | 3 (dupl) | 9 (consolidated)       |
| Total frontend lines            | (inline) | ~4,300 across 28 files |

### Positive

- Each file has a single clear responsibility.
- Routes are testable in isolation via their factory functions.
- Components can be worked on without merge conflicts in `server.ts`.
- Build step enables standard tooling (HMR, tree-shaking, linting per file).

### Negative

- Build step required: `deno task build:ui` after UI changes (or use
  `deno task dev` for watch mode).
- If `dist/` is missing, the server shows a fallback message instead of the UI.

### Backwards compatibility

All API endpoints, project config format, asset paths, and generated output
remained unchanged throughout the migration.
