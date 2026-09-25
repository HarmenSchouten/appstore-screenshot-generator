<!--
Maintainers: this file loads into every Claude Code session, so keep it short
(Anthropic's guidance is under 200 lines; this aims for under 100) and keep
only what an agent can't work out from the code. For each line ask: would an
agent get something wrong without it? Area rules live in `.claude/rules/*.md`
and load only when a matching file is read. The reasons behind the rules live
in docs/ARCHITECTURE.md; when you change a rule there, change it here and in
.claude/rules/ too. HTML comments like this one are stripped before the file
reaches the model.
-->

# App Store Screenshot Generator

A Deno + Hono server and a React + Vite editor for designing App Store and
Google Play screenshots from a layer-based JSON config, exported to PNG through
headless Chrome. `docs/ARCHITECTURE.md` maps the code and records why each rule
below exists: read the relevant section before a change that crosses a
boundary. `CONTRIBUTING.md` covers setup, dependencies and PR titles.

## Commands

- `deno install`: installs npm packages into `node_modules/`. Deno owns them:
  never run `npm`, `npx` or `node`.
- `deno task dev`: hot reload on :5173, with the API on :3000.
- `deno task start`: builds the UI and serves UI and API on :3000.
- `deno task check`: the only type check. There is no `tsc` and no
  `tsconfig.json`.
- `deno task test`: all tests. One file:
  `deno test --allow-read --allow-write --allow-env src/lib/gradient_test.ts`
- `deno task test -- --update`: rewrites the snapshots (renderer HTML, device
  presets). Only after an intended output change; check the snapshot diff.
- `deno task verify`: everything CI runs.

## Before saying a change is done

- `deno task verify` passes. If it fails, show the failing output.
- For a visible UI change, check it in the running app (`deno task start`), or
  say that it was not checked in a browser.
- A bug fix comes with a test that fails without it, where practical.

## Code rules

- Imports carry their extension (`./foo.ts`, `./Bar.tsx`). An import that
  leaves its own directory uses an alias from `deno.json` `imports`, never
  `../`. Add aliases in `deno.json` only; Vite reads them from there.
- The server and the editor share only `src/types`, `src/lib`,
  `src/device-presets` and `src/renderer-components`. Nothing in `src/ui`
  imports a server module, and no server module imports `src/ui`. Tests are
  the one exception: they may borrow `getDefaultConfig` and
  `src/test-helpers.ts` for fixtures.
- `Layer` and the shape layers are discriminated unions. A `switch` over one
  ends with `assertNever` from `@lib`, so a new variant fails the type check.
- Layer defaults live in `LAYER_DEFAULTS` and `SHAPE_DEFAULTS`
  (`src/lib/layers.ts`), read through `withDefaults` and `resolveShape`. Don't
  add inline `??` fallbacks for them.

## Git and pull requests

- Branch from an up-to-date `main` as `<type>/<issue>-<slug>`, for example
  `fix/141-rename-revert`. One issue per PR, and put `Closes #<issue>` in the
  PR body.
- `main` is squash-merge only and the PR title becomes the commit and the
  changelog line, so the title is a Conventional Commit. Read the type table
  in `CONTRIBUTING.md` before choosing the type.
- release-please owns `CHANGELOG.md`, the `version` in `package.json` and
  `.release-please-manifest.json`. Don't edit them by hand.

## Gotchas

- `projects/default/` is tracked, and it is the project the app opens and
  auto-saves to. Running the app can rewrite
  `projects/default/config.json`; don't commit that unless the change is the
  point.
