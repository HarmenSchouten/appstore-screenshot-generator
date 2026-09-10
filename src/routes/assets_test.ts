import { assert, assertEquals, assertFalse } from "@std/assert";
import { ensureDir, exists } from "@std/fs";
import { join } from "@std/path";
import { createAssetMiddleware, createAssetRoutes } from "./assets.ts";
import { createServerContext } from "./context.ts";
import { createProject, getProjectAssetsDir } from "@/projects.ts";
import {
  jsonRequest,
  makeRouteApp,
  withTempProjectsDir,
} from "@/test-helpers.ts";

const PNG_HEADER = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);

/** Asset routes and static middleware over a real on-disk project. */
async function makeTestApp() {
  const { id } = await createProject("Assets Test");
  const assetsDir = getProjectAssetsDir(id);
  const ctx = createServerContext(id);
  const app = makeRouteApp();
  app.use("/assets/*", createAssetMiddleware(ctx));
  app.route("/api/assets", createAssetRoutes(ctx));
  return { app, assetsDir, projectDir: join(assetsDir, "..") };
}

async function seedImage(assetsDir: string, name = "screen.png") {
  await ensureDir(join(assetsDir, "images"));
  await Deno.writeFile(join(assetsDir, "images", name), PNG_HEADER);
}

function upload(app: ReturnType<typeof makeRouteApp>, fileName: string) {
  const form = new FormData();
  form.append("file", new File([PNG_HEADER], fileName, { type: "image/png" }));
  return app.request("/api/assets/upload", { method: "POST", body: form });
}

// Encoded separators survive URL parsing (a literal ".." segment would be
// collapsed by the URL parser before reaching the router), and Hono only
// decodes them at the param/path stage — exactly what a curl repro sends.
const TRAVERSAL_PATHS = [
  "..%2Fconfig.json",
  "images%2F..%2F..%2Fconfig.json",
  "..%5C..%5Cdefault%5Cconfig.json",
  "%2e%2e%2Fconfig.json",
  "..%2F..%2Fdefault%2Fconfig.json",
  "C:%5CWindows%5Cwin.ini",
];

Deno.test("GET /api/assets lists images under assets/", async () => {
  await withTempProjectsDir(async () => {
    const { app, assetsDir } = await makeTestApp();
    await seedImage(assetsDir);
    await Deno.writeTextFile(join(assetsDir, "images", "notes.txt"), "");

    const res = await app.request("/api/assets");

    assertEquals(res.status, 200);
    assertEquals(await res.json(), { images: ["assets/images/screen.png"] });
  });
});

Deno.test("GET /assets/* serves a file with its content type", async () => {
  await withTempProjectsDir(async () => {
    const { app, assetsDir } = await makeTestApp();
    await seedImage(assetsDir);

    const res = await app.request("/assets/images/screen.png");

    assertEquals(res.status, 200);
    assertEquals(res.headers.get("content-type"), "image/png");
    assertEquals(new Uint8Array(await res.arrayBuffer()), PNG_HEADER);
  });
});

Deno.test("GET /assets/* is a JSON 404 for a missing file or a directory", async () => {
  await withTempProjectsDir(async () => {
    const { app, assetsDir } = await makeTestApp();
    await seedImage(assetsDir);

    const missing = await app.request("/assets/images/nope.png");
    assertEquals(missing.status, 404);
    assertEquals(await missing.json(), { error: "File not found" });

    const dir = await app.request("/assets/images");
    assertEquals(dir.status, 404);
  });
});

Deno.test("GET /assets/* rejects every traversal form with a 400", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();

    for (const path of TRAVERSAL_PATHS) {
      const res = await app.request(`/assets/${path}`);
      assertEquals(res.status, 400, path);
      assertEquals(await res.json(), { error: "Invalid asset path" });
    }
  });
});

Deno.test("POST /upload writes the file under assets/images", async () => {
  await withTempProjectsDir(async () => {
    const { app, assetsDir } = await makeTestApp();

    const res = await upload(app, "logo.png");

    assertEquals(res.status, 200);
    assertEquals(await res.json(), { path: "assets/images/logo.png" });
    assertEquals(
      await Deno.readFile(join(assetsDir, "images", "logo.png")),
      PNG_HEADER,
    );
  });
});

Deno.test("POST /upload rejects a file name with a directory part", async () => {
  await withTempProjectsDir(async () => {
    const { app, assetsDir, projectDir } = await makeTestApp();

    for (const name of ["../evil.png", "..\\evil.png", "sub/evil.png"]) {
      const res = await upload(app, name);
      assertEquals(res.status, 400, name);
      assertEquals(await res.json(), {
        error: "File name must be a plain file name",
      });
    }
    assertFalse(await exists(join(assetsDir, "evil.png")));
    assertFalse(await exists(join(projectDir, "evil.png")));
    assertFalse(await exists(join(assetsDir, "images", "sub")));
  });
});

