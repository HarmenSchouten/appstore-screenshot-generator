/**
 * Screenshot type
 */

import type { Layer } from "@types";

export interface Screenshot {
  /** Unique identifier for this screenshot */
  id: string;
  /** Role determines layout and styling */
  role: "screenshot" | "feature-graphic";
  /** List of layers for this screenshot */
  layers: Layer[];
}
