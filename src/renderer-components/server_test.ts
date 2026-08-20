import { assertSnapshot } from "@std/testing/snapshot";
import { assert, assertStringIncludes } from "@std/assert";
import {
  DEVICE_PRESET_REFERENCE_WIDTH,
  getDevicePreset,
} from "@device-presets";
import { FEATURE_GRAPHIC_SIZE, getScreenshotDimensions } from "@lib";
import { getDefaultConfig } from "@/projects.ts";
import {
  makeDefaultScreenshot,
  makeEffectsScreenshot,
  makeFeatureGraphic,
} from "@/test-helpers.ts";
import { renderScreenshot } from "./server.ts";

// renderToStaticMarkup is deterministic, so full-document snapshots catch
// any unintended change to renderer output (#57). Update intentionally with:
//   deno task test -- --update

const baseConfig = getDefaultConfig("Snapshot App");

Deno.test("renderScreenshot: default screenshot snapshot", async (t) => {
  const html = renderScreenshot({
    screenshot: makeDefaultScreenshot(),
    theme: baseConfig.theme,
    app: baseConfig.app,
    platform: "ios",
    defaultDevicePresetId: "ios-iphone-15-pro",
    dimensions: baseConfig.languages[0].platforms.ios.dimensions,
    assetUrlPrefix: "/assets/",
  });

  assertStringIncludes(html, "<!DOCTYPE html>");
  assertStringIncludes(html, "Track your day");
  await assertSnapshot(t, html);
});

Deno.test("renderScreenshot: feature graphic snapshot", async (t) => {
  const html = renderScreenshot({
    screenshot: makeFeatureGraphic(),
    theme: baseConfig.theme,
    app: baseConfig.app,
    platform: "android",
    defaultDevicePresetId: "android-pixel-9-pro",
    dimensions: { ...FEATURE_GRAPHIC_SIZE },
    assetUrlPrefix: "/assets/",
  });

  assertStringIncludes(html, "Plan. Track. Done.");
  await assertSnapshot(t, html);
});

// Phone-frame geometry (radii, bezels, insets) scales from the canvas
// width. A feature graphic must derive it from FEATURE_GRAPHIC_SIZE, not
// the platform dimensions — the 1080-vs-1024 mismatch was #60's preview
// bug, so this pins the export side both ways.
Deno.test("renderScreenshot: feature-graphic frame geometry scales from FEATURE_GRAPHIC_SIZE", () => {
  const fg = makeFeatureGraphic();
  const phone = fg.layers.find((l) => l.type === "phone-frame");
  assert(phone && phone.type === "phone-frame");

  const platformDimensions =
    baseConfig.languages[0].platforms.android.dimensions;
  const html = renderScreenshot({
    screenshot: fg,
    theme: baseConfig.theme,
    app: baseConfig.app,
    platform: "android",
    defaultDevicePresetId: "android-pixel-9-pro",
    dimensions: getScreenshotDimensions(fg, platformDimensions),
    assetUrlPrefix: "/assets/",
  });

  const preset = getDevicePreset(phone.model);
  const radiusFor = (canvasWidth: number) => {
    const pixelWidth = Math.round(canvasWidth * (phone.scale! / 100));
    const s = pixelWidth / DEVICE_PRESET_REFERENCE_WIDTH;
    return `border-radius:${preset.outerRadius * s}px`;
  };

  assertStringIncludes(html, radiusFor(FEATURE_GRAPHIC_SIZE.width));
  assert(
    !html.includes(radiusFor(platformDimensions.width)),
    "frame geometry must not derive from platform dimensions",
  );
});

Deno.test("renderScreenshot: shape, glow and image layers snapshot", async (t) => {
  const html = renderScreenshot({
    screenshot: makeEffectsScreenshot(),
    theme: baseConfig.theme,
    app: baseConfig.app,
    platform: "android",
    defaultDevicePresetId: "android-pixel-9-pro",
    dimensions: baseConfig.languages[0].platforms.android.dimensions,
    assetUrlPrefix: "/assets/",
  });

  assertStringIncludes(html, "/assets/images/logo.png");
  await assertSnapshot(t, html);
});
