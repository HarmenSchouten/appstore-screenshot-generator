# Contributing

Thanks for contributing.

## Setup

1. Install Deno 2.x (Node.js is not required).
2. Install dependencies:
   - deno install
3. Start development:
   - deno task dev
4. Open http://localhost:5173.

## Verify before opening a PR

Run:

- deno task verify

This runs:

- deno fmt --check
- deno lint
- deno check src/server.ts src/ui/main.tsx (server + UI graphs — the only type-check step; `tsc` is not used)
- vite build (`deno task build`)

## Dependencies

Deno owns dependencies: `package.json` is the single manifest for npm packages, `deno.json` `imports` holds jsr packages and path aliases, and `deno.lock` is the only lockfile (there is no `package-lock.json`; never run `npm install`).

- Add or bump a dependency in `package.json`, run `deno install`, commit `deno.lock` with it. CI runs `deno install --frozen` and fails if the lock is stale.
- Dependabot PRs bump `package.json` only (it cannot write `deno.lock`). Before merging one: check out the branch, run `deno install`, commit and push `deno.lock`.
- Tasks invoke Vite and concurrently via `node_modules/<pkg>/…/bin` paths rather than `npm:` specifiers, so running a task never writes `npm:pkg@*` entries into `deno.lock`.

## Scope guidance for this repo

This project is intentionally small. Prefer focused PRs with one clear goal.

Good first contributions:

- Docs clarity
- UI polish
- Preset and renderer improvements
- Bug fixes in routes and generation flow

## Pull request expectations

- Describe what changed and why.
- Keep unrelated refactors out of the same PR.
- Update docs when behavior or workflow changes.

## Conventional Commits

Please use conventional commit messages when making contributions:

- `fix:` for patch releases
- `feat:` for minor releases
- `feat!:` or `BREAKING CHANGE:` for major releases

Commit format before merging.
