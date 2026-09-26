import { assert, assertEquals, assertNotEquals } from "@std/assert";
import { join } from "@std/path";
import { createConfigRoutes } from "./config.ts";
import { createServerContext } from "./context.ts";
import { createProject } from "@/projects.ts";
import {
  jsonRequest,
  makeDefaultScreenshot,
  makeFeatureGraphic,
  makeRouteApp,
  withTempProjectsDir,
} from "@/test-helpers.ts";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const ID = "config-routes-test";
const BASE = `/api/projects/${ID}/config`;

/** Config routes over a real on-disk project — saveProject requires one. */
async function makeTestApp() {
  const { id } = await createProject("Config Routes Test");
  assertEquals(id, ID);
  const ctx = createServerContext(id);
  const app = makeRouteApp();
  app.route("/api/projects/:projectId/config", createConfigRoutes(ctx));
  return { app, ctx, id };
}

Deno.test("GET config returns the project's config", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();
    const res = await app.request(`${BASE}`);

    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.app.name, "Config Routes Test");
  });
});

Deno.test("PUT config replaces the config, normalized on disk and in memory", async () => {
  await withTempProjectsDir(async (dir) => {
    const { app, ctx, id } = await makeTestApp();
    const next = {
      ...(await ctx.getConfig(ID)),
      app: { name: "Replaced" },
      // No platforms at all — normalization must fill both
      languages: [{ language: "de" }],
    };

    const res = await jsonRequest(app, "PUT", `${BASE}`, next);

    assertEquals(res.status, 200);
    assertEquals((await ctx.getConfig(ID)).app.name, "Replaced");
    assertEquals(
      (await ctx.getConfig(ID)).languages[0].platforms.ios.screenshots,
      [],
    );
    const onDisk = JSON.parse(
      await Deno.readTextFile(join(dir, id, "config.json")),
    );
    assertEquals(onDisk.languages[0].platforms.android.screenshots, []);
  });
});

Deno.test("PUT config rejects a body without the top-level sections", async () => {
  await withTempProjectsDir(async () => {
    const { app, ctx } = await makeTestApp();
    const before = await ctx.getConfig(ID);

    const res = await jsonRequest(app, "PUT", `${BASE}`, {
      app: {},
      languages: "nope",
    });

    assertEquals(res.status, 400);
    assert((await res.json()).error.includes('"languages" array'));
    assertEquals(await ctx.getConfig(ID), before);
  });
});

Deno.test("POST /screenshot adds a screenshot with a server-generated id and persists it", async () => {
  await withTempProjectsDir(async (dir) => {
    const { app, ctx, id } = await makeTestApp();
    const screenshot = makeDefaultScreenshot();

    const res = await jsonRequest(
      app,
      "POST",
      `${BASE}/screenshot/en/android`,
      screenshot,
    );

    assertEquals(res.status, 200);
    const returned = await res.json();
    assertNotEquals(returned.id, screenshot.id);
    assert(UUID.test(returned.id), `not a UUID: ${returned.id}`);
    assertEquals(returned.name, screenshot.name);
    assertEquals(returned.layers.length, screenshot.layers.length);
    assertEquals(
      (await ctx.getConfig(ID)).languages[0].platforms.android.screenshots.map((
        s,
      ) => s.id),
      [returned.id],
    );
    const onDisk = JSON.parse(
      await Deno.readTextFile(join(dir, id, "config.json")),
    );
    assertEquals(
      onDisk.languages[0].platforms.android.screenshots[0].id,
      returned.id,
    );
  });
});

Deno.test("POST /screenshot with unknown language returns 404 JSON", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();
    const res = await jsonRequest(
      app,
      "POST",
      `${BASE}/screenshot/xx/android`,
      makeDefaultScreenshot(),
    );

    assertEquals(res.status, 404);
    assertEquals(await res.json(), { error: "Language not found" });
  });
});

Deno.test("POST /screenshot with an invalid platform is a 400 and persists nothing", async () => {
  await withTempProjectsDir(async () => {
    const { app, ctx } = await makeTestApp();
    const res = await jsonRequest(
      app,
      "POST",
      `${BASE}/screenshot/en/banana`,
      makeDefaultScreenshot(),
    );

    assertEquals(res.status, 400);
    assert((await res.json()).error.includes('Unknown platform "banana"'));
    const platforms = (await ctx.getConfig(ID)).languages[0]
      .platforms as unknown as Record<string, unknown>;
    assertEquals("banana" in platforms, false);
  });
});

