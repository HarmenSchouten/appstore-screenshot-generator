#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Generate screenshot HTML files from configuration
 *
 * Uses the shared renderer module for consistent output with UI previews.
 *
 * Usage:
 *   deno run --allow-read --allow-write src/generate.ts
 *   deno run --allow-read --allow-write src/generate.ts --lang en
 *   deno run --allow-read --allow-write src/generate.ts --platform android
 */

import { join } from "@std/path";
import { ensureDir } from "@std/fs";
import {
  renderScreenshot,
} from "./renderer-components/server.ts";
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

/**
 * Get asset URL prefix for file:// protocol
 */
const getAssetUrlPrefix = (
  config: ScreenshotConfig,
  projectRoot: string,
): string => {
  const assetsPath = join(projectRoot, config.assetsBasePath);
  if (Deno.build.os === "windows") {
    return `file:///${assetsPath.replace(/\\/g, "/")}/`;
  }
  return `file://${assetsPath}/`;
};

/**
 * Main generation function
 */
const generate = async (config: ScreenshotConfig) => {
  const { lang: langFilter, platform: platformFilter } = parseArgs();
  const projectRoot = Deno.cwd();
  const assetUrlPrefix = getAssetUrlPrefix(config, projectRoot);

  console.log("🎨 Generating screenshot HTML files\n");

  let totalGenerated = 0;

  for (const langConfig of config.languages) {
    if (langFilter && langConfig.language !== langFilter) continue;

    for (
      const [platformKey, platformConfig] of Object.entries(
        langConfig.platforms,
      )
    ) {
      const platform = platformKey as Platform;
      if (platformFilter && platform !== platformFilter) continue;

      const outputDir = join(
        projectRoot,
        "output",
        "html",
        langConfig.language,
        platform,
      );
      await ensureDir(outputDir);

      const emoji = platform === "ios" ? "🍎" : "🤖";
      console.log(
        `${emoji} ${platform.toUpperCase()} (${langConfig.language})`,
      );

      // Generate screenshot HTML files
      for (let i = 0; i < platformConfig.screenshots.length; i++) {
        const screenshot = platformConfig.screenshots[i];
        const filename = `${
          String(i + 1).padStart(2, "0")
        }-${screenshot.id}.html`;
        const filepath = join(outputDir, filename);

        // Use shared renderer
        const html = renderScreenshot({
          screenshot,
          theme: config.theme,
          app: config.app,
          platform,
          defaultDevicePresetId:
            config.platformDefaults[platform].defaultDevicePresetId,
          dimensions: platformConfig.dimensions,
          assetUrlPrefix,
        });

        await Deno.writeTextFile(filepath, html);
        console.log(`   ✅ ${filename}`);
        totalGenerated++;
      }

      // Generate feature graphic for Android
      // if (platform === "android" && platformConfig.featureGraphic) {
      //   const filename = "feature-graphic.html";
      //   const filepath = join(outputDir, filename);

      //   // Use shared renderer
      //   const html = renderFeatureGraphic({
      //     featureGraphic: platformConfig.featureGraphic,
      //     theme: config.theme,
      //     app: config.app,
      //     platform: "android",
      //     defaultDevicePresetId:
      //       config.platformDefaults.android.defaultDevicePresetId,
      //     assetUrlPrefix,
      //   });

      //   await Deno.writeTextFile(filepath, html);
      //   console.log(`   ✅ ${filename}`);
      //   totalGenerated++;
      // }

      console.log();
    }
  }

  console.log(`📊 Generated ${totalGenerated} HTML files\n`);
};

// Export for use as module
export { generate };

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
    await generate(config);
  } catch (error) {
    console.error("❌ Error generating screenshots:", error);
    Deno.exit(1);
  }
}
