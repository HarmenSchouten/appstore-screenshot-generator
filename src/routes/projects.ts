/**
 * Project Routes
 *
 * List, create, switch, delete, rename and duplicate projects.
 */

import { type Context, Hono } from "hono";
import {
  createProject,
  deleteProject,
  duplicateProject,
  initializeProjects,
  listProjects,
  loadProject,
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
    return c.json({ projects, currentProjectId: ctx.getCurrentProjectId() });
  });

  routes.get("/current", async (c) => {
    const config = await ctx.getConfig();
    return c.json({ projectId: ctx.getCurrentProjectId(), config });
  });

  routes.post("/", async (c) => {
    const project = await createProject(await readName(c));
    return c.json(project);
  });

  routes.put("/:id/activate", async (c) => {
    const { id } = c.req.param();
    // Load before switching: an unknown id 404s and leaves the current project alone
    const config = await loadProject(id);
    ctx.setCurrentProject(id, config);
    return c.json({ projectId: id, config });
  });

  routes.delete("/:id", async (c) => {
    const { id } = c.req.param();
    await deleteProject(id);

    if (id === ctx.getCurrentProjectId()) {
      // Land on another existing project; recreate the default if none are left
      const remaining = await listProjects();
      ctx.setCurrentProject(remaining[0]?.id ?? await initializeProjects());
    }

    return c.json({ success: true });
  });

  routes.patch("/:id", async (c) => {
    const { id } = c.req.param();
    const project = await renameProject(id, await readName(c));
    // The rename went to disk; a cached copy of the current project is stale
    if (id === ctx.getCurrentProjectId()) ctx.setConfig(null);
    return c.json(project);
  });

  routes.post("/:id/duplicate", async (c) => {
    const { id } = c.req.param();
    const project = await duplicateProject(id, await readName(c));
    return c.json(project);
  });

  return routes;
}
