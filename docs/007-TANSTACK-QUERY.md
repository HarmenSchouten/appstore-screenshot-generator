# 007 — TanStack Query for Server State Management

| | |
| --- | --- |
| **Status** | Implemented |
| **Date** | 2026-03-28 |
| **Updated** | 2026-03-29 |

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

3. **Waterfall fetches on mount.** `main.tsx` runs an imperative `fetch` then
   hydrates the store. Nothing runs in parallel.

4. **Duplicated fetch logic.** Asset upload exists in both `ImageSelect.tsx` and
   `MediaManagerModal.tsx` with near-identical fetch/FormData/error patterns.

5. **No request deduplication.** Multiple components (or rapid user actions) can
   trigger overlapping calls to the same endpoint without protection.

6. **Inconsistent error handling.** Some operations call `alert()`, some use
   `console.error`, some silently swallow inside `try-catch`, and some have no
   error handling at all.

7. **Fragile project switch chain.** `switchProject()` is a sequence of
   serial awaits. If any step fails partway through, the store is in an
   inconsistent state with no rollback.

8. **Config persistence is a module-level singleton.** The debounced save uses
   `setTimeout` and `clearTimeout` at module scope. It works but is opaque, not
   testable, and has no error feedback.

## Decision

Adopt **TanStack Query (React Query)** as the server state manager using a
**hybrid architecture**: React Query owns all server communication (queries and
mutations), while Zustand remains the single source of truth for the active
config document and all client state.

### Architecture overview

| Layer | Responsibility | Owns API calls? |
|-------|---------------|-----------------|
| `utils/api.ts` | Pure fetch functions (no state logic) | Yes (raw HTTP only) |
| React Query hooks (`hooks/`) | Orchestrate API calls, track status, hydrate store | Yes (via `useMutation` / `useQuery`) |
| Zustand store (`store/`) | Client-only state + synchronous setters | **No** |
| Components (`components/`) | Render UI, call hooks | No |

### Key principles

1. **Zustand store must never make API calls.** Store slices hold client-only
   state (config, selections, UI flags) and synchronous setters.

2. **All server communication goes through React Query hooks.** Use
   `useMutation` for writes and `useQuery` for reads. Hook `queryFn`/`mutationFn`
   calls functions from `utils/api.ts`.

3. **Hooks hydrate the store in `onSuccess` or `useEffect`.** After a
   successful query or mutation, update Zustand via `useAppStore.setState()`
   or slice setters.

4. **Compose hooks, don't duplicate logic.** If one mutation needs to trigger
   another (e.g. create project → switch to it), call the other hook's
   `.mutateAsync()`.

5. **Separate concerns in callbacks** (per TkDodo's guidance): put logic (store
   updates, invalidation) in `useMutation` callbacks; put UI actions (close
   modals, redirects) at the `mutate()` call site in components.

6. **Prefer `mutate` over `mutateAsync`** unless composing promises between
   hooks.

### What stays in Zustand

Zustand retains 8 slices. The slice count is not a problem — most slices are
thin (a few fields and synchronous setters). The split keeps related state and
convenience methods co-located.

| Slice | Contents |
|-------|----------|
| `ConfigSlice` | `config`, `_configDirty`, `setConfig()`, `updateConfig()` |
| `ProjectSlice` | `projects`, `currentProject`, `initialProjectId` |
| `SelectionSlice` | `selectedLang`, `selectedPlatform`, `selectedItem` |
| `AssetsSlice` | `assets`, `setAssets()` |
| `ScreenshotSlice` | `addScreenshot()`, `updateScreenshot()`, `removeScreenshot()`, etc. |
| `DevicePresetSlice` | `getDefaultDevicePreset()`, `updateDefaultDevicePreset()` |
| `GenerationSlice` | `generating`, `generateProgress`, `showGenerateModal`, `lastGenerated` |
| `UISlice` | Modal open/close flags |

**Why config stays in Zustand:** Config is a local-first editable document.
Screenshot and device-preset slices need synchronous `get().config` access to
clone-and-mutate. Zustand's `subscribe()` enables reactive auto-save without
prop drilling. Moving config to the React Query cache would require every
slice method to go async or accept config as a parameter, adding complexity
with no user-visible benefit.

### What React Query manages

All server-fetched data flows through React Query, then hydrates the store:

| Data | Query key | Hook | Hydration target |
|------|-----------|------|-----------------|
| Init payload | `['init']` | `useInitData` | `config`, `projects`, `currentProject`, `initialProjectId` |
| Asset list | `['assets']` | `useAssetsQuery` | `AssetsSlice.assets` |
| Generated results | `['generation', 'last']` | `useLastGeneratedQuery` | `GenerationSlice.lastGenerated` |

All mutations use `useMutation`:

