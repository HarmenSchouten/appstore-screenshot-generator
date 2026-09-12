/**
 * Server Context
 *
 * The one dependency every route factory takes: which project is active and
 * its config, read from disk on first use and cached until a save replaces
 * it or a switch drops it. `server.ts` creates one; route tests create their
 * own over a temp projects directory.
 */

import type { ProjectConfig } from "@app-types";
import { initializeProjects, loadProject } from "@/projects.ts";
import { NotFoundError } from "@/errors.ts";

export interface ServerContext {
  getCurrentProjectId(): string;
  /** The active project's config, loaded on first use. */
  getConfig(): Promise<ProjectConfig>;
  /**
   * Replace the cached config after a save, or drop it with `null` so the
   * next `getConfig` reads the file again.
   */
  setConfig(config: ProjectConfig | null): void;
  /** Make `id` the active project; its config is dropped unless supplied. */
  setCurrentProject(id: string, config?: ProjectConfig): void;
}

export function createServerContext(initialProjectId: string): ServerContext {
  let currentProjectId = initialProjectId;
  let currentConfig: ProjectConfig | null = null;

  return {
    getCurrentProjectId: () => currentProjectId,

    async getConfig() {
      if (currentConfig) return currentConfig;
      try {
        currentConfig = await loadProject(currentProjectId);
      } catch (error) {
        // The active project vanished from disk (deleted outside the app).
        // Land on the default project — recreated if needed — rather than
        // serve a phantom config the next save would materialise, or 404
        // every request until restart
        if (!(error instanceof NotFoundError)) throw error;
        currentProjectId = await initializeProjects();
        currentConfig = await loadProject(currentProjectId);
      }
      return currentConfig;
    },

    setConfig(config) {
      currentConfig = config;
    },

    setCurrentProject(id, config) {
      currentProjectId = id;
      currentConfig = config ?? null;
    },
  };
}
