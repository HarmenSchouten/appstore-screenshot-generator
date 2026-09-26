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

- Each route area is a factory. Anything inside a project is mounted under
  `:projectId` (`/api/projects/:projectId/…`, `/assets/:projectId`,
  `/output/:projectId`) and reads the id with `projectIdOf`; the `/api`
  ones sit behind `requireProject`. Both are in `routes/http.ts`. The
  server has no current project; don't add one. Configs are read and cached
  through the `ServerContext` in `routes/context.ts`, never kept anywhere
  else.
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
  at its real path (with `:projectId`) on `makeRouteApp()`, passing
  `createServerContext(id)` where it takes one, and send requests with
  `jsonRequest` (all in `src/test-helpers.ts`).
