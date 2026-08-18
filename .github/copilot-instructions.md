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

Declared **once**, in `deno.json` `imports`; `vite.config.ts` derives its `resolve.alias` from that block at config-load time (there is no `tsconfig.json`). Edit `deno.json` only.

| Alias | Target |
|-------|--------|
| `@app-types` / `@app-types/` | `src/types/index.ts` / `src/types/` |
| `@ui/` | `src/ui/` |
| `@hooks` / `@hooks/` | `src/ui/hooks/index.ts` / `src/ui/hooks/` |
| `@renderer` / `@renderer/` | `src/renderer-components/index.ts` / `src/renderer-components/` |
| `@device-presets` / `@device-presets/` | `src/device-presets/index.ts` / `src/device-presets/` |
| `@lib` / `@lib/` | `src/lib/index.ts` / `src/lib/` |
| `@routes` / `@routes/` | `src/routes/index.ts` / `src/routes/` |
| `@/` | `src/` — only for the server root modules (`src/projects.ts`, `src/png-export.ts`, …) |

Rules: any import that leaves the current directory uses an alias (no `../`); same-directory imports stay relative (`./foo.ts`). Use the most specific alias (`@hooks/` over `@ui/hooks/`). The alias is `@app-types`, not `@types`, so it cannot shadow npm's `@types/*` scope.

## Code Style

- TypeScript strict mode
- React functional components only
- Use `.ts` extensions in all imports
- Barrel exports (`index.ts`) at each directory level for hooks

## Build and Test

- `deno task dev` — Start dev server (Deno backend + Vite frontend)
- `deno task build` — Production UI build (Vite, run under Deno)
- `deno task verify` — fmt check + lint + type check + build (what CI runs)
- `deno task check` — Type check (server + UI graphs). This is the only type-check command; `tsc` is not used.
