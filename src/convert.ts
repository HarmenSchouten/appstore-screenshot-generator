#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env --allow-run
/**
 * Convert HTML screenshots to PNG using Puppeteer
 *
 * Usage:
 *   deno run -A src/convert.ts
 *   deno run -A src/convert.ts --lang en
 *   deno run -A src/convert.ts --platform android
 *   deno run -A src/convert.ts --lang nl --platform ios
 */

import puppeteer, { type Browser, type Page } from "npm:puppeteer@23.11.0";
import sharp from "npm:sharp@0.33.5";
import { join } from "@std/path";
import { ensureDir, walk } from "@std/fs";
import type { Language, Platform, ScreenshotConfig } from "./types.ts";

// Parse command line arguments
const parseArgs = () => {
  const args = Deno.args;
  return {
    lang: args.includes("--lang")
      ? args[args.indexOf("--lang") + 1] as Language
      : null,
    platform: args.includes("--platform")
      ? args[args.indexOf("--platform") + 1] as Platform
      : null,
  };
};

interface ConversionStats {
  total: number;
  successful: number;
  failed: number;
}

/**
 * Find Chrome executable path based on OS
 */
const findChromePath = (): string | undefined => {
  const paths: Record<string, string[]> = {
    win32: [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      `${
        Deno.env.get("LOCALAPPDATA")
      }\\Google\\Chrome\\Application\\chrome.exe`,
    ],
    darwin: [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ],
    linux: [
      "/usr/bin/google-chrome",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
    ],
  };

  const osType = Deno.build.os === "windows" ? "win32" : Deno.build.os;
  const osPaths = paths[osType] || [];

  for (const path of osPaths) {
    try {
      Deno.statSync(path);
      return path;
    } catch {
      // Path doesn't exist, try next
    }
  }

  return undefined;
};

/**
 * Convert HTML file to PNG with 2x supersampling
 */
const convertHTMLtoPNG = async (
  page: Page,
  htmlPath: string,
  outputPath: string,
  width: number,
  height: number,
): Promise<boolean> => {
  try {
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: 2,
    });
    await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });

    const buffer = await page.screenshot({
      type: "png",
      omitBackground: false,
    });

    await sharp(buffer)
      .resize(width, height, {
        kernel: "lanczos3",
        fit: "fill",
      })
      .png({
        quality: 100,
        compressionLevel: 6,
      })
      .toFile(outputPath);

    return true;
  } catch (error) {
    console.error(`   ❌ Failed to convert: ${error}`);
    return false;
  }
};

/**
 * Main conversion function
 */
