# Contributing

Thanks for helping out. This is a small project, so small, focused pull
requests are the easiest to review and merge.

## Setup

You need [Deno 2](https://docs.deno.com/runtime/getting_started/installation/)
and Google Chrome or Chromium (export drives Chrome to take the PNGs). Node.js
is not required.

```sh
deno install
deno task dev
```

`deno task dev` runs the API on port 3000 and the Vite dev server with hot
reload on <http://localhost:5173>. Open the second one.

On a fresh clone the very first `deno task dev` can leave the editor blank
with a `TsconfigCache` error in the log
([#138](https://github.com/HarmenSchouten/appstore-screenshot-generator/issues/138)).
Stop it and start it again; it works from the second run on. The
[README](README.md#troubleshooting) covers the other common problems, such as
Chrome not being found or port 3000 being taken.

## How the code is organised

[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) describes the layout of the
code, the boundaries between the server and the editor, and the rules the
code keeps (import aliases, where state lives, one renderer for preview and
export, and so on). Please read it before a larger change. If your change
breaks one of those rules on purpose, update the document in the same pull
request and say why in the description.

## Checks

Run this before you open a pull request:

```sh
deno task verify
```

It runs the same steps as CI, in order:

1. `deno fmt --check` for formatting (run `deno fmt` to fix it)
2. `deno lint`
3. `deno task check`, which type-checks the server, the editor and
   `vite.config.ts`
4. `deno task test`, the unit and route tests
5. `deno task build`, the production build of the editor

CI installs the latest Deno 2 release. If formatting passes on your machine
but fails in CI, run `deno upgrade` and try again.

## Tests

Tests sit next to the code they cover as `*_test.ts` files, use `@std/assert`,
and run with `deno task test`. `src/test-helpers.ts` has what most tests need:
a temporary projects directory (`withTempProjectsDir`), an app with the real
error handlers for route tests (`makeRouteApp`), and sample screenshots.

Where it's practical, a bug fix should come with a test that fails without
it. There is no
browser test setup, so if you want to test editor logic, put it in a plain
`.ts` module instead of inside a component.

## Dependencies

`package.json` lists the npm packages, `deno.json` holds the JSR packages and
the import aliases, and `deno.lock` is the only lockfile. Don't run
`npm install`.

- To add or update a package, edit `package.json`, run `deno install`, and
  commit the updated `deno.lock` along with it. CI installs with `--frozen`
  and fails if the lockfile is out of date.
- Dependabot pull requests only change `package.json`, because Dependabot
  can't update `deno.lock`. Before merging one, check out its branch, run
  `deno install`, and push the updated lockfile.
- Tasks run tools through their `node_modules/<pkg>/…/bin` path rather than an
  `npm:` specifier. An `npm:` specifier would add a new entry to `deno.lock`
  every time the task runs.

## Pull requests and commit messages

Pull requests are squash-merged, and the PR title becomes the commit message
on `main`. The changelog and version number are generated from those titles
by [release-please](https://github.com/googleapis/release-please), so the
title follows [Conventional Commits](https://www.conventionalcommits.org/):
`type: short description in the imperative`, for example
`fix: keep the layer selected after undo`.

Pick the type by what a user of the app would notice:

| Type       | Use it when                                                     | Changelog section      |
| ---------- | --------------------------------------------------------------- | ---------------------- |
| `feat`     | Users can do something they couldn't before                     | Features               |
| `fix`      | Something users could see was broken, and now it works          | Bug Fixes              |
| `perf`     | The same behaviour, measurably faster or lighter                | Performance            |
| `refactor` | The code changes but the behaviour doesn't                      | Refactoring            |
| `build`    | Dependencies, the lockfile, or build configuration              | Build System           |
| `ci`       | GitHub Actions workflows                                        | Continuous Integration |
| `docs`     | Documentation and comments only                                 | not listed             |
| `test`     | Tests only                                                      | not listed             |
| `chore`    | Anything else that doesn't touch the app, such as repo settings | not listed             |

`feat` bumps the minor version and `fix` the patch version. For a breaking
change, add `!` after the type (`feat!: …`) and explain the break in the
description.

When in doubt between `fix` and `refactor`, ask whether a user could have run
into the old behaviour. Restructuring code, renaming things or updating
comments is not a fix, even if the old code bothered you. A title like
`fix: refactor the store` puts a line under Bug Fixes that describes no bug.

In the description, say what changed and why, and keep unrelated changes for
a separate pull request. If the change affects how the app behaves or how
someone works on it, update the README, this file or `docs/ARCHITECTURE.md`
as part of it.
