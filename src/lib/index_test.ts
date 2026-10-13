import { assertEquals } from "@std/assert";
import {
  FEATURE_GRAPHIC_SIZE,
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
