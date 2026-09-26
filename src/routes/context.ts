/**
 * Server Context
 *
 * The one dependency every route factory takes. It caches each project's
 * config from first use until a save replaces it or a rename or delete drops
 * it, and it remembers the project a client opened last so `/api/init` can
 * land there. It never decides where a write goes: every project-scoped
 * route names its project in the path (#136). `server.ts` creates one; route
 * tests create their own over a temp projects directory.
 */

import type { ProjectConfig } from "@app-types";
import { exists } from "@std/fs";
import {
  getProjectConfigPath,
  initializeProjects,
  loadProject,
} from "@/projects.ts";
import { NotFoundError } from "@/errors.ts";

export interface ServerContext {
  /** The project a client opened last. */
  getLastProjectId(): string;
  setLastProjectId(id: string): void;
  /**
   * The last opened project and its config. When that project has vanished
   * from disk, the default project (recreated if needed) takes its place.
   */
  getLastProject(): Promise<{ projectId: string; config: ProjectConfig }>;
  /**
   * A project's config, loaded on first use. 404s on an unknown id, and on a
   * cached one whose folder has since been deleted outside the app.
   */
  getConfig(id: string): Promise<ProjectConfig>;
  /**
   * Replace a cached config after a save, or drop it with `null` so the
   * next `getConfig` reads the file again.
   */
  setConfig(id: string, config: ProjectConfig | null): void;
}

export function createServerContext(initialProjectId: string): ServerContext {
  let lastProjectId = initialProjectId;
  // Promises, not configs: two requests for a project that isn't loaded yet
  // must share one load, or they would edit two different copies
  const configs = new Map<string, Promise<ProjectConfig>>();

  async function getConfig(id: string): Promise<ProjectConfig> {
    // The cache must not outlive the folder: a project deleted outside the
    // app would still open, and getLastProject would never fall back
    if (
      configs.has(id) &&
      !(await exists(getProjectConfigPath(id), { isFile: true }))
    ) {
      configs.delete(id);
    }
    let config = configs.get(id);
    if (!config) {
      const loading = loadProject(id);
      configs.set(id, loading);
      // A failed load is not cached; the next request tries the disk again
      loading.catch(() => {
        if (configs.get(id) === loading) configs.delete(id);
      });
      config = loading;
    }
    return config;
  }

  return {
    getLastProjectId: () => lastProjectId,

    setLastProjectId(id) {
      lastProjectId = id;
    },

    async getLastProject() {
      try {
        return {
          projectId: lastProjectId,
          config: await getConfig(lastProjectId),
        };
      } catch (error) {
        // The project was deleted outside the app. Land on the default
        // project rather than 404 every load until restart
        if (!(error instanceof NotFoundError)) throw error;
        lastProjectId = await initializeProjects();
        return {
          projectId: lastProjectId,
          config: await getConfig(lastProjectId),
        };
      }
    },

    getConfig,

    setConfig(id, config) {
      if (config) configs.set(id, Promise.resolve(config));
      else configs.delete(id);
    },
  };
}
