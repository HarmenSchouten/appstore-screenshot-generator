/**
 * Project Management Module
 *
 * Handles creating, loading, saving, and switching between projects.
 * Each project has its own config, assets, and output directories.
 */

import { join } from "@std/path";
import { copy, ensureDir, exists } from "@std/fs";

import {
  DEFAULT_PLATFORM_DEFAULTS,
  isDevicePresetId,
  LEGACY_PLATFORM_DEFAULTS,
} from "@device-presets";
import type {
  LanguageConfig,
  Platform,
  PlatformConfig,
  ProjectConfig,
  ProjectInfo,
} from "@app-types";
import { DEFAULT_DIMENSIONS } from "@lib";
import { ConflictError, NotFoundError, ValidationError } from "@/errors.ts";

const PROJECTS_DIR = "projects";
const DEFAULT_PROJECT_ID = "default";

/**
 * Project ids are the slugs `createProject` produces; nothing else is ever a
 * valid id. Every lookup is checked against the same shape, so a
 * client-supplied id can't name a path (`..`, `a/b`, `C:`) and reach
 * `Deno.remove`.
 */
const PROJECT_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

export function isValidProjectId(id: string): boolean {
  return PROJECT_ID_PATTERN.test(id);
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Get projects directory path
 *
 * PROJECTS_DIR env var overrides the default location so tests can point
 * the whole module at a temp directory.
 */
export function getProjectsDir(): string {
  return Deno.env.get("PROJECTS_DIR") ?? join(Deno.cwd(), PROJECTS_DIR);
}

/**
 * Get project directory path. Throws a 400 for anything that isn't a slug —
 * this is the single chokepoint every project-relative path goes through.
 */
export function getProjectDir(projectId: string): string {
  if (!isValidProjectId(projectId)) {
    throw new ValidationError(`Invalid project id "${projectId}"`);
  }
  return join(getProjectsDir(), projectId);
}

/**
 * Get project config path
 */
export function getProjectConfigPath(projectId: string): string {
  return join(getProjectDir(projectId), "config.json");
}

/**
 * Get project assets directory
 */
export function getProjectAssetsDir(projectId: string): string {
  return join(getProjectDir(projectId), "assets");
}

/**
 * Get project output directory
 */
export function getProjectOutputDir(projectId: string): string {
  return join(getProjectDir(projectId), "output");
}

function getProjectInfoPath(projectId: string): string {
  return join(getProjectDir(projectId), "project.json");
}

/** An empty platform config at the platform's default store dimensions. */
export function createPlatformConfig(platform: Platform): PlatformConfig {
  return {
    dimensions: { ...DEFAULT_DIMENSIONS[platform] },
    screenshots: [],
  };
}

/** A language with an empty config for every platform. */
export function createLanguageConfig(language: string): LanguageConfig {
  return {
    language,
    platforms: {
      android: createPlatformConfig("android"),
      ios: createPlatformConfig("ios"),
    },
  };
}

/**
 * Default project configuration template
 */
export function getDefaultConfig(appName: string = "My App"): ProjectConfig {
  return {
    app: {
      name: appName,
    },
    theme: {
      background: {
        gradient:
          "linear-gradient(180deg, #6366f1 0%, #4f46e5 50%, #3730a3 100%)",
      },
      fontFamily:
        "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
    },
    platformDefaults: structuredClone(DEFAULT_PLATFORM_DEFAULTS),
    assetsBasePath: "assets",
    languages: [createLanguageConfig("en")],
  };
}

/**
 * Bring a config up to the invariants the rest of the code relies on: valid
 * platform defaults, and every language carrying a config for every
 * platform. `LanguageConfig.platforms` can type both platforms as required
 * because this runs on every load and save.
 */
export function normalizeProjectConfig(config: ProjectConfig): ProjectConfig {
  const fallbackPlatformDefaults = config.platformDefaults
    ? DEFAULT_PLATFORM_DEFAULTS
    : LEGACY_PLATFORM_DEFAULTS;

  const androidId = config.platformDefaults?.android?.defaultDevicePresetId;
  const iosId = config.platformDefaults?.ios?.defaultDevicePresetId;

  return {
    ...config,
    platformDefaults: {
      android: {
        defaultDevicePresetId:
          (androidId && isDevicePresetId(androidId) ? androidId : null) ??
            fallbackPlatformDefaults.android.defaultDevicePresetId,
      },
      ios: {
        defaultDevicePresetId:
          (iosId && isDevicePresetId(iosId) ? iosId : null) ??
            fallbackPlatformDefaults.ios.defaultDevicePresetId,
      },
    },
    languages: (config.languages ?? []).map((lang) => ({
      ...lang,
      platforms: {
        android: withLayerIds(
          lang.platforms?.android ?? createPlatformConfig("android"),
        ),
        ios: withLayerIds(lang.platforms?.ios ?? createPlatformConfig("ios")),
      },
    })),
  };
}

/**
 * Layer ids key the editor's list and its selection, so they have to be
 * stable. Configs written before layers had ids carry none; minting them in
 * the UI on every render made keys and the active layer drift (#65). They
 * are assigned once here and persisted by `loadProject`.
 */
function withLayerIds(platform: PlatformConfig): PlatformConfig {
  let changed = false;
  const screenshots = platform.screenshots.map((screenshot) => {
    const layers = screenshot.layers ?? [];
    if (layers.every((layer) => layer.id)) return screenshot;
    changed = true;
    return {
      ...screenshot,
      layers: layers.map((layer) =>
        layer.id ? layer : { ...layer, id: crypto.randomUUID() }
      ),
    };
  });
  return changed ? { ...platform, screenshots } : platform;
}

/**
 * Read project.json, or synthesise one for a directory that predates it.
 * Only a missing file is tolerated: a corrupt or unreadable one is a real
 * error the user should see, not a silent reset of their metadata.
 */
async function readProjectInfo(projectId: string): Promise<ProjectInfo> {
  try {
    return JSON.parse(await Deno.readTextFile(getProjectInfoPath(projectId)));
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
    const now = new Date().toISOString();
    return { id: projectId, name: projectId, createdAt: now, updatedAt: now };
  }
}

async function assertProjectExists(projectId: string): Promise<void> {
  if (!(await exists(getProjectDir(projectId), { isDirectory: true }))) {
    throw new NotFoundError(`Project "${projectId}" not found`);
  }
}

/**
 * List all projects
 */
export async function listProjects(): Promise<ProjectInfo[]> {
  const projects: ProjectInfo[] = [];

  try {
    for await (const entry of Deno.readDir(getProjectsDir())) {
      // Only slugs are addressable (see getProjectDir); anything else in the
      // directory is not a project and would 400 on every route.
      if (!entry.isDirectory || !isValidProjectId(entry.name)) continue;
      projects.push(await readProjectInfo(entry.name));
    }
  } catch (error) {
    // Projects directory doesn't exist yet
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }

  return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/**
 * Create a new project
 */
export async function createProject(name: string): Promise<ProjectInfo> {
  const id = slugify(name);
  if (!id) {
    throw new ValidationError(
      "Project name must contain at least one letter or number",
    );
  }
  const projectDir = getProjectDir(id);

  if (await exists(projectDir)) {
    throw new ConflictError(`Project "${id}" already exists`);
  }

  // Create project directories
  await ensureDir(projectDir);
  await ensureDir(join(projectDir, "assets", "images"));
  await ensureDir(join(projectDir, "output"));

  // Create project info
  const info: ProjectInfo = {
    id,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await Deno.writeTextFile(
    getProjectInfoPath(id),
    JSON.stringify(info, null, 2),
  );

  // Create default config
  const config = getDefaultConfig(name);
  await Deno.writeTextFile(
    getProjectConfigPath(id),
    JSON.stringify(config, null, 2),
  );

  return info;
}

/**
 * Load project configuration. Unknown ids are a 404 — there is deliberately
 * no default-config fallback, which used to materialise phantom projects on
 * the next save.
 *
 * A file that normalisation changes — missing layer ids, a missing platform
 * — is written back once, so the ids minted for it survive the next load
 * instead of being re-rolled every time. Project metadata is not touched:
 * a migration is not a user edit.
 */
export async function loadProject(projectId: string): Promise<ProjectConfig> {
  const path = getProjectConfigPath(projectId);
  let content: string;
  try {
    content = await Deno.readTextFile(path);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new NotFoundError(`Project "${projectId}" not found`);
    }
    throw error;
  }
  const parsed = JSON.parse(content);
  const config = normalizeProjectConfig(parsed);
  // Compare structure, not text: a formatting difference is not a migration
  if (JSON.stringify(config) !== JSON.stringify(parsed)) {
    await Deno.writeTextFile(path, JSON.stringify(config, null, 2));
  }
  return config;
}

/**
 * Save project configuration to an existing project. Returns the normalized
 * config that was written so callers can keep memory and disk identical.
 */
export async function saveProject(
  projectId: string,
  config: ProjectConfig,
): Promise<ProjectConfig> {
  await assertProjectExists(projectId);
  const normalizedConfig = normalizeProjectConfig(config);

  await Deno.writeTextFile(
    getProjectConfigPath(projectId),
    JSON.stringify(normalizedConfig, null, 2),
  );

  const info = await readProjectInfo(projectId);
  info.updatedAt = new Date().toISOString();
  info.name = normalizedConfig.app.name;
  await Deno.writeTextFile(
    getProjectInfoPath(projectId),
    JSON.stringify(info, null, 2),
  );

  return normalizedConfig;
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<void> {
  try {
    await Deno.remove(getProjectDir(projectId), { recursive: true });
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new NotFoundError(`Project "${projectId}" not found`);
    }
    throw error;
  }
}

/**
 * Rename a project. The app name in the config is the source of truth;
 * `saveProject` mirrors it into project.json.
 */
export async function renameProject(
  projectId: string,
  newName: string,
): Promise<ProjectInfo> {
  const config = await loadProject(projectId);
  config.app.name = newName;
  await saveProject(projectId, config);
  return readProjectInfo(projectId);
}

/**
 * Duplicate a project
 */
export async function duplicateProject(
  sourceId: string,
  newName: string,
): Promise<ProjectInfo> {
  const sourceConfig = await loadProject(sourceId);
  const newProject = await createProject(newName);

  // Copy config with new name
  sourceConfig.app.name = newName;
  await saveProject(newProject.id, sourceConfig);

  // Copy assets
  const sourceAssets = getProjectAssetsDir(sourceId);
  const destAssets = getProjectAssetsDir(newProject.id);

  // createProject already made the (empty) assets tree, so overwrite to merge
  try {
    await copy(sourceAssets, destAssets, { overwrite: true });
  } catch (error) {
    // Source assets may not exist
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }

  return newProject;
}

/**
 * Initialize projects directory, creating the default project if missing
 */
export async function initializeProjects(): Promise<string> {
  const projectsDir = getProjectsDir();
  await ensureDir(projectsDir);

  const defaultDir = getProjectDir(DEFAULT_PROJECT_ID);

  if (!(await exists(defaultDir))) {
    await ensureDir(defaultDir);
    await ensureDir(join(defaultDir, "assets", "images"));
    await ensureDir(join(defaultDir, "output"));

    await Deno.writeTextFile(
      getProjectConfigPath(DEFAULT_PROJECT_ID),
      JSON.stringify(normalizeProjectConfig(getDefaultConfig()), null, 2),
    );

    await Deno.writeTextFile(
      getProjectInfoPath(DEFAULT_PROJECT_ID),
      JSON.stringify(
        {
          id: DEFAULT_PROJECT_ID,
          name: "Default Project",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    );
  }

  return DEFAULT_PROJECT_ID;
}
