/**
 * Device preset builders (#72).
 *
 * Each builder owns the material its family shares — the Dynamic Island, the
 * face plate, the button rail — so a preset literal carries only what
 * distinguishes the model. A spec may override any shared value.
 */

import type {
  DeviceButtonPreset,
  DeviceMaterialPreset,
  DevicePreset,
  DeviceScreenPreset,
  DynamicIslandCutoutPreset,
  HolePunchCutoutPreset,
  Platform,
} from "@app-types";

/**
 * Every measurement in a preset is in units of this width; the renderer
 * scales them by `pixelWidth / DEVICE_PRESET_REFERENCE_WIDTH`. It lives with
 * the presets so the number 400 has exactly one home.
 */
export const DEVICE_PRESET_REFERENCE_WIDTH = 400;

/** The rail every modern phone uses: only side, top and height differ. */
export function railButton(
  side: DeviceButtonPreset["side"],
  top: number,
  height: number,
): DeviceButtonPreset {
  return { side, top, height, width: 3, offset: 2, radius: 1.5 };
}

// ── iPhone ──────────────────────────────────────────────────

/** Identical in all four iPhone presets. */
const DYNAMIC_ISLAND = {
  type: "dynamic-island",
  top: 11,
  width: 85,
  height: 23,
  radius: 12,
  background: "#000",
  borderColor: "rgba(255,255,255,0.02)",
  borderWidth: 0.75,
  shadow: "0 1px 1px rgba(0,0,0,0.35)",
} satisfies DynamicIslandCutoutPreset;

const IPHONE_MATERIAL = {
  faceFill: "#040404",
  faceInset: 4,
  faceBorderColor: "rgba(255,255,255,0.02)",
  faceBorderWidth: 0.75,
  borderWidth: 1,
  shadow: "0 18px 40px rgba(0, 0, 0, 0.24), 0 8px 18px rgba(0, 0, 0, 0.10)",
} satisfies Partial<DeviceMaterialPreset>;

/**
 * The fields a form factor fixes; only `bodyHeight` still varies per model.
 * Written against `DevicePreset<string>`: the spec's `form` is keyed off this
 * table, so pulling in the derived id union here would be circular.
 */
type IphoneFormFactor = Pick<
  DevicePreset<string>,
  "family" | "outerRadius" | "screen" | "buttons"
>;

/**
 * Two body sizes, four models: keeping the geometry here is what keeps a
 * 15 Pro and a 17 Pro from drifting apart by a stray unit.
 */
const IPHONE_FORMS = {
  pro: {
    family: "iPhone Pro",
    outerRadius: 57,
    screen: { top: 10, right: 11, bottom: 10, left: 11, radius: 46 },
    buttons: [
      railButton("left", 142, 36),
      railButton("left", 210, 68),
      railButton("left", 293, 68),
      railButton("right", 232, 85),
    ],
  },
  "pro-max": {
    family: "iPhone Pro Max",
    outerRadius: 58,
    // Fewer inset units than the Pro for the same physical bezel, because the
    // body is ~8% wider. The radii are tuned by eye, not derived from this.
    screen: { top: 9, right: 10, bottom: 9, left: 10, radius: 47 },
    buttons: [
      railButton("left", 145, 37),
      railButton("left", 213, 69),
      railButton("left", 297, 69),
      railButton("right", 236, 87),
    ],
  },
} satisfies Record<string, IphoneFormFactor>;

type IphoneForm = keyof typeof IPHONE_FORMS;

interface IphoneSpec<Id extends string> {
  id: Id;
  label: string;
  form: IphoneForm;
  bodyHeight: number;
  /** Laid over `IPHONE_MATERIAL`, so a model can override any default. */
  material: DeviceMaterialPreset;
  summary: string;
}

