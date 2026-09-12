/**
 * Config Routes
 *
 * Screenshots, feature graphics and languages of the active project.
 */

import { Hono } from "hono";
import type {
  LanguageConfig,
  PlatformConfig,
  ProjectConfig,
  Screenshot,
} from "@app-types";
import { createLanguageConfig, saveProject } from "@/projects.ts";
import { isScreenshotRole, SCREENSHOT_ROLES } from "@lib";
import { ConflictError, NotFoundError, ValidationError } from "@/errors.ts";
import type { ServerContext } from "./context.ts";
import {
  isRecord,
  optionalString,
  readJsonBody,
  requireObject,
  requirePlatform,
  requireString,
} from "./http.ts";

function findLanguage(config: ProjectConfig, lang: string): LanguageConfig {
  const langConfig = config.languages.find((l) => l.language === lang);
  if (!langConfig) throw new NotFoundError("Language not found");
  return langConfig;
}

function findPlatform(
  config: ProjectConfig,
  lang: string,
  platform: string,
): PlatformConfig {
  return findLanguage(config, lang).platforms[requirePlatform(platform)];
}

function findScreenshotIndex(
  platformConfig: PlatformConfig,
  id: string,
): number {
  const index = platformConfig.screenshots.findIndex((s) => s.id === id);
  if (index === -1) throw new NotFoundError("Screenshot not found");
  return index;
}

/**
 * Minimal shape check for a whole config: the top-level sections the server
 * and renderer dereference unconditionally. Everything below that is the
 * editor's business; `normalizeProjectConfig` fills in platform gaps.
 */
function requireConfig(body: unknown): ProjectConfig {
  const config = requireObject(body, "Config");
  if (
    !isRecord(config.app) || !isRecord(config.theme) ||
    !Array.isArray(config.languages)
  ) {
    throw new ValidationError(
      'Config must have "app" and "theme" objects and a "languages" array',
    );
  }
  for (const lang of config.languages) {
    if (
      !isRecord(lang) || typeof lang.language !== "string" ||
      (lang.platforms !== undefined && !isRecord(lang.platforms))
    ) {
      throw new ValidationError(
        'Every "languages" entry must have a "language" string and, if present, a "platforms" object',
      );
    }
  }
  return config as unknown as ProjectConfig;
}

/** A new screenshot from a client body; the id is always server-generated. */
function requireNewScreenshot(body: unknown): Screenshot {
  const shot = requireObject(body, "Screenshot");
  if (!isScreenshotRole(shot.role)) {
    throw new ValidationError(
      `"role" must be one of: ${SCREENSHOT_ROLES.join(", ")}`,
    );
  }
  if (!Array.isArray(shot.layers)) {
    throw new ValidationError('"layers" must be an array');
  }
  const name = optionalString(shot, "name");
  return {
    id: crypto.randomUUID(),
    role: shot.role,
    layers: shot.layers as Screenshot["layers"],
    ...(name !== undefined && { name }),
  };
}

export function createConfigRoutes(ctx: ServerContext) {
  const routes = new Hono();

  /** Persist a mutated config; memory and disk both get the normalized copy. */
  async function persist(config: ProjectConfig): Promise<void> {
    ctx.setConfig(await saveProject(ctx.getCurrentProjectId(), config));
  }

  routes.get("/", async (c) => c.json(await ctx.getConfig()));

  routes.put("/", async (c) => {
    await persist(requireConfig(await readJsonBody(c)));
    return c.json({ success: true });
  });

  routes.put("/screenshot/:lang/:platform/:id", async (c) => {
    const { lang, platform, id } = c.req.param();
    const updates = requireObject(await readJsonBody(c), "Screenshot updates");
    // The id is the address and the role drives canvas size; neither is patchable
    const { id: _id, role: _role, ...patch } = updates;

    const config = await ctx.getConfig();
    const platformConfig = findPlatform(config, lang, platform);
    const index = findScreenshotIndex(platformConfig, id);
    platformConfig.screenshots[index] = {
      ...platformConfig.screenshots[index],
      ...patch,
    };

    await persist(config);
    return c.json(platformConfig.screenshots[index]);
  });

  routes.post("/screenshot/:lang/:platform", async (c) => {
    const { lang, platform } = c.req.param();
    const screenshot = requireNewScreenshot(await readJsonBody(c));

    const config = await ctx.getConfig();
    findPlatform(config, lang, platform).screenshots.push(screenshot);

    await persist(config);
    return c.json(screenshot);
  });

  routes.delete("/screenshot/:lang/:platform/:id", async (c) => {
    const { lang, platform, id } = c.req.param();

    const config = await ctx.getConfig();
    const platformConfig = findPlatform(config, lang, platform);
    platformConfig.screenshots.splice(
      findScreenshotIndex(platformConfig, id),
      1,
    );

    await persist(config);
    return c.json({ success: true });
  });

  routes.post("/language", async (c) => {
    const body = requireObject(await readJsonBody(c));
    const language = requireString(body, "language");
    const copyFrom = optionalString(body, "copyFrom");

    const config = await ctx.getConfig();
    if (config.languages.some((l) => l.language === language)) {
      throw new ConflictError("Language already exists");
    }

    let newLangConfig: LanguageConfig;
    if (copyFrom !== undefined) {
      const source = config.languages.find((l) => l.language === copyFrom);
      if (!source) {
        throw new NotFoundError(`Source language "${copyFrom}" not found`);
      }
      newLangConfig = { ...structuredClone(source), language };
    } else {
      newLangConfig = createLanguageConfig(language);
    }

    config.languages.push(newLangConfig);
    await persist(config);
    return c.json(newLangConfig);
  });

  routes.delete("/language/:lang", async (c) => {
    const { lang } = c.req.param();

    const config = await ctx.getConfig();
    findLanguage(config, lang);
    if (config.languages.length <= 1) {
      throw new ValidationError("Cannot delete the only language");
    }

    config.languages = config.languages.filter((l) => l.language !== lang);
    await persist(config);
    return c.json({ success: true });
  });

  routes.post("/copy-platform", async (c) => {
    const body = requireObject(await readJsonBody(c));
    const language = requireString(body, "language");
    const sourcePlatform = requirePlatform(
      body.sourcePlatform,
      "sourcePlatform",
    );
    const targetPlatform = requirePlatform(
      body.targetPlatform,
      "targetPlatform",
    );
    if (sourcePlatform === targetPlatform) {
      throw new ValidationError(
        "sourcePlatform and targetPlatform must differ",
      );
    }

    const config = await ctx.getConfig();
    const langConfig = findLanguage(config, language);

    // Deep clone source screenshots with new ids, excluding feature graphics
    langConfig.platforms[targetPlatform].screenshots = langConfig
      .platforms[sourcePlatform].screenshots
      .filter((s) => s.role !== "feature-graphic")
      .map((s) => ({ ...structuredClone(s), id: crypto.randomUUID() }));

    await persist(config);
    return c.json(langConfig);
  });

  return routes;
}
