/**
 * Screenshot type
 */

import type { Layer } from "./layers.ts";

export interface Screenshot {
  /** Unique identifier for this screenshot */
  id: string;
  /** Human-readable display name */
  name?: string;
  /** Role determines layout and styling */
  role: "screenshot" | "feature-graphic";
  /** List of layers for this screenshot */
  layers: Layer[];
}