const convert = async (config: ScreenshotConfig) => {
  const { lang: langFilter, platform: platformFilter } = parseArgs();

  const stats: ConversionStats = {
    total: 0,
    successful: 0,
    failed: 0,
  };

  console.log("📸 Converting HTML screenshots to PNG (2x supersampling)\n");

  // Clean images directory
  const imagesBaseDir = join(Deno.cwd(), "output", "images");
  try {
    await Deno.remove(imagesBaseDir, { recursive: true });
    console.log("🧹 Cleaned images directory\n");
  } catch {
    // Directory doesn't exist
  }

  // Find Chrome
  const chromePath = findChromePath();
  if (!chromePath) {
    console.error(
      "❌ Could not find Chrome/Chromium. Please install Chrome or set PUPPETEER_EXECUTABLE_PATH.",
    );
    Deno.exit(1);
  }

  console.log(`🌐 Using Chrome: ${chromePath}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
  });
  const page = await browser.newPage();

  try {
    for (const langConfig of config.languages) {
      if (langFilter && langConfig.language !== langFilter) continue;

      for (
        const [platformKey, platformConfig] of Object.entries(
          langConfig.platforms,
        )
      ) {
        const platform = platformKey as Platform;
        if (platformFilter && platform !== platformFilter) continue;

        const emoji = platform === "ios" ? "🍎" : "🤖";
        const inputDir = join(
          Deno.cwd(),
          "output",
          "html",
          langConfig.language,
          platform,
        );
        const outputDir = join(
          Deno.cwd(),
          "output",
          "images",
          langConfig.language,
          platform,
        );

        try {
          await Deno.stat(inputDir);
        } catch {
          console.log(
            `⚠️  Skipping ${langConfig.language}/${platform} (no HTML files found)`,
          );
          continue;
        }

        await ensureDir(outputDir);
        console.log(
          `${emoji} ${platform.toUpperCase()} (${langConfig.language}) - ${platformConfig.dimensions.width}x${platformConfig.dimensions.height}`,
        );

        const htmlFiles: string[] = [];
        for await (const entry of walk(inputDir, { exts: ["html"] })) {
          if (entry.isFile) htmlFiles.push(entry.path);
        }

        htmlFiles.sort();

        for (const htmlPath of htmlFiles) {
          const filename = htmlPath.split(/[\\/]/).pop()!;
          const outputFilename = filename.replace(".html", ".png");
          const outputPath = join(outputDir, outputFilename);

          const isFeatureGraphic = filename === "feature-graphic.html";
          const width = isFeatureGraphic
            ? 1024
            : platformConfig.dimensions.width;
          const height = isFeatureGraphic
            ? 500
            : platformConfig.dimensions.height;

          console.log(`   📸 Converting ${filename}...`);
          stats.total++;

          const success = await convertHTMLtoPNG(
            page,
            htmlPath,
            outputPath,
            width,
            height,
          );

          if (success) {
            console.log(
              `      ✅ Saved ${langConfig.language}/${platform}/${outputFilename}`,
            );
            stats.successful++;
          } else {
            stats.failed++;
          }
        }

        console.log();
      }
    }
  } finally {
    await browser.close();
  }

  console.log("📊 Conversion Summary");
  console.log(`   Total: ${stats.total}`);
  console.log(`   ✅ Successful: ${stats.successful}`);
  if (stats.failed > 0) {
    console.log(`   ❌ Failed: ${stats.failed}`);
  }
  console.log();

  return stats.failed === 0;
};

// Shared browser instance for server use
let sharedBrowser: Browser | null = null;

/**
 * Get or create shared browser instance
 */
async function getSharedBrowser() {
  if (!sharedBrowser) {
    const chromePath = findChromePath();
    if (!chromePath) {
      throw new Error("Could not find Chrome/Chromium");
    }
    sharedBrowser = await puppeteer.launch({
      headless: true,
      executablePath: chromePath,
    });
  }
  return sharedBrowser;
}

/**
 * Convert a single HTML file to PNG
 * Exported for use by server
 */
export async function convertHtmlFileToPng(
  htmlPath: string,
  outputPath: string,
  dimensions: { width: number; height: number },
): Promise<void> {
  const browser = await getSharedBrowser();
  const page = await browser.newPage();

  try {
    const success = await convertHTMLtoPNG(
      page,
      htmlPath,
      outputPath,
      dimensions.width,
      dimensions.height,
    );

    if (!success) {
      throw new Error("Conversion failed");
    }
  } finally {
    await page.close();
  }
}

/**
 * Cleanup shared browser
 */
export async function closeBrowser(): Promise<void> {
  if (sharedBrowser) {
    await sharedBrowser.close();
    sharedBrowser = null;
  }
}

// Export for use as module
export { convert };

// Load config from JSON or TypeScript
async function loadConfig(): Promise<ScreenshotConfig> {
  const jsonConfigPath = join(Deno.cwd(), "config", "config.json");

  // Try JSON config first
  try {
    const jsonContent = await Deno.readTextFile(jsonConfigPath);
    return JSON.parse(jsonContent);
  } catch {
    // Fall back to TypeScript config
  }

  const configPath = join(Deno.cwd(), "config", "config.ts");
  const configUrl = Deno.build.os === "windows"
    ? `file:///${configPath.replace(/\\/g, "/")}`
    : configPath;
  const { screenshotConfig } = await import(configUrl);
  return screenshotConfig;
}

// Run if executed directly
if (import.meta.main) {
  try {
    const config = await loadConfig();
    const success = await convert(config);
    Deno.exit(success ? 0 : 1);
  } catch (error) {
    console.error("❌ Error converting screenshots:", error);
    Deno.exit(1);
  }
}
