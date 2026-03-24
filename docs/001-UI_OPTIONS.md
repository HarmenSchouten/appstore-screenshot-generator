# ADR-001: Web UI Technology Choice

| | |
| --- | --- | 
| **Date** | 2026-03-01
| **Status** | Accepted
| **Superseded by** | [ADR-002](002-ARCHITECTURE-REVIEW.md) (partially)

## Context

The screenshot generator started as a CLI/config-driven tool with no visual
editing. As the number of configurable options grew (glow effects, shapes, phone
frames, text positioning), editing JSON configs by hand became impractical. A
web-based UI was needed to provide live preview and interactive editing.

## Decision Drivers

- Must work within the existing Deno runtime (no separate Node.js dependency)
- Low overhead — this is a local dev tool, not a production web service
- Fast iteration — single developer, quick prototyping valued over scalability
- Live preview capability for screenshot rendering

## Options Considered

### Option A: Deno + Hono with lightweight frontend

Hono (~25KB) as the HTTP framework, serving API endpoints and static files.
Pair with Preact or Alpine.js for frontend interactivity. Tailwind CSS via CDN
for styling.

### Option B: Deno Fresh (Islands architecture)

Deno's official full-stack framework with Preact-based Islands architecture
and partial hydration. Built-in routing and no build step.

### Option C: React + Vite SPA

Traditional React SPA bundled with Vite. Separate from Deno backend, connected
via API.

### Option D: Vanilla JS + Deno HTTP server

Plain HTML/CSS/JS served by Deno's built-in HTTP server. Zero dependencies.

### Option E: Tauri desktop app

Native desktop wrapper with React frontend. Full file system access.

## Decision

**Chosen: Option A — Deno + Hono with Preact frontend.**

## Rationale

- **Single runtime**: No Node.js required. Deno runs both server and generation
  pipeline.
- **Minimal footprint**: Hono is lightweight and TypeScript-first.
- **Familiar patterns**: Preact provides React-like component model without the
  bundle weight.
- **No build step initially**: Inline Preact + HTM allowed rapid prototyping
  (build step added later in [ADR-003](003-TSX-REFACTOR.md)).
- **Extensible**: API-first design makes it easy to add features incrementally.

Options B and E were rejected as overkill. Option C introduced an unnecessary
Node.js dependency. Option D lacked component reusability for the editor
complexity that was already foreseeable.

## Consequences

- **Positive**: Fast initial development. Single `deno task dev` starts
  everything. Shared TypeScript types between server and renderer.
- **Negative**: Initial implementation embedded all UI in `server.ts` as inline
  HTML/Preact, leading to a ~4,000 line monolith. This was addressed in
  [ADR-002](002-ARCHITECTURE-REVIEW.md) and [ADR-003](003-TSX-REFACTOR.md).
- **Risk**: Preact ecosystem is smaller than React. Mitigated by later migration
  to React + Vite (see [ADR-003](003-TSX-REFACTOR.md)).
