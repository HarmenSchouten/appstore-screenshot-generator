/**
 * The screenshot canvas sizes each store accepts, as the sidebar's pick list.
 * Portrait only; a landscape size can still be set by hand in `config.json`.
 */

import type { Dimensions, Platform } from "@app-types";

export interface CanvasSizePreset {
  id: string;
  label: string;
  dimensions: Dimensions;
}

/**
 * developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications
 * Labelled by pixels, because Apple lists several sizes per display group.
 */
const IOS_SIZES: readonly CanvasSizePreset[] = [
  {
    id: "ios-1320x2868",
    label: "1320 × 2868",
    dimensions: { width: 1320, height: 2868 },
  },
  {
    id: "ios-1290x2796",
    label: "1290 × 2796",
    dimensions: { width: 1290, height: 2796 },
  },
  {
    id: "ios-1260x2736",
    label: "1260 × 2736",
    dimensions: { width: 1260, height: 2736 },
  },
  {
    id: "ios-1284x2778",
    label: "1284 × 2778",
    dimensions: { width: 1284, height: 2778 },
  },
  {
    id: "ios-1242x2688",
    label: "1242 × 2688",
    dimensions: { width: 1242, height: 2688 },
  },
  {
    id: "ios-1206x2622",
    label: "1206 × 2622",
    dimensions: { width: 1206, height: 2622 },
  },
  {
    id: "ios-1179x2556",
    label: "1179 × 2556",
    dimensions: { width: 1179, height: 2556 },
  },
  {
    id: "ios-duo-inner",
    label: "iPhone Duo · 2007 × 2853",
    dimensions: { width: 2007, height: 2853 },
  },
  {
    id: "ios-duo-outer",
    label: "iPhone Duo · 1398 × 2034",
    dimensions: { width: 1398, height: 2034 },
  },
];

/**
 * support.google.com/googleplay/android-developer/answer/9866151
 * Play takes 320 to 3840 px a side with the long side at most twice the short,
 * so a 20:9 handset size is rejected. 9:16 also qualifies for promotion.
 */
const ANDROID_SIZES: readonly CanvasSizePreset[] = [
  {
    id: "android-1080x1920",
    label: "1080 × 1920",
    dimensions: { width: 1080, height: 1920 },
  },
  {
    id: "android-1440x2560",
    label: "1440 × 2560",
    dimensions: { width: 1440, height: 2560 },
  },
  {
    id: "android-2160x3840",
    label: "2160 × 3840",
    dimensions: { width: 2160, height: 3840 },
  },
  {
    id: "android-1080x2160",
    label: "1080 × 2160",
    dimensions: { width: 1080, height: 2160 },
  },
  {
    id: "android-1440x2880",
    label: "1440 × 2880",
    dimensions: { width: 1440, height: 2880 },
  },
];

export const CANVAS_SIZE_PRESETS: Readonly<
  Record<Platform, readonly CanvasSizePreset[]>
> = {
  ios: IOS_SIZES,
  android: ANDROID_SIZES,
};

/** The preset matching a canvas, or null for a size not on the list. */
export function findCanvasSizePreset(
  platform: Platform,
  dimensions: Readonly<Dimensions>,
): CanvasSizePreset | null {
  return CANVAS_SIZE_PRESETS[platform].find((p) =>
    p.dimensions.width === dimensions.width &&
    p.dimensions.height === dimensions.height
  ) ?? null;
}
