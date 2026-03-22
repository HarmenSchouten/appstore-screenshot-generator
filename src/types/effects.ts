/**
 * Visual effect types - Shape type enum
 *
 * Note: GlowEffect and Shape interfaces have been replaced by
 * GlowLayerProps and ShapeLayerProps in layers.ts.
 * GlowColor is now inlined in the Glow renderer constants.
 */

// ============================================================
// Shapes
// ============================================================

/** Available shape types for decorative elements */
export type ShapeType =
  // Basic shapes
  | "circle"
  | "ring"
  | "rectangle"
  | "pill"
  // Lines & Curves
  | "curved-line"
  | "s-curve"
  | "wave-line"
  // Arrows & Chevrons
  | "chevron"
  | "double-chevron"
  | "arrow"
  // Geometric
  | "triangle"
  | "diamond"
  | "hexagon"
  | "star"
  | "sparkle"
  | "cross"
  // Organic
  | "blob"
  | "crescent"
  // Patterns
  | "dots-grid"
  | "scattered-dots";
