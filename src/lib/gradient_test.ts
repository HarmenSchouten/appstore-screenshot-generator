import { assertEquals } from "@std/assert";
import {
  applyPaletteToGradient,
  buildGradientCSS,
  DEFAULT_PALETTES,
  GRADIENT_TEMPLATES,
  type GradientParts,
  parseGradientCSS,
} from "@lib";

const linear = (colors: string[], direction: number): GradientParts => ({
  gradientType: "linear",
  colors,
  direction,
});
const radial = (colors: string[]): GradientParts => ({
  gradientType: "radial",
  colors,
  direction: 180,
});
const solid = (color: string): GradientParts => ({
  gradientType: "solid",
  colors: [color],
  direction: 180,
});

// ── The bug: commas inside color functions ───────────────────────────

Deno.test("parseGradientCSS: keeps rgba()/hsl() stops whole", () => {
  assertEquals(
    parseGradientCSS(
      "linear-gradient(90deg, rgba(0,0,0,.5), hsl(210, 40%, 50%), #fff)",
    ),
    linear(["rgba(0,0,0,.5)", "hsl(210, 40%, 50%)", "#fff"], 90),
  );
  assertEquals(
    parseGradientCSS("radial-gradient(circle, rgb(0 0 0 / 50%), transparent)"),
    radial(["rgb(0 0 0 / 50%)", "transparent"]),
  );
});

// ── Positional stops ─────────────────────────────────────────────────

Deno.test("parseGradientCSS: accepts positions the browser would assign anyway", () => {
  assertEquals(
    parseGradientCSS("linear-gradient(135deg, #a855f7 0%, #0a0a0a 100%)"),
    linear(["#a855f7", "#0a0a0a"], 135),
  );
  assertEquals(
    parseGradientCSS("linear-gradient(135deg, #aaa 0%, #bbb 50%, #ccc 100%)"),
    linear(["#aaa", "#bbb", "#ccc"], 135),
  );
  // A stop may omit its position while its neighbours spell theirs out
  assertEquals(
    parseGradientCSS("linear-gradient(0deg, red, blue 100%)"),
    linear(["red", "blue"], 0),
  );
});

Deno.test("parseGradientCSS: rejects positions that change the rendering", () => {
  // Off the even spacing
  assertEquals(
    parseGradientCSS("linear-gradient(90deg, #fff 20%, #000)"),
    null,
  );
  // Hard stop
  assertEquals(
    parseGradientCSS(
      "linear-gradient(90deg, #aaa 0%, #aaa 50%, #bbb 50%, #bbb 100%)",
    ),
    null,
  );
  // Lengths, double positions, color hints
  assertEquals(
    parseGradientCSS("linear-gradient(90deg, #aaa 0px, #bbb)"),
    null,
  );
  assertEquals(
    parseGradientCSS("linear-gradient(90deg, #aaa 0% 20%, #bbb)"),
    null,
  );
  assertEquals(
    parseGradientCSS("linear-gradient(90deg, #aaa, 30%, #bbb)"),
    null,
  );
});

// ── Direction ────────────────────────────────────────────────────────

Deno.test("parseGradientCSS: direction forms", () => {
  const stops = "#aaa, #bbb";
  assertEquals(parseGradientCSS(`linear-gradient(${stops})`)?.direction, 180);
  assertEquals(
    parseGradientCSS(`linear-gradient(to right, ${stops})`)?.direction,
    90,
  );
  assertEquals(
    parseGradientCSS(`linear-gradient(to top, ${stops})`)?.direction,
    0,
  );
  assertEquals(
    parseGradientCSS(`linear-gradient(-90deg, ${stops})`)?.direction,
    270,
  );
  assertEquals(
    parseGradientCSS(`linear-gradient(450deg, ${stops})`)?.direction,
    90,
  );
  assertEquals(
    parseGradientCSS(`linear-gradient(360deg, ${stops})`)?.direction,
    0,
  );
  // Corners are not a fixed angle; other units and fractions stay raw
  assertEquals(
    parseGradientCSS(`linear-gradient(to top right, ${stops})`),
    null,
  );
  assertEquals(parseGradientCSS(`linear-gradient(0.25turn, ${stops})`), null);
  assertEquals(parseGradientCSS(`linear-gradient(45.5deg, ${stops})`), null);
});

// ── Radial ───────────────────────────────────────────────────────────

Deno.test("parseGradientCSS: radial only in the shape the builder emits", () => {
  assertEquals(
    parseGradientCSS("radial-gradient(circle, #aaa, #bbb)"),
    radial(["#aaa", "#bbb"]),
  );
  assertEquals(
    parseGradientCSS("radial-gradient(circle at 30% 30%, #aaa 0%, #bbb 70%)"),
    null,
  );
  // CSS default is an ellipse, which is not what `circle` renders
  assertEquals(parseGradientCSS("radial-gradient(#aaa, #bbb)"), null);
  assertEquals(parseGradientCSS("radial-gradient(ellipse, #aaa, #bbb)"), null);
});

