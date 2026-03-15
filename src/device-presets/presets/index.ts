import type { DevicePreset, DevicePresetId } from '../../types/device.ts';
import { ANDROID_GALAXY_S24_ULTRA_PRESET } from './android-galaxy-s24-ultra.ts';
import { ANDROID_LEGACY_CLASSIC_PRESET } from './android-legacy-classic.ts';
import { ANDROID_ONEPLUS_13_PRESET } from './android-oneplus-13.ts';
import { ANDROID_PIXEL_9_PRO_PRESET } from './android-pixel-9-pro.ts';
import { IOS_IPHONE_15_PRO_PRESET } from './ios-iphone-15-pro.ts';
import { IOS_IPHONE_15_PRO_MAX_PRESET } from './ios-iphone-15-pro-max.ts';
import { IOS_IPHONE_17_PRO_PRESET } from './ios-iphone-17-pro.ts';
import { IOS_IPHONE_17_PRO_MAX_PRESET } from './ios-iphone-17-pro-max.ts';
import { IOS_LEGACY_CLASSIC_PRESET } from './ios-legacy-classic.ts';

export {
  ANDROID_GALAXY_S24_ULTRA_PRESET,
  ANDROID_LEGACY_CLASSIC_PRESET,
  ANDROID_ONEPLUS_13_PRESET,
  ANDROID_PIXEL_9_PRO_PRESET,
  IOS_IPHONE_15_PRO_PRESET,
  IOS_IPHONE_15_PRO_MAX_PRESET,
  IOS_IPHONE_17_PRO_PRESET,
  IOS_IPHONE_17_PRO_MAX_PRESET,
  IOS_LEGACY_CLASSIC_PRESET,
};

export const ALL_DEVICE_PRESETS: DevicePreset[] = [
  IOS_IPHONE_15_PRO_PRESET,
  IOS_IPHONE_15_PRO_MAX_PRESET,
  IOS_IPHONE_17_PRO_PRESET,
  IOS_IPHONE_17_PRO_MAX_PRESET,
  IOS_LEGACY_CLASSIC_PRESET,
  ANDROID_PIXEL_9_PRO_PRESET,
  ANDROID_GALAXY_S24_ULTRA_PRESET,
  ANDROID_ONEPLUS_13_PRESET,
  ANDROID_LEGACY_CLASSIC_PRESET,
];

export const DEVICE_PRESETS: Record<DevicePresetId, DevicePreset> = {
  'ios-iphone-15-pro': IOS_IPHONE_15_PRO_PRESET,
  'ios-iphone-15-pro-max': IOS_IPHONE_15_PRO_MAX_PRESET,
  'ios-iphone-17-pro': IOS_IPHONE_17_PRO_PRESET,
  'ios-iphone-17-pro-max': IOS_IPHONE_17_PRO_MAX_PRESET,
  'ios-legacy-classic': IOS_LEGACY_CLASSIC_PRESET,
  'android-pixel-9-pro': ANDROID_PIXEL_9_PRO_PRESET,
  'android-galaxy-s24-ultra': ANDROID_GALAXY_S24_ULTRA_PRESET,
  'android-oneplus-13': ANDROID_ONEPLUS_13_PRESET,
  'android-legacy-classic': ANDROID_LEGACY_CLASSIC_PRESET,
};