/**
 * Theme and Color Palette types
 */

import type { TypographyOptions } from './components.ts';

// ============================================================
// Theme
// ============================================================

export interface ThemeConfig {
  /** Primary gradient background */
  background: {
    gradient: string;
    /** Gradient color stops for visual editing */
    colors?: string[];
    /** Gradient direction in degrees (0 = top to bottom, 90 = left to right) */
    direction?: number;
  };
  /** Font family */
  fontFamily: string;
  /** Google Fonts URL (optional) */
  googleFontsUrl?: string;
  /** Default typography settings (can be overridden per screenshot) */
  defaultTypography?: TypographyOptions;
}

// ============================================================
// Color Palette & Gradients
// ============================================================

/** Color Palette for consistent theming */
export interface ColorPalette {
  /** Main brand color (hex) */
  primary: string;
  /** Secondary brand color (hex) */
  secondary: string;
  /** Accent color (hex) */
  accent: string;
}

/** Gradient preset definition */
export interface GradientPreset {
  id: string;
  name: string;
  /** CSS gradient string */
  css: string;
}

/** Gradient template with palette placeholders */
export interface GradientTemplate {
  id: string;
  name: string;
  /** Template string with {primary}, {secondary}, {accent} placeholders */
  template: string;
}

// ============================================================
// App Branding
// ============================================================

export interface AppBranding {
  /** App name */
  name: string;
  /** App icon path (relative to assets) */
  iconPath?: string;
  /** Default mascot image path */
  defaultMascotPath?: string;
}

/** Alias for renderer compatibility */
export type AppConfig = AppBranding;
