/**
 * Screenshot type
 */

import type { Layer } from "./layers.ts";

/** A store screenshot, or one of the fixed-size placements in `SCREENSHOT_ROLE_SPECS`. */
export type ScreenshotRole =
  | "screenshot"
  | "feature-graphic"
  | "product-page-header"
  | "search-result";

/** Every role but a plain screenshot. */
export type PlacementRole = Exclude<ScreenshotRole, "screenshot">;

export interface Screenshot {
  /** Unique identifier for this screenshot */
  id: string;
  /** Human-readable display name */
  name?: string;
  /** Role determines layout and styling */
  role: ScreenshotRole;
  /** List of layers for this screenshot */
  layers: Layer[];
}
