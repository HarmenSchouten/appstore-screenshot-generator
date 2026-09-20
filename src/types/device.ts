/**
 * Device preset types
 */

import type { Platform } from "./base.ts";
// Type-only, so it is erased at runtime and the @app-types ⇄ @device-presets
// cycle never exists in the emitted code. The union is derived from the
// registry, so a new preset needs no edit here (#72).
import type { DevicePresetId } from "@device-presets";

export type { DevicePresetId };

export interface DeviceButtonPreset {
  side: "left" | "right";
  top: number;
  height: number;
  width: number;
  offset: number;
  radius: number;
}

interface DeviceCutoutBase {
  /** Distance from the top of the screen, which the cutout sits inside */
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
 * a frame border, a highlight) turn it on by being present; the sizes come
 * from `DEFAULT_MATERIAL` when omitted.
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
  /** Buttons in a finish of their own; omitted = `frameFill` */
  buttonFill?: string;
  shadow?: string;
  /** Top-edge sheen over the frame; omitted = none */
  topHighlight?: string;
}

/**
 * All measurements are in units of `DEVICE_PRESET_REFERENCE_WIDTH`
 * (`@device-presets`), which the renderer scales to the rendered width.
 *
 * `Id` is generic so a builder can return a preset typed to its own id
 * literal — which is what the registry derives `DevicePresetId` from, and
 * what would otherwise make that inference circular. Consumers use the bare
 * `DevicePreset`.
 */
export interface DevicePreset<Id extends string = DevicePresetId> {
  id: Id;
  label: string;
  platform: Platform;
  family: string;
  bodyHeight: number;
  outerRadius: number;
  screen: DeviceScreenPreset;
  cutout?: DeviceCutoutPreset;
  /** Readonly: presets are shared, immutable data — builders hand out the
   * same arrays rather than copying them per preset. */
  buttons: readonly DeviceButtonPreset[];
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
