/**
 * Project Routes
 *
 * List, create, open, delete, rename and duplicate projects. What a project
 * contains is edited through the routes mounted under `/api/projects/:projectId`.
 */

import { type Context, Hono } from "hono";
import {
  createProject,
  deleteProject,
  duplicateProject,
  initializeProjects,
  listProjects,
  renameProject,
} from "@/projects.ts";
import type { ServerContext } from "./context.ts";
import { readJsonBody, requireObject, requireString } from "./http.ts";

/** The `{ name }` body shared by create, rename and duplicate. */
async function readName(c: Context): Promise<string> {
  return requireString(requireObject(await readJsonBody(c)), "name");
}

export function createProjectRoutes(ctx: ServerContext) {
  const routes = new Hono();

  routes.get("/", async (c) => {
    const projects = await listProjects();
    return c.json({ projects, lastProjectId: ctx.getLastProjectId() });
  });

  routes.post("/", async (c) => {
    const project = await createProject(await readName(c));
    return c.json(project);
  });

  /**
   * Load a project for the editor and remember it as the one `/api/init`
   * opens next time. It moves nothing else: writes name their project.
   */
  routes.put("/:id/open", async (c) => {
    const { id } = c.req.param();
    // Load before remembering: an unknown id 404s and leaves the last one alone
    const config = await ctx.getConfig(id);
    ctx.setLastProjectId(id);
    return c.json({ projectId: id, config });
  });

  routes.delete("/:id", async (c) => {
    const { id } = c.req.param();
    await deleteProject(id);
    ctx.setConfig(id, null);

    if (id === ctx.getLastProjectId()) {
      // Land on another existing project; recreate the default if none are left
      const remaining = await listProjects();
      ctx.setLastProjectId(remaining[0]?.id ?? await initializeProjects());
    }

    return c.json({ success: true });
  });

  routes.patch("/:id", async (c) => {
    const { id } = c.req.param();
    const project = await renameProject(id, await readName(c));
    // The rename went to disk; a cached copy is stale
    ctx.setConfig(id, null);
    return c.json(project);
  });

  routes.post("/:id/duplicate", async (c) => {
    const { id } = c.req.param();
    const project = await duplicateProject(id, await readName(c));
    return c.json(project);
  });

  return routes;
}
