/**
 * Config Routes
 *
 * Handles configuration management: screenshots, feature graphics, languages.
 */

import { Hono } from "hono";
import type { ProjectConfig, Screenshot } from "@types";
import { saveProject } from "../projects.ts";

export function createConfigRoutes(
  getCurrentProjectId: () => string,
  getConfig: () => Promise<ProjectConfig>,
  setConfig: (config: ProjectConfig) => void,
) {
  const routes = new Hono();

  /**
   * Get config
   */
  routes.get("/", async (c) => {
    const config = await getConfig();
    return c.json(config);
  });

  /**
   * Update full config
   */
  routes.put("/", async (c) => {
    const config = await c.req.json() as ProjectConfig;
    await saveProject(getCurrentProjectId(), config);
    setConfig(config);
    return c.json({ success: true });
  });

  /**
   * Update screenshot
   */
  routes.put("/screenshot/:lang/:platform/:id", async (c) => {
    const { lang, platform, id } = c.req.param();
    const updates = await c.req.json();
    const config = await getConfig();

    const langIndex = config.languages.findIndex((l) => l.language === lang);
    if (langIndex === -1) return c.json({ error: "Language not found" }, 404);

    const platformConfig =
      config.languages[langIndex].platforms[platform as "android" | "ios"];
    if (!platformConfig) return c.json({ error: "Platform not found" }, 404);

    const screenshotIndex = platformConfig.screenshots.findIndex((s) =>
      s.id === id
    );
    if (screenshotIndex === -1) {
      return c.json({ error: "Screenshot not found" }, 404);
    }

    platformConfig.screenshots[screenshotIndex] = {
      ...platformConfig.screenshots[screenshotIndex],
      ...updates,
    };

    await saveProject(getCurrentProjectId(), config);
    setConfig(config);
    return c.json(platformConfig.screenshots[screenshotIndex]);
  });

  /**
   * Add new screenshot
   */
  routes.post("/screenshot/:lang/:platform", async (c) => {
    const { lang, platform } = c.req.param();
    const screenshot = await c.req.json() as Screenshot;
    const config = await getConfig();

    const langIndex = config.languages.findIndex((l) => l.language === lang);
    if (langIndex === -1) return c.json({ error: "Language not found" }, 404);

    let platformConfig =
      config.languages[langIndex].platforms[platform as "android" | "ios"];
    if (!platformConfig) {
      // Create platform config
      (config.languages[langIndex].platforms as Record<string, unknown>)[
        platform
      ] = {
        dimensions: platform === "ios"
          ? { width: 1242, height: 2688 }
          : { width: 1242, height: 2688 },
        screenshots: [],
      };
      platformConfig =
        config.languages[langIndex].platforms[platform as "android" | "ios"];
    }

    platformConfig.screenshots.push(screenshot);
    await saveProject(getCurrentProjectId(), config);
    setConfig(config);
    return c.json(screenshot);
  });

  /**
   * Delete screenshot
   */
  routes.delete("/screenshot/:lang/:platform/:id", async (c) => {
    const { lang, platform, id } = c.req.param();
    const config = await getConfig();

    const langIndex = config.languages.findIndex((l) => l.language === lang);
    if (langIndex === -1) return c.json({ error: "Language not found" }, 404);

    const platformConfig =
      config.languages[langIndex].platforms[platform as "android" | "ios"];
    if (!platformConfig) return c.json({ error: "Platform not found" }, 404);

    platformConfig.screenshots = platformConfig.screenshots.filter((s) =>
      s.id !== id
    );
    await saveProject(getCurrentProjectId(), config);
    setConfig(config);
    return c.json({ success: true });
  });

  /**
   * Add new language
   */
  routes.post("/language", async (c) => {
    const { language, copyFrom } = await c.req.json();
    const config = await getConfig();

    // Check if language already exists
    if (config.languages.find((l) => l.language === language)) {
      return c.json({ error: "Language already exists" }, 400);
    }

    let newLangConfig;
    if (copyFrom) {
      const source = config.languages.find((l) => l.language === copyFrom);
      if (source) {
        newLangConfig = JSON.parse(JSON.stringify(source));
        newLangConfig.language = language;
      }
    }

    if (!newLangConfig) {
      newLangConfig = {
        language,
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
      };
    }

    config.languages.push(newLangConfig);
    await saveProject(getCurrentProjectId(), config);
    setConfig(config);
    return c.json(newLangConfig);
  });

  /**
   * Delete language
   */
  routes.delete("/language/:lang", async (c) => {
    const { lang } = c.req.param();
    const config = await getConfig();

    if (config.languages.length <= 1) {
      return c.json({ error: "Cannot delete the only language" }, 400);
    }

    config.languages = config.languages.filter((l) => l.language !== lang);
    await saveProject(getCurrentProjectId(), config);
    setConfig(config);
    return c.json({ success: true });
  });

  /**
   * Copy platform screenshots
   */
  routes.post("/copy-platform", async (c) => {
    const { language, sourcePlatform, targetPlatform } = await c.req.json() as {
      language: string;
      sourcePlatform: "android" | "ios";
      targetPlatform: "android" | "ios";
    };
    const config = await getConfig();

    const langConfig = config.languages.find((l) => l.language === language);
    if (!langConfig) {
      return c.json({ error: "Language not found" }, 404);
    }

    const source = langConfig.platforms[sourcePlatform];
    if (!source) {
      return c.json({ error: "Source platform not found" }, 404);
    }

    // Deep clone source screenshots with new IDs, excluding feature graphics
    const copiedScreenshots = source.screenshots
      .filter((s) => s.role !== "feature-graphic")
      .map((s) => ({
        ...JSON.parse(JSON.stringify(s)),
        id: crypto.randomUUID(),
      }));

    // Initialize target platform if needed
    if (!langConfig.platforms[targetPlatform]) {
      langConfig.platforms[targetPlatform] = {
        dimensions: targetPlatform === "ios"
          ? { width: 1242, height: 2688 }
          : { width: 1080, height: 1920 },
        screenshots: [],
      };
    }

    // Replace target screenshots
    langConfig.platforms[targetPlatform].screenshots = copiedScreenshots;

    await saveProject(getCurrentProjectId(), config);
    setConfig(config);
    return c.json(langConfig);
  });

  return routes;
}
