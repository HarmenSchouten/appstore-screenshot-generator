import { assert, assertEquals, assertNotEquals } from "@std/assert";
import { assetUrl, seededRandom } from "./utils.ts";

Deno.test("assetUrl: prefixes the path and drops a leading assets/", () => {
  assertEquals(assetUrl("images/a.png", "/assets/"), "/assets/images/a.png");
  assertEquals(
    assetUrl("assets/images/a.png", "file:///out/"),
    "file:///out/images/a.png",
  );
  assertEquals(assetUrl(undefined, "/assets/"), "");
  assertEquals(assetUrl("", "/assets/"), "");
});

Deno.test("seededRandom: in [0, 1), stable per seed, distinct for neighbours", () => {
  for (let seed = -5; seed <= 200; seed++) {
    const v = seededRandom(seed);
    assert(v >= 0 && v < 1, `seed ${seed} → ${v}`);
    assertEquals(seededRandom(seed), v);
    assertNotEquals(seededRandom(seed + 1), v);
  }
});

Deno.test("seededRandom: integer seeds, so a fractional seed truncates", () => {
  assertEquals(seededRandom(3.7), seededRandom(3));
});

// Every saved blob and scatter pattern depends on these exact values: a
// change here re-rolls them in every project.
Deno.test("seededRandom: mulberry32 step is pinned", () => {
  assertEquals(seededRandom(1), 0.6270739405881613);
  assertEquals(seededRandom(42), 0.6011037519201636);
  assertEquals(seededRandom(-1), 0.8964226141106337);
});
