/**
 * Project and Configuration types
 */

import type { Dimensions, Language } from "./base.ts";
import type { Screenshot } from "./screenshot.ts";
import type { AppBranding, ColorPalette, ThemeConfig } from "./theme.ts";
import type { PlatformDefaults } from "./device.ts";

// ============================================================
// Platform & Language Config
// ============================================================

export interface PlatformConfig {
  /** Platform-specific dimensions */
  dimensions: Dimensions;
  /** Screenshots for this platform */
  screenshots: Screenshot[];
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
