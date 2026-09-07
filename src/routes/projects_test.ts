import { assert, assertEquals, assertFalse } from "@std/assert";
import { exists } from "@std/fs";
import { join } from "@std/path";
import type { ProjectConfig } from "@app-types";
import { createProjectRoutes, type ProjectState } from "./projects.ts";
import { createProject, initializeProjects, loadProject } from "@/projects.ts";
import {
  jsonRequest,
  makeRouteApp,
  withTempProjectsDir,
} from "@/test-helpers.ts";

/** Project routes with the same state wiring as server.ts. */
async function makeTestApp() {
  const state: ProjectState = {
    currentProjectId: await initializeProjects(),
    currentConfig: null,
  };
  const getConfig = async (): Promise<ProjectConfig> =>
    state.currentConfig ??= await loadProject(state.currentProjectId);
  const app = makeRouteApp();
  app.route(
    "/api/projects",
    createProjectRoutes(
      () => state,
      (updates) => Object.assign(state, updates),
      getConfig,
    ),
  );
  return { app, state };
}

Deno.test("POST /api/projects creates a project", async () => {
  await withTempProjectsDir(async (dir) => {
    const { app } = await makeTestApp();
    const res = await jsonRequest(app, "POST", "/api/projects", {
      name: "Brand New",
    });

    assertEquals(res.status, 200);
    const info = await res.json();
    assertEquals(info.id, "brand-new");
    assert(await exists(join(dir, "brand-new", "config.json")));
  });
});

Deno.test("POST /api/projects validates the body", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();

    const missing = await jsonRequest(app, "POST", "/api/projects", {});
    assertEquals(missing.status, 400);
    assertEquals(await missing.json(), {
      error: '"name" must be a non-empty string',
    });

    const unusable = await jsonRequest(app, "POST", "/api/projects", {
      name: "???",
    });
    assertEquals(unusable.status, 400);
    assert(
      (await unusable.json()).error.includes("at least one letter or number"),
    );

    const plain = await app.request("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ name: "Sneaky" }),
    });
    assertEquals(plain.status, 415);
  });
});

Deno.test("POST /api/projects with an existing id is a 409", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();
    await jsonRequest(app, "POST", "/api/projects", { name: "Twice" });

    const res = await jsonRequest(app, "POST", "/api/projects", {
      name: "Twice",
    });

    assertEquals(res.status, 409);
    assertEquals(await res.json(), { error: 'Project "twice" already exists' });
  });
});

Deno.test("PUT /:id/activate switches the current project", async () => {
  await withTempProjectsDir(async () => {
    const { app, state } = await makeTestApp();
    await createProject("Other");

    const res = await app.request("/api/projects/other/activate", {
      method: "PUT",
    });

    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.projectId, "other");
    assertEquals(body.config.app.name, "Other");
    assertEquals(state.currentProjectId, "other");
    assertEquals(state.currentConfig?.app.name, "Other");
  });
});

Deno.test("PUT /:id/activate with an unknown id is a 404 and leaves state alone", async () => {
  await withTempProjectsDir(async (dir) => {
    const { app, state } = await makeTestApp();

    const res = await app.request("/api/projects/does-not-exist/activate", {
      method: "PUT",
    });

    assertEquals(res.status, 404);
    assertEquals(await res.json(), {
      error: 'Project "does-not-exist" not found',
    });
    assertEquals(state.currentProjectId, "default");
    // No phantom project appeared on disk
    assertFalse(await exists(join(dir, "does-not-exist")));
  });
});

Deno.test("project ids that are not slugs are a 400 on every route", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();
    // Encoded slashes survive URL parsing; Hono decodes the param to "../default"
    const traversal = "..%2Fdefault";

    for (
      const [method, path] of [
        ["PUT", `/api/projects/${traversal}/activate`],
        ["DELETE", `/api/projects/${traversal}`],
        ["PUT", "/api/projects/Upper%20Case/activate"],
      ] as const
    ) {
      const res = await app.request(path, { method });
      assertEquals(res.status, 400, `${method} ${path}`);
      assert((await res.json()).error.startsWith("Invalid project id"));
    }
  });
});

Deno.test("DELETE /:id removes a project; unknown id is a 404", async () => {
  await withTempProjectsDir(async (dir) => {
    const { app, state } = await makeTestApp();
    await createProject("Doomed");

    const res = await app.request("/api/projects/doomed", {
      method: "DELETE",
    });
    assertEquals(res.status, 200);
    assertFalse(await exists(join(dir, "doomed")));
    assertEquals(state.currentProjectId, "default");

    const again = await app.request("/api/projects/doomed", {
      method: "DELETE",
    });
    assertEquals(again.status, 404);
  });
});

Deno.test("DELETE of the current project lands on another existing project", async () => {
  await withTempProjectsDir(async () => {
    const { app, state } = await makeTestApp();
    await createProject("Other");
    await app.request("/api/projects/other/activate", { method: "PUT" });

    const res = await app.request("/api/projects/other", {
      method: "DELETE",
    });

    assertEquals(res.status, 200);
    assertEquals(state.currentProjectId, "default");
    assertEquals(state.currentConfig, null);
  });
});

Deno.test("DELETE of the only project recreates the default", async () => {
  await withTempProjectsDir(async (dir) => {
    const { app, state } = await makeTestApp();

    const res = await app.request("/api/projects/default", {
      method: "DELETE",
    });

    assertEquals(res.status, 200);
    assertEquals(state.currentProjectId, "default");
    assert(await exists(join(dir, "default", "config.json")));
  });
});

Deno.test("PATCH /:id renames; unknown id is a 404; blank name is a 400", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();
    await createProject("Old");

    const ok = await jsonRequest(app, "PATCH", "/api/projects/old", {
      name: "New",
    });
    assertEquals(ok.status, 200);
    assertEquals((await ok.json()).name, "New");
    assertEquals((await loadProject("old")).app.name, "New");

    const unknown = await jsonRequest(app, "PATCH", "/api/projects/nope", {
      name: "New",
    });
    assertEquals(unknown.status, 404);

    const blank = await jsonRequest(app, "PATCH", "/api/projects/old", {
      name: "",
    });
    assertEquals(blank.status, 400);
  });
});

Deno.test("POST /:id/duplicate copies a project; unknown source is a 404", async () => {
  await withTempProjectsDir(async (dir) => {
    const { app } = await makeTestApp();

    const ok = await jsonRequest(
      app,
      "POST",
      "/api/projects/default/duplicate",
      { name: "Default (copy)" },
    );
    assertEquals(ok.status, 200);
    assertEquals((await ok.json()).id, "default-copy");
    assertEquals(
      (await loadProject("default-copy")).app.name,
      "Default (copy)",
    );
    assert(await exists(join(dir, "default-copy", "assets")));

    const unknown = await jsonRequest(
      app,
      "POST",
      "/api/projects/nope/duplicate",
      { name: "Whatever" },
    );
    assertEquals(unknown.status, 404);
    assertFalse(await exists(join(dir, "whatever")));
  });
});