Deno.test("POST /screenshot validates role and layers", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();

    const badRole = await jsonRequest(
      app,
      "POST",
      `${BASE}/screenshot/en/ios`,
      { ...makeDefaultScreenshot(), role: "poster" },
    );
    assertEquals(badRole.status, 400);
    assert((await badRole.json()).error.includes('"role" must be one of'));

    const badLayers = await jsonRequest(
      app,
      "POST",
      `${BASE}/screenshot/en/ios`,
      { ...makeDefaultScreenshot(), layers: "none" },
    );
    assertEquals(badLayers.status, 400);
    assertEquals(await badLayers.json(), {
      error: '"layers" must be an array',
    });
  });
});

Deno.test("POST /screenshot without a JSON Content-Type is a 415", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();
    const res = await app.request(`${BASE}/screenshot/en/ios`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(makeDefaultScreenshot()),
    });

    assertEquals(res.status, 415);
  });
});

Deno.test("PUT /screenshot merges updates but never id or role", async () => {
  await withTempProjectsDir(async () => {
    const { app, ctx } = await makeTestApp();
    const created = await (await jsonRequest(
      app,
      "POST",
      `${BASE}/screenshot/en/ios`,
      makeDefaultScreenshot(),
    )).json();

    const res = await jsonRequest(
      app,
      "PUT",
      `${BASE}/screenshot/en/ios/${created.id}`,
      { id: "hijacked", role: "feature-graphic", name: "Updated name" },
    );

    assertEquals(res.status, 200);
    const updated =
      (await ctx.getConfig(ID)).languages[0].platforms.ios.screenshots[0];
    assertEquals(updated.id, created.id);
    assertEquals(updated.role, "screenshot");
    assertEquals(updated.name, "Updated name");
    // Merge, not replace: layers survive
    assertEquals(updated.layers.length, created.layers.length);
  });
});

Deno.test("PUT /screenshot with unknown id returns 404 JSON", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();
    const res = await jsonRequest(
      app,
      "PUT",
      `${BASE}/screenshot/en/ios/nope`,
      { name: "x" },
    );

    assertEquals(res.status, 404);
    assertEquals(await res.json(), { error: "Screenshot not found" });
  });
});

Deno.test("PUT /screenshot with a malformed body is a 400", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();
    const res = await app.request(`${BASE}/screenshot/en/ios/x`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: "{oops",
    });

    assertEquals(res.status, 400);
    assertEquals(await res.json(), { error: "Request body is not valid JSON" });
  });
});

Deno.test("DELETE /screenshot removes it; an unknown id is a 404", async () => {
  await withTempProjectsDir(async () => {
    const { app, ctx } = await makeTestApp();
    const created = await (await jsonRequest(
      app,
      "POST",
      `${BASE}/screenshot/en/ios`,
      makeDefaultScreenshot(),
    )).json();

    const res = await app.request(
      `${BASE}/screenshot/en/ios/${created.id}`,
      { method: "DELETE" },
    );
    assertEquals(res.status, 200);
    assertEquals(
      (await ctx.getConfig(ID)).languages[0].platforms.ios.screenshots,
      [],
    );

    const again = await app.request(
      `${BASE}/screenshot/en/ios/${created.id}`,
      { method: "DELETE" },
    );
    assertEquals(again.status, 404);
  });
});

Deno.test("POST /language adds a language; a duplicate is a 409", async () => {
  await withTempProjectsDir(async () => {
    const { app, ctx } = await makeTestApp();

    const res = await jsonRequest(app, "POST", `${BASE}/language`, {
      language: "fr",
    });
    assertEquals(res.status, 200);
    assertEquals((await ctx.getConfig(ID)).languages.length, 2);

    const dupe = await jsonRequest(app, "POST", `${BASE}/language`, {
      language: "fr",
    });
    assertEquals(dupe.status, 409);
    assertEquals(await dupe.json(), { error: "Language already exists" });
  });
});

Deno.test("POST /language copies from a source language, 404 when it does not exist", async () => {
  await withTempProjectsDir(async () => {
    const { app, ctx } = await makeTestApp();
    await jsonRequest(
      app,
      "POST",
      `${BASE}/screenshot/en/ios`,
      makeDefaultScreenshot(),
    );

    const copied = await jsonRequest(app, "POST", `${BASE}/language`, {
      language: "nl",
      copyFrom: "en",
    });
    assertEquals(copied.status, 200);
    assertEquals((await ctx.getConfig(ID)).languages[1].language, "nl");
    assertEquals(
      (await ctx.getConfig(ID)).languages[1].platforms.ios.screenshots.length,
      1,
    );

    const missing = await jsonRequest(app, "POST", `${BASE}/language`, {
      language: "it",
      copyFrom: "xx",
    });
    assertEquals(missing.status, 404);
    assertEquals(await missing.json(), {
      error: 'Source language "xx" not found',
    });
  });
});

Deno.test("POST /language requires a language string", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();
    const res = await jsonRequest(app, "POST", `${BASE}/language`, {
      copyFrom: "en",
    });

    assertEquals(res.status, 400);
    assertEquals(await res.json(), {
      error: '"language" must be a non-empty string',
    });
  });
});

