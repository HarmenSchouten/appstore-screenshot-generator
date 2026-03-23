import { DEVICE_PRESETS } from "@device-presets";
import type { ShapeType, TypographyOptions } from "@types";

interface BaseLayerProps {
  id: string;
  opacity: number;
}

interface PositionalLayerProps {
  posX: number;
  posY: number;
  rotation: number;
}

// ============================================================
// Text Layers
// ============================================================

/** A single text element — labels, badges, callouts */
export interface TextLayerProps
  extends BaseLayerProps, PositionalLayerProps, TypographyOptions {
  type: "text";
  /** The text to display */
  text: string;
}

// ============================================================
// Device & Image Layers
// ============================================================

/** A device phone frame with a screenshot inside */
export interface PhoneFrameLayerProps
  extends BaseLayerProps, PositionalLayerProps {
  type: "phone-frame";
  /** Device preset to render */
  model: keyof typeof DEVICE_PRESETS;
  /** Path to the screenshot image shown inside the frame (relative to assets) */
  imagePath?: string;
  /** Phone size as percentage of container width (e.g. 70 for single, 42 for side-by-side) */
  scale?: number;
}

/** An image at any position and size */
export interface ImageLayerProps extends BaseLayerProps, PositionalLayerProps {
  type: "image";
  /** Path to image (relative to assets) */
  imagePath: string;
  /** Size as percentage of container width */
  size: number;
  /** Border radius as percentage (0 = sharp, 50 = circular) */
  borderRadius?: number;
  /** How the image fills its container */
  objectFit?: "cover" | "contain" | "fill";
}

// ============================================================
// Effect Layers
// ============================================================

/** A colored blurred glow effect */
export interface GlowLayerProps extends BaseLayerProps, PositionalLayerProps {
  type: "glow";
  /** Color — named color or hex value */
  color: string;
  /** Size of the glow in pixels */
  size: number;
  /** Blur amount in pixels (defaults to 80) */
  blur?: number;
}

/** A decorative SVG shape — carries all existing shape properties */
export interface ShapeLayerProps extends BaseLayerProps, PositionalLayerProps {
  type: "shape";
  /** Which shape to render */
  shapeType: ShapeType;
  /** Size of the shape in pixels */
  size: number;
  /** Color (hex) */
  color: string;
  /** Blur amount in pixels (0–50) */
  blur?: number;
  /** Filled shape vs outline only */
  filled?: boolean;
  /** Stroke width for outlines (1–20) */
  strokeWidth?: number;
  /** Border radius for rectangles (0–50) */
  borderRadius?: number;

  // Line-specific
  /** Line orientation preset */
  orientation?: "horizontal" | "vertical" | "diagonal-down" | "diagonal-up";
  /** Curvature amount (−100 to 100) */
  curvature?: number;
  /** Start X position as percentage (0–100) */
  startX?: number;
  /** Start Y position as percentage (0–100) */
  startY?: number;
  /** End X position as percentage (0–100) */
  endX?: number;
  /** End Y position as percentage (0–100) */
  endY?: number;
  /** Line dash style */
  dashStyle?: "solid" | "dashed" | "dotted";
  /** Line cap style */
  lineCap?: "round" | "square" | "butt";

  // Chevron-specific
  /** Direction chevron points to */
  direction?: "up" | "down" | "left" | "right";
  /** Chevron angle in degrees (30–120) */
  angle?: number;
  /** Number of stacked shapes (1–4) */
  count?: number;
  /** Gap between stacked shapes in pixels */
  gap?: number;

  // Star / sparkle-specific
  /** Number of points (4–8) */
  points?: number;
  /** Inner radius ratio (0.2–0.8) */
  innerRadius?: number;

  // Pattern-specific
  /** Number of rows for grid patterns */
  rows?: number;
  /** Number of columns for grid patterns */
  columns?: number;
  /** Spacing between pattern elements */
  spacing?: number;
  /** Size of individual dots in patterns */
  dotSize?: number;

  // Blob-specific
  /** Complexity / number of control points (3–8) */
  complexity?: number;
  /** Random seed for reproducible blobs */
  seed?: number;

  // Crescent-specific
  /** Arc percentage for crescents (10–90) */
  arcPercentage?: number;
}

// ============================================================
// Background Layer
// ============================================================

/** Full-canvas gradient background — ignores posX/posY/rotation, always fills */
export interface BackgroundLayerProps extends BaseLayerProps {
  type: "background";
  /** CSS gradient string. Empty/undefined = inherit from project theme. */
  gradient?: string;
  /** Gradient type for visual editing */
  gradientType?: "solid" | "linear" | "radial";
  /** Gradient color stops for visual editing */
  colors?: string[];
  /** Gradient direction in degrees (0 = top→bottom, 90 = left→right) */
  direction?: number;
}

// ============================================================
// Union
// ============================================================

/** A layer can be one of several layer types, discriminated by the `type` property */
export type Layer =
  | TextLayerProps
  | PhoneFrameLayerProps
  | ImageLayerProps
  | GlowLayerProps
  | ShapeLayerProps
  | BackgroundLayerProps;
