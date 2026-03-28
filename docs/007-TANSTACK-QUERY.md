# 007 — TanStack Query for Server State Management

| | |
| --- | --- |
| **Status** | Accepted |
| **Date** | 2026-03-28 |

## Context

The UI uses a single Zustand store that mixes two distinct concerns:

1. **Client state** (selected language, selected platform, selected item, modal
   open/close flags, device preset defaults)
2. **Server state** (project config fetched from the API, asset list, project
   list, generated results)

Server-related logic is scattered across store slices, components, and utility
functions with no unified strategy for loading states, error handling, request
deduplication, or cache invalidation.

### Pain points

1. **No loading or error states for most operations.** Only `generating` and
   `uploading` have loading indicators. Asset fetches, project CRUD, and config
   saves fail silently or expose nothing to the user.

2. **Manual cache invalidation.** After every mutation (upload, rename, delete,
   project switch), code must manually call `refreshAssets()`, refetch config,
   or chain additional requests. Missing an invalidation call leads to stale UI.

3. **Waterfall fetches on mount.** `App.tsx` runs `activateProject`, then
   `setConfig`, then `fetchAssets`, then `refreshLastGenerated` in strict
   sequence. Nothing runs in parallel.

4. **Duplicated fetch logic.** Asset upload exists in both `ImageSelect.tsx` and
   `MediaManagerModal.tsx` with near-identical fetch/FormData/error patterns.

5. **No request deduplication.** Multiple components (or rapid user actions) can
   trigger overlapping calls to the same endpoint without protection.

6. **Inconsistent error handling.** Some operations call `alert()`, some use
   `console.error`, some silently swallow inside `try-catch`, and some have no
   error handling at all.

7. **Fragile project switch chain.** `switchProject()` is a sequence of four
   serial awaits. If any step fails partway through, the store is in an
   inconsistent state with no rollback.

8. **Config persistence is a module-level singleton.** The debounced save uses
   `setTimeout` and `clearTimeout` at module scope. It works but is opaque, not
   testable, and has no error feedback.

## Decision

Adopt **TanStack Query (React Query)** as the server state manager. Zustand
retains client-only state. The migration includes:

- **Query-based config per project.** Config moves from Zustand to the React
  Query cache under key `['config', projectId]`. Local edits use
  `queryClient.setQueryData` for instant UI updates, backed by a debounced
  `useMutation` for server persistence. On error, the query invalidates to roll
  back to the server's version.

- **Suspense mode for all queries.** All read hooks use `useSuspenseQuery`.
  The app tree wraps in `<Suspense>` boundaries with loading fallbacks and
  `<ErrorBoundary>` components for error recovery.

- **Optimistic updates for project rename.** The `useRenameProject` mutation
  uses `onMutate` to update the cache immediately, `onError` to rollback, and
  `onSettled` to refetch.

- **React Query DevTools.** Added as a dev dependency and rendered inside the
  `QueryClientProvider` for cache visibility during development.

### What stays in Zustand

Zustand becomes a thin client-state store holding only:

- `currentProject` / `initialProjectId` (navigation state)
- `selectedLang` / `selectedPlatform` / `selectedItem` (selection state)
- `generating` / `generateProgress` / `showGenerateModal` (streaming UI state
  for the SSE-based generation progress modal)
- Modal open/close flags (`projectModalOpen`, `themeEditorOpen`,
  `mediaManagerOpen`)

### What moves to React Query

All server-fetched data and server-mutating operations:

| Data | Query key | Replaces |
|------|-----------|----------|
| Init payload | `['init']` | `main.tsx` imperative fetch |
| Project config | `['config', projectId]` | `ConfigSlice` + `ScreenshotSlice` + `DevicePresetSlice` |
| Asset list | `['assets']` | `AssetsSlice` |
| Project list | `['projects']` | `ProjectSlice.projects` |
| Generated results | `['generated']` | `GenerationSlice.lastGenerated` |

### Hook structure

One hook per file, categorized by domain:

