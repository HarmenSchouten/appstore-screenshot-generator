/**
 * Layer defaults — the one table the renderer, the editors and layer
 * creation all read (#71). A renderer fallback, an editor's initial slider
 * value and a new layer's seed must agree, or the preview silently shows
 * something the editor does not.
 */

import type {
  ArrowShapeProps,
  BaseLayerProps,
  BasicShapeProps,
  GeometricShapeProps,
  GlowLayerProps,
  ImageLayerProps,
  Layer,
  LineShapeProps,
  OrganicShapeProps,
  PatternShapeProps,
  PhoneFrameLayerProps,
  PositionalLayerProps,
  ShapeFamily,
  ShapeLayerProps,
  ShapePaint,
  ShapePropsFor,
  ShapeType,
  TypographyOptions,
} from "@app-types";

// ============================================================
// Resolving defaults
// ============================================================

/** `P` with every key of `D` made required — the type of `withDefaults(D, P)`. */
export type WithDefaults<P, D> = P extends unknown
  ? Omit<P, keyof D> & Required<Pick<P, Extract<keyof D, keyof P>>>
  : never;

/**
 * `{ ...defaults, ...props }` that lets an explicit `undefined` fall through
 * to the default, the way a destructuring default does. Distributes over a
 * union `props` type so a discriminated layer stays narrowable.
 */
export function withDefaults<P extends object, D extends Partial<P>>(
  defaults: D,
  props: P,
): WithDefaults<P, D> {
  const out: Record<string, unknown> = { ...defaults };
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) out[key] = value;
  }
  return out as WithDefaults<P, D>;
}

// ============================================================
// Per-type defaults
// ============================================================

/** Where a new layer lands and how it is oriented. */
export const POSITION_DEFAULTS: Readonly<
  PositionalLayerProps & Pick<BaseLayerProps, "opacity">
> = { posX: 50, posY: 50, rotation: 0, opacity: 1 };

const TEXT_DEFAULTS = {
  fontSize: 48,
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: 0,
  textColor: "#ffffff",
  textAlign: "center",
  textTransform: "none",
  horizontalPadding: 6,
} satisfies Required<TypographyOptions>;

const PHONE_FRAME_DEFAULTS = {
  scale: 70,
} satisfies Partial<PhoneFrameLayerProps>;

const IMAGE_DEFAULTS = {
  size: 20,
  borderRadius: 0,
} satisfies Partial<ImageLayerProps>;

const GLOW_DEFAULTS = {
  color: "#8b5cf6",
  size: 200,
  blur: 80,
} satisfies Partial<GlowLayerProps>;

const SHAPE_LAYER_DEFAULTS = {
  shapeType: "circle",
  size: 200,
  color: "#ffffff",
} satisfies Partial<BasicShapeProps>;

/**
 * Per layer type: the optional props a renderer falls back on, the values an
 * editor shows for them, and what `createDefaultLayer` writes. Shape geometry
 * has its own per-shape table, `SHAPE_DEFAULTS`.
 */
export const LAYER_DEFAULTS = {
  background: {},
  text: TEXT_DEFAULTS,
  "phone-frame": PHONE_FRAME_DEFAULTS,
  image: IMAGE_DEFAULTS,
  glow: GLOW_DEFAULTS,
  shape: SHAPE_LAYER_DEFAULTS,
} satisfies { [T in Layer["type"]]: Partial<Extract<Layer, { type: T }>> };

// ============================================================
// Shapes
// ============================================================

const SHAPE_COMMON = { blur: 0, filled: false, strokeWidth: 2 };

const BASIC = {
  ...SHAPE_COMMON,
  borderRadius: 0,
} satisfies Partial<BasicShapeProps>;

const LINE = {
  ...SHAPE_COMMON,
  orientation: "horizontal",
  dashStyle: "solid",
  lineCap: "round",
  count: 3,
} satisfies Partial<LineShapeProps>;

const ARROW = {
  ...SHAPE_COMMON,
  direction: "right",
  angle: 45,
  gap: 15,
  lineCap: "round",
} satisfies Partial<ArrowShapeProps>;

const GEOMETRIC = {
  ...SHAPE_COMMON,
  points: 5,
  innerRadius: 0.4,
  lineCap: "round",
} satisfies Partial<GeometricShapeProps>;

const ORGANIC = {
  ...SHAPE_COMMON,
  complexity: 6,
  seed: 1,
  innerRadius: 0.7,
} satisfies Partial<OrganicShapeProps>;

