# App Store Screenshot Generator

![Deno](https://img.shields.io/badge/Deno-2.0+-000000?logo=deno&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Platforms](https://img.shields.io/badge/Platforms-iOS%20%7C%20Android-blue)
![License](https://img.shields.io/badge/License-MIT-green)

Generate App Store and Google Play marketing screenshots with a visual editor
and a shared render pipeline for preview and export.

![App Store Screenshot Generator UI](docs/images/readme-preview.png)

## What It Does

- Visual editor with live preview
- iOS and Android output support
- Multi-language project setup
- Shared renderer for browser preview and PNG export
- Project-based asset and config management

> [!NOTE]
> This project started as a script-first screenshot generator. Later on a
> generated frontend was attached to it. The frontend has been iteratively
> refined over time, and the history is documented in
> [docs/PROJECT_HISTORY.md](docs/PROJECT_HISTORY.md).

## Quick Start

### Prerequisites

- Deno 2.x
- Node.js 20+
- Google Chrome or Chromium (for PNG export)

### Run locally

```bash
git clone https://github.com/HarmenSchouten/appstore-screenshot-generator.git
cd appstore-screenshot-generator
npm ci
deno task dev
```

Open http://localhost:5173

## Day-to-day Commands

```bash
# Start API + Vite UI
deno task dev

# Verify before a PR
npm run verify
```

## Releases

- Releases are owner-controlled with Release Please.
- Preparing a release is manual: run the `prepare-release` GitHub Actions
  workflow when you want a new version.
- That workflow creates or updates a release PR with the next version number and
  changelog changes.
- Nothing is published until that release PR is merged into `main`.
- Merging the release PR triggers the `publish-release` workflow, which creates
  the Git tag and GitHub Release.
- GitHub automatically attaches stable source archives (`.zip` and `.tar.gz`) to
  each GitHub Release.
- To keep release merges owner-controlled, use GitHub branch protection or
  repository permissions for `main`.

## Output and Projects

- Project data: projects/{project-id}/
- Generated images: projects/{project-id}/output/{language}/{platform}/
- Root output mode: output/

## Architecture at a Glance

- API and orchestration: src/server.ts and src/routes/
- Screenshot generation: src/generate.ts and src/convert.ts
- Shared renderer components: src/renderer-components/
- Editor UI: src/ui/ (React + Vite)

For project evolution and technical decisions, see:

- [docs/README.md](docs/README.md)
- [docs/PROJECT_HISTORY.md](docs/PROJECT_HISTORY.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, verification steps, and PR
expectations.

## Troubleshooting

### Chrome not found

Set PUPPETEER_EXECUTABLE_PATH if Chrome is not auto-detected.

Windows PowerShell:

```powershell
$env:PUPPETEER_EXECUTABLE_PATH="C:\Path\To\chrome.exe"
```

macOS/Linux:

```bash
export PUPPETEER_EXECUTABLE_PATH="/path/to/chrome"
```

### Fonts not loading

Generation needs network access for Google Fonts URLs in project theme settings.

## License

MIT
