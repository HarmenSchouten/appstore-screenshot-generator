/**
 * Theme and Color Palette types
 */

// ============================================================
// Theme
// ============================================================

export interface ThemeConfig {
  /** Primary gradient background */
  background: {
    gradient: string;
  };
  /** Font family */
  fontFamily: string;
  /** Google Fonts URL (optional) */
  googleFontsUrl?: string;
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
}
