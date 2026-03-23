/**
 * Generation Routes
 *
 * Handles screenshot generation and export functionality.
 */

import { Hono } from "hono";
import { join } from "@std/path";
import { ensureDir } from "@std/fs";
import type { ProjectConfig } from "../types/index.ts";
import { getProjectAssetsDir, getProjectOutputDir } from "../projects.ts";
import { renderScreenshot } from "../renderer-components/server.ts";

export function createGenerateRoutes(
  getCurrentProjectId: () => string,
  getConfig: () => Promise<ProjectConfig>,
) {
  const routes = new Hono();

  /**
   * Generate all screenshots for export
   */
  routes.post("/", async (c) => {
    const { languages, platforms } = await c.req.json();
    const config = await getConfig();
    const outputDir = getProjectOutputDir(getCurrentProjectId());
    const assetsDir = getProjectAssetsDir(getCurrentProjectId());

    const results: {
      path: string;
      status: "success" | "error";
      error?: string;
    }[] = [];

    // Import convert module for HTML to PNG
    const { convertHtmlFileToPng } = await import("../convert.ts");

    for (const langConfig of config.languages) {
      if (languages && !languages.includes(langConfig.language)) continue;

      for (
        const [platformName, platformConfig] of Object.entries(
          langConfig.platforms,
        )
      ) {
        if (platforms && !platforms.includes(platformName)) continue;
        if (!platformConfig) continue;

        const langOutputDir = join(
          outputDir,
          langConfig.language,
          platformName,
        );
        await ensureDir(langOutputDir);

        // Generate screenshots
        for (const screenshot of platformConfig.screenshots) {
          const htmlPath = join(langOutputDir, `${screenshot.id}.html`);
          const pngPath = join(langOutputDir, `${screenshot.id}.png`);

          try {
            // Generate HTML using renderer
            const html = renderScreenshot({
              screenshot,
              theme: config.theme,
              app: config.app,
              platform: platformName as "android" | "ios",
              defaultDevicePresetId:
                config.platformDefaults[platformName as "android" | "ios"]
                  .defaultDevicePresetId,
              dimensions: platformConfig.dimensions,
              assetUrlPrefix: `file:///${assetsDir.replace(/\\/g, "/")}/`,
            });

            await Deno.writeTextFile(htmlPath, html);

            // Convert to PNG
            await convertHtmlFileToPng(
              htmlPath,
              pngPath,
              platformConfig.dimensions,
            );

            results.push({ path: pngPath, status: "success" });
          } catch (error) {
            results.push({
              path: pngPath,
              status: "error",
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }

        // Generate feature graphic if Android
        if (platformName === "android" && platformConfig.featureGraphic) {
          const fg = platformConfig.featureGraphic;
          const htmlPath = join(langOutputDir, "feature-graphic.html");
          const pngPath = join(langOutputDir, "feature-graphic.png");

          try {
            const html = renderFeatureGraphic({
              featureGraphic: fg,
              theme: config.theme,
              app: config.app,
              platform: "android",
              defaultDevicePresetId:
                config.platformDefaults.android.defaultDevicePresetId,
              assetUrlPrefix: `file:///${assetsDir.replace(/\\/g, "/")}/`,
            });

            await Deno.writeTextFile(htmlPath, html);
            await convertHtmlFileToPng(htmlPath, pngPath, {
              width: 1024,
              height: 500,
            });

            results.push({ path: pngPath, status: "success" });
          } catch (error) {
            results.push({
              path: pngPath,
              status: "error",
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }
      }
    }

    return c.json({ results, outputDir });
  });

  /**
   * Generate with streaming progress
   */
  routes.post("/stream", async (_c) => {
    const config = await getConfig();
    const outputDir = getProjectOutputDir(getCurrentProjectId());
    const assetsDir = getProjectAssetsDir(getCurrentProjectId());

    // Calculate total items
    let totalItems = 0;
    for (const langConfig of config.languages) {
      for (
        const [platformName, platformConfig] of Object.entries(
          langConfig.platforms,
        )
      ) {
        if (!platformConfig) continue;
        totalItems += platformConfig.screenshots.length;
        if (platformName === "android" && platformConfig.featureGraphic) {
          totalItems++;
        }
      }
    }

    // Stream response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (data: unknown) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
          );
        };

        const { convertHtmlFileToPng } = await import("../convert.ts");
        let completed = 0;
        const results: {
          path: string;
          relativePath: string;
          status: "success" | "error";
          error?: string;
        }[] = [];

        send({ type: "start", total: totalItems });

        for (const langConfig of config.languages) {
          for (
            const [platformName, platformConfig] of Object.entries(
              langConfig.platforms,
            )
          ) {
            if (!platformConfig) continue;

            const langOutputDir = join(
              outputDir,
              langConfig.language,
              platformName,
            );
            await ensureDir(langOutputDir);

            for (const screenshot of platformConfig.screenshots) {
              const htmlPath = join(langOutputDir, `${screenshot.id}.html`);
              const pngPath = join(langOutputDir, `${screenshot.id}.png`);
              const relativePath =
                `${langConfig.language}/${platformName}/${screenshot.id}.png`;

              send({
                type: "progress",
                current: completed + 1,
                total: totalItems,
                item: `${langConfig.language}/${platformName}: ${
                  screenshot.headline || screenshot.id
                }`,
              });

              try {
                const html = renderScreenshot({
                  screenshot,
                  theme: config.theme,
                  app: config.app,
                  platform: platformName as "android" | "ios",
                  defaultDevicePresetId:
                    config.platformDefaults[platformName as "android" | "ios"]
                      .defaultDevicePresetId,
                  dimensions: platformConfig.dimensions,
                  assetUrlPrefix: `file:///${assetsDir.replace(/\\/g, "/")}/`,
                });
                await Deno.writeTextFile(htmlPath, html);
                await convertHtmlFileToPng(
                  htmlPath,
                  pngPath,
                  platformConfig.dimensions,
                );
                results.push({
                  path: pngPath,
                  relativePath,
                  status: "success",
                });
              } catch (error) {
                results.push({
                  path: pngPath,
                  relativePath,
                  status: "error",
                  error: error instanceof Error
                    ? error.message
                    : "Unknown error",
                });
              }
              completed++;
            }

            if (platformName === "android" && platformConfig.featureGraphic) {
              const fg = platformConfig.featureGraphic;
              const htmlPath = join(langOutputDir, "feature-graphic.html");
              const pngPath = join(langOutputDir, "feature-graphic.png");
              const relativePath =
                `${langConfig.language}/${platformName}/feature-graphic.png`;

              send({
                type: "progress",
                current: completed + 1,
                total: totalItems,
                item: `${langConfig.language}/${platformName}: Feature Graphic`,
              });

              try {
                const html = renderFeatureGraphic({
                  featureGraphic: fg,
                  theme: config.theme,
                  app: config.app,
                  platform: "android",
                  defaultDevicePresetId:
                    config.platformDefaults.android.defaultDevicePresetId,
                  assetUrlPrefix: `file:///${assetsDir.replace(/\\/g, "/")}/`,
                });
                await Deno.writeTextFile(htmlPath, html);
                await convertHtmlFileToPng(htmlPath, pngPath, {
                  width: 1024,
                  height: 500,
                });
                results.push({
                  path: pngPath,
                  relativePath,
                  status: "success",
                });
              } catch (error) {
                results.push({
                  path: pngPath,
                  relativePath,
                  status: "error",
                  error: error instanceof Error
                    ? error.message
                    : "Unknown error",
                });
              }
              completed++;
            }
          }
        }

        send({ type: "complete", results, outputDir });
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  });

  /**
   * Open folder in system file explorer
   */
  routes.post("/open-folder", async (c) => {
    const { path } = await c.req.json();
    const folderPath = path || getProjectOutputDir(getCurrentProjectId());

    try {
      // Windows: explorer, macOS: open, Linux: xdg-open
      const cmd = Deno.build.os === "windows"
        ? ["explorer", folderPath]
        : Deno.build.os === "darwin"
        ? ["open", folderPath]
        : ["xdg-open", folderPath];

      const command = new Deno.Command(cmd[0], { args: cmd.slice(1) });
      await command.spawn();
      return c.json({ success: true });
    } catch (error) {
      return c.json({
        error: error instanceof Error ? error.message : "Failed to open folder",
      }, 500);
    }
  });

  /**
   * Get previously generated images
   */
  routes.get("/generated", async (c) => {
    const outputDir = getProjectOutputDir(getCurrentProjectId());
    const results: { relativePath: string; status: string }[] = [];

    async function scanDir(dir: string, prefix: string = "") {
      try {
        for await (const entry of Deno.readDir(dir)) {
          const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
          if (entry.isDirectory) {
            await scanDir(join(dir, entry.name), relativePath);
          } else if (
            entry.isFile &&
            (entry.name.endsWith(".png") || entry.name.endsWith(".jpg"))
          ) {
            results.push({ relativePath, status: "success" });
          }
        }
      } catch {
        // Directory doesn't exist or can't be read
      }
    }

    await scanDir(outputDir);
    return c.json({ results, outputDir });
  });

  /**
   * Serve generated output files
   */
  routes.get("/output/:path{.+}", async (c) => {
    const filePath = c.req.param("path");
    const fullPath = join(getProjectOutputDir(getCurrentProjectId()), filePath);

    try {
      const file = await Deno.readFile(fullPath);
      const ext = fullPath.split(".").pop()?.toLowerCase();
      const contentType = ext === "png"
        ? "image/png"
        : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : "application/octet-stream";
      return new Response(file, { headers: { "Content-Type": contentType } });
    } catch {
      return c.notFound();
    }
  });

  return routes;
}
