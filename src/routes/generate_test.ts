import { assert, assertEquals, assertStringIncludes } from "@std/assert";
import { exists } from "@std/fs";
import { join } from "@std/path";
import type { GenerationEvent, GenerationResult } from "@app-types";
import { createGenerateRoutes } from "./generate.ts";
import { createServerContext } from "./context.ts";
import { type HtmlToPngConverter, MANIFEST_FILE } from "@/generation.ts";
import {
  createProject,
  getProjectOutputDir,
  loadProject,
  saveProject,
} from "@/projects.ts";
import {
  makeDefaultScreenshot,
  makeRouteApp,
  withTempProjectsDir,
} from "@/test-helpers.ts";

/** Generate routes over a real project with two iOS screenshots. */
async function makeTestApp(convert: HtmlToPngConverter) {
  const { id } = await createProject("Generate Routes Test");
  const config = await loadProject(id);
  config.languages[0].platforms.ios.screenshots.push(
    makeDefaultScreenshot(),
    { ...makeDefaultScreenshot(), id: "shot-2", name: "Second" },
  );
  await saveProject(id, config);

  const app = makeRouteApp();
  app.route(
    "/api/generate",
    createGenerateRoutes(createServerContext(id), convert),
  );
  return { app, outputDir: getProjectOutputDir(id) };
}

const writingConverter: HtmlToPngConverter = (html, pngPath) =>
  Deno.writeTextFile(pngPath, `png:${html.length}`);

/** Every `data:` line of an SSE body, parsed. */
async function readEvents(res: Response): Promise<GenerationEvent[]> {
  const text = await res.text();
  return text.split("\n")
    .filter((line) => line.startsWith("data: "))
    .map((line) => JSON.parse(line.slice(6)));
}

async function waitFor(
  condition: () => Promise<boolean>,
  timeoutMs = 2000,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!(await condition())) {
    if (Date.now() > deadline) throw new Error("waitFor: timed out");
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

Deno.test("POST /stream relays start/progress/complete as SSE and leaves a manifest", async () => {
  await withTempProjectsDir(async () => {
    const { app, outputDir } = await makeTestApp(writingConverter);

    const res = await app.request("/api/generate/stream", { method: "POST" });

    assertEquals(res.status, 200);
    assertEquals(res.headers.get("content-type"), "text/event-stream");
    const events = await readEvents(res);
    assertEquals(events.map((e) => e.type), [
      "start",
      "progress",
      "progress",
      "complete",
    ]);
    const complete = events.at(-1);
    assert(complete?.type === "complete");
    assertEquals(complete.results.map((r) => r.relativePath), [
      "en/ios/hero.png",
      "en/ios/second.png",
    ]);
    assertEquals(complete.outputDir, outputDir);
    assert(await exists(join(outputDir, MANIFEST_FILE)));
    assert(await exists(join(outputDir, "en", "ios", "second.png")));
  });
});

Deno.test("POST /stream carries a converter failure per screenshot with its real message", async () => {
  await withTempProjectsDir(async () => {
    const reason =
      "Chrome or Chromium was not found. Install Google Chrome, or set PUPPETEER_EXECUTABLE_PATH to a Chromium binary.";
    const { app } = await makeTestApp(() => Promise.reject(new Error(reason)));

    const events = await readEvents(
      await app.request("/api/generate/stream", { method: "POST" }),
    );

    const complete = events.at(-1);
    assert(complete?.type === "complete");
    assertEquals(complete.results.map((r) => r.status), ["error", "error"]);
    assertEquals(complete.results[0].error, reason);
  });
});

Deno.test("POST /stream reports a setup failure as an error event instead of ending silently", async () => {
  await withTempProjectsDir(async () => {
    const { app, outputDir } = await makeTestApp(writingConverter);
    // A file where the output directory should be: the prune can't read it
    await Deno.remove(outputDir, { recursive: true });
    await Deno.writeTextFile(outputDir, "not a directory");

    const events = await readEvents(
      await app.request("/api/generate/stream", { method: "POST" }),
    );

    assertEquals(events.length, 1);
    assert(events[0].type === "error");
    assert(events[0].message.length > 0);
  });
});

Deno.test("POST /stream: cancelling the body stops the run after the screenshot in flight", async () => {
  await withTempProjectsDir(async () => {
    let calls = 0;
    const entered = Promise.withResolvers<void>();
    const gate = Promise.withResolvers<void>();
    // Hold the first screenshot until the test has cancelled
    const convert: HtmlToPngConverter = async (html, pngPath) => {
      calls++;
      entered.resolve();
      await gate.promise;
      await Deno.writeTextFile(pngPath, `png:${html.length}`);
    };
    const { app, outputDir } = await makeTestApp(convert);

    const res = await app.request("/api/generate/stream", { method: "POST" });
    const reader = res.body!.getReader();
    const first = await reader.read();
    assertStringIncludes(new TextDecoder().decode(first.value), '"start"');
    await entered.promise;

    await reader.cancel();
    gate.resolve();
    await waitFor(() => exists(join(outputDir, MANIFEST_FILE)));

    const manifest = JSON.parse(
      await Deno.readTextFile(join(outputDir, MANIFEST_FILE)),
    );
    assertEquals(calls, 1);
    assertEquals(manifest.completed, false);
    assertEquals(manifest.results.length, 1);
    assert(await exists(join(outputDir, "en", "ios", "hero.png")));
    assert(!(await exists(join(outputDir, "en", "ios", "second.png"))));
  });
});

Deno.test("GET /generated is empty before a run and reads the manifest after one", async () => {
  await withTempProjectsDir(async () => {
    const { app, outputDir } = await makeTestApp(writingConverter);

    const before = await (await app.request("/api/generate/generated")).json();
    assertEquals(before, { results: [], outputDir });

    await readEvents(
      await app.request("/api/generate/stream", { method: "POST" }),
    );

    const after = await (await app.request("/api/generate/generated")).json();
    assertEquals(
      (after.results as GenerationResult[]).map((r) => [
        r.relativePath,
        r.role,
        r.status,
      ]),
      [
        ["en/ios/hero.png", "screenshot", "success"],
        ["en/ios/second.png", "screenshot", "success"],
      ],
    );
  });
});
