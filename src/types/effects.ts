/**
 * Visual effect types - Glows and Shapes
 */

// ============================================================
// Glow Effects
// ============================================================

export type GlowColor =
  | "purple"
  | "blue"
  | "pink"
  | "cyan"
  | "amber"
  | "green"
  | "red"
  | "orange"
  | "white";

export interface GlowEffect {
  /** Color - can be a GlowColor name or hex value */
  color: string;
  /** Size of the glow in pixels */
  size: number;
  /** Position from top (CSS value) */
  top?: string;
  /** Position from right (CSS value) */
  right?: string;
  /** Position from bottom (CSS value) */
  bottom?: string;
  /** Position from left (CSS value) */
  left?: string;
}

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

/** Decorative shape configuration */
export interface Shape {
  /** Shape type */
  type: ShapeType;

  /** Size as percentage of container width (1-500) */
  size: number;
  /** Color (hex) */
  color: string;
  /** Opacity (0-1) */
  opacity?: number;
  /** Blur amount in pixels (0-50) */
  blur?: number;
  /** Rotation angle in degrees (-180 to 180) */
  rotation?: number;
  /** Z-index (0=behind phone, 5=default, 10=above) */
  zIndex?: number;

  /** X position as percentage (0=left, 50=center, 100=right) */
  posX?: number;
  /** Y position as percentage (0=top, 50=center, 100=bottom) */
  posY?: number;

  /** Filled shape vs outline only */
  filled?: boolean;
  /** Stroke width for outlines (1-20) */
  strokeWidth?: number;
  /** Border radius for rectangles (0-50) */
  borderRadius?: number;

  // Line-specific properties
  /** Line orientation preset - simplifies configuration */
  orientation?: "horizontal" | "vertical" | "diagonal-down" | "diagonal-up";
  /** Curvature amount (-100 to 100, negative curves opposite direction) */
  curvature?: number;

  // Advanced line positioning (optional, overrides orientation)
  /** Start X position as percentage (0-100) */
  startX?: number;
  /** Start Y position as percentage (0-100) */
  startY?: number;
  /** End X position as percentage (0-100) */
  endX?: number;
  /** End Y position as percentage (0-100) */
  endY?: number;
  /** Line dash style */
  dashStyle?: "solid" | "dashed" | "dotted";
  /** Line cap style */
  lineCap?: "round" | "square" | "butt";

  // Chevron-specific properties
  /** Direction chevron points to */
  direction?: "up" | "down" | "left" | "right";
  /** Chevron angle in degrees (30-120) */
  angle?: number;
  /** Number of stacked shapes (1-4) */
  count?: number;
  /** Gap between stacked shapes in pixels */
  gap?: number;

  // Star/sparkle-specific properties
  /** Number of points (4-8) */
  points?: number;
  /** Inner radius ratio (0.2-0.8) */
  innerRadius?: number;

  // Pattern-specific properties
  /** Number of rows for grid patterns */
  rows?: number;
  /** Number of columns for grid patterns */
  columns?: number;
  /** Spacing between pattern elements */
  spacing?: number;
  /** Size of individual dots in patterns */
  dotSize?: number;

  // Blob-specific properties
  /** Complexity/number of control points (3-8) */
  complexity?: number;
  /** Random seed for reproducible blobs */
  seed?: number;

  // Crescent-specific properties
  /** Arc percentage for crescents (10-90) */
  arcPercentage?: number;
}
