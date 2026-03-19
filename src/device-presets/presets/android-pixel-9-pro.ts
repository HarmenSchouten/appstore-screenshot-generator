import type { DevicePreset } from "../../types/device.ts";

export const ANDROID_PIXEL_9_PRO_PRESET = {
  id: "android-pixel-9-pro",
  label: "Pixel 9 Pro",
  platform: "android",
  family: "Pixel Pro",
  bodyHeight: 849,
  outerRadius: 46,
  screen: {
    top: 10,
    right: 11,
    bottom: 10,
    left: 11,
    radius: 35,
  },
  cutout: {
    type: "hole-punch",
    top: 10,
    diameter: 13,
    background:
      "radial-gradient(circle at 35% 30%, #202228 0%, #0c0d10 42%, #020203 72%, #000 100%)",
    borderColor: "rgba(255,255,255,0.04)",
    borderWidth: 0.75,
    shadow:
      "0 0 0 1px rgba(0,0,0,0.36), 0 1px 1px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.04)",
  },
  buttons: [
    { side: "right", top: 194, height: 55, width: 3, offset: 2, radius: 1.5 },
    { side: "right", top: 270, height: 80, width: 3, offset: 2, radius: 1.5 },
  ],
  material: {
    frameFill: "#3a3d44",
    faceFill: "#040404",
    faceInset: 3,
    faceBorderColor: "rgba(255,255,255,0.03)",
    faceBorderWidth: 0.75,
    faceShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
    borderColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    buttonFill: "#3a3d44",
    shadow: "0 26px 56px rgba(0, 0, 0, 0.34), 0 12px 24px rgba(0, 0, 0, 0.14)",
    screenShadow: undefined,
  },
  summary: "Polished aluminum rail, centered hole-punch, 20:9 screen",
} satisfies DevicePreset;
