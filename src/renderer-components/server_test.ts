import { assertSnapshot } from "@std/testing/snapshot";
import { assert, assertStringIncludes } from "@std/assert";
import {
  DEVICE_PRESET_REFERENCE_WIDTH,
  getDevicePreset,
} from "@device-presets";
import type { DevicePresetId } from "@app-types";
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
  assert(phone.model, "fixture pins an explicit model");

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

// The frame div's aspect-ratio embeds the preset's bodyHeight, which
// identifies the preset that actually rendered.
const aspectRatioFor = (id: DevicePresetId) =>
  `aspect-ratio:${DEVICE_PRESET_REFERENCE_WIDTH} / ${
    getDevicePreset(id).bodyHeight
  }`;

// Resolution order for the rendered device: layer model → platform default
// (#61). A phone-frame layer without `model` inherits defaultDevicePresetId;
// an explicit `model` always wins over it.
Deno.test("renderScreenshot: phone frame without model inherits the platform default device", () => {
  const screenshot = makeDefaultScreenshot();
  const phone = screenshot.layers.find((l) => l.type === "phone-frame");
  assert(phone && phone.type === "phone-frame");
  delete phone.model;

  const html = renderScreenshot({
    screenshot,
    theme: baseConfig.theme,
    app: baseConfig.app,
    platform: "android",
    defaultDevicePresetId: "android-pixel-9-pro",
    dimensions: baseConfig.languages[0].platforms.android.dimensions,
    assetUrlPrefix: "/assets/",
  });

  assert(
    aspectRatioFor("android-pixel-9-pro") !==
      aspectRatioFor("ios-iphone-15-pro"),
    "presets must have distinct geometry for this test to discriminate",
  );
  assertStringIncludes(html, aspectRatioFor("android-pixel-9-pro"));
  assert(!html.includes(aspectRatioFor("ios-iphone-15-pro")));
});

Deno.test("renderScreenshot: explicit layer model wins over the platform default device", () => {
  // Fixture's phone frame pins model: "ios-iphone-15-pro".
  const html = renderScreenshot({
    screenshot: makeDefaultScreenshot(),
    theme: baseConfig.theme,
    app: baseConfig.app,
    platform: "android",
    defaultDevicePresetId: "android-pixel-9-pro",
    dimensions: baseConfig.languages[0].platforms.android.dimensions,
    assetUrlPrefix: "/assets/",
  });

  assertStringIncludes(html, aspectRatioFor("ios-iphone-15-pro"));
  assert(!html.includes(aspectRatioFor("android-pixel-9-pro")));
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
