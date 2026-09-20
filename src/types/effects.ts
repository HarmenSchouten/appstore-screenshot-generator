/**
 * Visual effect types - shape vocabulary
 *
 * Glow and shape layer props live in layers.ts (GlowLayerProps, ShapeLayerProps).
 * Shape types are grouped into families: a family shares one set of optional
 * props (see the per-family `*ShapeProps` in layers.ts) and one editor panel.
 */

// ============================================================
// Shapes
// ============================================================

export type BasicShapeType = "circle" | "ring" | "rectangle" | "pill";
export type LineShapeType = "curved-line" | "s-curve" | "wave-line";
export type ArrowShapeType = "chevron" | "double-chevron" | "arrow";
export type GeometricShapeType =
  | "triangle"
  | "diamond"
  | "hexagon"
  | "star"
  | "sparkle"
  | "cross";
export type OrganicShapeType = "blob" | "crescent";
export type PatternShapeType = "dots-grid" | "scattered-dots";

/** Available shape types for decorative elements */
export type ShapeType =
  | BasicShapeType
  | LineShapeType
  | ArrowShapeType
  | GeometricShapeType
  | OrganicShapeType
  | PatternShapeType;

export type ShapeFamily =
  | "basic"
  | "line"
  | "arrow"
  | "geometric"
  | "organic"
  | "pattern";

/** How a shape is painted: always solid, always an outline, or the user's choice. */
export type ShapePaint = "fill" | "stroke" | "toggle";

export type LineOrientation =
  | "horizontal"
  | "vertical"
  | "diagonal-down"
  | "diagonal-up";
export type LineDashStyle = "solid" | "dashed" | "dotted";
export type LineCap = "round" | "square" | "butt";
export type ArrowDirection = "up" | "down" | "left" | "right";
