/**
 * The fixed-size placements each store takes besides screenshots, one of each
 * per platform. A plain screenshot has no entry: its canvas comes from the
 * language config.
 *
 * Sizes are the stores' published figures:
 * developer.apple.com/help/app-store-connect/reference/app-information/creative-assets-specifications
 * support.google.com/googleplay/android-developer/answer/9866151
 */

import type {
  Dimensions,
  PlacementRole,
  Platform,
  ScreenshotRole,
} from "@app-types";

export interface ScreenshotRoleSpec {
  /** Sidebar heading, and the name of an unnamed result. */
  label: string;
  dimensions: Readonly<Dimensions>;
  platform: Platform;
}

export const FEATURE_GRAPHIC_SIZE: Readonly<Dimensions> = {
  width: 1024,
  height: 500,
};

/** 21:9. Apple's 16:9 alternative is a separate asset covering both placements. */
export const PRODUCT_PAGE_HEADER_SIZE: Readonly<Dimensions> = {
  width: 3840,
  height: 1646,
};

/** 3:2, the largest size Apple accepts. */
export const SEARCH_RESULT_SIZE: Readonly<Dimensions> = {
  width: 3840,
  height: 2560,
};

export const SCREENSHOT_ROLE_SPECS: Record<PlacementRole, ScreenshotRoleSpec> =
  {
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

/** The store a placement belongs to; undefined for a plain screenshot. */
export function getRolePlatform(role: ScreenshotRole): Platform | undefined {
  return role === "screenshot"
    ? undefined
    : SCREENSHOT_ROLE_SPECS[role].platform;
}

export function getRolesForPlatform(platform: Platform): PlacementRole[] {
  return (Object.keys(SCREENSHOT_ROLE_SPECS) as PlacementRole[])
    .filter((role) => SCREENSHOT_ROLE_SPECS[role].platform === platform);
}

export function getRoleLabel(role: ScreenshotRole): string {
  return role === "screenshot"
    ? "Screenshot"
    : SCREENSHOT_ROLE_SPECS[role].label;
}

/**
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
