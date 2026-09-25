---
paths:
  - "src/server.ts"
  - "src/routes/**"
  - "src/projects.ts"
  - "src/generation.ts"
  - "src/png-export.ts"
  - "src/errors.ts"
  - "src/path-safety.ts"
---

# Server rules

- Each route area is a factory taking the `ServerContext` from
  `routes/context.ts`. The context is the only holder of the active project;
  don't keep project state anywhere else.
- Fail with the `HttpError` subclasses in `src/errors.ts` (`ValidationError`,
  `NotFoundError`, `ConflictError`, `UnsupportedMediaTypeError`); `onError`
  turns them into a JSON `{ error }` response. Parse bodies with
  `readJsonBody` and the `require*` / `optionalString` helpers in
  `routes/http.ts`.
- A project id from a request goes through `getProjectDir`, which only accepts
  slugs. An asset or output path from a request goes through `resolveInside`;
  treat `null` as outside the base directory. These values reach
  `Deno.remove`.
- Configs are normalised by `normalizeProjectConfig` on load and save. Rely on
  what it guarantees instead of re-checking it.
- `src/generation.ts` and `src/routes/` never import `png-export.ts`; the HTML
  to PNG converter is injected from `server.ts`, so tests run without Chrome
  or sharp.
- Route tests: `withTempProjectsDir`, `createProject`, then mount the factory
  on `makeRouteApp()` with `createServerContext(id)`, and send requests with
  `jsonRequest` (all in `src/test-helpers.ts`).
