import {
  assert,
  assertEquals,
  assertFalse,
  assertRejects,
  assertStrictEquals,
  assertThrows,
} from "@std/assert";
import { exists } from "@std/fs";
import { join } from "@std/path";
import type { LanguageConfig, Layer } from "@app-types";
import { DEFAULT_DIMENSIONS } from "@lib";
import {
  createProject,
  deleteProject,
  getDefaultConfig,
  getProjectConfigPath,
  getProjectDir,
  listProjects,
  loadProject,
  normalizeProjectConfig,
  renameProject,
  saveProject,
} from "./projects.ts";
import { ConflictError, NotFoundError, ValidationError } from "./errors.ts";
import { withTempProjectsDir } from "./test-helpers.ts";

type Platforms = Partial<LanguageConfig["platforms"]>;

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

Deno.test("createProject: a duplicate id is a conflict", async () => {
  await withTempProjectsDir(async () => {
    await createProject("Twice");
    await assertRejects(
      () => createProject("Twice"),
      ConflictError,
      "already exists",
    );
  });
});

Deno.test("createProject: a name with no letters or digits is rejected, not 'already exists'", async () => {
  await withTempProjectsDir(async (dir) => {
    await assertRejects(
      () => createProject("!!!"),
      ValidationError,
      "at least one letter or number",
    );
    assertEquals((await Array.fromAsync(Deno.readDir(dir))).length, 0);
  });
});

Deno.test("getProjectDir: only slugs are valid ids", () => {
  const rejected = [
    "",
    ".",
    "..",
    "../default",
    "a/b",
    "a\\b",
    "Upper",
    "-leading",
    "with space",
    "%2e%2e",
    "C:",
  ];
  for (const id of rejected) {
    assertThrows(
      () => getProjectDir(id),
      ValidationError,
      "Invalid project id",
    );
  }
  for (const id of ["default", "my-cool-app", "a", "2fast"]) {
    getProjectDir(id);
  }
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

Deno.test("loadProject: unknown id is a NotFoundError, not a default config", async () => {
  await withTempProjectsDir(async (dir) => {
    await assertRejects(
      () => loadProject("does-not-exist"),
      NotFoundError,
      "not found",
    );
    assertFalse(await exists(join(dir, "does-not-exist")));
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

Deno.test("saveProject: refuses to materialise a project that does not exist", async () => {
  await withTempProjectsDir(async (dir) => {
    await assertRejects(
      () => saveProject("phantom", getDefaultConfig()),
      NotFoundError,
    );
    assertFalse(await exists(join(dir, "phantom")));
  });
});

Deno.test("saveProject: returns the normalized config it wrote", async () => {
  await withTempProjectsDir(async () => {
    const info = await createProject("Normalize Me");
    const config = getDefaultConfig("Normalize Me");
    delete (config.languages[0].platforms as Platforms).ios;

    const saved = await saveProject(info.id, config);

    assertEquals(saved.languages[0].platforms.ios.screenshots, []);
    const onDisk = await loadProject(info.id);
    assertEquals(
      onDisk.languages[0].platforms.ios,
      saved.languages[0].platforms.ios,
    );
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

Deno.test("deleteProject / renameProject: unknown id is a NotFoundError", async () => {
  await withTempProjectsDir(async () => {
    await assertRejects(() => deleteProject("nope"), NotFoundError);
    await assertRejects(() => renameProject("nope", "x"), NotFoundError);
  });
});

Deno.test("listProjects: skips directories whose names are not valid ids", async () => {
  await withTempProjectsDir(async (dir) => {
    await createProject("Real");
    await Deno.mkdir(join(dir, "Not A Project"));
    await Deno.writeTextFile(join(dir, "stray.txt"), "");

    assertEquals((await listProjects()).map((p) => p.id), ["real"]);
  });
});

Deno.test("normalizeProjectConfig: fills a missing platform with an empty default", () => {
  const config = getDefaultConfig();
  delete (config.languages[0].platforms as Platforms).android;

  const normalized = normalizeProjectConfig(config);

  assertEquals(normalized.languages[0].platforms.android, {
    dimensions: DEFAULT_DIMENSIONS.android,
    screenshots: [],
  });
  // The other platform is untouched
  assertEquals(
    normalized.languages[0].platforms.ios,
    config.languages[0].platforms.ios,
  );
});

Deno.test("normalizeProjectConfig: assigns ids to layers that have none, leaves the rest alone", () => {
  const config = getDefaultConfig();
  const android = config.languages[0].platforms.android;
  android.screenshots = [
    {
      id: "with-ids",
      name: "Has ids",
      role: "screenshot",
      layers: [{ id: "bg", type: "background", opacity: 1 }],
    },
    {
      id: "legacy",
      name: "Pre-id config",
      role: "screenshot",
      // Written before layers carried ids
      layers: [
        { type: "background", opacity: 1 },
        { type: "background", opacity: 0.5 },
      ] as Layer[],
    },
  ];

  const normalized = normalizeProjectConfig(config);
  const [withIds, legacy] = normalized.languages[0].platforms.android
    .screenshots;

  // Untouched screenshot keeps its identity — nothing was rebuilt for it
  assertStrictEquals(withIds, android.screenshots[0]);
  assertEquals(legacy.layers.map((l) => typeof l.id), ["string", "string"]);
  assert(legacy.layers[0].id !== legacy.layers[1].id);
  // Everything but the id is as it was
  assertEquals(legacy.layers[1].opacity, 0.5);
});

Deno.test("loadProject: persists minted layer ids so they survive the next load", async () => {
  await withTempProjectsDir(async () => {
    const { id } = await createProject("Legacy");
    const legacy = await loadProject(id);
    legacy.languages[0].platforms.android.screenshots = [{
      id: "s1",
      name: "Legacy",
      role: "screenshot",
      layers: [{ type: "background", opacity: 1 }] as Layer[],
    }];
    const path = getProjectConfigPath(id);
    await Deno.writeTextFile(path, JSON.stringify(legacy));

    const first = await loadProject(id);
    const minted = first.languages[0].platforms.android.screenshots[0]
      .layers[0].id;
    assert(minted, "id assigned on load");

    // On disk now, and stable across loads rather than re-rolled each time
    const onDisk = JSON.parse(await Deno.readTextFile(path));
    assertEquals(
      onDisk.languages[0].platforms.android.screenshots[0].layers[0].id,
      minted,
    );
    const second = await loadProject(id);
    assertEquals(
      second.languages[0].platforms.android.screenshots[0].layers[0].id,
      minted,
    );
  });
});
