import type { DevicePreset } from '../../types/device.ts';

export const ANDROID_PIXEL_9_PRO_PRESET = {
  id: 'android-pixel-9-pro',
  label: 'Pixel 9 Pro',
  platform: 'android',
  family: 'Pixel Pro',
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
    type: 'hole-punch',
    top: 10,
    diameter: 13,
    background: 'radial-gradient(circle at 35% 30%, #202228 0%, #0c0d10 42%, #020203 72%, #000 100%)',
    borderColor: 'rgba(255,255,255,0.04)',
    borderWidth: 0.75,
    shadow: '0 0 0 1px rgba(0,0,0,0.36), 0 1px 1px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.04)',
  },
  buttons: [
    { side: 'right', top: 194, height: 92, width: 5, offset: 3, radius: 3 },
    { side: 'right', top: 315, height: 126, width: 5, offset: 3, radius: 3 },
  ],
  material: {
    frameFill: 'linear-gradient(180deg, #3b3e45 0%, #1c1f24 18%, #111317 50%, #090a0c 100%)',
    innerFill: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.015) 18%, rgba(0,0,0,0.14) 100%)',
    borderColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    innerBorderColor: 'rgba(255,255,255,0.05)',
    buttonFill: 'linear-gradient(90deg, #5d626c 0%, #262a30 100%)',
    shadow: '0 26px 56px rgba(0, 0, 0, 0.34), 0 12px 24px rgba(0, 0, 0, 0.14)',
    screenShadow: '0 0 0 1px rgba(255,255,255,0.025), inset 0 0 0 1px rgba(255,255,255,0.035)',
    topHighlight: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.015) 12%, transparent 24%)',
  },
  summary: 'Centered hole-punch, 20:9 screen',
} satisfies DevicePreset;