// ── Solid colors ─────────────────────────────────────────────────────

Deno.test("parseGradientCSS: bare colors are solid", () => {
  for (
    const color of [
      "#fff",
      "#FFF8",
      "#a855f7",
      "#a855f780",
      "rgb(0 0 0 / 50%)",
      "rgba(10, 20, 30, 0.4)",
      "hsl(210 40% 50%)",
      "oklch(70% 0.1 200)",
      "color-mix(in srgb, red, blue)",
      "var(--brand)",
      "transparent",
      "Red",
      "currentColor",
    ]
  ) {
    assertEquals(parseGradientCSS(color), solid(color), color);
  }
});

Deno.test("parseGradientCSS: things that are not a single gradient or color", () => {
  for (
    const css of [
      "",
      "   ",
      "#ggg",
      "#12345",
      "red blue",
      "none",
      "inherit",
      "url(bg.png)",
      "conic-gradient(red, blue)",
      "repeating-linear-gradient(90deg, #aaa, #bbb)",
      "linear-gradient(90deg, #aaa, #bbb) no-repeat",
      "linear-gradient(90deg, #aaa, #bbb), #0a0a0a",
      "linear-gradient(90deg, #aaa)",
      "linear-gradient(90deg, #aaa,, #bbb)",
      "linear-gradient(90deg, #aaa, #bbb",
      "linear-gradient(90deg, #aaa, #bbb))",
      "linear-gradient(90deg, to, #bbb)",
      "linear-gradient(90deg, 10%, #bbb)",
    ]
  ) {
    assertEquals(parseGradientCSS(css), null, JSON.stringify(css));
  }
});

// ── Whitespace and case ──────────────────────────────────────────────

Deno.test("parseGradientCSS: tolerates whitespace, newlines and case", () => {
  assertEquals(
    parseGradientCSS(
      "  LINEAR-GRADIENT( 90DEG ,\n  #A855F7 ,\n  rgb( 0 , 0 , 0 )  )\n",
    ),
    linear(["#A855F7", "rgb( 0 , 0 , 0 )"], 90),
  );
  assertEquals(
    parseGradientCSS("Radial-Gradient(Circle, #aaa, #bbb)"),
    radial(["#aaa", "#bbb"]),
  );
});

// ── Round trips ──────────────────────────────────────────────────────

Deno.test("parseGradientCSS inverts buildGradientCSS", () => {
  const cases: GradientParts[] = [
    linear(["#8b5cf6", "#3b82f6"], 180),
    linear(["#8b5cf6", "#3b82f6", "#ec4899"], 45),
    linear(["rgba(0,0,0,.5)", "transparent"], 0),
    radial(["#a855f7", "#0a0a0a"]),
    solid("#a855f7"),
    solid("rgb(0 0 0 / 50%)"),
  ];
  for (const parts of cases) {
    const css = buildGradientCSS(
      parts.gradientType,
      parts.colors,
      parts.direction,
    );
    assertEquals(parseGradientCSS(css), parts, css);
  }
});

Deno.test("decomposed CSS rebuilds to the same rendering", () => {
  // Same gradient, spelled the way a person types it
  const spellings = [
    "linear-gradient(135deg, #a855f7 0%, #0a0a0a 100%)",
    "linear-gradient(to right,#aaa,#bbb)",
    "radial-gradient(circle, #aaa 0%, #bbb 100%)",
  ];
  const expected = [
    "linear-gradient(135deg, #a855f7, #0a0a0a)",
    "linear-gradient(90deg, #aaa, #bbb)",
    "radial-gradient(circle, #aaa, #bbb)",
  ];
  spellings.forEach((css, i) => {
    const parts = parseGradientCSS(css)!;
    assertEquals(
      buildGradientCSS(parts.gradientType, parts.colors, parts.direction),
      expected[i],
    );
  });
});

// ── Theme templates ──────────────────────────────────────────────────

Deno.test("theme templates: which ones the visual editor can take over", () => {
  // Pinned so a template change that flips this is a conscious decision.
  // Templates that use positions/shapes/layers the visual controls cannot
  // express stay raw CSS when a layer starts customizing from the theme.
  const decomposable: Record<string, GradientParts["gradientType"] | null> = {
    "solid-primary": "solid",
    "solid-secondary": "solid",
    "primary-dark": "linear",
    "primary-secondary": "linear",
    "secondary-primary": "linear",
    "radial-primary": null,
    "radial-secondary": null,
    "mesh-primary": null,
    "diagonal-split": null,
    "triple-gradient": "linear",
  };
  const palette = DEFAULT_PALETTES[0].palette;
  for (const template of GRADIENT_TEMPLATES) {
    const css = applyPaletteToGradient(template.template, palette);
    assertEquals(
      parseGradientCSS(css)?.gradientType ?? null,
      decomposable[template.id],
      `${template.id}: ${css}`,
    );
  }
});
