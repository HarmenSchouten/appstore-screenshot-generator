import { assertSnapshot } from "@std/testing/snapshot";
import {
  assert,
  assertEquals,
  assertStringIncludes,
  assertThrows,
} from "@std/assert";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  DEVICE_PRESET_REFERENCE_WIDTH,
  getDevicePreset,
} from "@device-presets";
import type { DevicePresetId, Layer, RenderOptions } from "@app-types";
import { FEATURE_GRAPHIC_SIZE, getScreenshotDimensions } from "@lib";
import { getDefaultConfig } from "@/projects.ts";
import {
  makeAllShapesScreenshot,
  makeDefaultScreenshot,
  makeEffectsScreenshot,
  makeFeatureGraphic,
} from "@/test-helpers.ts";
import { ScreenshotContent } from "./Screenshot.tsx";
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

// A preset whose buttons are the frame's own metal leaves `buttonFill` out
// and the renderer falls back to `frameFill` (#72), rather than to the
// generic dark gradient DEFAULT_MATERIAL used to supply.
Deno.test("renderScreenshot: buttons fall back to the frame fill", () => {
  const preset = getDevicePreset("ios-iphone-15-pro");
  assertEquals(preset.material.buttonFill, undefined, "fixture preset");

  // Fixture's phone frame pins model: "ios-iphone-15-pro".
  const html = renderScreenshot({
    screenshot: makeDefaultScreenshot(),
    theme: baseConfig.theme,
    app: baseConfig.app,
    platform: "ios",
    defaultDevicePresetId: "ios-iphone-15-pro",
    dimensions: baseConfig.languages[0].platforms.ios.dimensions,
  });

  // The button's background layers the two sheens over the fill, so the
  // fill is what the declaration ends on.
  assertStringIncludes(html, `transparent 20%), ${preset.material.frameFill}`);
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

Deno.test("renderScreenshot: every shape type snapshot", async (t) => {
  const html = renderScreenshot({
    screenshot: makeAllShapesScreenshot(),
    theme: baseConfig.theme,
    app: baseConfig.app,
    platform: "android",
    defaultDevicePresetId: "android-pixel-9-pro",
    dimensions: baseConfig.languages[0].platforms.android.dimensions,
    assetUrlPrefix: "/assets/",
  });

  await assertSnapshot(t, html);
});

// An unknown shape used to fall through to a circle; #71 made every switch
// exhaustive, so a stale config fails loudly instead of drawing the wrong thing.
Deno.test("renderScreenshot: an unknown shape type throws", () => {
  const screenshot = makeDefaultScreenshot();
  screenshot.layers.push({
    id: "bad",
    type: "shape",
    shapeType: "hexagram",
    size: 100,
    color: "#fff",
    posX: 50,
    posY: 50,
    rotation: 0,
    opacity: 1,
  } as unknown as Layer);

  assertThrows(
    () =>
      renderScreenshot({
        screenshot,
        theme: baseConfig.theme,
        app: baseConfig.app,
        platform: "ios",
        defaultDevicePresetId: "ios-iphone-15-pro",
        dimensions: baseConfig.languages[0].platforms.ios.dimensions,
      }),
    Error,
    "Unhandled case",
  );
});

// The empty-screen pulse made a PNG's opacity depend on when Chrome
// captured it (#71): the export document renders the placeholder static,
// at the pulse's resting opacity, while the preview keeps animating.
Deno.test("renderScreenshot: an empty phone frame is static in the export document", () => {
  const screenshot = makeDefaultScreenshot();
  const phone = screenshot.layers.find((l) => l.type === "phone-frame");
  assert(phone && phone.type === "phone-frame");
  delete phone.imagePath;

  const options: RenderOptions = {
    screenshot,
    theme: baseConfig.theme,
    app: baseConfig.app,
    platform: "ios",
    defaultDevicePresetId: "ios-iphone-15-pro",
    dimensions: baseConfig.languages[0].platforms.ios.dimensions,
  };
  const exported = renderScreenshot(options);
  assertStringIncludes(exported, "No screenshot");
  assertStringIncludes(exported, "opacity:0.4");
  assert(!exported.includes("animation:"), "export must not animate");

  const preview = renderToStaticMarkup(
    createElement(ScreenshotContent, { options }),
  );
  assertStringIncludes(preview, "animation:phoneFrameEmptyPulse");
});
