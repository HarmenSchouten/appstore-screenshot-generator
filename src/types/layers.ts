import type { DevicePresetId } from "./device.ts";
import type {
  ArrowDirection,
  ArrowShapeType,
  BasicShapeType,
  GeometricShapeType,
  LineCap,
  LineDashStyle,
  LineOrientation,
  LineShapeType,
  OrganicShapeType,
  PatternShapeType,
} from "./effects.ts";
import type { TypographyOptions } from "./typography.ts";

export interface BaseLayerProps {
  id: string;
  opacity: number;
}

/** Where a layer sits: centred on (posX, posY) percent of the canvas, rotated in degrees. */
export interface PositionalLayerProps {
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
  /** Device preset to render. Omitted = inherit the platform's default device. */
  model?: DevicePresetId;
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
  /** Border radius in pixels (0 = sharp corners) */
  borderRadius?: number;
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

// ============================================================
// Shape Layers — one interface per family
// ============================================================

/**
 * What every shape carries. `filled` and `strokeWidth` sit here rather than
 * on the families that use them because all but the patterns read at least
 * one of them; which shapes expose the toggle is `SHAPE_META[type].paint`.
 */
interface ShapeBaseProps extends BaseLayerProps, PositionalLayerProps {
  type: "shape";
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
}

/** circle, ring, rectangle, pill */
export interface BasicShapeProps extends ShapeBaseProps {
  shapeType: BasicShapeType;
  /** Corner radius for rectangles (0–50, in viewBox units) */
  borderRadius?: number;
}

/** curved-line, s-curve, wave-line */
export interface LineShapeProps extends ShapeBaseProps {
  shapeType: LineShapeType;
  /** Line orientation preset; also picks the axis a curve bends on */
  orientation?: LineOrientation;
  /** Curvature amount (−100 to 100) */
  curvature?: number;
  /** Custom endpoints (0–100 %); both X values set = orientation preset ignored */
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  /** Line dash style */
  dashStyle?: LineDashStyle;
  /** Line cap style */
  lineCap?: LineCap;
  /** Number of waves (wave-line) */
  count?: number;
}

/** chevron, double-chevron, arrow */
export interface ArrowShapeProps extends ShapeBaseProps {
  shapeType: ArrowShapeType;
  /** Direction the shape points to */
  direction?: ArrowDirection;
  /** Chevron opening angle in degrees (30–120) */
  angle?: number;
  /** Gap between the two chevrons (double-chevron) */
  gap?: number;
  /** Line cap style */
  lineCap?: LineCap;
}

/** triangle, diamond, hexagon, star, sparkle, cross */
export interface GeometricShapeProps extends ShapeBaseProps {
  shapeType: GeometricShapeType;
  /** Number of points (star) */
  points?: number;
  /** Inner radius ratio (star, 0.2–0.8) */
  innerRadius?: number;
  /** Line cap style for an outlined cross */
  lineCap?: LineCap;
}

/** blob, crescent */
export interface OrganicShapeProps extends ShapeBaseProps {
  shapeType: OrganicShapeType;
  /** Complexity / number of control points (blob, 3–8) */
  complexity?: number;
  /** Random seed for reproducible blobs */
  seed?: number;
  /** Inner radius ratio of the bite (crescent) */
  innerRadius?: number;
}

/** dots-grid, scattered-dots */
export interface PatternShapeProps extends ShapeBaseProps {
  shapeType: PatternShapeType;
  /** Rows (dots-grid) */
  rows?: number;
  /** Columns (dots-grid) */
  columns?: number;
  /** Spacing between dots (dots-grid) */
  spacing?: number;
  /** Radius of one dot */
  dotSize?: number;
  /** Number of dots (scattered-dots) */
  count?: number;
  /** Random seed for reproducible scatter */
  seed?: number;
}

/** A decorative SVG shape, discriminated by `shapeType` into its family */
export type ShapeLayerProps =
  | BasicShapeProps
  | LineShapeProps
  | ArrowShapeProps
  | GeometricShapeProps
  | OrganicShapeProps
  | PatternShapeProps;

/** The family member of `ShapeLayerProps` whose `shapeType` includes `T`. */
export type ShapePropsFor<T extends ShapeLayerProps["shapeType"]> = MemberFor<
  ShapeLayerProps,
  T
>;
type MemberFor<M, T> = M extends { shapeType: infer S }
  ? T extends S ? M : never
  : never;

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