Deno.test("POST /upload validates the form and its Content-Type", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();

    const noFile = await app.request("/api/assets/upload", {
      method: "POST",
      body: new FormData(),
    });
    assertEquals(noFile.status, 400);
    assertEquals(await noFile.json(), { error: "No file provided" });

    const json = await jsonRequest(app, "POST", "/api/assets/upload", {
      file: "x",
    });
    assertEquals(json.status, 415);
    assertEquals(await json.json(), {
      error: "Content-Type must be multipart/form-data",
    });
  });
});

Deno.test("PATCH /rename moves the file, carrying the extension over", async () => {
  await withTempProjectsDir(async () => {
    const { app, assetsDir } = await makeTestApp();
    await seedImage(assetsDir);

    const res = await jsonRequest(app, "PATCH", "/api/assets/rename", {
      oldPath: "assets/images/screen.png",
      newName: "hero",
    });

    assertEquals(res.status, 200);
    assertEquals(await res.json(), {
      success: true,
      newPath: "assets/images/hero.png",
    });
    assert(await exists(join(assetsDir, "images", "hero.png")));
    assertFalse(await exists(join(assetsDir, "images", "screen.png")));
  });
});

Deno.test("PATCH /rename: unknown source is a 404, existing target is a 409", async () => {
  await withTempProjectsDir(async () => {
    const { app, assetsDir } = await makeTestApp();
    await seedImage(assetsDir, "a.png");
    await seedImage(assetsDir, "b.png");

    const missing = await jsonRequest(app, "PATCH", "/api/assets/rename", {
      oldPath: "assets/images/nope.png",
      newName: "x",
    });
    assertEquals(missing.status, 404);
    assertEquals(await missing.json(), {
      error: 'Asset "assets/images/nope.png" not found',
    });

    const clash = await jsonRequest(app, "PATCH", "/api/assets/rename", {
      oldPath: "assets/images/a.png",
      newName: "b",
    });
    assertEquals(clash.status, 409);
    assertEquals(await clash.json(), {
      error: 'An asset named "b.png" already exists',
    });
    // Nothing was clobbered
    assert(await exists(join(assetsDir, "images", "a.png")));
    assert(await exists(join(assetsDir, "images", "b.png")));
  });
});

Deno.test("PATCH /rename confines both the source and the new name", async () => {
  await withTempProjectsDir(async () => {
    const { app, assetsDir, projectDir } = await makeTestApp();
    await seedImage(assetsDir);

    const badSource = await jsonRequest(app, "PATCH", "/api/assets/rename", {
      oldPath: "assets/../config.json",
      newName: "stolen.json",
    });
    assertEquals(badSource.status, 400);
    assertEquals(await badSource.json(), {
      error: 'Invalid asset path "assets/../config.json"',
    });

    for (const newName of ["../escaped.png", "..\\escaped.png", ".."]) {
      const res = await jsonRequest(app, "PATCH", "/api/assets/rename", {
        oldPath: "assets/images/screen.png",
        newName,
      });
      assertEquals(res.status, 400, newName);
      assertEquals(await res.json(), {
        error: '"newName" must be a plain file name',
      });
    }
    assert(await exists(join(projectDir, "config.json")));
    assert(await exists(join(assetsDir, "images", "screen.png")));
    assertFalse(await exists(join(assetsDir, "escaped.png")));
  });
});

Deno.test("DELETE /api/assets removes the file; unknown path is a 404", async () => {
  await withTempProjectsDir(async () => {
    const { app, assetsDir } = await makeTestApp();
    await seedImage(assetsDir);

    const res = await jsonRequest(app, "DELETE", "/api/assets", {
      path: "assets/images/screen.png",
    });
    assertEquals(res.status, 200);
    assertFalse(await exists(join(assetsDir, "images", "screen.png")));

    const again = await jsonRequest(app, "DELETE", "/api/assets", {
      path: "assets/images/screen.png",
    });
    assertEquals(again.status, 404);
    assertEquals(await again.json(), {
      error: 'Asset "assets/images/screen.png" not found',
    });
  });
});

Deno.test("DELETE /api/assets refuses to reach outside the assets dir", async () => {
  await withTempProjectsDir(async () => {
    const { app, projectDir } = await makeTestApp();

    for (
      const path of [
        "assets/../config.json",
        "assets/../../default/config.json",
        "../config.json",
        "assets/",
      ]
    ) {
      const res = await jsonRequest(app, "DELETE", "/api/assets", { path });
      assertEquals(res.status, 400, path);
      assertEquals(await res.json(), { error: `Invalid asset path "${path}"` });
    }
    assert(await exists(join(projectDir, "config.json")));

    const noPath = await jsonRequest(app, "DELETE", "/api/assets", {});
    assertEquals(noPath.status, 400);
    assertEquals(await noPath.json(), {
      error: '"path" must be a non-empty string',
    });
  });
});
