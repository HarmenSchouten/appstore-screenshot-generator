/**
 * Screenshot type
 */

import type { Layer } from "./layers.ts";

/** Role determines canvas size and layout: store screenshot vs. Play feature graphic */
export type ScreenshotRole = "screenshot" | "feature-graphic";

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
