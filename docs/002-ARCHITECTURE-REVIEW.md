# ADR-002: Incremental Modularization over Full Rewrite

| | |
| --- | --- |
| **Date** | 2026-03-07
| **Status** | Accepted — executed in [ADR-003](003-TSX-REFACTOR.md)
| **Supersedes** | [ADR-001](001-UI_OPTIONS.md) (partially — same runtime, new frontend approach)

## Context

The technology choice from [ADR-001](001-UI_OPTIONS.md) — Deno + Hono +
Preact — was effective for early development, but the implementation had grown
into a monolith:

- `src/server.ts`: **4,372 lines** — API routes, UI shell, CSS, and all
  frontend state/components in a single file.
- **33 route handlers** and **23 component functions** co-located in that file.
- Core domain interfaces duplicated across `renderer.ts`, `types.ts`, and
  `projects.ts`.
- No test files.

The inline Preact + HTM approach was productive early on but was hitting a
tooling ceiling as component count and interaction complexity grew.

### What was working

- Single Deno runtime — fast to run and reason about.
- Preview and generation shared rendering logic, avoiding visual drift.
- Product velocity was high for small-to-medium changes.

### Pressure points

- Medium/large changes to `server.ts` carried merge risk and review difficulty.
- Duplicate interfaces risked subtle contract mismatches.
- No tests meant refactoring was riskier than necessary.

## Options Considered

### Option A: Keep current architecture as-is

No migration effort, but `server.ts` complexity would continue to grow
unchecked. **Not recommended.**

### Option B: Keep Deno/Hono, modularize incrementally

Preserve the runtime and generation pipeline. Split routes into domain modules,
extract UI into component files, introduce a build step (Vite), and consolidate
types. Migrate in phases without a feature freeze. **Recommended.**

### Option C: Full React + Deno API rewrite

Mature ecosystem and conventions, but significant migration cost with limited
near-term benefit for a single-developer project. **Deferred.**

## Decision

**Chosen: Option B — Incremental modularization.**

Split the monolith into:

1. **Backend**: `server.ts` reduced to bootstrap/composition. Routes split by
   domain into `src/routes/`.
2. **Frontend**: UI extracted from inline monolith into `src/ui/` component
   tree. Preact retained initially; build step via Vite.
3. **Types**: Consolidated into `src/types/` as the single canonical source.
4. **Tests**: Focused coverage for config merges, key endpoints, and renderer
   output.

### Phased execution

| Phase | Scope                          | Done criteria                          |
| ----- | ------------------------------ | -------------------------------------- |
| 1     | Split API routes               | `server.ts` has no route handlers      |
| 2     | Extract frontend to components | UI no longer embedded as template      |
| 3     | Consolidate types, add tests   | Single type source, basic test safety  |

## Consequences

- **Positive**: Each phase delivers immediate maintainability wins. No feature
  freeze needed. Existing API contracts and output format remain unchanged.
- **Negative**: Temporary mixed structure during transition. Requires discipline
  to avoid half-migrated code stalling.
- **Outcome**: All three phases were completed in [ADR-003](003-TSX-REFACTOR.md),
  reducing `server.ts` to ~280 lines and establishing the current module
  structure.

### Migration trigger for Option C

Re-open the full React rewrite if at least two of these become true:

1. Team grows and multiple frontend contributors need stronger conventions.
2. UI complexity makes Preact ergonomics a bottleneck.
3. Ecosystem integrations become substantially easier in React.
4. Refactor cost to maintain current structure exceeds migration cost.

## Summary

Current architecture choice is still valid for this product and stage, but the
project has outgrown the single-file UI/server organization. The highest ROI
path is incremental modularization while keeping Deno/Hono and shared renderer
continuity.