Deno.test("DELETE /language refuses the only language and 404s an unknown one", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();

    const only = await app.request(`${BASE}/language/en`, {
      method: "DELETE",
    });
    assertEquals(only.status, 400);
    assertEquals(await only.json(), {
      error: "Cannot delete the only language",
    });

    const unknown = await app.request(`${BASE}/language/xx`, {
      method: "DELETE",
    });
    assertEquals(unknown.status, 404);
    assertEquals(await unknown.json(), { error: "Language not found" });
  });
});

Deno.test("POST /copy-platform copies screenshots with fresh ids, skipping feature graphics", async () => {
  await withTempProjectsDir(async () => {
    const { app, ctx } = await makeTestApp();
    const shot = await (await jsonRequest(
      app,
      "POST",
      `${BASE}/screenshot/en/android`,
      makeDefaultScreenshot(),
    )).json();
    await jsonRequest(
      app,
      "POST",
      `${BASE}/screenshot/en/android`,
      makeFeatureGraphic(),
    );

    const res = await jsonRequest(app, "POST", `${BASE}/copy-platform`, {
      language: "en",
      sourcePlatform: "android",
      targetPlatform: "ios",
    });

    assertEquals(res.status, 200);
    const copied =
      (await ctx.getConfig(ID)).languages[0].platforms.ios.screenshots;
    assertEquals(copied.length, 1);
    assertEquals(copied[0].role, "screenshot");
    assertNotEquals(copied[0].id, shot.id);
    assert(UUID.test(copied[0].id));
  });
});

Deno.test("POST /copy-platform validates both platforms", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();

    const unknown = await jsonRequest(
      app,
      "POST",
      `${BASE}/copy-platform`,
      { language: "en", sourcePlatform: "android", targetPlatform: "web" },
    );
    assertEquals(unknown.status, 400);
    assert(
      (await unknown.json()).error.includes('Unknown targetPlatform "web"'),
    );

    const same = await jsonRequest(app, "POST", `${BASE}/copy-platform`, {
      language: "en",
      sourcePlatform: "ios",
      targetPlatform: "ios",
    });
    assertEquals(same.status, 400);
    assertEquals(await same.json(), {
      error: "sourcePlatform and targetPlatform must differ",
    });
  });
});

Deno.test("a save lands in the project its path names, whichever project was opened last (#136)", async () => {
  await withTempProjectsDir(async (dir) => {
    const { app, ctx } = await makeTestApp();
    const other = await createProject("Other");
    const onDisk = async (id: string) =>
      JSON.parse(await Deno.readTextFile(join(dir, id, "config.json")));
    const before = await onDisk(ID);

    // Another tab opened "other" last; this tab still has ID open
    ctx.setLastProjectId(other.id);
    const res = await jsonRequest(app, "PUT", BASE, {
      ...(await ctx.getConfig(ID)),
      app: { name: "Saved from this tab" },
    });
    assertEquals(res.status, 200);
    assertEquals((await onDisk(ID)).app.name, "Saved from this tab");
    assertEquals((await onDisk(other.id)).app.name, "Other");

    // And the other way round: a save for "other" leaves ID alone
    const otherRes = await jsonRequest(
      app,
      "PUT",
      `/api/projects/${other.id}/config`,
      { ...(await ctx.getConfig(other.id)), app: { name: "Other, edited" } },
    );
    assertEquals(otherRes.status, 200);
    assertEquals((await onDisk(other.id)).app.name, "Other, edited");
    assertEquals((await onDisk(ID)).app.name, "Saved from this tab");
    assertEquals((await ctx.getConfig(ID)).app.name, "Saved from this tab");
    assertNotEquals(before.app.name, "Saved from this tab");
  });
});

Deno.test("a write to a project that doesn't exist is a 404 and creates nothing", async () => {
  await withTempProjectsDir(async (dir) => {
    const { app, ctx } = await makeTestApp();
    const config = await ctx.getConfig(ID);

    const save = await jsonRequest(
      app,
      "PUT",
      "/api/projects/deleted-elsewhere/config",
      config,
    );
    assertEquals(save.status, 404);
    assertEquals(await save.json(), { error: "Project not found" });

    const language = await jsonRequest(
      app,
      "POST",
      "/api/projects/deleted-elsewhere/config/language",
      { language: "de" },
    );
    assertEquals(language.status, 404);

    const entries = [];
    for await (const e of Deno.readDir(dir)) entries.push(e.name);
    assertEquals(entries, [ID]);
  });
});

Deno.test("a project id that isn't a slug is refused before it reaches the disk", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();
    const res = await app.request("/api/projects/Not_A_Slug/config");
    assertEquals(res.status, 400);
  });
});
