---
paths:
  - "src/renderer-components/**"
---

# Renderer rules

The renderer draws both the editor preview (`ScreenshotContent`) and the
exported document (`Screenshot` through `renderToStaticMarkup`). The preview
and the PNG must not drift apart, so:

- Import only `react`, `react-dom/server`, `@app-types`, `@lib`,
  `@device-presets` and other renderer files. No browser globals (`window`,
  `document`, `ResizeObserver`), no `Deno.*`, no fetching.
- Components are pure functions of their props: no hooks, no `Math.random`
  (use `seededRandom` from `utils.ts`), no dates. The same config must render
  the same HTML.
- Animations only run behind the `animate` flag; export renders with
  `animate={false}`.
- Canvas size comes from `getScreenshotDimensions` in `@lib`. Frame geometry is
  specified at `DEVICE_PRESET_REFERENCE_WIDTH` and scaled to the canvas width.
- Every layer except the background (which fills the canvas) is placed by
  `PositionedLayer`, centred on `posX`/`posY` percent. Paint order is list
  order; there is no `zIndex`.
- Any change to the HTML fails the snapshots in `server_test.ts`. If the change
  is intended, run `deno task test -- --update` and say in the PR which
  snapshots changed and why.
