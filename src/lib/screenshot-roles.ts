/**
 * The store placements this tool can design: the fixed-size assets a store
 * asks for separately from screenshots.
 *
 * Every role question in the app — the sidebar's section, which store a
 * placement belongs to, what canvas it renders at, what to call it, and which
 * store may accept it — is answered from this table. Adding a placement a
 * store launches is an entry here rather than an edit in six files.
 *
 * `ScreenshotRole` itself is the union of `"screenshot"` and these keys.
 * Plain screenshots are deliberately *not* an entry: they are not a
 * placement, they belong to both stores, and their canvas comes from the
 * language config rather than a fixed size. Everything downstream that needs
 * to tell them apart asks `role === "screenshot"`, and says so.
 *
 * Sizes are Apple's and Google's published figures, in pixels:
 * developer.apple.com/help/app-store-connect/reference/app-information/
 *   creative-assets-specifications
 * support.google.com/googleplay/android-developer/answer/9866151
 */

import type { Dimensions, Platform, ScreenshotRole } from "@app-types";

export interface ScreenshotRoleSpec {
  /** The sidebar section heading, and what an unnamed result shows. */
  label: string;
  /** Fixed canvas. A placement never renders at the platform's dimensions. */
  dimensions: Readonly<Dimensions>;
  /** The one store this placement exists in. */
  platform: Platform;
}

/** Google Play feature graphic. Play takes no other fixed-size asset. */
export const FEATURE_GRAPHIC_SIZE: Readonly<Dimensions> = {
  width: 1024,
  height: 500,
};

/**
 * App Store product page header — the banner above the fold on the product
 * page. Apple accepts this at 21:9 (3840 × 1646) or 16:9 (5244 × 2950); we
 * use the first, since the 16:9 one is a separate "universal" asset that
 * has to cover both the header and search results in a single file.
 */
export const PRODUCT_PAGE_HEADER_SIZE: Readonly<Dimensions> = {
  width: 3840,
  height: 1646,
};

/**
 * App Store search results. Apple accepts 3:2 between 1920 × 1280 and
 * 3840 × 2560; we use the largest, which is the sharpest the store shows.
 */
export const SEARCH_RESULT_SIZE: Readonly<Dimensions> = {
  width: 3840,
  height: 2560,
};

/** Placements only — see the module note on why `screenshot` is absent. */
export const SCREENSHOT_ROLE_SPECS: Record<
  Exclude<ScreenshotRole, "screenshot">,
  ScreenshotRoleSpec
> = {
  "feature-graphic": {
    label: "Feature Graphic",
    dimensions: FEATURE_GRAPHIC_SIZE,
    platform: "android",
  },
  "product-page-header": {
    label: "Product Page Header",
    dimensions: PRODUCT_PAGE_HEADER_SIZE,
    platform: "ios",
  },
  "search-result": {
    label: "Search Results",
    dimensions: SEARCH_RESULT_SIZE,
    platform: "ios",
  },
};

/**
 * The stores a placement belongs to; none for a plain screenshot, which
 * belongs to whichever store is being edited.
 */
export function getRolePlatforms(role: ScreenshotRole): readonly Platform[] {
  const platform = getRolePlatform(role);
  return platform ? [platform] : [];
}

/** The one store a placement belongs to, or undefined for a screenshot. */
export function getRolePlatform(role: ScreenshotRole): Platform | undefined {
  return role === "screenshot"
    ? undefined
    : SCREENSHOT_ROLE_SPECS[role].platform;
}

/** The placements the given store takes, one of each. */
export function getRolesForPlatform(
  platform: Platform,
): Exclude<ScreenshotRole, "screenshot">[] {
  return (Object.keys(SCREENSHOT_ROLE_SPECS) as Exclude<
    ScreenshotRole,
    "screenshot"
  >[]).filter((role) => SCREENSHOT_ROLE_SPECS[role].platform === platform);
}

export function getRoleLabel(role: ScreenshotRole): string {
  return role === "screenshot"
    ? "Screenshot"
    : SCREENSHOT_ROLE_SPECS[role].label;
}

/**
 * The canvas a screenshot renders at. A placement ignores the platform's
 * dimensions — that is the whole point of it — and a screenshot uses the
 * platform's own.
 *
 * Preview and export must both derive dimensions from here: phone-frame
 * geometry scales from the canvas width, so a mismatch breaks WYSIWYG.
 */
export function getScreenshotDimensions(
  screenshot: { role: ScreenshotRole },
  platformDimensions: Readonly<Dimensions>,
): Readonly<Dimensions> {
  return screenshot.role === "screenshot"
    ? platformDimensions
    : SCREENSHOT_ROLE_SPECS[screenshot.role].dimensions;
}
