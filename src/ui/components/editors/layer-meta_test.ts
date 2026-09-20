import { assert, assertEquals, assertObjectMatch } from "@std/assert";
import { LAYER_DEFAULTS, POSITION_DEFAULTS } from "@lib";
import {
  createDefaultLayer,
  LAYER_TYPES,
  layerDisplayName,
} from "./layer-meta.ts";

Deno.test("createDefaultLayer: every type is centred and carries its LAYER_DEFAULTS", () => {
  for (const type of LAYER_TYPES) {
    const layer = createDefaultLayer(type);
    assertEquals(layer.type, type);
    assert(layer.id.length > 0);
    assertObjectMatch(layer, LAYER_DEFAULTS[type]);
    if (type !== "background") {
      assertObjectMatch(layer, POSITION_DEFAULTS);
    }
  }
});

Deno.test("createDefaultLayer: a phone frame inherits the platform device", () => {
  const layer = createDefaultLayer("phone-frame");
  assert(!("model" in layer));
});

Deno.test("createDefaultLayer: a background is only id, type and opacity", () => {
  assertEquals(Object.keys(createDefaultLayer("background")).sort(), [
    "id",
    "opacity",
    "type",
  ]);
});

Deno.test("layerDisplayName: shapes use the SHAPE_META label and siblings are numbered", () => {
  const a = { ...createDefaultLayer("shape"), shapeType: "s-curve" as const };
  const b = { ...createDefaultLayer("shape"), shapeType: "s-curve" as const };
  assertEquals(layerDisplayName(a, [a]), "S-Curve");
  assertEquals(layerDisplayName(b, [a, b]), "S-Curve #2");
});
