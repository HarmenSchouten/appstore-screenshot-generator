/**
 * Device preset types
 */

import type { Platform } from './base.ts';

export type DevicePresetId =
  | 'ios-iphone-15-pro'
  | 'ios-iphone-15-pro-max'
  | 'ios-legacy-classic'
  | 'android-pixel-9-pro'
  | 'android-galaxy-s24-ultra'
  | 'android-legacy-classic';

export type DeviceMode = 'inherit' | 'override';

export interface DeviceButtonPreset {
  side: 'left' | 'right';
  top: number;
  height: number;
  width: number;
  offset: number;
  radius: number;
  background?: string;
}

export interface DeviceCutoutPreset {
  type: 'dynamic-island' | 'hole-punch' | 'none';
  top: number;
  width?: number;
  height?: number;
  radius?: number;
  diameter?: number;
  background?: string;
  borderColor?: string;
  borderWidth?: number;
  shadow?: string;
}

export interface DeviceScreenPreset {
  top: number;
  right: number;
  bottom: number;
  left: number;
  radius: number;
}

export interface DeviceMaterialPreset {
  frameFill: string;
  faceFill?: string;
  faceInset?: number;
  faceBorderColor?: string;
  faceBorderWidth?: number;
  faceShadow?: string;
  innerFill?: string;
  borderColor?: string;
  borderWidth?: number;
  innerBorderColor?: string;
  buttonFill?: string;
  shadow?: string;
  screenShadow?: string;
  topHighlight?: string;
}

/**
 * All measurements are defined for a reference width of 400px.
 */
export interface DevicePreset {
  id: DevicePresetId;
  label: string;
  platform: Platform;
  family: string;
  bodyHeight: number;
  outerRadius: number;
  screen: DeviceScreenPreset;
  cutout?: DeviceCutoutPreset;
  buttons?: DeviceButtonPreset[];
  material: DeviceMaterialPreset;
  summary: string;
}

export interface PlatformDeviceDefaults {
  defaultDevicePresetId: DevicePresetId;
}

export interface PlatformDefaults {
  android: PlatformDeviceDefaults;
  ios: PlatformDeviceDefaults;
}