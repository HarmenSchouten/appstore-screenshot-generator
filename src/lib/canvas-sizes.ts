/**
 * The canvas sizes each store accepts, as a pick list.
 *
 * A language's screenshots all render at one size (`dimensions` on the
 * platform config), which was only ever hand-editable in `config.json`. These
 * are the sizes the stores publish, so picking a display class or a foldable
 * is a choice rather than arithmetic.
 *
 * Portrait only: every device preset in this repo is portrait, and a
 * landscape canvas would render the same frames sideways. Apple's landscape
 * sizes are each portrait's transposed and can be written by hand.
 */

import type { Dimensions, Platform } from "@app-types";

export interface CanvasSizePreset {
  id: string;
  /** Shown in the picker; carries the pixels so the list is self-describing. */
  label: string;
  dimensions: Dimensions;
}

/**
 * Apple's accepted iPhone screenshot sizes, portrait:
 * developer.apple.com/help/app-store-connect/reference/app-information/
 *   screenshot-specifications
 *
 * Labelled by pixel size rather than by display class: Apple lists several
 * sizes per group and does not name a model against each, so a guess at which
 * iPhone a size belongs to would be wrong more often than not.
 */
const IOS_SIZES: readonly CanvasSizePreset[] = [
  // The foldable's two displays, which are the reason the two Duo presets
  // exist as well. 2007 × 2853 is the 7.6" inner, 1398 × 2034 the 5.4" outer.
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
];

/**
 * Play takes any size from 320 to 3840 px on each side, so these are
 * common handset densities rather than a list the store imposes.
 * support.google.com/googleplay/android-developer/answer/9866151
 */
const ANDROID_SIZES: readonly CanvasSizePreset[] = [
  {
    id: "android-1080x1920",
    label: "1080 × 1920",
    dimensions: { width: 1080, height: 1920 },
  },
  {
    id: "android-1080x2400",
    label: "1080 × 2400",
    dimensions: { width: 1080, height: 2400 },
  },
  {
    id: "android-1440x3120",
    label: "1440 × 3120",
    dimensions: { width: 1440, height: 3120 },
  },
  {
    id: "android-1440x3200",
    label: "1440 × 3200",
    dimensions: { width: 1440, height: 3200 },
  },
  {
    id: "android-2160x3840",
    label: "2160 × 3840",
    dimensions: { width: 2160, height: 3840 },
  },
];

export const CANVAS_SIZE_PRESETS: Readonly<
  Record<Platform, readonly CanvasSizePreset[]>
> = {
  ios: IOS_SIZES,
  android: ANDROID_SIZES,
};

/**
 * The preset matching a canvas, or null for a size the store does not list —
 * a hand-edited `config.json` keeps working, it just shows as the first entry
 * rather than pretending to be one of these.
 */
export function findCanvasSizePreset(
  platform: Platform,
  dimensions: Readonly<Dimensions>,
): CanvasSizePreset | null {
  return CANVAS_SIZE_PRESETS[platform].find((p) =>
    p.dimensions.width === dimensions.width &&
    p.dimensions.height === dimensions.height
  ) ?? null;
}
