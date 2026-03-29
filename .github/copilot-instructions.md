# Project Guidelines

## Architecture

This project uses a **React + Zustand + TanStack React Query** stack for the UI.
See `docs/` for detailed architecture docs.

### State Management Boundaries

| Layer | Responsibility | Owns API calls? |
|-------|---------------|-----------------|
| `src/ui/utils/api.ts` | Pure fetch functions (no state logic) | Yes (raw HTTP only) |
| React Query hooks (`src/ui/hooks/`) | Orchestrate API calls, track status, hydrate store | Yes (via `useMutation` / `useQuery`) |
| Zustand store (`src/ui/store/`) | Client-only state + synchronous setters | **No** |
| Components (`src/ui/components/`) | Render UI, call hooks | No |

### Rules

1. **Zustand store must never make API calls.** Store slices hold client-only state (selections, UI flags, config cache) and synchronous setters. No `fetch`, no `async` actions that call the server.
2. **All server communication goes through React Query hooks.** Use `useMutation` for writes and `useQuery` for reads. The hook's `mutationFn`/`queryFn` calls functions from `utils/api.ts`.
3. **Hooks hydrate the store in `onSuccess`.** After a successful mutation, update Zustand via `useAppStore.setState()` in the `onSuccess` callback.
4. **Compose hooks, don't duplicate logic.** If one mutation needs to trigger another (e.g. create project → switch to it), call the other hook's `.mutateAsync()` — don't rewrite the logic.
5. **Separate concerns in callbacks** (per TkDodo's guidance): put logic (store updates, invalidation) in `useMutation` callbacks; put UI actions (close modals, redirects) at the `mutate()` call site in components.
6. **Prefer `mutate` over `mutateAsync`** unless composing promises between hooks.

### File Structure

```
src/ui/
  hooks/
    index.ts              # Barrel export
    mutations/
      index.ts            # Barrel export
      projects/
        index.ts          # Barrel export
        useCreateProject.ts
        useDeleteProject.ts
        useRenameProject.ts
        useSwitchProject.ts
      # Future: config/, assets/, generation/
    # Future: queries/
  store/
    index.ts              # Combined store + selectors
    types.ts              # Slice interfaces (no async methods)
    projects.ts           # Pure data slice
    config.ts
    ...
  utils/
    api.ts                # Pure fetch functions
    query.ts              # Shared QueryClient + query key factories
```

### Path Aliases

| Alias | Target |
|-------|--------|
| `@hooks` | `src/ui/hooks/index.ts` |
| `@ui` | `src/ui/` |
| `@types` | `src/types/` |
| `@device-presets` | `src/device-presets/` |
| `@renderer` | `src/renderer-components/` |
| `@lib` | `src/lib/` |

Aliases are defined in `tsconfig.json`, `vite.config.ts`, and `deno.json`. All three must stay in sync.

## Code Style

- TypeScript strict mode
- React functional components only
- Use `.ts` extensions in all imports
- Barrel exports (`index.ts`) at each directory level for hooks

## Build and Test

- `deno task dev` — Start dev server (Deno backend + Vite frontend)
- `npx vite build` — Production build
- `npx tsc --noEmit` — Type check
