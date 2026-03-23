/**
 * Shared Constants and Utilities
 *
 * This module contains shared constants, templates, and utility functions
 * used throughout the application.
 */

import type { ColorPalette, GradientTemplate } from "../types/index.ts";
import { DEFAULT_PLATFORM_DEFAULTS } from "../device-presets/index.ts";

// ============================================================
// Gradient Templates
// ============================================================

/**
 * Predefined gradient templates - use {primary}, {secondary}, {accent} as placeholders
 */
export const GRADIENT_TEMPLATES: GradientTemplate[] = [
  { id: "solid-primary", name: "Solid Primary", template: "{primary}" },
  { id: "solid-secondary", name: "Solid Secondary", template: "{secondary}" },
  {
    id: "primary-dark",
    name: "Primary to Dark",
    template: "linear-gradient(135deg, {primary} 0%, #0a0a0a 100%)",
  },
  {
    id: "primary-secondary",
    name: "Primary to Secondary",
    template: "linear-gradient(135deg, {primary} 0%, {secondary} 100%)",
  },
  {
    id: "secondary-primary",
    name: "Secondary to Primary",
    template: "linear-gradient(135deg, {secondary} 0%, {primary} 100%)",
  },
  {
    id: "radial-primary",
    name: "Radial Primary",
    template: "radial-gradient(circle at 30% 30%, {primary} 0%, #0a0a0a 70%)",
  },
  {
    id: "radial-secondary",
    name: "Radial Secondary",
    template: "radial-gradient(circle at 30% 30%, {secondary} 0%, #0a0a0a 70%)",
  },
  {
    id: "mesh-primary",
    name: "Mesh Primary",
    template:
      "linear-gradient(135deg, {primary}22 0%, transparent 50%), linear-gradient(225deg, {secondary}22 0%, transparent 50%), #0a0a0a",
  },
  {
    id: "diagonal-split",
    name: "Diagonal Split",
    template:
      "linear-gradient(135deg, {primary} 0%, {primary} 50%, {secondary} 50%, {secondary} 100%)",
  },
  {
    id: "triple-gradient",
    name: "Triple Gradient",
    template:
      "linear-gradient(135deg, {primary} 0%, {secondary} 50%, {accent} 100%)",
  },
];

// ============================================================
// Default Palettes
// ============================================================

/**
 * Default color palettes for quick setup
 */
export const DEFAULT_PALETTES: { name: string; palette: ColorPalette }[] = [
  {
    name: "Purple Night",
    palette: { primary: "#a855f7", secondary: "#6366f1", accent: "#ec4899" },
  },
  {
    name: "Ocean Blue",
    palette: { primary: "#3b82f6", secondary: "#06b6d4", accent: "#22c55e" },
  },
  {
    name: "Sunset",
    palette: { primary: "#f97316", secondary: "#ef4444", accent: "#f59e0b" },
  },
  {
    name: "Forest",
    palette: { primary: "#22c55e", secondary: "#14b8a6", accent: "#84cc16" },
  },
  {
    name: "Rose",
    palette: { primary: "#ec4899", secondary: "#f43f5e", accent: "#a855f7" },
  },
  {
    name: "Midnight",
    palette: { primary: "#6366f1", secondary: "#8b5cf6", accent: "#3b82f6" },
  },
  {
    name: "Ember",
    palette: { primary: "#ef4444", secondary: "#f97316", accent: "#fbbf24" },
  },
  {
    name: "Teal",
    palette: { primary: "#14b8a6", secondary: "#06b6d4", accent: "#22c55e" },
  },
];

// ============================================================
// Utility Functions
// ============================================================

/**
 * Apply palette colors to a gradient template
 */
export function applyPaletteToGradient(
  template: string,
  palette: ColorPalette,
): string {
  return template
    .replace(/\{primary\}/g, palette.primary)
    .replace(/\{secondary\}/g, palette.secondary)
    .replace(/\{accent\}/g, palette.accent);
}

/**
 * Get default project configuration
 */
export function getDefaultConfig(appName: string = "My App") {
  return {
    app: {
      name: appName,
      iconPath: "",
      defaultMascotPath: "",
    },
    theme: {
      background: {
        gradient: "linear-gradient(135deg, #a855f7 0%, #0a0a0a 100%)",
      },
      fontFamily: "Inter, sans-serif",
      googleFontsUrl:
        "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');",
    },
    palette: DEFAULT_PALETTES[0].palette,
    platformDefaults: structuredClone(DEFAULT_PLATFORM_DEFAULTS),
    assetsBasePath: "assets",
    languages: [
      {
        language: "en",
        platforms: {
          android: {
            dimensions: { width: 1242, height: 2688 },
            screenshots: [],
          },
          ios: {
            dimensions: { width: 1242, height: 2688 },
            screenshots: [],
          },
        },
      },
    ],
  };
}
