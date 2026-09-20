import { assert, assertEquals, assertFalse } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import type { DeviceCutoutPreset } from "@app-types";
import { assertNever } from "@lib";
import {
  ALL_DEVICE_PRESETS,
  DEFAULT_PLATFORM_DEFAULTS,
  DEVICE_PRESET_REFERENCE_WIDTH,
  DEVICE_PRESETS,
  isDevicePresetId,
  LEGACY_PLATFORM_DEFAULTS,
} from "./index.ts";

Deno.test("device presets: the registry derives a complete, unique record", async (t) => {
  const ids = ALL_DEVICE_PRESETS.map((p) => p.id);
  assertEquals(new Set(ids).size, ids.length, "duplicate preset id");
  // A duplicate id would silently collapse in Object.fromEntries rather than
  // fail, so the record has to be counted, not just spot-checked.
  assertEquals(Object.keys(DEVICE_PRESETS).length, ALL_DEVICE_PRESETS.length);

  for (const preset of ALL_DEVICE_PRESETS) {
    assertEquals(DEVICE_PRESETS[preset.id], preset);
  }

  // Pins every number and colour in the registry: the cheap guard that a
  // refactor of the builders leaves the rendered frames alone (#72).
  await assertSnapshot(t, ALL_DEVICE_PRESETS);
});

Deno.test("device presets: every preset has a platform-prefixed id and a label", () => {
  for (const preset of ALL_DEVICE_PRESETS) {
    assert(
      preset.platform === "android" || preset.platform === "ios",
      `${preset.id}: platform "${preset.platform}"`,
    );
    assertEquals(
      preset.id.startsWith(`${preset.platform}-`),
      true,
      `${preset.id}: id not prefixed with its platform`,
    );
    assert(preset.label.length > 0, `${preset.id}: empty label`);
    assert(preset.summary.length > 0, `${preset.id}: empty summary`);
  }
});

Deno.test("device presets: iOS comes before Android in the registry", () => {
  // Registry order is menu order: the editor renders one group per platform
  // straight from getDevicePresetsForPlatform, so the grouping lives here.
  const platforms = ALL_DEVICE_PRESETS.map((p) => p.platform);
  assertEquals(
    platforms,
    [...platforms].sort((a, b) => (a === b ? 0 : a === "ios" ? -1 : 1)),
  );
});

/** Cutout footprint in reference units — a pill is wide, a hole is round. */
function cutoutSize(cutout: DeviceCutoutPreset): [number, number] {
  switch (cutout.type) {
    case "dynamic-island":
      return [cutout.width, cutout.height];
    case "hole-punch":
      return [cutout.diameter, cutout.diameter];
    default:
      return assertNever(cutout);
  }
}

Deno.test("device presets: geometry fits inside the frame", () => {
  for (const preset of ALL_DEVICE_PRESETS) {
    const where = (what: string) => `${preset.id}: ${what}`;
    assert(preset.bodyHeight > 0, where("bodyHeight"));
    assert(preset.material.frameFill.length > 0, where("frameFill"));

    const { top, right, bottom, left } = preset.screen;
    for (const [name, inset] of Object.entries({ top, right, bottom, left })) {
      assert(inset >= 0, where(`negative screen.${name}`));
    }
    assert(top + bottom < preset.bodyHeight, where("screen taller than body"));
    assert(
      left + right < DEVICE_PRESET_REFERENCE_WIDTH,
      where("screen wider than the reference width"),
    );

    for (const button of preset.buttons) {
      assert(
        button.top + button.height <= preset.bodyHeight,
        where(`button at ${button.top} runs past the body`),
      );
    }

    if (preset.cutout) {
      // The cutout is positioned inside the screen box, so it is the screen
      // it has to fit in — not the body.
      const [cutoutW, cutoutH] = cutoutSize(preset.cutout);
      assert(
        cutoutW < DEVICE_PRESET_REFERENCE_WIDTH - left - right,
        where("cutout wider than the screen"),
      );
      assert(preset.cutout.top >= 0, where("negative cutout.top"));
      assert(
        preset.cutout.top + cutoutH < preset.bodyHeight - top - bottom,
        where("cutout taller than the screen"),
      );
    }
  }
});

Deno.test("device presets: platform defaults point at existing presets", () => {
  for (
    const defaults of [DEFAULT_PLATFORM_DEFAULTS, LEGACY_PLATFORM_DEFAULTS]
  ) {
    for (const platform of ["android", "ios"] as const) {
      const id = defaults[platform].defaultDevicePresetId;
      assert(isDevicePresetId(id), `unknown preset id "${id}"`);
      assertEquals(DEVICE_PRESETS[id].platform, platform);
    }
  }
});

Deno.test("device presets: isDevicePresetId rejects unknown ids", () => {
  assertFalse(isDevicePresetId("ios-iphone-99"));
  assertFalse(isDevicePresetId(""));
  assertFalse(isDevicePresetId("toString"));
});
