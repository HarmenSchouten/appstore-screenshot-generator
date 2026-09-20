import { assert, assertEquals } from "@std/assert";
import { defineAndroid, defineGeneric, defineIphone } from "./define.ts";

// Every number these builders inject is pinned by the registry snapshot in
// index_test.ts; these tests cover what the snapshot cannot see — the merge
// rules and the id's literal type.

const IPHONE_SPEC = {
  id: "ios-test-pro",
  label: "Test Pro",
  form: "pro",
  bodyHeight: 800,
  material: {
    frameFill: "#111213",
    borderColor: "rgba(255,255,255,0.15)",
    faceShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  },
  summary: "Test",
} as const;

Deno.test("defineIphone: the spec only carries what differs per model", () => {
  const preset = defineIphone(IPHONE_SPEC);

  // The id survives as a literal type — what the registry derives
  // DevicePresetId from. Assigning it to a narrower type proves it.
  const id: "ios-test-pro" = preset.id;
  assertEquals(id, "ios-test-pro");

  assertEquals(preset.platform, "ios");
  assertEquals(preset.cutout?.type, "dynamic-island");
  assertEquals(preset.material.frameFill, "#111213");
  assertEquals(preset.material.faceFill, "#040404");
  // Buttons take the frame's own finish through the renderer's fallback.
  assertEquals(preset.material.buttonFill, undefined);
});

Deno.test("defineIphone: spec material wins over the shared defaults", () => {
  const shared = defineIphone(IPHONE_SPEC);
  const overridden = defineIphone({
    ...IPHONE_SPEC,
    material: { ...IPHONE_SPEC.material, faceInset: 6 },
  });

  assertEquals(shared.material.faceInset, 4);
  assertEquals(overridden.material.faceInset, 6);
  // Untouched defaults still come through.
  assertEquals(overridden.material.faceBorderWidth, 0.75);
});

Deno.test("defineIphone: the form factor fixes family, radii and buttons", () => {
  const pro = defineIphone(IPHONE_SPEC);
  const proMax = defineIphone({ ...IPHONE_SPEC, form: "pro-max" });

  assertEquals(pro.family, "iPhone Pro");
  assertEquals(proMax.family, "iPhone Pro Max");
  assert(proMax.outerRadius > pro.outerRadius, "Pro Max is the larger body");

  // Same rail everywhere: only side, top and height differ. The right-hand
  // button of the two Pro models used to sit a unit further out (#72).
  for (const button of [...pro.buttons, ...proMax.buttons]) {
    assertEquals([button.width, button.offset, button.radius], [3, 2, 1.5]);
  }
});

Deno.test("defineAndroid: spec values win over the shared defaults", () => {
  const preset = defineAndroid({
    id: "android-test",
    label: "Test",
    family: "Test",
    bodyHeight: 840,
    outerRadius: 40,
    screen: { top: 10, right: 10, bottom: 10, left: 10, radius: 30 },
    cutout: {
      diameter: 12,
      top: 14,
      background: "#000",
      borderColor: "rgba(255,255,255,0.04)",
      shadow: "0 0 0 1px rgba(0,0,0,0.36)",
    },
    buttons: [],
    material: {
      frameFill: "#2a2c30",
      faceFill: "#030303",
      faceBorderColor: "rgba(255,255,255,0.02)",
    },
    summary: "Test",
  });

  assertEquals(preset.platform, "android");
  assertEquals(preset.cutout?.type, "hole-punch");
  assertEquals(preset.cutout?.top, 14);
  assertEquals(preset.cutout?.borderWidth, 0.75);

  assertEquals(preset.material.faceFill, "#030303");
  assertEquals(preset.material.faceBorderColor, "rgba(255,255,255,0.02)");
  // Untouched defaults still come through.
  assertEquals(preset.material.faceInset, 3);
  assertEquals(preset.material.faceBorderWidth, 0.75);
});

Deno.test("defineGeneric: a bare frame, no cutout and no face plate", () => {
  const ios = defineGeneric({ id: "ios-test-generic", platform: "ios" });
  const android = defineGeneric({
    id: "android-test-generic",
    platform: "android",
  });

  assertEquals(ios.cutout, undefined);
  assertEquals(ios.material.faceFill, undefined);
  assertEquals(ios.label, "Generic");
  assertEquals(ios.family, "Generic");
  // The one preset whose buttons are not the frame's own finish.
  assert(ios.material.buttonFill !== ios.material.frameFill);

  // The two differ in nothing but id and platform.
  assertEquals(
    { ...ios, id: "", platform: "ios" },
    { ...android, id: "", platform: "ios" },
  );
});
