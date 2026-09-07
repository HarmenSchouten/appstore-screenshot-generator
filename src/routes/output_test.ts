import { assertEquals, assertNotEquals } from "@std/assert";
import { ensureDir } from "@std/fs";
import { join } from "@std/path";
import { createOutputRoutes } from "./output.ts";
import { createProject, getProjectOutputDir } from "@/projects.ts";
import { makeRouteApp, withTempProjectsDir } from "@/test-helpers.ts";

const PNG_HEADER = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);

async function makeTestApp() {
  const { id } = await createProject("Output Test");
  const outputDir = getProjectOutputDir(id);
  await ensureDir(join(outputDir, "en", "ios"));
  await Deno.writeFile(
    join(outputDir, "en", "ios", "1-screenshot.png"),
    PNG_HEADER,
  );
  const app = makeRouteApp();
  app.route("/output", createOutputRoutes(() => id));
  return { app, projectDir: join(outputDir, "..") };
}

Deno.test("GET /output/* serves a generated file", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();

    const res = await app.request("/output/en/ios/1-screenshot.png");

    assertEquals(res.status, 200);
    assertEquals(res.headers.get("content-type"), "image/png");
    assertEquals(new Uint8Array(await res.arrayBuffer()), PNG_HEADER);
  });
});

Deno.test("GET /output/* is a JSON 404 for a missing file or a directory", async () => {
  await withTempProjectsDir(async () => {
    const { app } = await makeTestApp();

    const missing = await app.request("/output/en/ios/nope.png");
    assertEquals(missing.status, 404);
    assertEquals(await missing.json(), { error: "File not found" });

    const dir = await app.request("/output/en/ios");
    assertEquals(dir.status, 404);
  });
});

Deno.test("GET /output/* rejects traversal out of the output dir", async () => {
  await withTempProjectsDir(async () => {
    const { app, projectDir } = await makeTestApp();
    const configJson = await Deno.readTextFile(join(projectDir, "config.json"));

    // The issue's repro shape: encoded slashes reach the router intact and
    // Hono decodes the param to "../config.json"
    for (
      const path of [
        "..%2Fconfig.json",
        "en%2F..%2F..%2Fconfig.json",
        "..%5Cconfig.json",
        "%2e%2e%2Fconfig.json",
        "..%2F..%2Fdefault%2Fconfig.json",
        "C:%5CWindows%5Cwin.ini",
        "%2Fetc%2Fpasswd",
      ]
    ) {
      const res = await app.request(`/output/${path}`);
      assertEquals(res.status, 400, path);
      const body = await res.text();
      assertNotEquals(body, configJson, path);
      assertEquals(JSON.parse(body), { error: "Invalid output path" });
    }
  });
});
