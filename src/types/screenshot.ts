/**
 * Screenshot type
 */

import type { Layer } from "./layers.ts";

/**
 * Role determines canvas size and layout: a store screenshot, or one of the
 * fixed-size assets a store asks for separately from screenshots.
 *
 * `SCREENSHOT_ROLE_SPECS` (`@lib`) is what gives a role its canvas, its store
 * and its name; this union only says which roles exist.
 */
export type ScreenshotRole =
  | "screenshot"
  | "feature-graphic"
  | "product-page-header"
  | "search-result";

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
