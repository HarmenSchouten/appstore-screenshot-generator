import { assert, assertEquals, assertFalse } from "@std/assert";
import {
  ALL_DEVICE_PRESETS,
  DEFAULT_PLATFORM_DEFAULTS,
  DEVICE_PRESETS,
  isDevicePresetId,
  LEGACY_PLATFORM_DEFAULTS,
} from "./index.ts";

Deno.test("device presets: ids are unique", () => {
  const ids = ALL_DEVICE_PRESETS.map((p) => p.id);
  assertEquals(new Set(ids).size, ids.length);
});

Deno.test("device presets: record and array stay in sync", () => {
  // Three hand-maintained lists (id union, array, record) — this pins the
  // two runtime ones to each other until they get derived from one source.
  assertEquals(
    new Set(Object.keys(DEVICE_PRESETS)),
    new Set(ALL_DEVICE_PRESETS.map((p) => p.id)),
  );
  for (const [key, preset] of Object.entries(DEVICE_PRESETS)) {
    assertEquals(preset.id, key, `record key "${key}" maps to "${preset.id}"`);
  }
});

Deno.test("device presets: every preset has sane geometry and platform", () => {
  for (const preset of ALL_DEVICE_PRESETS) {
    assert(
      preset.platform === "android" || preset.platform === "ios",
      `${preset.id}: platform "${preset.platform}"`,
    );
    assert(preset.bodyHeight > 0, `${preset.id}: bodyHeight`);
    assert(preset.label.length > 0, `${preset.id}: empty label`);
    assertEquals(
      preset.id.startsWith(`${preset.platform}-`),
      true,
      `${preset.id}: id not prefixed with its platform`,
    );
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
