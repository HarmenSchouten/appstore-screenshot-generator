/**
 * What every screenshot role means, in one table.
 *
 * The roles are the placements a store asks for: the screenshots themselves,
 * plus the assets it takes separately and at a fixed size. Asking whether a
 * role is one-per-platform, which store it belongs to, what canvas it renders
 * at and what to call it used to be a `role === "feature-graphic"` branch in
 * each of those places. They all read this table now, so a store launching a
 * new placement is an entry here rather than an edit in six files.
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
  /** Fixed canvas; omitted means the role uses the platform's dimensions. */
  dimensions?: Readonly<Dimensions>;
  /** The stores this placement exists in. */
  platforms: readonly Platform[];
  /** At most one per platform — Play's feature graphic, Apple's header. */
  unique: boolean;
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

export const SCREENSHOT_ROLE_SPECS: Record<
  ScreenshotRole,
  ScreenshotRoleSpec
> = {
  screenshot: {
    label: "Screenshots",
    platforms: ["android", "ios"],
    unique: false,
  },
  "feature-graphic": {
    label: "Feature Graphic",
    dimensions: FEATURE_GRAPHIC_SIZE,
    platforms: ["android"],
    unique: true,
  },
  "product-page-header": {
    label: "Product Page Header",
    dimensions: PRODUCT_PAGE_HEADER_SIZE,
    platforms: ["ios"],
    unique: true,
  },
  "search-result": {
    label: "Search Results",
    dimensions: SEARCH_RESULT_SIZE,
    platforms: ["ios"],
    unique: true,
  },
};

/** The stores a placement belongs to; none for a plain screenshot. */
export function getRolePlatforms(role: ScreenshotRole): readonly Platform[] {
  return role === "screenshot" ? [] : SCREENSHOT_ROLE_SPECS[role].platforms;
}

/** The stores that have a one-per-platform placement to show the user. */
export function getUniqueRolesForPlatform(
  platform: Platform,
): ScreenshotRole[] {
  return (Object.keys(SCREENSHOT_ROLE_SPECS) as ScreenshotRole[])
    .filter((role) =>
      role !== "screenshot" && SCREENSHOT_ROLE_SPECS[role].platforms
        .includes(platform)
    );
}

export function isUniqueScreenshotRole(role: ScreenshotRole): boolean {
  return SCREENSHOT_ROLE_SPECS[role].unique;
}

export function getRoleLabel(role: ScreenshotRole): string {
  return role === "screenshot"
    ? "Screenshot"
    : SCREENSHOT_ROLE_SPECS[role].label;
}

/**
 * The canvas a screenshot renders at. A role with a fixed size ignores the
 * platform's dimensions — that is the whole point of the feature graphic and
 * of Apple's header — and a screenshot uses the platform's own.
 *
 * Preview and export must both derive dimensions from here: phone-frame
 * geometry scales from the canvas width, so a mismatch breaks WYSIWYG.
 */
export function getScreenshotDimensions(
  screenshot: { role: ScreenshotRole },
  platformDimensions: Readonly<Dimensions>,
): Readonly<Dimensions> {
  return SCREENSHOT_ROLE_SPECS[screenshot.role].dimensions ??
    platformDimensions;
}
