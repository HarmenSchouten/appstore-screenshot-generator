import type { DevicePreset } from '../../types/device.ts';

export const ANDROID_GALAXY_S24_ULTRA_PRESET = {
  id: 'android-galaxy-s24-ultra',
  label: 'Galaxy S24 Ultra',
  platform: 'android',
  family: 'Galaxy Ultra',
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
    type: 'hole-punch',
    top: 10,
    diameter: 12,
    background: 'radial-gradient(circle at 35% 30%, #181a1f 0%, #090a0c 42%, #010102 74%, #000 100%)',
    borderColor: 'rgba(255,255,255,0.03)',
    borderWidth: 0.75,
    shadow: '0 0 0 1px rgba(0,0,0,0.38), 0 1px 1px rgba(0,0,0,0.28), inset 0 1px 1px rgba(255,255,255,0.03)',
  },
  buttons: [
    { side: 'right', top: 186, height: 88, width: 5, offset: 3, radius: 2.5 },
    { side: 'right', top: 304, height: 130, width: 5, offset: 3, radius: 2.5 },
  ],
  material: {
    frameFill: 'linear-gradient(180deg, #34373d 0%, #17191d 18%, #0f1013 52%, #08090b 100%)',
    innerFill: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 14%, rgba(0,0,0,0.16) 100%)',
    borderColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    innerBorderColor: 'rgba(255,255,255,0.03)',
    buttonFill: 'linear-gradient(90deg, #52565d 0%, #21252b 100%)',
    shadow: '0 24px 50px rgba(0, 0, 0, 0.36), 0 10px 22px rgba(0, 0, 0, 0.14)',
    screenShadow: '0 0 0 1px rgba(255,255,255,0.02), inset 0 0 0 1px rgba(255,255,255,0.03)',
    topHighlight: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 10%, transparent 20%)',
  },
  summary: 'Centered hole-punch, squared flagship silhouette',
} satisfies DevicePreset;