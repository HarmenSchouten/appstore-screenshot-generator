/**
 * Project Routes
 *
 * Handles project management: list, create, switch, delete, rename, duplicate.
 */

import { type Context, Hono } from "hono";
import type { ProjectConfig } from "@app-types";
import {
  createProject,
  deleteProject,
  duplicateProject,
  initializeProjects,
  listProjects,
  loadProject,
  renameProject,
} from "@/projects.ts";
import { readJsonBody, requireObject, requireString } from "./http.ts";

export interface ProjectState {
  currentProjectId: string;
  currentConfig: ProjectConfig | null;
}

/** The `{ name }` body shared by create, rename and duplicate. */
async function readName(c: Context): Promise<string> {
  return requireString(requireObject(await readJsonBody(c)), "name");
}

export function createProjectRoutes(
  getState: () => ProjectState,
  setState: (updates: Partial<ProjectState>) => void,
  getConfig: () => Promise<ProjectConfig>,
) {
  const routes = new Hono();

  /**
   * List all projects
   */
  routes.get("/", async (c) => {
    const projects = await listProjects();
    return c.json({ projects, currentProjectId: getState().currentProjectId });
  });

  /**
   * Get current project
   */
  routes.get("/current", async (c) => {
    const config = await getConfig();
    return c.json({ projectId: getState().currentProjectId, config });
  });

  /**
   * Create new project
   */
  routes.post("/", async (c) => {
    const project = await createProject(await readName(c));
    return c.json(project);
  });

  /**
   * Switch to a project
   */
  routes.put("/:id/activate", async (c) => {
    const { id } = c.req.param();
    // Load before switching: an unknown id 404s and leaves the current project alone
    const config = await loadProject(id);
    setState({ currentProjectId: id, currentConfig: config });
    return c.json({ projectId: id, config });
  });

  /**
   * Delete a project
   */
  routes.delete("/:id", async (c) => {
    const { id } = c.req.param();
    await deleteProject(id);

    if (id === getState().currentProjectId) {
      // Land on another existing project; recreate the default if none are left
      const remaining = await listProjects();
      const nextId = remaining[0]?.id ?? await initializeProjects();
      setState({ currentProjectId: nextId, currentConfig: null });
    }

    return c.json({ success: true });
  });

  /**
   * Rename a project
   */
  routes.patch("/:id", async (c) => {
    const { id } = c.req.param();
    const project = await renameProject(id, await readName(c));

    // If renamed current project, reload config
    if (id === getState().currentProjectId) {
      setState({ currentConfig: null });
    }

    return c.json(project);
  });

  /**
   * Duplicate a project
   */
  routes.post("/:id/duplicate", async (c) => {
    const { id } = c.req.param();
    const project = await duplicateProject(id, await readName(c));
    return c.json(project);
  });

  return routes;
}
