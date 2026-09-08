/**
 * UI Component Types
 *
 * Shared type definitions for the frontend UI components.
 */

// Re-export from main types
export type {
  DevicePresetId,
  GenerationResult as GenerateResult,
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
 * A previous run's results, from GET /api/generate/generated
 */
export interface LastGenerated {
  results: import("@app-types").GenerationResult[];
  outputDir: string;
}

/**
 * Asset lists from server
 */
export interface Assets {
  images: string[];
}

/**
 * Generation progress state
 */
export interface GenerateProgress {
  current: number;
  total: number;
  item: string;
  results: import("@app-types").GenerationResult[] | null;
  outputDir: string;
  /**
   * Run-level failure (the export could not run at all). Per-screenshot
   * failures, Chrome errors included, are carried in `results`.
   */
  error: string | null;
}
