import { assertSnapshot } from "@std/testing/snapshot";
import { assertStringIncludes } from "@std/assert";
import { FEATURE_GRAPHIC_SIZE } from "@lib";
import { getDefaultConfig } from "../projects.ts";
import {
  makeDefaultScreenshot,
  makeEffectsScreenshot,
  makeFeatureGraphic,
} from "../test-helpers.ts";
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
