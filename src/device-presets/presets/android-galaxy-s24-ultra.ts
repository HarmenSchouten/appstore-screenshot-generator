import type { DevicePreset } from "@types";

export const ANDROID_GALAXY_S24_ULTRA_PRESET = {
  id: "android-galaxy-s24-ultra",
  label: "Galaxy S24 Ultra",
  platform: "android",
  family: "Galaxy Ultra",
  bodyHeight: 822,
  outerRadius: 20,
  screen: {
    top: 9,
    right: 12,
    bottom: 11,
    left: 12,
    radius: 18,
  },
  cutout: {
    type: "hole-punch",
    top: 10,
    diameter: 12,
    background:
      "radial-gradient(circle at 35% 30%, #181a1f 0%, #090a0c 42%, #010102 74%, #000 100%)",
    borderColor: "rgba(255,255,255,0.03)",
    borderWidth: 0.75,
    shadow:
      "0 0 0 1px rgba(0,0,0,0.38), 0 1px 1px rgba(0,0,0,0.28), inset 0 1px 1px rgba(255,255,255,0.03)",
  },
  buttons: [
    { side: "right", top: 186, height: 52, width: 3, offset: 2, radius: 1.5 },
    { side: "right", top: 260, height: 80, width: 3, offset: 2, radius: 1.5 },
  ],
  material: {
    frameFill: "#87827b",
    faceFill: "#040404",
    faceInset: 3,
    faceBorderColor: "rgba(255,255,255,0.02)",
    faceBorderWidth: 0.75,
    faceShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
    borderColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    buttonFill: "#87827b",
    shadow: "0 24px 50px rgba(0, 0, 0, 0.36), 0 10px 22px rgba(0, 0, 0, 0.14)",
    screenShadow: undefined,
  },
  summary: "Titanium rail, centered hole-punch, squared flagship silhouette",
} satisfies DevicePreset;
