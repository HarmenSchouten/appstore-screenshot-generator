# 002 - Architecture Review and Direction

Date: 2026-03-07
Status: Accepted (for next iteration)
Supersedes: `docs/001-UI_OPTIONS.md`

## Why this doc exists

`docs/001-UI_OPTIONS.md` captured broad technology options when the project was younger.
This document revisits that decision based on the current repository shape, recent UI complexity, and maintenance concerns.

## Current state (repo-specific)

### Runtime and stack

- Runtime: Deno 2.x
- HTTP framework: Hono
- Frontend rendering: Preact + HTM in an inline script inside `server.ts`
- Styling: Tailwind CDN + custom CSS in HTML string
- Conversion: Puppeteer + Sharp

### Module layout

- `src/server.ts`: web server + API routes + UI shell + full client app logic
- `src/renderer.ts`: canonical screenshot/feature graphic rendering
- `src/projects.ts`: project config + filesystem management
- `src/generate.ts`: HTML generation using shared renderer
- `src/convert.ts`: HTML to PNG conversion

### Key metrics observed

- `src/server.ts`: 4372 lines
- Route handlers in `src/server.ts`: 33 (`app.get/post/put/patch/delete`)
- Component-style functions in `src/server.ts`: 23
- No test files detected (`*.test.ts` / `*.spec.ts`)
- Core domain interfaces are duplicated in multiple files:
  - `src/renderer.ts`
  - `src/types.ts`
  - `src/projects.ts`

## What is working well

1. Single-runtime simplicity
- Deno-centric workflow is fast to run and easy to reason about.
- Local file operations and generation scripts fit this runtime well.

2. Rendering consistency
- Preview and generation share rendering logic, reducing visual drift:
  - preview endpoints in `src/server.ts`
  - generation in `src/generate.ts`
  - rendering in `src/renderer.ts`

3. Product velocity
- Recent UI work (shape controls, custom color input, preset menu, debounce behavior) was shipped quickly without framework migration overhead.

## Architectural pressure points

1. Monolithic server/UI file
- `src/server.ts` now holds backend routes, app shell, CSS, and extensive frontend state/components.
- Small changes are easy, but medium/large changes raise merge risk and review difficulty.

2. Type drift risk
- Duplicate interfaces across modules increase maintenance overhead and can cause subtle contract mismatches.

3. Limited test safety net
- Refactoring high-change code (editor interactions, config mutations) is riskier without targeted tests.

4. Tooling ceiling for frontend scale
- Inline script + template string architecture is productive early on, but harder to maintain as component count and interaction complexity grows.

## Options considered now

### Option A: Keep current architecture exactly as-is

Pros:
- Zero migration effort
- No short-term disruption

Cons:
- `server.ts` complexity continues to rise
- Increasing maintenance and onboarding friction

Verdict:
- Not recommended.

### Option B: Keep Deno/Hono backend, modularize frontend and routes incrementally

Pros:
- Preserves runtime and existing generation pipeline
- Lowest risk path with immediate maintainability wins
- Allows gradual migration without feature freeze

Cons:
- Requires disciplined refactor phases
- Temporary mixed structure during transition

Verdict:
- Recommended.

### Option C: Full move to React + Deno API (or React + Node stack)

Pros:
- Mature frontend ecosystem and conventions
- Better long-term ergonomics if many contributors

Cons:
- Significant migration cost now
- Limited near-term business/product benefit for current scope
- Risk of regressions during rewrite

Verdict:
- Defer unless team/roadmap conditions change.

## Decision

Adopt Option B:

- Keep Deno + Hono backend and generation pipeline.
- Refactor architecture in place with clear boundaries.
- Avoid full stack rewrite at this stage.

## Target architecture (next stage)

1. Backend
- `src/server.ts` becomes bootstrap/composition only.
- Route modules split by domain, for example:
  - `src/routes/config.ts`
  - `src/routes/projects.ts`
  - `src/routes/assets.ts`
  - `src/routes/generate.ts`
  - `src/routes/preview.ts`

2. Frontend
- Move client UI from inline monolith into component files under `src/ui/`.
- Keep Preact (minimal cognitive/migration cost from current implementation).
- Introduce a build step (recommended: Vite + Preact) while still serving through Hono.

3. Shared contracts
- Consolidate canonical types into a single source (`src/types.ts`) and import from there.
- Remove duplicate interface definitions from `renderer.ts` and `projects.ts` over time.

4. Testing
- Add focused tests around:
  - config update merge behavior
  - route-level contract sanity for key endpoints
  - renderer output invariants for representative scenarios

## Phased execution plan

### Phase 1 (low risk, immediate value)

- Split API routes from `server.ts` into domain files.
- Keep UI behavior unchanged.
- Introduce shared utility modules where obvious duplication exists.

Done criteria:
- `server.ts` no longer contains all route handlers.
- Routes are grouped and easier to navigate.

### Phase 2 (frontend extraction)

- Move editor components to `src/ui/components/*`.
- Keep same UX and API contracts.
- Add minimal frontend build pipeline.

Done criteria:
- Main UI is no longer embedded as one large template string.
- Component boundaries are explicit and reusable.

### Phase 3 (type and test hardening)

- Consolidate type definitions.
- Add smoke tests for generation and key API flows.
- Add regression tests for high-change controls.

Done criteria:
- Single canonical type source.
- Basic safety net for refactors.

## Migration trigger conditions (when to reconsider React rewrite)

Re-open Option C if at least two are true:

1. Team grows and multiple frontend contributors need stronger conventions/tooling.
2. UI complexity grows to where Preact + HTM ergonomics become a bottleneck.
3. You need ecosystem-heavy integrations that are substantially easier in React.
4. Refactor cost to maintain current structure exceeds migration cost.

## Summary

Current architecture choice is still valid for this product and stage, but the project has outgrown the single-file UI/server organization. The highest ROI path is incremental modularization while keeping Deno/Hono and shared renderer continuity.
