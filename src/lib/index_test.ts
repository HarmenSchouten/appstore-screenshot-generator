import { assertEquals } from "@std/assert";
import {
  FEATURE_GRAPHIC_SIZE,
  getRoleLabel,
  getRolePlatform,
  getRolePlatforms,
  getRolesForPlatform,
  getScreenshotDimensions,
  isScreenshotRole,
  PRODUCT_PAGE_HEADER_SIZE,
  SCREENSHOT_ROLE_SPECS,
  SCREENSHOT_ROLES,
  SEARCH_RESULT_SIZE,
} from "@lib";
import type { ScreenshotRole } from "@app-types";

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

Deno.test("the role table holds placements only, one store each", () => {
  // A plain screenshot is not a placement: it belongs to both stores and
  // takes its canvas from the language config, so it is deliberately absent.
  assertEquals("screenshot" in SCREENSHOT_ROLE_SPECS, false);

  const roles = Object.keys(SCREENSHOT_ROLE_SPECS) as Exclude<
    ScreenshotRole,
    "screenshot"
  >[];
  const platforms = roles.map((role) => SCREENSHOT_ROLE_SPECS[role].platform);
  assertEquals(platforms, ["android", "ios", "ios"]);
});

Deno.test("every role table entry has the size and label the stores expect", () => {
  // Published pixel sizes, not approximations. A header at the wrong ratio
  // is rejected by App Store Connect, so pin them.
  assertEquals(FEATURE_GRAPHIC_SIZE, { width: 1024, height: 500 });
  assertEquals(PRODUCT_PAGE_HEADER_SIZE, { width: 3840, height: 1646 });
  assertEquals(SEARCH_RESULT_SIZE, { width: 3840, height: 2560 });

  // 3:2 for search results, ~21:9 for the header — both as Apple states them.
  assertEquals(
    SEARCH_RESULT_SIZE.width / SEARCH_RESULT_SIZE.height,
    3 / 2,
  );
  assertEquals(getRoleLabel("product-page-header"), "Product Page Header");
  assertEquals(getRoleLabel("screenshot"), "Screenshot");
});

Deno.test("a placement names its one store; a screenshot names none", () => {
  assertEquals(getRolePlatforms("feature-graphic"), ["android"]);
  assertEquals(getRolePlatforms("product-page-header"), ["ios"]);
  assertEquals(getRolePlatforms("search-result"), ["ios"]);
  assertEquals(getRolePlatforms("screenshot"), []);
  assertEquals(getRolePlatform("product-page-header"), "ios");
  assertEquals(getRolePlatform("screenshot"), undefined);
});

Deno.test("getRolesForPlatform lists what each store still asks for", () => {
  assertEquals(getRolesForPlatform("android"), ["feature-graphic"]);
  assertEquals(getRolesForPlatform("ios"), [
    "product-page-header",
    "search-result",
  ]);
});
