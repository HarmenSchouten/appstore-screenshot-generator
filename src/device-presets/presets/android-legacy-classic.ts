import type { DevicePreset } from "../../types/device.ts";

export const ANDROID_LEGACY_CLASSIC_PRESET = {
  id: "android-legacy-classic",
  label: "Legacy Classic",
  platform: "android",
  family: "Legacy",
  bodyHeight: 855,
  outerRadius: 24,
  screen: {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
    radius: 18,
  },
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
    buttonFill: "linear-gradient(90deg, #3a3a3e 0%, #2a2a2e 100%)",
    shadow:
      "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
    topHighlight:
      "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 12%, transparent 24%)",
  },
  summary: "Original generic premium frame",
} satisfies DevicePreset;
