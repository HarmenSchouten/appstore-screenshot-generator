/**
 * The context caches each project's config, remembers the last project a
 * client opened, and heals when that project disappears from disk behind it.
 */

import {
  assertEquals,
  assertNotStrictEquals,
  assertRejects,
  assertStrictEquals,
} from "@std/assert";
import { createServerContext } from "./context.ts";
import {
  createProject,
  deleteProject,
  initializeProjects,
  loadProject,
  saveProject,
} from "@/projects.ts";
import { NotFoundError } from "@/errors.ts";
import { withTempProjectsDir } from "@/test-helpers.ts";

Deno.test("getConfig loads once and hands out the cached object until setConfig replaces it", async () => {
  await withTempProjectsDir(async () => {
    const ctx = createServerContext(await initializeProjects());

    const first = await ctx.getConfig("default");
    assertStrictEquals(await ctx.getConfig("default"), first);

    const saved = await saveProject("default", {
      ...first,
      app: { ...first.app, name: "Renamed" },
    });
    ctx.setConfig("default", saved);
    assertStrictEquals(await ctx.getConfig("default"), saved);
  });
});

Deno.test("two requests for a project that isn't loaded yet share one copy", async () => {
  await withTempProjectsDir(async () => {
    const ctx = createServerContext(await initializeProjects());

    const [a, b] = await Promise.all([
      ctx.getConfig("default"),
      ctx.getConfig("default"),
    ]);
    assertStrictEquals(a, b);
  });
});

Deno.test("each project has its own cache entry", async () => {
  await withTempProjectsDir(async () => {
    const ctx = createServerContext(await initializeProjects());
    const other = await createProject("Other");

    const defaultConfig = await ctx.getConfig("default");
    const otherConfig = await ctx.getConfig(other.id);
    assertNotStrictEquals(defaultConfig, otherConfig);
    assertEquals(otherConfig.app.name, "Other");

    ctx.setConfig(other.id, null);
    assertStrictEquals(await ctx.getConfig("default"), defaultConfig);
  });
});

Deno.test("setConfig(null) drops the cache so the next getConfig reads the file", async () => {
  await withTempProjectsDir(async () => {
    const ctx = createServerContext(await initializeProjects());
    const cached = await ctx.getConfig("default");

    const onDisk = await loadProject("default");
    onDisk.app.name = "Edited on disk";
    await saveProject("default", onDisk);
    assertEquals((await ctx.getConfig("default")).app.name, cached.app.name);

    ctx.setConfig("default", null);
    assertEquals((await ctx.getConfig("default")).app.name, "Edited on disk");
  });
});

Deno.test("an unknown project is a 404 and is not cached", async () => {
  await withTempProjectsDir(async () => {
    const ctx = createServerContext(await initializeProjects());

    await assertRejects(() => ctx.getConfig("later"), NotFoundError);
    await createProject("Later");
    assertEquals((await ctx.getConfig("later")).app.name, "Later");
  });
});

Deno.test("getLastProject returns the last opened project and its config", async () => {
  await withTempProjectsDir(async () => {
    const ctx = createServerContext(await initializeProjects());
    const other = await createProject("Other");

    ctx.setLastProjectId(other.id);
    const last = await ctx.getLastProject();
    assertEquals(last.projectId, other.id);
    assertStrictEquals(last.config, await ctx.getConfig(other.id));
  });
});

Deno.test("a last project deleted behind the context heals to a recreated default project", async () => {
  await withTempProjectsDir(async () => {
    await initializeProjects();
    const other = await createProject("Other");
    const ctx = createServerContext(other.id);

    await deleteProject(other.id);
    await deleteProject("default");

    const last = await ctx.getLastProject();
    assertEquals(last.projectId, "default");
    assertEquals(ctx.getLastProjectId(), "default");
    assertEquals(last.config, await loadProject("default"));
  });
});