const PATTERN = {
  ...SHAPE_COMMON,
  rows: 4,
  columns: 4,
  spacing: 20,
  count: 12,
  seed: 1,
} satisfies Partial<PatternShapeProps>;

/**
 * Every optional prop of every shape, per shape type. Shapes in a family
 * share an entry unless a value differs (an s-curve bends more than a
 * curved line by default; grid dots are larger than scattered ones).
 */
export const SHAPE_DEFAULTS = {
  circle: BASIC,
  ring: BASIC,
  rectangle: BASIC,
  pill: BASIC,
  "curved-line": { ...LINE, curvature: 30 },
  "s-curve": { ...LINE, curvature: 40 },
  "wave-line": { ...LINE, curvature: 15 },
  chevron: ARROW,
  "double-chevron": ARROW,
  arrow: ARROW,
  triangle: GEOMETRIC,
  diamond: GEOMETRIC,
  hexagon: GEOMETRIC,
  star: GEOMETRIC,
  sparkle: GEOMETRIC,
  cross: GEOMETRIC,
  blob: ORGANIC,
  crescent: ORGANIC,
  "dots-grid": { ...PATTERN, dotSize: 3 },
  "scattered-dots": { ...PATTERN, dotSize: 2 },
} satisfies { [T in ShapeType]: Partial<ShapePropsFor<T>> };

/** `layer` with its family's defaults filled in, typed to that family. */
export type ResolvedShape<L extends ShapeLayerProps> = WithDefaults<
  L,
  (typeof SHAPE_DEFAULTS)[L["shapeType"]]
>;

export function resolveShape<L extends ShapeLayerProps>(
  layer: L,
): ResolvedShape<L> {
  // The entry is keyed by the layer's own shapeType, so it is a Partial of
  // this family; TS cannot relate the two through a generic L, hence the
  // assertion on the merged object.
  return withDefaults(
    SHAPE_DEFAULTS[layer.shapeType] as Partial<ShapeLayerProps>,
    layer as ShapeLayerProps,
  ) as unknown as ResolvedShape<L>;
}

export interface ShapeMeta {
  label: string;
  family: ShapeFamily;
  paint: ShapePaint;
}

/**
 * Display name, family and paint mode per shape. Listed in picker order;
 * `SHAPE_TYPES` and the picker's groups derive from it.
 */
export const SHAPE_META: Record<ShapeType, ShapeMeta> = {
  circle: { label: "Circle", family: "basic", paint: "fill" },
  ring: { label: "Ring", family: "basic", paint: "stroke" },
  rectangle: { label: "Rectangle", family: "basic", paint: "toggle" },
  pill: { label: "Pill", family: "basic", paint: "toggle" },
  "curved-line": { label: "Curved Line", family: "line", paint: "stroke" },
  "s-curve": { label: "S-Curve", family: "line", paint: "stroke" },
  "wave-line": { label: "Wave Line", family: "line", paint: "stroke" },
  chevron: { label: "Chevron", family: "arrow", paint: "stroke" },
  "double-chevron": {
    label: "Double Chevron",
    family: "arrow",
    paint: "stroke",
  },
  arrow: { label: "Arrow", family: "arrow", paint: "stroke" },
  triangle: { label: "Triangle", family: "geometric", paint: "toggle" },
  diamond: { label: "Diamond", family: "geometric", paint: "toggle" },
  hexagon: { label: "Hexagon", family: "geometric", paint: "toggle" },
  star: { label: "Star", family: "geometric", paint: "toggle" },
  sparkle: { label: "Sparkle", family: "geometric", paint: "toggle" },
  cross: { label: "Cross", family: "geometric", paint: "toggle" },
  blob: { label: "Blob", family: "organic", paint: "toggle" },
  crescent: { label: "Crescent", family: "organic", paint: "fill" },
  "dots-grid": { label: "Dots Grid", family: "pattern", paint: "fill" },
  "scattered-dots": {
    label: "Scattered Dots",
    family: "pattern",
    paint: "fill",
  },
};

export const SHAPE_TYPES = Object.keys(SHAPE_META) as ShapeType[];

export const SHAPE_FAMILY_LABELS: Record<ShapeFamily, string> = {
  basic: "Basic",
  line: "Lines & Curves",
  arrow: "Arrows & Chevrons",
  geometric: "Geometric",
  organic: "Organic",
  pattern: "Patterns",
};

/** Whether the stroke-width control applies: an outline is being drawn. */
export function isStroked(shapeType: ShapeType, filled: boolean): boolean {
  const paint = SHAPE_META[shapeType].paint;
  return paint === "stroke" || (paint === "toggle" && !filled);
}
