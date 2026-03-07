/**
 * Project Management Module
 * 
 * Handles creating, loading, saving, and switching between projects.
 * Each project has its own config, assets, and output directories.
 */

import { join } from '@std/path';
import { ensureDir, exists } from '@std/fs';

export interface ProjectInfo {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectConfig {
  app: {
    name: string;
    iconPath?: string;
    defaultMascotPath?: string;
  };
  theme: {
    background: { gradient: string };
    fontFamily: string;
    googleFontsUrl?: string;
  };
  assetsBasePath: string;
  languages: LanguageConfig[];
}

export interface LanguageConfig {
  language: string;
  platforms: {
    android: PlatformConfig;
    ios: PlatformConfig;
  };
}

export interface PlatformConfig {
  dimensions: { width: number; height: number };
  screenshots: Screenshot[];
  featureGraphic?: FeatureGraphic | null;
}

export interface Screenshot {
  id: string;
  headline: string;
  subtitle: string;
  imagePath: string | string[];
  glows: GlowEffect[];
  phoneFrame?: PhoneFrameOptions;
  mascot?: MascotOptions | null;
}

export interface GlowEffect {
  color: string;
  size: number;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface PhoneFrameOptions {
  scale?: number;
  bottomOffset?: number;
  dualRotation?: number;
  dualGap?: number;
}

export interface MascotOptions {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  imagePath?: string;
  size?: number;
  offset?: number;
  borderRadius?: number;
}

export interface FeatureGraphic {
  headline: string;
  subtitle: string;
  imagePath: string;
  glows: GlowEffect[];
  showIcon?: boolean;
  showAppName?: boolean;
  phoneRotation?: number;
  phoneScale?: number;
  mascot?: MascotOptions | null;
}

const PROJECTS_DIR = 'projects';
const DEFAULT_PROJECT_ID = 'default';

/**
 * Get projects directory path
 */
export function getProjectsDir(): string {
  return join(Deno.cwd(), PROJECTS_DIR);
}

/**
 * Get project directory path
 */
export function getProjectDir(projectId: string): string {
  return join(getProjectsDir(), projectId);
}

/**
 * Get project config path
 */
export function getProjectConfigPath(projectId: string): string {
  return join(getProjectDir(projectId), 'config.json');
}

/**
 * Get project assets directory
 */
export function getProjectAssetsDir(projectId: string): string {
  return join(getProjectDir(projectId), 'assets');
}

/**
 * Get project output directory
 */
export function getProjectOutputDir(projectId: string): string {
  return join(getProjectDir(projectId), 'output');
}

/**
 * Default project configuration template
 */
export function getDefaultConfig(appName: string = 'My App'): ProjectConfig {
  return {
    app: {
      name: appName,
      iconPath: '',
      defaultMascotPath: '',
    },
    theme: {
      background: {
        gradient: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 50%, #3730a3 100%)',
      },
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap',
    },
    assetsBasePath: 'assets',
    languages: [
      {
        language: 'en',
        platforms: {
          android: {
            dimensions: { width: 1242, height: 2688 },
            screenshots: [],
            featureGraphic: null,
          },
          ios: {
            dimensions: { width: 1242, height: 2688 },
            screenshots: [],
          },
        },
      },
    ],
  };
}

/**
 * List all projects
 */
export async function listProjects(): Promise<ProjectInfo[]> {
  const projectsDir = getProjectsDir();
  const projects: ProjectInfo[] = [];
  
  try {
    for await (const entry of Deno.readDir(projectsDir)) {
      if (entry.isDirectory) {
        const infoPath = join(projectsDir, entry.name, 'project.json');
        try {
          const info = JSON.parse(await Deno.readTextFile(infoPath));
          projects.push(info);
        } catch {
          // Project info doesn't exist, create default entry
          projects.push({
            id: entry.name,
            name: entry.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }
  } catch {
    // Projects directory doesn't exist yet
  }
  
  return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/**
 * Create a new project
 */
export async function createProject(name: string): Promise<ProjectInfo> {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const projectDir = getProjectDir(id);
  
  // Check if project already exists
  if (await exists(projectDir)) {
    throw new Error(`Project "${id}" already exists`);
  }
  
  // Create project directories
  await ensureDir(projectDir);
  await ensureDir(join(projectDir, 'assets', 'screenshots'));
  await ensureDir(join(projectDir, 'output'));
  
  // Create project info
  const info: ProjectInfo = {
    id,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await Deno.writeTextFile(
    join(projectDir, 'project.json'),
    JSON.stringify(info, null, 2)
  );
  
  // Create default config
  const config = getDefaultConfig(name);
  await Deno.writeTextFile(
    getProjectConfigPath(id),
    JSON.stringify(config, null, 2)
  );
  
  return info;
}

/**
 * Load project configuration
 */
export async function loadProject(projectId: string): Promise<ProjectConfig> {
  const configPath = getProjectConfigPath(projectId);
  
  try {
    const content = await Deno.readTextFile(configPath);
    return JSON.parse(content);
  } catch {
    // If config doesn't exist, check for legacy config locations
    
    // Try legacy config.json in root
    try {
      const legacyPath = join(Deno.cwd(), 'config', 'config.json');
      const content = await Deno.readTextFile(legacyPath);
      return JSON.parse(content);
    } catch {
      // Return default config
      return getDefaultConfig();
    }
  }
}

/**
 * Save project configuration
 */
export async function saveProject(projectId: string, config: ProjectConfig): Promise<void> {
  const projectDir = getProjectDir(projectId);
  
  // Ensure project directory exists
  await ensureDir(projectDir);
  
  // Save config
  await Deno.writeTextFile(
    getProjectConfigPath(projectId),
    JSON.stringify(config, null, 2)
  );
  
  // Update project info
  const infoPath = join(projectDir, 'project.json');
  try {
    const info: ProjectInfo = JSON.parse(await Deno.readTextFile(infoPath));
    info.updatedAt = new Date().toISOString();
    info.name = config.app.name;
    await Deno.writeTextFile(infoPath, JSON.stringify(info, null, 2));
  } catch {
    // Create project info if it doesn't exist
    const info: ProjectInfo = {
      id: projectId,
      name: config.app.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await Deno.writeTextFile(infoPath, JSON.stringify(info, null, 2));
  }
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<void> {
  if (projectId === DEFAULT_PROJECT_ID) {
    throw new Error('Cannot delete the default project');
  }
  
  const projectDir = getProjectDir(projectId);
  await Deno.remove(projectDir, { recursive: true });
}

/**
 * Duplicate a project
 */
export async function duplicateProject(sourceId: string, newName: string): Promise<ProjectInfo> {
  const sourceConfig = await loadProject(sourceId);
  const newProject = await createProject(newName);
  
  // Copy config with new name
  sourceConfig.app.name = newName;
  await saveProject(newProject.id, sourceConfig);
  
  // Copy assets
  const sourceAssets = getProjectAssetsDir(sourceId);
  const destAssets = getProjectAssetsDir(newProject.id);
  
  try {
    await copyDir(sourceAssets, destAssets);
  } catch {
    // Source assets may not exist
  }
  
  return newProject;
}

/**
 * Helper to recursively copy a directory
 */
async function copyDir(src: string, dest: string): Promise<void> {
  await ensureDir(dest);
  
  for await (const entry of Deno.readDir(src)) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory) {
      await copyDir(srcPath, destPath);
    } else {
      await Deno.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Initialize projects directory with a default project
 * Migrates legacy config if exists
 */
export async function initializeProjects(): Promise<string> {
  const projectsDir = getProjectsDir();
  await ensureDir(projectsDir);
  
  const defaultDir = getProjectDir(DEFAULT_PROJECT_ID);
  
  // Check if default project exists
  if (!(await exists(defaultDir))) {
    // Try to migrate from legacy config
    let config: ProjectConfig | null = null;
    
    // Check for legacy JSON config
    try {
      const legacyJson = join(Deno.cwd(), 'config', 'config.json');
      config = JSON.parse(await Deno.readTextFile(legacyJson));
    } catch {
      // No legacy JSON
    }
    
    // Check for legacy TypeScript config
    if (!config) {
      try {
        const legacyTs = join(Deno.cwd(), 'config', 'config.ts');
        const configUrl = Deno.build.os === 'windows' 
          ? `file:///${legacyTs.replace(/\\/g, '/')}`
          : `file://${legacyTs}`;
        const module = await import(configUrl);
        config = module.screenshotConfig;
      } catch {
        // No legacy TS config
      }
    }
    
    // Create default project
    await ensureDir(defaultDir);
    await ensureDir(join(defaultDir, 'assets', 'screenshots'));
    await ensureDir(join(defaultDir, 'output'));
    
    // Copy legacy assets if they exist
    const legacyAssets = join(Deno.cwd(), 'assets');
    const newAssets = getProjectAssetsDir(DEFAULT_PROJECT_ID);
    try {
      await copyDir(legacyAssets, newAssets);
    } catch {
      // No legacy assets
    }
    
    // Save config
    await Deno.writeTextFile(
      getProjectConfigPath(DEFAULT_PROJECT_ID),
      JSON.stringify(config || getDefaultConfig(), null, 2)
    );
    
    // Create project info
    await Deno.writeTextFile(
      join(defaultDir, 'project.json'),
      JSON.stringify({
        id: DEFAULT_PROJECT_ID,
        name: config?.app?.name || 'Default Project',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, null, 2)
    );
  }
  
  return DEFAULT_PROJECT_ID;
}
