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
} from "@types";

// Re-export ProjectConfig as Config for component convenience
export type { ProjectConfig as Config } from "@types";

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
  config: import("@types").ProjectConfig;
  projects: import("@types").ProjectInfo[];
  projectId: string;
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
  role: "screenshot" | "feature-graphic";
  status: "success" | "error";
  error?: string;
}

// Import Palette type
import type { ColorPalette as Palette } from "@types";
