/**
 * Pure SVG geometry for ShapeLayer (#71). Everything is in the layer's
 * `0 0 100 100` viewBox; the layer's `size` scales it.
 */

import type {
  ArrowDirection,
  LineCap,
  LineDashStyle,
  LineOrientation,
} from "@app-types";
import { seededRandom } from "@renderer/utils.ts";

export const CENTER = 50;
/** Outer radius of a full-size shape: the 5-unit margin keeps strokes inside the box. */
export const RADIUS = 45;

/** SVG angles: degrees clockwise from +x. */
export const DIRECTION_ANGLE: Record<ArrowDirection, number> = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
};

export const DASH_ARRAY: Record<LineDashStyle, string | undefined> = {
  solid: undefined,
  dashed: "10 5",
  dotted: "2 4",
};

const rad = (deg: number) => deg * Math.PI / 180;

function vertex(r: number, deg: number): string {
  return `${CENTER + Math.cos(rad(deg)) * r},${
    CENTER + Math.sin(rad(deg)) * r
  }`;
}

// ── Paint ───────────────────────────────────────────────────

interface Painted {
  color: string;
  filled: boolean;
  strokeWidth: number;
}

/** Paint for a closed shape: solid, or an outline of `strokeWidth`. */
export function fillOrStroke(
  { color, filled, strokeWidth }: Painted,
  linejoin?: "round",
) {
  return filled
    ? { fill: color }
    : { fill: "none", stroke: color, strokeWidth, strokeLinejoin: linejoin };
}

/** Stroke paint for a `<line>`, which has nothing to fill. */
export function lineStroke(
  { color, strokeWidth }: Pick<Painted, "color" | "strokeWidth">,
  lineCap?: LineCap,
) {
  return { stroke: color, strokeWidth, strokeLinecap: lineCap };
}

/** Paint for an open path or an outline-only shape: no fill, just the stroke. */
export function strokeOnly(
  painted: Pick<Painted, "color" | "strokeWidth">,
  lineCap?: LineCap,
) {
  return { fill: "none", ...lineStroke(painted, lineCap) };
}

// ── Polygons ────────────────────────────────────────────────

/** Vertices of a regular n-gon of radius r, the first at `offsetDeg`. */
export function polygonPoints(n: number, r: number, offsetDeg: number): string {
  return Array.from({ length: n }, (_, i) => vertex(r, offsetDeg + i * 360 / n))
    .join(" ");
}

/** Vertices of an n-pointed star alternating outer and inner radius. */
export function starPoints(
  n: number,
  outerR: number,
  innerR: number,
  offsetDeg = -90,
): string {
  return Array.from(
    { length: n * 2 },
    (_, i) => vertex(i % 2 === 0 ? outerR : innerR, offsetDeg + i * 180 / n),
  ).join(" ");
}

// ── Lines ───────────────────────────────────────────────────

