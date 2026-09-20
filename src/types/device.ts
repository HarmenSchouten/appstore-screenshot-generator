/**
 * Device preset types
 */

import type { Platform } from "./base.ts";

export type DevicePresetId =
  | "ios-iphone-15-pro"
  | "ios-iphone-15-pro-max"
  | "ios-iphone-17-pro"
  | "ios-iphone-17-pro-max"
  | "ios-legacy-classic"
  | "android-pixel-9-pro"
  | "android-galaxy-s24-ultra"
  | "android-oneplus-13"
  | "android-legacy-classic";

export interface DeviceButtonPreset {
  side: "left" | "right";
  top: number;
  height: number;
  width: number;
  offset: number;
  radius: number;
}

interface DeviceCutoutBase {
  /** Distance from the top of the frame */
  top: number;
  background: string;
  borderColor: string;
  borderWidth: number;
  shadow: string;
}

/** A pill-shaped camera housing, centred horizontally */
export interface DynamicIslandCutoutPreset extends DeviceCutoutBase {
  type: "dynamic-island";
  width: number;
  height: number;
  radius: number;
}

/** A round camera hole, centred horizontally */
export interface HolePunchCutoutPreset extends DeviceCutoutBase {
  type: "hole-punch";
  diameter: number;
}

/** A camera cutout in the screen; a preset without one omits `cutout`. */
export type DeviceCutoutPreset =
  | DynamicIslandCutoutPreset
  | HolePunchCutoutPreset;

export interface DeviceScreenPreset {
  top: number;
  right: number;
  bottom: number;
  left: number;
  radius: number;
}

/**
 * Surface finish. Fields that describe an optional feature (a face plate,
 * a frame border, a highlight) turn it on by being present; the sizes and
 * the button colour come from `DEFAULT_MATERIAL` when omitted.
 */
export interface DeviceMaterialPreset {
  frameFill: string;
  /** Frame border; omitted = none */
  borderColor?: string;
  borderWidth?: number;
  /** Inner face plate; omitted = none */
  faceFill?: string;
  faceInset?: number;
  faceBorderColor?: string;
  faceBorderWidth?: number;
  faceShadow?: string;
  buttonFill?: string;
  shadow?: string;
  /** Top-edge sheen over the frame; omitted = none */
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
  buttons: DeviceButtonPreset[];
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
