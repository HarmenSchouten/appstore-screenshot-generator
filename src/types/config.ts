/**
 * Project and Configuration types
 */

import type { Language, Dimensions } from './base.ts';
import type { Screenshot, FeatureGraphic } from './screenshot.ts';
import type { ThemeConfig, ColorPalette, AppBranding } from './theme.ts';
import type { PlatformDefaults } from './device.ts';

// ============================================================
// Platform & Language Config
// ============================================================

export interface PlatformConfig {
  /** Platform-specific dimensions */
  dimensions: Dimensions;
  /** Screenshots for this platform */
  screenshots: Screenshot[];
  /** Feature graphic (Google Play only) */
  featureGraphic?: FeatureGraphic | null;
}

export interface LanguageConfig {
  /** Language code */
  language: Language;
  /** Screenshots per platform for this language */
  platforms: {
    android: PlatformConfig;
    ios: PlatformConfig;
  };
}

// ============================================================
// Project
// ============================================================

export interface ProjectInfo {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectConfig {
  /** App branding */
  app: AppBranding;
  /** Theme configuration */
  theme: ThemeConfig;
  /** Color palette */
  palette?: ColorPalette;
  /** Base path for assets */
  assetsBasePath: string;
  /** Shared platform defaults applied across all languages */
  platformDefaults: PlatformDefaults;
  /** All language configurations */
  languages: LanguageConfig[];
}

/** Legacy alias for ScreenshotConfig - prefer using ProjectConfig */
export type ScreenshotConfig = ProjectConfig;
