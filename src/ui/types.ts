/**
 * UI Component Types
 *
 * Shared type definitions for the frontend UI components.
 */

// Re-export from main types
export type {
  ColorPalette as Palette,
  DevicePresetId,
  ProjectConfig,
  ProjectInfo,
  Screenshot,
  ShapeType,
  ThemeConfig as Theme,
} from "../types/index.ts";

// Re-export ProjectConfig as Config for component convenience
export type { ProjectConfig as Config } from "../types/index.ts";

/**
 * Glow color presets
 */
export type GlowColors = Record<string, string>;

/**
 * Gradient template strings with {primary}, {secondary}, {accent} placeholders
 */
export type GradientTemplates = Record<string, string>;

/**
 * Default color palettes
 */
export type DefaultPalettes = Record<string, Palette>;

/**
 * App initial data injected by server
 */
export interface AppData {
  config: import("../types/index.ts").ProjectConfig;
  projects: import("../types/index.ts").ProjectInfo[];
  projectId: string;
  glowColors: GlowColors;
  gradientTemplates: GradientTemplates;
  palettes: DefaultPalettes;
}

/**
 * Asset lists from server
 */
export interface Assets {
  images: string[];
}

/**
 * Selected item in sidebar
 */
export type SelectedItem =
  | { type: "screenshot"; id: string }
  | null;

/**
 * Generation progress state
 */
export interface GenerateProgress {
  current: number;
  total: number;
  item: string;
  results: GenerateResult[] | null;
  outputDir: string;
}

/**
 * Generation result for single item
 */
export interface GenerateResult {
  path: string;
  relativePath: string;
  status: "success" | "error";
  error?: string;
}

// Import Palette type
import type { ColorPalette as Palette } from "../types/index.ts";
