import { assertEquals } from "@std/assert";
import { FEATURE_GRAPHIC_SIZE, getScreenshotDimensions } from "@lib";

const platformDimensions = { width: 1080, height: 1920 };

Deno.test("getScreenshotDimensions: feature graphic uses the fixed Play Store size", () => {
  assertEquals(
    getScreenshotDimensions({ role: "feature-graphic" }, platformDimensions),
    FEATURE_GRAPHIC_SIZE,
  );
});

Deno.test("getScreenshotDimensions: regular screenshot uses platform dimensions", () => {
  assertEquals(
    getScreenshotDimensions({ role: "screenshot" }, platformDimensions),
    platformDimensions,
  );
});
