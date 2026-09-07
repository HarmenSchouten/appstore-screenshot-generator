/**
 * Generation pipeline
 *
 * The one implementation of the languages → platforms → screenshots loop.
 * The HTML→PNG converter is injected, so the loop, its progress events, the
 * manifest and cancellation are all testable without Chrome; the SSE route
 * is a thin adapter over `generateAll`.
 *
 * The pipeline owns the project's output directory: orphans (renamed or
 * deleted screenshots, intermediate files from older versions) are pruned
 * before a run, and `manifest.json` records what the run produced so
 * `GET /generated` reads facts instead of guessing roles from aspect ratios.
 */

import { dirname, join, resolve, toFileUrl } from "@std/path";
import { ensureDir } from "@std/fs";
import type {
  DevicePresetId,
  Dimensions,
  GenerationManifest,
  GenerationProgressEvent,
  GenerationResult,
  Platform,
  ProjectConfig,
  Screenshot,
} from "@app-types";
import { getScreenshotDimensions, PLATFORMS } from "@lib";
import { renderScreenshot } from "@renderer/server.ts";

export const MANIFEST_FILE = "manifest.json";

/** Renders one HTML document to a PNG file at the given size. */
export type HtmlToPngConverter = (
  html: string,
  pngPath: string,
  dimensions: Dimensions,
) => Promise<void>;

export interface GenerateOptions {
  outputDir: string;
  assetsDir: string;
  convert: HtmlToPngConverter;
  onEvent?: (event: GenerationProgressEvent) => void;
  /** Checked between screenshots: cancelling stops after the current one. */
  signal?: AbortSignal;
}

export interface PlannedItem {
  screenshot: Screenshot;
  language: string;
  platform: Platform;
  displayName: string;
  /** Under the output dir, forward-slashed: "en/ios/hero.png" */
  relativePath: string;
  pngPath: string;
  dimensions: Dimensions;
  defaultDevicePresetId: DevicePresetId;
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "screenshot";
}

/**
 * Human-readable name for a screenshot without one: numbered within its role
 * so it matches the sidebar ("Screenshot 3" → "3-screenshot").
 */
function fallbackName(screenshot: Screenshot, siblings: Screenshot[]): string {
  const n = siblings.filter((s) => s.role === screenshot.role)
    .indexOf(screenshot) + 1;
  return `${n}-${screenshot.role}`;
}

function uniqueName(base: string, used: Set<string>): string {
  let name = base;
  let i = 2;
  while (used.has(name)) {
    name = `${base}-${i++}`;
  }
  used.add(name);
  return name;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Everything a run will produce, decided up front so the progress total, the
 * orphan prune and the loop all agree on the same file set.
 */
export function planGeneration(
  config: ProjectConfig,
  outputDir: string,
): PlannedItem[] {
  const items: PlannedItem[] = [];
  for (const langConfig of config.languages) {
    for (const platform of PLATFORMS) {
      const platformConfig = langConfig.platforms[platform];
      const usedNames = new Set<string>();
      for (const screenshot of platformConfig.screenshots) {
        const displayName = screenshot.name ||
          fallbackName(screenshot, platformConfig.screenshots);
        const fileName = uniqueName(sanitizeFilename(displayName), usedNames);
        items.push({
          screenshot,
          language: langConfig.language,
          platform,
          displayName,
          relativePath: `${langConfig.language}/${platform}/${fileName}.png`,
          pngPath: join(
            outputDir,
            langConfig.language,
            platform,
            `${fileName}.png`,
          ),
          dimensions: getScreenshotDimensions(
            screenshot,
            platformConfig.dimensions,
          ),
          defaultDevicePresetId:
            config.platformDefaults[platform].defaultDevicePresetId,
        });
      }
    }
  }
  return items;
}

async function removeIfExists(path: string): Promise<void> {
  try {
    await Deno.remove(path);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }
}

/**
 * Delete everything under `outputDir` that this run will not produce: PNGs
 * of renamed or deleted screenshots, intermediate `.html` files from older
 * versions, directories left empty, and the previous manifest (rewritten at
 * the end of the run). PNGs for current screenshots stay until overwritten,
 * so a cancelled run leaves the ones it never reached intact.
 */
export async function pruneOutputDir(
  outputDir: string,
  keep: ReadonlySet<string>,
): Promise<void> {
  /** Returns true when `dir` ended up empty. */
  async function prune(dir: string, prefix: string): Promise<boolean> {
    let empty = true;
    for await (const entry of Deno.readDir(dir)) {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const path = join(dir, entry.name);
      if (entry.isDirectory) {
        if (await prune(path, relativePath)) {
          await Deno.remove(path);
        } else {
          empty = false;
        }
      } else if (keep.has(relativePath)) {
        empty = false;
      } else {
        await Deno.remove(path);
      }
    }
    return empty;
  }

  try {
    await prune(outputDir, "");
  } catch (error) {
    // Nothing generated yet
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }
}

/** The last run's manifest, or null when nothing has been generated. */
export async function readManifest(
  outputDir: string,
): Promise<GenerationManifest | null> {
  try {
    return JSON.parse(await Deno.readTextFile(join(outputDir, MANIFEST_FILE)));
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) return null;
    throw error;
  }
}

/**
 * Render and convert every screenshot in `config`. Per-screenshot failures
 * are recorded in the results with the converter's real message and the run
 * carries on; only setup failures (unreadable output dir, …) reject.
 */
export async function generateAll(
  config: ProjectConfig,
  options: GenerateOptions,
): Promise<GenerationManifest> {
  const { outputDir, assetsDir, convert, onEvent = () => {}, signal } = options;
  const items = planGeneration(config, outputDir);
  await pruneOutputDir(
    outputDir,
    new Set(items.map((item) => item.relativePath)),
  );

  onEvent({ type: "start", total: items.length });

  const assetUrlPrefix = `${toFileUrl(resolve(assetsDir)).href}/`;
  const results: GenerationResult[] = [];
  let completed = true;

  for (const [index, item] of items.entries()) {
    if (signal?.aborted) {
      completed = false;
      break;
    }
    onEvent({
      type: "progress",
      current: index + 1,
      total: items.length,
      item: `${item.language}/${item.platform}: ${item.displayName}`,
    });

    const base = {
      relativePath: item.relativePath,
      role: item.screenshot.role,
      screenshotName: item.displayName,
      screenshotId: item.screenshot.id,
      language: item.language,
      platform: item.platform,
    };
    try {
      await ensureDir(dirname(item.pngPath));
      const html = renderScreenshot({
        screenshot: item.screenshot,
        theme: config.theme,
        app: config.app,
        platform: item.platform,
        defaultDevicePresetId: item.defaultDevicePresetId,
        dimensions: item.dimensions,
        assetUrlPrefix,
      });
      await convert(html, item.pngPath, item.dimensions);
      results.push({ ...base, status: "success" });
    } catch (error) {
      // A stale PNG from an earlier run must not pass for this run's output
      await removeIfExists(item.pngPath);
      results.push({ ...base, status: "error", error: errorMessage(error) });
    }
  }

  const manifest: GenerationManifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    completed,
    results,
  };
  await ensureDir(outputDir);
  await Deno.writeTextFile(
    join(outputDir, MANIFEST_FILE),
    JSON.stringify(manifest, null, 2),
  );

  if (completed) onEvent({ type: "complete", results, outputDir });
  return manifest;
}
