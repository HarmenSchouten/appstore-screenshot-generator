/**
 * The device registry — the one file a new preset is added to.
 *
 * Listed in menu order (iOS first), which is the order
 * `getDevicePresetsForPlatform` feeds the model dropdowns. Everything else —
 * the `DevicePresetId` union, the `DEVICE_PRESETS` record — derives from this
 * array, so adding a device is one literal and no bookkeeping.
 */

import {
  defineAndroid,
  defineGeneric,
  defineIphone,
  railButton,
} from "./define.ts";

export const ALL_DEVICE_PRESETS = [
  defineIphone({
    id: "ios-iphone-15-pro",
    label: "iPhone 15 Pro",
    form: "pro",
    bodyHeight: 831,
    material: {
      frameFill: "#97918a",
      borderColor: "rgba(255,255,255,0.15)",
      faceShadow: "inset 0 1px 0 rgba(255,255,255,0.025)",
    },
    summary: "Titanium rails, slimmer bezels, compact Dynamic Island",
  }),
  defineIphone({
    id: "ios-iphone-15-pro-max",
    label: "iPhone 15 Pro Max",
    form: "pro-max",
    bodyHeight: 834,
    material: {
      frameFill: "#97918a",
      borderColor: "rgba(255,255,255,0.15)",
      faceShadow: "inset 0 1px 0 rgba(255,255,255,0.025)",
    },
    summary: "Titanium rails, slimmer bezels, compact Dynamic Island",
  }),
  defineIphone({
    id: "ios-iphone-17-pro",
    label: "iPhone 17 Pro",
    form: "pro",
    bodyHeight: 835,
    material: {
      frameFill: "#a8a9ad",
      borderColor: "rgba(255,255,255,0.18)",
      faceShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
    },
    summary: 'Aluminum alloy body, Dynamic Island, refined 6.3" display',
  }),
  defineIphone({
    id: "ios-iphone-17-pro-max",
    label: "iPhone 17 Pro Max",
    form: "pro-max",
    bodyHeight: 838,
    material: {
      frameFill: "#a8a9ad",
      borderColor: "rgba(255,255,255,0.18)",
      faceShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
    },
    summary: 'Aluminum alloy body, Dynamic Island, expansive 6.9" display',
  }),
  defineGeneric({ id: "ios-legacy-classic", platform: "ios" }),

  defineAndroid({
    id: "android-pixel-9-pro",
    label: "Pixel 9 Pro",
    family: "Pixel Pro",
    bodyHeight: 849,
    outerRadius: 46,
    screen: { top: 10, right: 11, bottom: 10, left: 11, radius: 35 },
    cutout: {
      diameter: 13,
      background:
        "radial-gradient(circle at 35% 30%, #202228 0%, #0c0d10 42%, #020203 72%, #000 100%)",
      borderColor: "rgba(255,255,255,0.04)",
      shadow:
        "0 0 0 1px rgba(0,0,0,0.36), 0 1px 1px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.04)",
    },
    buttons: [railButton("right", 194, 55), railButton("right", 270, 80)],
    material: {
      frameFill: "#3a3d44",
      borderColor: "rgba(255,255,255,0.12)",
      shadow:
        "0 26px 56px rgba(0, 0, 0, 0.34), 0 12px 24px rgba(0, 0, 0, 0.14)",
    },
    summary: "Polished aluminum rail, centered hole-punch, 20:9 screen",
  }),
  defineAndroid({
    id: "android-galaxy-s24-ultra",
    label: "Galaxy S24 Ultra",
    family: "Galaxy Ultra",
    bodyHeight: 822,
    outerRadius: 20,
    screen: { top: 9, right: 12, bottom: 11, left: 12, radius: 18 },
    cutout: {
      diameter: 12,
      background:
        "radial-gradient(circle at 35% 30%, #181a1f 0%, #090a0c 42%, #010102 74%, #000 100%)",
      borderColor: "rgba(255,255,255,0.03)",
      shadow:
        "0 0 0 1px rgba(0,0,0,0.38), 0 1px 1px rgba(0,0,0,0.28), inset 0 1px 1px rgba(255,255,255,0.03)",
    },
    buttons: [railButton("right", 186, 52), railButton("right", 260, 80)],
    material: {
      frameFill: "#87827b",
      borderColor: "rgba(255,255,255,0.10)",
      faceBorderColor: "rgba(255,255,255,0.02)",
      shadow:
        "0 24px 50px rgba(0, 0, 0, 0.36), 0 10px 22px rgba(0, 0, 0, 0.14)",
    },
    summary: "Titanium rail, centered hole-punch, squared flagship silhouette",
  }),
  defineAndroid({
    id: "android-oneplus-13",
    label: "OnePlus 13",
    family: "OnePlus",
    bodyHeight: 852,
    outerRadius: 44,
    screen: { top: 9, right: 10, bottom: 10, left: 10, radius: 36 },
    cutout: {
      diameter: 12,
      background:
        "radial-gradient(circle at 35% 30%, #1a1c22 0%, #0a0b0e 42%, #020203 72%, #000 100%)",
      borderColor: "rgba(255,255,255,0.04)",
      shadow:
        "0 0 0 1px rgba(0,0,0,0.36), 0 1px 1px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.04)",
    },
    buttons: [
      railButton("left", 152, 24),
      railButton("right", 200, 52),
      railButton("right", 272, 38),
    ],
    material: {
      frameFill: "#2a2c30",
      borderColor: "rgba(255,255,255,0.10)",
      faceFill: "#030303",
      shadow:
        "0 24px 52px rgba(0, 0, 0, 0.34), 0 10px 22px rgba(0, 0, 0, 0.14)",
    },
    summary:
      "Matte aluminum frame, alert slider, centered hole-punch, 2K BOE display",
  }),
  defineGeneric({ id: "android-legacy-classic", platform: "android" }),
] as const;

/**
 * Derived from the array above: a preset added there is a valid id
 * everywhere, with no second list to keep in step. `@app-types` re-exports
 * this as the canonical `DevicePresetId`.
 */
export type DevicePresetId = (typeof ALL_DEVICE_PRESETS)[number]["id"];