export function defineIphone<const Id extends string>(
  spec: IphoneSpec<Id>,
): DevicePreset<Id> {
  const form = IPHONE_FORMS[spec.form];
  return {
    id: spec.id,
    label: spec.label,
    platform: "ios",
    family: form.family,
    bodyHeight: spec.bodyHeight,
    outerRadius: form.outerRadius,
    screen: form.screen,
    cutout: DYNAMIC_ISLAND,
    buttons: form.buttons,
    material: { ...IPHONE_MATERIAL, ...spec.material },
    summary: spec.summary,
  };
}

// ── Android ─────────────────────────────────────────────────

/** Shared hole-punch geometry; size and glass colour are per model. */
const ANDROID_CUTOUT = {
  type: "hole-punch",
  top: 10,
  borderWidth: 0.75,
} satisfies Pick<HolePunchCutoutPreset, "type" | "top" | "borderWidth">;

const ANDROID_MATERIAL = {
  faceFill: "#040404",
  faceInset: 3,
  faceBorderColor: "rgba(255,255,255,0.03)",
  faceBorderWidth: 0.75,
  faceShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
  borderWidth: 1,
} satisfies Partial<DeviceMaterialPreset>;

/** Laid over `ANDROID_CUTOUT`: `top` and `borderWidth` are overridable. */
type AndroidCutoutSpec =
  & Omit<HolePunchCutoutPreset, keyof typeof ANDROID_CUTOUT>
  & Partial<Pick<HolePunchCutoutPreset, "top" | "borderWidth">>;

interface AndroidSpec<Id extends string> {
  id: Id;
  label: string;
  family: string;
  bodyHeight: number;
  outerRadius: number;
  screen: DeviceScreenPreset;
  cutout: AndroidCutoutSpec;
  buttons: readonly DeviceButtonPreset[];
  /** Laid over `ANDROID_MATERIAL`, so a model can override any default. */
  material: DeviceMaterialPreset;
  summary: string;
}

export function defineAndroid<const Id extends string>(
  spec: AndroidSpec<Id>,
): DevicePreset<Id> {
  return {
    id: spec.id,
    label: spec.label,
    platform: "android",
    family: spec.family,
    bodyHeight: spec.bodyHeight,
    outerRadius: spec.outerRadius,
    screen: spec.screen,
    cutout: { ...ANDROID_CUTOUT, ...spec.cutout },
    buttons: spec.buttons,
    material: { ...ANDROID_MATERIAL, ...spec.material },
    summary: spec.summary,
  };
}

// ── Generic ─────────────────────────────────────────────────

/**
 * The plain frame both platforms fall back to. It predates `platformDefaults`
 * and stays a real, selectable option (#61), so its ids never change.
 */
const GENERIC_FRAME = {
  label: "Generic",
  family: "Generic",
  bodyHeight: 855,
  outerRadius: 24,
  screen: { top: 5, right: 5, bottom: 5, left: 5, radius: 18 },
  buttons: [
    { side: "left", top: 137, height: 17, width: 3, offset: 3, radius: 2 },
    { side: "left", top: 188, height: 34, width: 3, offset: 3, radius: 2 },
    { side: "left", top: 248, height: 34, width: 3, offset: 3, radius: 2 },
    { side: "right", top: 188, height: 43, width: 3, offset: 3, radius: 2 },
  ],
  material: {
    frameFill: "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 100%)",
    borderColor: "rgba(80, 80, 85, 0.5)",
    borderWidth: 1,
    // The only preset whose buttons are not the frame's own finish.
    buttonFill: "linear-gradient(90deg, #3a3a3e 0%, #2a2a2e 100%)",
    shadow:
      "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
    topHighlight:
      "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 12%, transparent 24%)",
  },
  summary: "Generic frame without camera cutout",
} satisfies Omit<DevicePreset, "id" | "platform">;

interface GenericSpec<Id extends string> {
  id: Id;
  platform: Platform;
}

export function defineGeneric<const Id extends string>(
  spec: GenericSpec<Id>,
): DevicePreset<Id> {
  // Split so the fields come out in `DevicePreset` order, as in the other
  // two builders; id and platform are all a generic frame varies by.
  const { label, ...frame } = GENERIC_FRAME;
  return { id: spec.id, label, platform: spec.platform, ...frame };
}
