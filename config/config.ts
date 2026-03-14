/**
 * Main screenshot configuration
 *
 * This file combines all language configs and defines global settings.
 * Modify the theme, app branding, and import additional language configs here.
 */

import type { ScreenshotConfig } from '../src/types.ts';
import { enConfig } from './config.en.ts';

export const screenshotConfig: ScreenshotConfig = {
  // App branding
  app: {
    name: 'My App',
    iconPath: 'assets/icon.png',
    defaultMascotPath: 'assets/mascot.png',
  },

  // Theme configuration
  theme: {
    background: {
      gradient: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 50%, #3730a3 100%)',
    },
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap',
  },

  platformDefaults: {
    android: {
      defaultDevicePresetId: 'android-pixel-9-pro',
    },
    ios: {
      defaultDevicePresetId: 'ios-iphone-15-pro',
    },
  },

  // Assets base path (relative to project root)
  assetsBasePath: 'assets',

  // Language configurations
  languages: [enConfig],
};

// Re-export types for convenience
export * from '../src/types.ts';
