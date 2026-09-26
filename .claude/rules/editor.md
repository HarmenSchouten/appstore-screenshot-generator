---
paths:
  - "src/ui/**"
---

# Editor rules

- There is no browser or React test harness. Put editor logic worth testing in
  a plain `.ts` module with a `*_test.ts` beside it.
- The Zustand store never calls the API. Server calls go through TanStack
  Query hooks in `src/ui/hooks/`, which call `src/ui/utils/api.ts`, the only
  file that uses `fetch`. The hook writes the store in its mutation callbacks;
  UI reactions such as closing a modal go at the `mutate()` call site,
  unless the navigation is itself the state change (switching project, adding
  a language).
- Read the store with `useAppStore(selector)` in render, and with
  `useAppStore.getState()` in handlers, effects and mutation callbacks.
- A local edit goes through `updateConfig`, which marks the config dirty and
  auto-saves it. A config that came from the server goes through `hydrate`,
  which does not. A mutation that makes the server read or rewrite the open
  project's config reads `currentProject` once, calls
  `await flushPersist(projectId)`, sends that id to the API, and drops the
  answer if `isProjectOpen(projectId)` is false by then.
- The URL owns the project, language, platform and selected screenshot. Read
  them with `useSelection()`, change them with `useNavigateSelection()`, and
  never copy them into the store. Path segments are validated only in
  `utils/route-selection.ts`.
- Components import hooks from `@hooks`; files inside `src/ui/hooks/` import
  each other by relative path.
- Use the primitives in `components/primitives/` (`Modal`, `ConfirmBar` with
  `useConfirm`, `SortableList`) instead of new modals, confirm flows or
  drag-and-drop lists.
- A keyboard shortcut is an entry in `SHORTCUTS`
  (`hooks/shortcut-definitions.ts`) bound with `useShortcut`; the cheat sheet
  reads the same table.
