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

## Release Process

- Normal feature and fix PRs merge into `main` as usual.
- Releases are not created for every merge.
- When a release is wanted, run the `prepare-release` workflow in GitHub
  Actions.
- Release Please creates or updates a dedicated release PR with version and
  changelog updates.
- Review that PR like any other change.
- Merging the release PR triggers the publish workflow, which creates the Git
  tag and GitHub Release.
- GitHub Releases provide the stable source artifacts for this repository.
- If release merges should stay owner-only, enforce that with branch protection
  or repository permissions on `main`.

## Conventional Commits

Release Please uses commit messages to calculate the next version.

- `fix:` for patch releases
- `feat:` for minor releases
- `feat!:` or `BREAKING CHANGE:` for major releases

If you primarily squash merge, set the PR title to the intended Conventional
Commit format before merging.
