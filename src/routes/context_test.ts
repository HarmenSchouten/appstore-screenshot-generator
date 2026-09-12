/**
 * The context caches the active project's config and heals when the project
 * disappears from disk behind it.
 */

import { assertEquals, assertStrictEquals } from "@std/assert";
import { createServerContext } from "./context.ts";
import {
  createProject,
  deleteProject,
  initializeProjects,
  loadProject,
  saveProject,
} from "@/projects.ts";
import { withTempProjectsDir } from "@/test-helpers.ts";

Deno.test("getConfig loads once and hands out the cached object until setConfig replaces it", async () => {
  await withTempProjectsDir(async () => {
    const ctx = createServerContext(await initializeProjects());

    const first = await ctx.getConfig();
    assertStrictEquals(await ctx.getConfig(), first);

    const saved = await saveProject("default", {
      ...first,
      app: { ...first.app, name: "Renamed" },
    });
    ctx.setConfig(saved);
    assertStrictEquals(await ctx.getConfig(), saved);
  });
});

Deno.test("setConfig(null) drops the cache so the next getConfig reads the file", async () => {
  await withTempProjectsDir(async () => {
    const ctx = createServerContext(await initializeProjects());
    const cached = await ctx.getConfig();

    const onDisk = await loadProject("default");
    onDisk.app.name = "Edited on disk";
    await saveProject("default", onDisk);
    assertEquals((await ctx.getConfig()).app.name, cached.app.name);

    ctx.setConfig(null);
    assertEquals((await ctx.getConfig()).app.name, "Edited on disk");
  });
});

Deno.test("setCurrentProject switches the id, keeping a supplied config or reloading without one", async () => {
  await withTempProjectsDir(async () => {
    const ctx = createServerContext(await initializeProjects());
    await ctx.getConfig();
    const other = await createProject("Other");
    const otherConfig = await loadProject(other.id);

    ctx.setCurrentProject(other.id, otherConfig);
    assertEquals(ctx.getCurrentProjectId(), other.id);
    assertStrictEquals(await ctx.getConfig(), otherConfig);

    ctx.setCurrentProject("default");
    assertEquals(ctx.getCurrentProjectId(), "default");
    assertEquals(await ctx.getConfig(), await loadProject("default"));
  });
});

Deno.test("a project deleted behind the context heals to a recreated default project", async () => {
  await withTempProjectsDir(async () => {
    await initializeProjects();
    const other = await createProject("Other");
    const ctx = createServerContext(other.id);

    await deleteProject(other.id);
    await deleteProject("default");

    const config = await ctx.getConfig();
    assertEquals(ctx.getCurrentProjectId(), "default");
    assertEquals(config, await loadProject("default"));
  });
});
