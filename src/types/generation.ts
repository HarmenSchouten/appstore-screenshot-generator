/**
 * Generation types — shared by the server pipeline, the SSE route and the UI
 */

import type { Platform } from "./base.ts";
import type { ScreenshotRole } from "./screenshot.ts";

/** Outcome for one screenshot in a generation run */
export interface GenerationResult {
  /** Under the project's output dir, forward-slashed: "en/ios/hero.png" */
  relativePath: string;
  role: ScreenshotRole;
  status: "success" | "error";
  /** The converter's or renderer's real message when status is "error" */
  error?: string;
  screenshotName: string;
  screenshotId: string;
  language: string;
  platform: Platform;
}

/**
 * `output/manifest.json` — what the last run produced, so nothing has to be
 * guessed from the files on disk
 */
export interface GenerationManifest {
  version: 1;
  generatedAt: string;
  /** false when the run was cancelled before reaching every screenshot */
  completed: boolean;
  results: GenerationResult[];
}

/** Events the pipeline emits while running; the SSE route relays them verbatim */
export type GenerationProgressEvent =
  | { type: "start"; total: number }
  | { type: "progress"; current: number; total: number; item: string }
  | { type: "complete"; results: GenerationResult[]; outputDir: string };

/**
 * Run-level failure (output dir unreadable, …). Per-screenshot failures,
 * including Chrome errors, are carried in `results` instead.
 */
export interface GenerationErrorEvent {
  type: "error";
  message: string;
}

export type GenerationEvent = GenerationProgressEvent | GenerationErrorEvent;