| Domain | Hooks |
|--------|-------|
| Config | `useConfigAutoSave` (Zustand subscribe → debounced mutation) |
| Projects | `useCreateProject`, `useDeleteProject`, `useRenameProject`, `useSwitchProject` |
| Assets | `useUploadAsset`, `useRenameAsset`, `useDeleteAsset` |
| Languages | `useAddLanguage`, `useDeleteLanguage`, `useCopyPlatformConfig` |
| Generation | `useGenerateAll` (SSE streaming), `useOpenOutputFolder` |

### Hook structure

One hook per file, categorized by domain:

```
src/ui/hooks/
  index.ts                # Barrel export
  queries/
    index.ts
    init/
      useInitData.ts
      index.ts
    assets/
      useAssetsQuery.ts
      index.ts
    generation/
      useLastGeneratedQuery.ts
      index.ts
  mutations/
    index.ts
    config/
      useConfigAutoSave.ts
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
```

The existing `src/ui/utils/api.ts` stays as-is. Its pure fetch functions become
the `queryFn` and `mutationFn` callables passed to React Query hooks.

### Config editing pattern

Config is the most frequently edited server resource. The flow:

1. Component calls `useAppStore.getState().updateConfig(newConfig)` (or uses a
   `ScreenshotSlice` / `DevicePresetSlice` convenience method that calls
   `updateConfig` internally)
2. `updateConfig` sets `config` and `_configDirty = true` in Zustand
3. `useConfigAutoSave` subscribes to the store; when `config` changes and
   `_configDirty` is true, it debounces 50ms then calls `useMutation`
4. The mutation sends `PUT /api/config`
5. On success, `_configDirty` is cleared

A `flushPersist()` bridge (`utils/config-persistence.ts`) allows non-React code
(project switch, generation) to force an immediate save before proceeding.

### Screenshot and device-preset mutations

Screenshot operations (add, remove, update, add feature graphic, remove feature
graphic) and the default device preset setter stay as **Zustand convenience
methods**. They `structuredClone(config)`, mutate the clone, then call
`get().updateConfig(newConfig)`. The auto-save hook picks up the change.

This avoids the overhead of individual mutation hooks for operations that are
purely local config transforms — no separate server endpoint exists for them.

### App initialization

The `useInitData` query replaces the imperative `fetch("/api/init")` in
`main.tsx`. An `AppShell` component calls `useInitData`, hydrates the store
on success, and renders the app tree. `main.tsx` wraps `AppShell` in
`<Suspense>` + `<ErrorBoundary>` for loading and error states.

### Error boundaries

A React `ErrorBoundary` component wraps the app tree. It catches render errors
and query failures propagated by Suspense, displaying a retry UI instead of a
blank screen.

- **React Query DevTools.** Added as a dev dependency and rendered inside the
  `QueryClientProvider` for cache visibility during development.

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

### Config in React Query cache

Considered moving config to the React Query cache under key
`['config', projectId]`, with `queryClient.setQueryData` for local edits and
a debounced mutation for persistence. Rejected because:

- Screenshot and device-preset slices need synchronous `get().config` access.
  Moving config to the query cache would require every convenience method to
  accept config as a parameter or go async.
- Zustand's `subscribe()` provides a clean reactive auto-save pattern.
- The hybrid approach (Zustand owns config, React Query handles the network)
  is simpler and already working well.

## Consequences

### Positive

- **Automatic cache invalidation and deduplication.** Mutations declare which
  query keys to invalidate. Multiple components using `useAssetsQuery()` share
  a single network request.

- **Built-in loading and error states.** Every query returns `isPending`,
  `isError`, `error`. Error boundaries catch failures and offer retry.

- **DevTools.** The React Query DevTools panel shows every cache entry, its
  staleness, and refetch triggers.

- **Retry logic.** Failed requests retry once automatically (configurable)
  instead of silently failing.

- **No API calls in store.** Clear separation: Zustand = synchronous state,
  React Query = async server communication.

- **Reactive config persistence.** The subscribe-based auto-save is transparent
  to components — they just call `updateConfig()` and the hook handles the rest.

### Negative

- **Added dependency.** `@tanstack/react-query` adds approximately 13KB gzipped
  to the client bundle.

- **New patterns to learn.** Developers need to understand query keys,
  `useQuery`, `useMutation`, and cache invalidation strategies.

- **Dual-store hydration.** React Query fetches data, then syncs it to Zustand
  via `useEffect` / `onSuccess`. This indirection is the cost of keeping
  Zustand as the component-facing state source.

## Scope

### In scope

- All UI data fetching and mutation logic
- QueryClient setup, `<Suspense>` boundary, `<ErrorBoundary>` component
- `useInitData` query to replace imperative init fetch
- Zustand store cleanup (remove all API calls from slices)
- React Query DevTools integration

### Out of scope

- Server/backend code (routes, server.ts, generate.ts, convert.ts)
- Renderer components (TSX rendering pipeline)
- React Router structure
- Config in React Query cache (deliberately kept in Zustand — see Alternatives)
- Screenshot/device-preset mutation hooks (stay as Zustand convenience methods)
- `useSuspenseQuery` (regular `useQuery` is sufficient for current needs)
- Optimistic updates for project rename (not needed yet)
- Any new API endpoints
