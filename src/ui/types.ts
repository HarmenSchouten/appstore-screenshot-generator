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
  ScreenshotRole,
  ShapeType,
  ThemeConfig as Theme,
} from "@app-types";

// Re-export ProjectConfig as Config for component convenience
export type { ProjectConfig as Config } from "@app-types";

/**
 * Initial app data from GET /api/init
 */
export interface AppData {
  config: import("@app-types").ProjectConfig;
  projects: import("@app-types").ProjectInfo[];
  projectId: string;
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
  role: ScreenshotRole;
  status: "success" | "error";
  error?: string;
  screenshotName?: string;
}

import type { ScreenshotRole } from "@app-types";