```
src/ui/hooks/
  queries/
    useInitData.ts
    useConfig.ts
    useAssets.ts
    useGenerated.ts
    index.ts
  mutations/
    config/
      useSaveConfig.ts
      index.ts
    screenshots/
      useAddScreenshot.ts
      useRemoveScreenshot.ts
      useUpdateScreenshot.ts
      useAddFeatureGraphic.ts
      useRemoveFeatureGraphic.ts
      index.ts
    assets/
      useUploadAsset.ts
      useRenameAsset.ts
      useDeleteAsset.ts
      index.ts
    projects/
      useCreateProject.ts
      useDeleteProject.ts
      useRenameProject.ts
      useSwitchProject.ts
      index.ts
    language/
      useAddLanguage.ts
      useDeleteLanguage.ts
      useCopyPlatform.ts
      index.ts
    generation/
      useGenerateAll.ts
      useOpenOutputFolder.ts
      index.ts
    device-presets/
      useUpdateDevicePreset.ts
      index.ts
    index.ts
```

The existing `src/ui/utils/api.ts` stays as-is. Its pure fetch functions become
the `queryFn` and `mutationFn` callables passed to React Query hooks.

### Config editing pattern

Config is the most frequently edited server resource. The new flow:

1. Component calls `useSaveConfig().save(newConfig)`
2. Hook calls `queryClient.setQueryData(['config', projectId], newConfig)` for
   instant UI update
3. A 50ms debounce timer starts (matching the current behavior)
4. When the timer fires, `useMutation` sends `PUT /api/config`
5. On error, `queryClient.invalidateQueries(['config', projectId])` rolls back
   to the server's version

This preserves the existing UX (rapid edits feel instant, server sees one
request per burst) while adding error recovery and visibility through DevTools.

### Screenshot mutations

Screenshot operations (add, remove, update, add feature graphic, remove feature
graphic) follow the same pattern they do today: `structuredClone(config)`,
mutate the clone, then call `useSaveConfig().save(newConfig)`. The difference is
that the clone is read from the query cache instead of the Zustand store, and
the save goes through the debounced mutation instead of a Zustand action.

## Alternatives considered

### Keep Zustand for everything

Continue the current approach. Rejected because the pain points above
(inconsistent error handling, manual invalidation, no loading states, duplicated
logic) would grow as the app gains more server interactions.

### SWR

Lighter alternative from Vercel. Rejected because SWR lacks built-in mutation
primitives (`useMutation`, optimistic updates with rollback, `onMutate` /
`onError` / `onSettled`). We would need to build those patterns manually, which
defeats the purpose.

### Move everything to React Query (including client state)

Possible but not practical. Selection state, modal flags, and streaming progress
are purely client-side with no server backing. Putting them in a query cache
would add unnecessary complexity and confusion about what is "fetched" versus
what is "local."

## Consequences

### Positive

- **Automatic cache invalidation and deduplication.** Mutations declare which
  query keys to invalidate. Multiple components using `useAssets()` share a
  single network request.

- **Built-in loading and error states.** Every query returns `isPending`,
  `isError`, `error`. Suspense mode surfaces these through boundaries instead of
  manual state tracking.

- **Optimistic updates with rollback.** Project rename and config edits update
  the UI instantly with automatic rollback on server failure.

- **DevTools.** The React Query DevTools panel shows every cache entry, its
  staleness, and refetch triggers. This makes debugging data flow
  straightforward.

- **Retry logic.** Failed requests retry once automatically (configurable)
  instead of silently failing.

- **Reduced Zustand surface.** The store drops from 8 slices to 3, making the
  remaining client state easier to reason about.

### Negative

- **Added dependency.** `@tanstack/react-query` adds approximately 13KB gzipped
  to the client bundle.

- **New patterns to learn.** Developers need to understand query keys,
  `useSuspenseQuery`, `useMutation`, optimistic update callbacks, and cache
  invalidation strategies.

- **Suspense boundaries required.** The app needs `<Suspense>` and
  `<ErrorBoundary>` wrappers that did not exist before. Incorrect boundary
  placement can cause unexpected loading states or error propagation.

- **Migration surface.** Every component that currently reads `config`, `assets`,
  or `projects` from Zustand needs to switch to the corresponding query hook.
  This touches most UI files.

## Scope

### In scope

- All UI data fetching and mutation logic
- QueryClient setup, Suspense boundaries, ErrorBoundary component
- Zustand store simplification
- React Query DevTools integration

### Out of scope

- Server/backend code (routes, server.ts, generate.ts, convert.ts)
- Renderer components (TSX rendering pipeline)
- React Router structure
- Any new API endpoints
