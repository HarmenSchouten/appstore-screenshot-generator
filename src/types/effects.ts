/**
 * Visual effect types - Shape type enum
 *
 * Glow and shape layer props live in layers.ts (GlowLayerProps, ShapeLayerProps).
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
