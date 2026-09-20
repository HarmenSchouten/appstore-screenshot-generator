import { assert, assertEquals, assertNotEquals } from "@std/assert";
import {
  blobPath,
  chevronPath,
  curvePath,
  DIRECTION_ANGLE,
  fillOrStroke,
  gridDots,
  LINE_ENDS,
  lineStroke,
  offset,
  ORIGIN,
  polygonPoints,
  RADIUS,
  scatteredDots,
  sCurvePath,
  starPoints,
  strokeOnly,
  wavePath,
} from "./shape-geometry.ts";

// The expected strings are what ShapeLayer emitted before #71 pulled the
// geometry out of its switch: the helpers must reproduce them exactly, so a
// shape drawn by an old project renders the same after the refactor.

Deno.test("polygonPoints: the triangle, diamond and hexagon of the old switch", () => {
  assertEquals(
    polygonPoints(3, RADIUS, -90),
    "50,5 88.97114317029974,72.5 11.02885682970026,72.5",
  );
  assertEquals(
    polygonPoints(4, RADIUS, 0),
    "95,50 50,95 5,50.00000000000001 49.99999999999999,5",
  );
  assertEquals(
    polygonPoints(6, RADIUS, -30),
    "88.97114317029974,27.500000000000004 88.97114317029974,72.5 50,95 11.02885682970026,72.5 11.02885682970026,27.499999999999996 49.99999999999999,5",
  );
});

Deno.test("starPoints: a default star, and the sparkle as a 4-point star", () => {
  assertEquals(
    starPoints(5, RADIUS, RADIUS * 0.4),
    "50,5 60.58013454126451,35.43769410125095 92.79754323328191,36.094235253127366 67.11901729331277,55.56230589874905 76.45033635316129,86.40576474687263 50,68 23.549663646838713,86.40576474687263 32.880982706687234,55.56230589874905 7.202456766718093,36.09423525312735 39.41986545873548,35.43769410125095",
  );
  assertEquals(
    starPoints(4, RADIUS, RADIUS * 0.25),
    "50,5 57.95495128834866,42.04504871165134 95,50 57.95495128834866,57.95495128834866 50,95 42.04504871165134,57.95495128834866 5,50.00000000000001 42.04504871165134,42.04504871165134",
  );
});

Deno.test("chevronPath: opens away from its direction, at half the angle each side", () => {
  assertEquals(
    chevronPath(ORIGIN, DIRECTION_ANGLE.right, 45 / 2, 40),
    "M 13.044818699548529 34.69266270539641 L 50 50 L 13.044818699548529 65.3073372946036",
  );
  assertEquals(
    chevronPath(ORIGIN, DIRECTION_ANGLE.up, 60 / 2, 40),
    "M 29.999999999999996 84.64101615137754 L 50 50 L 70.00000000000001 84.64101615137753",
  );
  // The arrow head of the old switch: apex at the tip, 25° each side
  assertEquals(
    chevronPath(
      offset(DIRECTION_ANGLE.left, 35, ORIGIN),
      DIRECTION_ANGLE.left,
      25,
      20,
    ),
    "M 33.126155740733 58.452365234813996 L 15 50.00000000000001 L 33.126155740733 41.54763476518602",
  );
});

Deno.test("offset: a vector along a direction, optionally from an origin", () => {
  assertEquals(offset(DIRECTION_ANGLE.right, 10), { x: 10, y: 0 });
  const up = offset(DIRECTION_ANGLE.up, 10);
  assert(Math.abs(up.x) < 1e-12 && Math.abs(up.y + 10) < 1e-12);
  assertEquals(offset(DIRECTION_ANGLE.right, -40, ORIGIN), { x: 10, y: 50 });
});

Deno.test("line paths: curve bends on the orientation's axis, S-curve and wave flip with the sign", () => {
  assertEquals(
    curvePath(LINE_ENDS.horizontal, 30, "horizontal"),
    "M 10 50 Q 50 20 90 50",
  );
  // Custom endpoints still bend on the axis the orientation names
  assertEquals(
    curvePath({ startX: 5, startY: 50, endX: 95, endY: 50 }, 30, "vertical"),
    "M 5 50 Q 20 50 95 50",
  );
  assertEquals(
    sCurvePath(LINE_ENDS.vertical, 40),
    "M 50 10 C 50 -30, 50 130, 50 90",
  );
  assertEquals(
    wavePath(LINE_ENDS["diagonal-up"], 5, -20),
    "M 10 90 Q 18 110, 26 90 Q 34 70, 42 90 Q 50 110, 58 90 Q 66 70, 74 90 Q 82 110, 90 90",
  );
});

Deno.test("blobPath: closed, one cubic per point, deterministic per seed", () => {
  const path = blobPath(6, 42);
  assert(path.startsWith("M "));
  assert(path.endsWith(" Z"));
  assertEquals(path.split(" C ").length - 1, 6);
  assertEquals(blobPath(6, 42), path);
  assertNotEquals(blobPath(6, 43), path);
  assertNotEquals(blobPath(8, 42), path);
});

Deno.test("gridDots: rows × cols centred on the box", () => {
  const dots = gridDots(3, 5, 15, 4);
  assertEquals(dots.length, 15);
  assertEquals(dots.slice(0, 3), [
    { x: 20, y: 35, r: 4 },
    { x: 35, y: 35, r: 4 },
    { x: 50, y: 35, r: 4 },
  ]);
  assertEquals(dots[14], { x: 80, y: 65, r: 4 });
});

Deno.test("scatteredDots: inside the margin, sized around dotSize, deterministic", () => {
  const dots = scatteredDots(12, 2, 7);
  assertEquals(dots.length, 12);
  for (const d of dots) {
    assert(d.x >= 10 && d.x < 90, `x ${d.x}`);
    assert(d.y >= 10 && d.y < 90, `y ${d.y}`);
    assert(d.r >= 1 && d.r < 3, `r ${d.r}`);
  }
  assertEquals(scatteredDots(12, 2, 7), dots);
  assertNotEquals(scatteredDots(12, 2, 8), dots);
});

Deno.test("paint helpers: fill or outline, stroke without fill for lines", () => {
  const s = { color: "#abc", filled: false, strokeWidth: 3 };
  assertEquals(fillOrStroke({ ...s, filled: true }), { fill: "#abc" });
  assertEquals(fillOrStroke(s, "round"), {
    fill: "none",
    stroke: "#abc",
    strokeWidth: 3,
    strokeLinejoin: "round",
  });
  assertEquals(strokeOnly(s, "square"), {
    fill: "none",
    stroke: "#abc",
    strokeWidth: 3,
    strokeLinecap: "square",
  });
  assertEquals(lineStroke(s), {
    stroke: "#abc",
    strokeWidth: 3,
    strokeLinecap: undefined,
  });
});
