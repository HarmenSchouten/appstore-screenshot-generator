# Contributing

Thanks for contributing.

## Setup

1. Install Deno 2.x and Node 20+.
2. Install dependencies:
   - npm ci
3. Start development:
   - deno task dev
4. Open http://localhost:5173.

## Verify before opening a PR

Run:

- npm run verify

This runs:

- deno lint
- deno check src/server.ts
- vite build

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
