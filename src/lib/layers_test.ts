import { assert, assertEquals, assertNotStrictEquals } from "@std/assert";
import type {
  LineShapeProps,
  PatternShapeProps,
  ShapeLayerProps,
} from "@app-types";
import {
  isStroked,
  LAYER_DEFAULTS,
  resolveShape,
  SHAPE_DEFAULTS,
  SHAPE_META,
  SHAPE_TYPES,
  withDefaults,
} from "./layers.ts";

Deno.test("withDefaults: an explicit undefined falls through, a value wins, extras survive", () => {
  const defaults = { a: 1, b: "x" };
  const out = withDefaults(defaults, {
    a: undefined,
    b: "y",
    c: true,
  } as { a?: number; b?: string; c: boolean });
  assertEquals(out, { a: 1, b: "y", c: true });
  assertNotStrictEquals(out, defaults);
  assertEquals(defaults, { a: 1, b: "x" }, "defaults are not mutated");
});

Deno.test("SHAPE_DEFAULTS and SHAPE_META cover the same shape types", () => {
  assertEquals(
    Object.keys(SHAPE_DEFAULTS).sort(),
    Object.keys(SHAPE_META).sort(),
  );
  assertEquals(SHAPE_TYPES, Object.keys(SHAPE_META));
});

// The drift #71 set out to remove: the editor showed "30" for every line
// while an s-curve without an explicit curvature rendered at 40.
Deno.test("resolveShape: per-shape values within a family", () => {
  const line = (shapeType: LineShapeProps["shapeType"]): LineShapeProps => ({
    id: "l",
    type: "shape",
    shapeType,
    size: 100,
    color: "#fff",
    posX: 50,
    posY: 50,
    rotation: 0,
    opacity: 1,
  });
  assertEquals(resolveShape(line("curved-line")).curvature, 30);
  assertEquals(resolveShape(line("s-curve")).curvature, 40);
  assertEquals(resolveShape(line("wave-line")).curvature, 15);
  assertEquals(
    resolveShape({ ...line("s-curve"), curvature: -5 }).curvature,
    -5,
  );

  const dots = (
    shapeType: PatternShapeProps["shapeType"],
  ): PatternShapeProps => ({
    ...line("curved-line"),
    shapeType,
  } as unknown as PatternShapeProps);
  assertEquals(resolveShape(dots("dots-grid")).dotSize, 3);
  assertEquals(resolveShape(dots("scattered-dots")).dotSize, 2);
});

Deno.test("resolveShape: every shape gets the shared paint defaults", () => {
  for (const shapeType of SHAPE_TYPES) {
    const layer: ShapeLayerProps = {
      id: "s",
      type: "shape",
      shapeType,
      size: 10,
      color: "#000",
      posX: 0,
      posY: 0,
      rotation: 0,
      opacity: 1,
    };
    const s = resolveShape(layer);
    assertEquals(s.blur, 0, shapeType);
    assertEquals(s.filled, false, shapeType);
    assertEquals(s.strokeWidth, 2, shapeType);
  }
});

Deno.test("isStroked: the stroke-width control follows the shape's paint mode", () => {
  assert(isStroked("ring", false));
  assert(isStroked("ring", true), "always stroked, filled is ignored");
  assert(isStroked("curved-line", true));
  assert(isStroked("rectangle", false));
  assert(!isStroked("rectangle", true));
  assert(!isStroked("circle", false), "always filled");
  assert(!isStroked("dots-grid", false));
});

Deno.test("LAYER_DEFAULTS: one entry per layer type", () => {
  assertEquals(
    Object.keys(LAYER_DEFAULTS).sort(),
    ["background", "glow", "image", "phone-frame", "shape", "text"],
  );
});