export interface LineEnds {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const LINE_ENDS: Record<LineOrientation, LineEnds> = {
  horizontal: { startX: 10, startY: 50, endX: 90, endY: 50 },
  vertical: { startX: 50, startY: 10, endX: 50, endY: 90 },
  "diagonal-down": { startX: 10, startY: 10, endX: 90, endY: 90 },
  "diagonal-up": { startX: 10, startY: 90, endX: 90, endY: 10 },
};

/** Quadratic curve bending by `curvature` on the axis the orientation implies. */
export function curvePath(
  { startX, startY, endX, endY }: LineEnds,
  curvature: number,
  orientation: LineOrientation,
): string {
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const [cpX, cpY] = orientation === "vertical"
    ? [midX - curvature, midY]
    : [midX, midY - curvature];
  return `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;
}

/** Cubic S-curve; a negative `curvature` flips which way it bends first. */
export function sCurvePath(
  { startX, startY, endX, endY }: LineEnds,
  curvature: number,
): string {
  const amount = Math.abs(curvature);
  const flip = curvature < 0 ? -1 : 1;
  const cp1X = startX + (endX - startX) * 0.3;
  const cp1Y = startY - amount * flip;
  const cp2X = startX + (endX - startX) * 0.7;
  const cp2Y = endY + amount * flip;
  return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
}

/** `waves` half-period arcs along the line's X span at `startY`. */
export function wavePath(
  { startX, startY, endX }: LineEnds,
  waves: number,
  curvature: number,
): string {
  const amplitude = Math.abs(curvature);
  const flip = curvature < 0 ? -1 : 1;
  const segmentWidth = (endX - startX) / waves;
  let path = `M ${startX} ${startY}`;
  for (let i = 0; i < waves; i++) {
    const x1 = startX + segmentWidth * i + segmentWidth * 0.5;
    const y1 = i % 2 === 0
      ? startY - amplitude * flip
      : startY + amplitude * flip;
    const x2 = startX + segmentWidth * (i + 1);
    path += ` Q ${x1} ${y1}, ${x2} ${startY}`;
  }
  return path;
}

// ── Arrows ──────────────────────────────────────────────────

export interface Point {
  x: number;
  y: number;
}

export const ORIGIN: Point = { x: CENTER, y: CENTER };

/** `origin` moved by `distance` along `dirDeg` (negative = against it). */
export function offset(
  dirDeg: number,
  distance: number,
  origin?: Point,
): Point {
  const x = Math.cos(rad(dirDeg)) * distance;
  const y = Math.sin(rad(dirDeg)) * distance;
  return origin ? { x: origin.x + x, y: origin.y + y } : { x, y };
}

/** Two strokes of `len` meeting at `apex`, opening away from `dirDeg`. */
export function chevronPath(
  apex: Point,
  dirDeg: number,
  halfAngleDeg: number,
  len: number,
): string {
  const a1 = rad(dirDeg + halfAngleDeg);
  const a2 = rad(dirDeg - halfAngleDeg);
  return `M ${apex.x - Math.cos(a1) * len} ${
    apex.y - Math.sin(a1) * len
  } L ${apex.x} ${apex.y} L ${apex.x - Math.cos(a2) * len} ${
    apex.y - Math.sin(a2) * len
  }`;
}

// ── Organic ─────────────────────────────────────────────────

/** Closed smooth path through `complexity` points jittered by `seed`. */
export function blobPath(
  complexity: number,
  seed: number,
  r = 40,
  variation = 10,
): string {
  const points = Array.from({ length: complexity }, (_, i) => {
    const angle = (i / complexity) * Math.PI * 2;
    const radius = r + (seededRandom(seed + i) - 0.5) * variation * 2;
    return {
      x: CENTER + Math.cos(angle) * radius,
      y: CENTER + Math.sin(angle) * radius,
    };
  });
  const at = (i: number) => points[(i + points.length) % points.length];
  let path = `M ${at(0).x} ${at(0).y}`;
  for (let i = 0; i < points.length; i++) {
    const prev = at(i - 1);
    const p = at(i);
    const next = at(i + 1);
    const afterNext = at(i + 2);
    const cp1 = {
      x: p.x + (next.x - prev.x) * 0.2,
      y: p.y + (next.y - prev.y) * 0.2,
    };
    const cp2 = {
      x: next.x - (afterNext.x - p.x) * 0.2,
      y: next.y - (afterNext.y - p.y) * 0.2,
    };
    path += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${next.x} ${next.y}`;
  }
  return `${path} Z`;
}

// ── Patterns ────────────────────────────────────────────────

export interface Dot {
  x: number;
  y: number;
  r: number;
}

/** rows × cols dots on a `spacing` grid centred in the box. */
export function gridDots(
  rows: number,
  cols: number,
  spacing: number,
  dotSize: number,
): Dot[] {
  const sx = CENTER - ((cols - 1) * spacing) / 2;
  const sy = CENTER - ((rows - 1) * spacing) / 2;
  const dots: Dot[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      dots.push({ x: sx + col * spacing, y: sy + row * spacing, r: dotSize });
    }
  }
  return dots;
}

/** `count` dots scattered by `seed` inside a 10-unit margin, radius 0.5–1.5 × dotSize. */
export function scatteredDots(
  count: number,
  dotSize: number,
  seed: number,
): Dot[] {
  return Array.from({ length: count }, (_, i) => ({
    x: 10 + seededRandom(seed + i * 2) * 80,
    y: 10 + seededRandom(seed + i * 2 + 1) * 80,
    r: dotSize * (0.5 + seededRandom(seed + i * 3)),
  }));
}
