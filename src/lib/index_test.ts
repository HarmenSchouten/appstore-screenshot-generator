import { assert, assertEquals } from "@std/assert";
import {
  CANVAS_SIZE_PRESETS,
  DEFAULT_DIMENSIONS,
  FEATURE_GRAPHIC_SIZE,
  findCanvasSizePreset,
  getRoleLabel,
  getRolePlatform,
  getRolesForPlatform,
  getScreenshotDimensions,
  isScreenshotRole,
  PRODUCT_PAGE_HEADER_SIZE,
  SCREENSHOT_ROLE_SPECS,
  SCREENSHOT_ROLES,
  SEARCH_RESULT_SIZE,
} from "@lib";

const platformDimensions = { width: 1080, height: 1920 };

Deno.test("getScreenshotDimensions: a fixed-size placement ignores the platform", () => {
  assertEquals(
    getScreenshotDimensions({ role: "feature-graphic" }, platformDimensions),
    FEATURE_GRAPHIC_SIZE,
  );
  assertEquals(
    getScreenshotDimensions(
      { role: "product-page-header" },
      platformDimensions,
    ),
    PRODUCT_PAGE_HEADER_SIZE,
  );
  assertEquals(
    getScreenshotDimensions({ role: "search-result" }, platformDimensions),
    SEARCH_RESULT_SIZE,
  );
});

Deno.test("getScreenshotDimensions: regular screenshot uses platform dimensions", () => {
  assertEquals(
    getScreenshotDimensions({ role: "screenshot" }, platformDimensions),
    platformDimensions,
  );
});

Deno.test("the role table and its runtime twin agree", () => {
  assertEquals(SCREENSHOT_ROLES[0], "screenshot", "the plain one comes first");
  assertEquals(
    [...SCREENSHOT_ROLES].sort(),
    ["screenshot", ...Object.keys(SCREENSHOT_ROLE_SPECS)].sort(),
  );
  for (const role of SCREENSHOT_ROLES) {
    assertEquals(isScreenshotRole(role), true, `${role} is a valid role`);
  }
  assertEquals(isScreenshotRole("poster"), false);
});

Deno.test("placements have the sizes the stores publish", () => {
  // Pinned: App Store Connect rejects a header at the wrong ratio.
  assertEquals(FEATURE_GRAPHIC_SIZE, { width: 1024, height: 500 });
  assertEquals(PRODUCT_PAGE_HEADER_SIZE, { width: 3840, height: 1646 });
  assertEquals(SEARCH_RESULT_SIZE, { width: 3840, height: 2560 });
  assertEquals(getRoleLabel("product-page-header"), "Product Page Header");
  assertEquals(getRoleLabel("screenshot"), "Screenshot");
});

Deno.test("a placement names its store; a screenshot names none", () => {
  assertEquals(getRolePlatform("feature-graphic"), "android");
  assertEquals(getRolePlatform("product-page-header"), "ios");
  assertEquals(getRolePlatform("search-result"), "ios");
  assertEquals(getRolePlatform("screenshot"), undefined);
});

Deno.test("getRolesForPlatform lists each store's placements", () => {
  assertEquals(getRolesForPlatform("android"), ["feature-graphic"]);
  assertEquals(getRolesForPlatform("ios"), [
    "product-page-header",
    "search-result",
  ]);
});

Deno.test("canvas sizes: the default canvas is on the list for both stores", () => {
  for (const platform of ["ios", "android"] as const) {
    assert(
      findCanvasSizePreset(platform, DEFAULT_DIMENSIONS[platform]) !== null,
      `${platform}: default ${DEFAULT_DIMENSIONS[platform].width}×${
        DEFAULT_DIMENSIONS[platform].height
      } is not offered`,
    );
  }
});

Deno.test("canvas sizes: ids are unique and each carries its own pixels", () => {
  for (const platform of ["ios", "android"] as const) {
    const presets = CANVAS_SIZE_PRESETS[platform];
    const ids = presets.map((p) => p.id);
    assertEquals(new Set(ids).size, ids.length, `${platform}: duplicate id`);

    for (const preset of presets) {
      const { width, height } = preset.dimensions;
      assert(width > 0 && height > 0, `${preset.id}: empty dimensions`);
      assertEquals(
        findCanvasSizePreset(platform, preset.dimensions)?.id,
        preset.id,
        `${preset.id}: does not round-trip`,
      );
    }
  }
});

Deno.test("canvas sizes: an unlisted size is reported as unknown, not guessed", () => {
  assertEquals(findCanvasSizePreset("ios", { width: 999, height: 1111 }), null);
});

Deno.test("canvas sizes: every Android size is one Play accepts", () => {
  for (const { id, dimensions } of CANVAS_SIZE_PRESETS.android) {
    const short = Math.min(dimensions.width, dimensions.height);
    const long = Math.max(dimensions.width, dimensions.height);
    assert(short >= 320 && long <= 3840, `${id}: side out of range`);
    assert(long <= 2 * short, `${id}: long side over twice the short`);
  }
});

Deno.test("canvas sizes: the iPhone Duo's two displays are both offered", () => {
  assertEquals(
    findCanvasSizePreset("ios", { width: 2007, height: 2853 })?.id,
    "ios-duo-inner",
  );
  assertEquals(
    findCanvasSizePreset("ios", { width: 1398, height: 2034 })?.id,
    "ios-duo-outer",
  );
});
