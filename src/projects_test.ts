import { assert, assertEquals, assertFalse, assertRejects } from "@std/assert";
import { exists } from "@std/fs";
import { join } from "@std/path";
import {
  createProject,
  deleteProject,
  getDefaultConfig,
  loadProject,
  renameProject,
  saveProject,
} from "./projects.ts";
import { withTempProjectsDir } from "./test-helpers.ts";

Deno.test("createProject: slugifies the name and scaffolds the project", async () => {
  await withTempProjectsDir(async (dir) => {
    const info = await createProject("My Cool App!");

    assertEquals(info.id, "my-cool-app");
    assertEquals(info.name, "My Cool App!");
    assert(await exists(join(dir, "my-cool-app", "project.json")));
    assert(await exists(join(dir, "my-cool-app", "config.json")));
    assert(await exists(join(dir, "my-cool-app", "assets", "images")));
    assert(await exists(join(dir, "my-cool-app", "output")));
  });
});

Deno.test("createProject: rejects a duplicate id", async () => {
  await withTempProjectsDir(async () => {
    await createProject("Twice");
    await assertRejects(
      () => createProject("Twice"),
      Error,
      "already exists",
    );
  });
});

Deno.test("loadProject: round-trips the created config", async () => {
  await withTempProjectsDir(async () => {
    const info = await createProject("Roundtrip");
    const config = await loadProject(info.id);

    assertEquals(config.app.name, "Roundtrip");
    assertEquals(config.languages[0].language, "en");
    // normalizeProjectConfig guarantees platform defaults on every load
    assert(config.platformDefaults.android.defaultDevicePresetId);
    assert(config.platformDefaults.ios.defaultDevicePresetId);
  });
});

Deno.test("loadProject: unknown id falls back to the default config", async () => {
  await withTempProjectsDir(async () => {
    // TODO(#62): this becomes a NotFound error; the fallback materialises
    // phantom projects on the next save. Asserting current behaviour.
    const config = await loadProject("does-not-exist");
    assertEquals(config.app.name, getDefaultConfig().app.name);
  });
});

Deno.test("saveProject: persists config and updates project info name", async () => {
  await withTempProjectsDir(async (dir) => {
    const info = await createProject("Save Me");
    const config = await loadProject(info.id);
    config.app.name = "Renamed via config";

    await saveProject(info.id, config);

    const reloaded = await loadProject(info.id);
    assertEquals(reloaded.app.name, "Renamed via config");
    const savedInfo = JSON.parse(
      await Deno.readTextFile(join(dir, info.id, "project.json")),
    );
    assertEquals(savedInfo.name, "Renamed via config");
  });
});

Deno.test("renameProject: updates both project info and config app name", async () => {
  await withTempProjectsDir(async () => {
    const info = await createProject("Old Name");
    const renamed = await renameProject(info.id, "New Name");

    assertEquals(renamed.id, info.id);
    assertEquals(renamed.name, "New Name");
    const config = await loadProject(info.id);
    assertEquals(config.app.name, "New Name");
  });
});

Deno.test("deleteProject: removes the project directory", async () => {
  await withTempProjectsDir(async (dir) => {
    const info = await createProject("Doomed");
    assert(await exists(join(dir, info.id)));

    await deleteProject(info.id);

    assertFalse(await exists(join(dir, info.id)));
  });
});
