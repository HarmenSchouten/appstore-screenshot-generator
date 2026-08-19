import { assert, assertEquals } from "@std/assert";
import { exists } from "@std/fs";
import { join } from "@std/path";
import { Hono } from "hono";
import type { ProjectConfig, Screenshot } from "@app-types";
import { createConfigRoutes } from "./config.ts";
import { getDefaultConfig } from "../projects.ts";
import { makeDefaultScreenshot, withTempProjectsDir } from "../test-helpers.ts";

const PROJECT_ID = "config-routes-test";

function makeTestApp() {
  const state: { config: ProjectConfig } = {
    config: getDefaultConfig("Config Routes Test"),
  };
  const app = new Hono();
  app.route(
    "/api/config",
    createConfigRoutes(
      () => PROJECT_ID,
      () => Promise.resolve(state.config),
      (config) => {
        state.config = config;
      },
    ),
  );
  return { app, state };
}

function postJson(app: Hono, path: string, body: unknown) {
  return app.request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

Deno.test("GET /api/config returns the current config", async () => {
  await withTempProjectsDir(async () => {
    const { app } = makeTestApp();
    const res = await app.request("/api/config");

    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.app.name, "Config Routes Test");
  });
});

Deno.test("POST /screenshot adds a screenshot and persists it to disk", async () => {
  await withTempProjectsDir(async (dir) => {
    const { app, state } = makeTestApp();
    const screenshot = makeDefaultScreenshot();

    const res = await postJson(
      app,
      "/api/config/screenshot/en/android",
      screenshot,
    );

    assertEquals(res.status, 200);
    const returned = await res.json() as Screenshot;
    assertEquals(returned.id, screenshot.id);
    assertEquals(
      state.config.languages[0].platforms.android.screenshots.length,
      1,
    );
    assert(await exists(join(dir, PROJECT_ID, "config.json")));
    const onDisk = JSON.parse(
      await Deno.readTextFile(join(dir, PROJECT_ID, "config.json")),
    );
    assertEquals(
      onDisk.languages[0].platforms.android.screenshots[0].id,
      screenshot.id,
    );
  });
});

Deno.test("POST /screenshot with unknown language returns 404 JSON", async () => {
  await withTempProjectsDir(async () => {
    const { app } = makeTestApp();
    const res = await postJson(
      app,
      "/api/config/screenshot/xx/android",
      makeDefaultScreenshot(),
    );

    assertEquals(res.status, 404);
    assertEquals(await res.json(), { error: "Language not found" });
  });
});

Deno.test("POST /screenshot with an invalid platform persists it anyway", async () => {
  await withTempProjectsDir(async () => {
    const { app, state } = makeTestApp();
    // TODO(#62): platform gets validated against an enum and this becomes a
    // 400. Today any :platform value creates and persists a platform config
    // (with empty dimensions). Asserting current behaviour.
    const res = await postJson(
      app,
      "/api/config/screenshot/en/banana",
      makeDefaultScreenshot(),
    );

    assertEquals(res.status, 200);
    const platforms = state.config.languages[0]
      .platforms as unknown as Record<string, unknown>;
    assert("banana" in platforms);
  });
});

Deno.test("PUT /screenshot merges updates into an existing screenshot", async () => {
  await withTempProjectsDir(async () => {
    const { app, state } = makeTestApp();
    const screenshot = makeDefaultScreenshot();
    await postJson(app, "/api/config/screenshot/en/ios", screenshot);

    const res = await app.request(
      `/api/config/screenshot/en/ios/${screenshot.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Updated name" }),
      },
    );

    assertEquals(res.status, 200);
    const updated = state.config.languages[0].platforms.ios.screenshots[0];
    assertEquals(updated.name, "Updated name");
    // Merge, not replace: layers survive
    assertEquals(updated.layers.length, screenshot.layers.length);
  });
});

Deno.test("PUT /screenshot with unknown id returns 404 JSON", async () => {
  await withTempProjectsDir(async () => {
    const { app } = makeTestApp();
    const res = await app.request("/api/config/screenshot/en/ios/nope", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "x" }),
    });

    assertEquals(res.status, 404);
    assertEquals(await res.json(), { error: "Screenshot not found" });
  });
});

Deno.test("DELETE /screenshot removes it from the platform config", async () => {
  await withTempProjectsDir(async () => {
    const { app, state } = makeTestApp();
    const screenshot = makeDefaultScreenshot();
    await postJson(app, "/api/config/screenshot/en/ios", screenshot);

    const res = await app.request(
      `/api/config/screenshot/en/ios/${screenshot.id}`,
      { method: "DELETE" },
    );

    assertEquals(res.status, 200);
    assertEquals(state.config.languages[0].platforms.ios.screenshots, []);
  });
});

Deno.test("POST /language adds a language, rejects duplicates", async () => {
  await withTempProjectsDir(async () => {
    const { app, state } = makeTestApp();

    const res = await postJson(app, "/api/config/language", {
      language: "fr",
    });
    assertEquals(res.status, 200);
    assertEquals(state.config.languages.length, 2);

    const dupe = await postJson(app, "/api/config/language", {
      language: "fr",
    });
    assertEquals(dupe.status, 400);
    assertEquals(await dupe.json(), { error: "Language already exists" });
  });
});

Deno.test("DELETE /language refuses to remove the only language", async () => {
  await withTempProjectsDir(async () => {
    const { app } = makeTestApp();
    const res = await app.request("/api/config/language/en", {
      method: "DELETE",
    });

    assertEquals(res.status, 400);
    assertEquals(await res.json(), {
      error: "Cannot delete the only language",
    });
  });
});
