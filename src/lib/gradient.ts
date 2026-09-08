/**
 * CSS gradient ↔ visual-editor parts.
 *
 * A background layer keeps its background in two forms: structured parts
 * (`gradientType`, `colors`, `direction`) that drive the visual controls, and
 * a raw CSS string for anything those controls cannot express.
 *
 * `buildGradientCSS` goes parts → CSS. `parseGradientCSS` is its inverse and
 * deliberately partial: it decomposes only CSS that `buildGradientCSS` would
 * reproduce with the same rendering, and returns null for everything else so
 * the editor keeps the raw CSS rather than silently rendering something
 * different (#65).
 */

import type { BackgroundLayerProps } from "@app-types";

export type GradientType = NonNullable<BackgroundLayerProps["gradientType"]>;

export interface GradientParts {
  gradientType: GradientType;
  colors: string[];
  direction: number;
}

/** CSS `linear-gradient` default (`to bottom`); also what radial/solid carry. */
export const DEFAULT_GRADIENT_DIRECTION = 180;

/** Build a CSS background string from structured gradient data. */
export function buildGradientCSS(
  gradientType: GradientType,
  colors: string[],
  direction: number,
): string {
  if (colors.length === 0) return "transparent";
  if (gradientType === "solid" || colors.length === 1) return colors[0];
  if (gradientType === "radial") {
    return `radial-gradient(circle, ${colors.join(", ")})`;
  }
  return `linear-gradient(${direction}deg, ${colors.join(", ")})`;
}

// ── Tokenizer ────────────────────────────────────────────────────────

/**
 * Split on commas at parenthesis depth 0. A plain `split(",")` here turned
 * `rgba(0,0,0,.5)` into four "colors". Null on unbalanced parentheses or an
 * empty segment (`a,,b`), both of which mean the CSS is not something we
 * should claim to understand.
 */
function splitOnCommas(input: string): string[] | null {
  const segments: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of input) {
    if (ch === "(") depth++;
    else if (ch === ")" && --depth < 0) return null;
    if (ch === "," && depth === 0) {
      segments.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (depth !== 0) return null;
  segments.push(current.trim());
  return segments.every(Boolean) ? segments : null;
}

/** Split on whitespace at parenthesis depth 0, so `rgb(0 0 0)` stays whole. */
function splitOnSpaces(input: string): string[] | null {
  const tokens: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of input) {
    if (ch === "(") depth++;
    else if (ch === ")" && --depth < 0) return null;
    if (/\s/.test(ch) && depth === 0) {
      if (current) tokens.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (depth !== 0) return null;
  if (current) tokens.push(current);
  return tokens;
}

// ── Token classes ────────────────────────────────────────────────────

const HEX_COLOR = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const COLOR_FUNCTION =
  /^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark|var)\(.*\)$/is;
const NAMED_COLOR = /^[a-z]+$/i;
/** Identifiers that are valid where a color goes but never mean a color. */
const NOT_COLORS = new Set([
  "to",
  "at",
  "circle",
  "ellipse",
  "none",
  "inherit",
  "initial",
  "unset",
  "revert",
]);
const PERCENTAGE = /^-?(?:\d+\.?\d*|\.\d+)%$/;
const DEGREES = /^(-?(?:\d+\.?\d*|\.\d+))deg$/i;
const SIDE_ANGLES: Record<string, number> = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

function isColor(token: string): boolean {
  if (HEX_COLOR.test(token) || COLOR_FUNCTION.test(token)) return true;
  return NAMED_COLOR.test(token) && !NOT_COLORS.has(token.toLowerCase());
}

// ── Parsers ──────────────────────────────────────────────────────────

/**
 * Color stops → colors. Every stop must be `<color>` or `<color> <pct>` where
 * the percentage is the position the browser would assign anyway (evenly
 * spaced from 0% to 100%). Anything else — off-grid positions, double
 * positions, color hints, lengths — changes the rendering, so it is rejected.
 */
function parseStops(segments: string[]): string[] | null {
  if (segments.length < 2) return null;
  const spacing = 100 / (segments.length - 1);
  const colors: string[] = [];
  for (let i = 0; i < segments.length; i++) {
    const tokens = splitOnSpaces(segments[i]);
    if (!tokens || tokens.length === 0 || tokens.length > 2) return null;
    const [color, position] = tokens;
    if (!isColor(color)) return null;
    if (position !== undefined) {
      if (!PERCENTAGE.test(position)) return null;
      const expected = i * spacing;
      if (Math.abs(Number(position.slice(0, -1)) - expected) > 0.01) {
        return null;
      }
    }
    colors.push(color);
  }
  return colors;
}

function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function parseLinear(inner: string): GradientParts | null {
  const segments = splitOnCommas(inner);
  if (!segments) return null;

  let direction = DEFAULT_GRADIENT_DIRECTION;
  const head = segments[0].toLowerCase();
  const angle = head.match(DEGREES);
  const sideWords = head.split(/\s+/);
  if (angle) {
    const deg = Number(angle[1]);
    // The direction slider is integer degrees; keep fractional angles raw
    if (!Number.isInteger(deg)) return null;
    direction = normalizeDegrees(deg);
    segments.shift();
  } else if (sideWords[0] === "to") {
    // Only the four sides map to an exact angle; corners depend on the box
    const side = sideWords.length === 2 ? SIDE_ANGLES[sideWords[1]] : undefined;
    if (side === undefined) return null;
    direction = side;
    segments.shift();
  }

  const colors = parseStops(segments);
  return colors && { gradientType: "linear", colors, direction };
}

function parseRadial(inner: string): GradientParts | null {
  const segments = splitOnCommas(inner);
  // `buildGradientCSS` always emits `circle` centred; the CSS default is an
  // ellipse, and any `at`/size keywords change the shape
  if (!segments || segments[0].toLowerCase() !== "circle") return null;
  const colors = parseStops(segments.slice(1));
  return colors &&
    { gradientType: "radial", colors, direction: DEFAULT_GRADIENT_DIRECTION };
}

/**
 * Decompose a CSS background value into visual-editor parts, or null when
 * it cannot be rebuilt by `buildGradientCSS` with the same rendering:
 * multiple background layers, positional stops off the even spacing,
 * radial shapes/positions, unknown functions, fractional angles.
 */
export function parseGradientCSS(css: string): GradientParts | null {
  const value = css.trim();
  if (!value) return null;

  // `a, b` is two background layers; `a b` is a color plus something else
  const layers = splitOnCommas(value);
  const tokens = splitOnSpaces(value);
  if (!layers || layers.length !== 1 || !tokens || tokens.length !== 1) {
    return null;
  }

  const call = value.match(/^([a-z-]+)\((.*)\)$/is);
  if (call) {
    const [, name, inner] = call;
    switch (name.toLowerCase()) {
      case "linear-gradient":
        return parseLinear(inner);
      case "radial-gradient":
        return parseRadial(inner);
    }
  }

  return isColor(value)
    ? {
      gradientType: "solid",
      colors: [value],
      direction: DEFAULT_GRADIENT_DIRECTION,
    }
    : null;
}
