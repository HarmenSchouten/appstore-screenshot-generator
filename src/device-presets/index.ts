import type {
  DeviceMaterialPreset,
  DevicePreset,
  Platform,
  PlatformDefaults,
} from "@app-types";
import { ALL_DEVICE_PRESETS, type DevicePresetId } from "./presets.ts";

export * from "./presets.ts";
export { DEVICE_PRESET_REFERENCE_WIDTH } from "./define.ts";

/**
 * Lookup table over `ALL_DEVICE_PRESETS`. Derived rather than written out:
 * the array is the only list of presets anyone maintains.
 */
export const DEVICE_PRESETS = Object.fromEntries(
  ALL_DEVICE_PRESETS.map((preset) => [preset.id, preset]),
) as Readonly<Record<DevicePresetId, DevicePreset>>;

/**
 * Material fields a preset may leave out. Sizes are in reference-width units
 * like the rest of the preset. `buttonFill` is not here: the renderer falls
 * back to `frameFill`, so only a frame whose buttons differ writes one.
 */
export const DEFAULT_MATERIAL = {
  borderWidth: 1,
  faceInset: 0,
  faceBorderWidth: 1,
} satisfies Partial<DeviceMaterialPreset>;

export const DEFAULT_PLATFORM_DEFAULTS: PlatformDefaults = {
  android: {
    defaultDevicePresetId: "android-pixel-9-pro",
  },
  ios: {
    defaultDevicePresetId: "ios-iphone-15-pro",
  },
};

/** Fallback for configs written before `platformDefaults` existed (#61). */
export const LEGACY_PLATFORM_DEFAULTS: PlatformDefaults = {
  android: {
    defaultDevicePresetId: "android-legacy-classic",
  },
  ios: {
    defaultDevicePresetId: "ios-legacy-classic",
  },
};

export function getDefaultDevicePresetId(platform: Platform): DevicePresetId {
  return DEFAULT_PLATFORM_DEFAULTS[platform].defaultDevicePresetId;
}

export function getDevicePreset(id: DevicePresetId): DevicePreset {
  return DEVICE_PRESETS[id];
}

/** In registry order: the model dropdowns list presets exactly like this. */
export function getDevicePresetsForPlatform(
  platform: Platform,
): DevicePreset[] {
  return ALL_DEVICE_PRESETS.filter((preset) => preset.platform === platform);
}

export function isDevicePresetId(value: string): value is DevicePresetId {
  return Object.hasOwn(DEVICE_PRESETS, value);
}
