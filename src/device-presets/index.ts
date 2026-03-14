import type {
  DeviceMode,
  DevicePreset,
  DevicePresetId,
  PlatformDefaults,
} from '../types/device.ts';
import type { PhoneFrameOptions } from '../types/components.ts';
import type { Platform } from '../types/base.ts';
import { ALL_DEVICE_PRESETS, DEVICE_PRESETS } from './presets/index.ts';

export * from './presets/index.ts';

export const DEVICE_PRESET_REFERENCE_WIDTH = 400;

export const DEFAULT_PLATFORM_DEFAULTS: PlatformDefaults = {
  android: {
    defaultDevicePresetId: 'android-pixel-9-pro',
  },
  ios: {
    defaultDevicePresetId: 'ios-iphone-15-pro',
  },
};

export const LEGACY_PLATFORM_DEFAULTS: PlatformDefaults = {
  android: {
    defaultDevicePresetId: 'android-legacy-classic',
  },
  ios: {
    defaultDevicePresetId: 'ios-legacy-classic',
  },
};

export function getDefaultDevicePresetId(platform: Platform): DevicePresetId {
  return DEFAULT_PLATFORM_DEFAULTS[platform].defaultDevicePresetId;
}

export function getDevicePreset(id: DevicePresetId): DevicePreset {
  return DEVICE_PRESETS[id];
}

export function getAllDevicePresets(): DevicePreset[] {
  return [...ALL_DEVICE_PRESETS];
}

export function getDevicePresetsForPlatform(platform: Platform): DevicePreset[] {
  return getAllDevicePresets().filter((preset) => preset.platform === platform);
}

export function isDevicePresetId(value: string): value is DevicePresetId {
  return Object.hasOwn(DEVICE_PRESETS, value);
}

export function resolveDeviceMode(phoneFrame?: PhoneFrameOptions): DeviceMode {
  return phoneFrame?.deviceMode ?? 'inherit';
}

export function resolveScreenshotDevicePresetId(
  platform: Platform,
  defaultDevicePresetId: DevicePresetId,
  phoneFrame?: PhoneFrameOptions,
): DevicePresetId {
  if (
    resolveDeviceMode(phoneFrame) === 'override' &&
    phoneFrame?.devicePresetId &&
    isDevicePresetId(phoneFrame.devicePresetId)
  ) {
    const overridePreset = getDevicePreset(phoneFrame.devicePresetId);
    if (overridePreset.platform === platform) {
      return overridePreset.id;
    }
  }

  return defaultDevicePresetId;
}

export function getDevicePresetSummary(id: DevicePresetId): string {
  return getDevicePreset(id).summary;
}