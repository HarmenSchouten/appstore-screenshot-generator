import {
  assert,
  assertEquals,
  assertFalse,
  assertStringIncludes,
} from "@std/assert";
import { ensureDir, exists } from "@std/fs";
import { dirname, join } from "@std/path";
import type {
  Dimensions,
  GenerationProgressEvent,
  ProjectConfig,
} from "@app-types";
import { DEFAULT_DIMENSIONS, FEATURE_GRAPHIC_SIZE } from "@lib";
import {
  generateAll,
  MANIFEST_FILE,
  planGeneration,
  readManifest,
} from "./generation.ts";
import {
  createProject,
  getDefaultConfig,
  getProjectAssetsDir,
  getProjectOutputDir,
} from "./projects.ts";
import {
  makeDefaultScreenshot,
  makeFeatureGraphic,
  withTempProjectsDir,
} from "./test-helpers.ts";

/**
 * Three screenshots: en/ios "Hero", en/android a feature graphic and an
 * unnamed screenshot (exercises the role-numbered fallback name).
 */
function makeConfig(): ProjectConfig {
  const config = getDefaultConfig("Generation Test");
  const en = config.languages[0];
  en.platforms.ios.screenshots.push(makeDefaultScreenshot());
  en.platforms.android.screenshots.push(makeFeatureGraphic(), {
    id: "unnamed",
    role: "screenshot",
    layers: [{ id: "bg", type: "background", opacity: 1 }],
  });
  return config;
}

interface StubCall {
  html: string;
  pngPath: string;
  dimensions: Dimensions;
}

/**
 * A converter that records calls and writes the HTML length as the "PNG".
 * `fail` can make chosen paths throw; `onCall` runs before the write.
 */
function stubConverter(options: {
  fail?: (pngPath: string) => Error | undefined;
  onCall?: (call: StubCall) => void;
} = {}) {
  const calls: StubCall[] = [];
  const convert = async (
    html: string,
    pngPath: string,
    dimensions: Dimensions,
  ) => {
    const call = { html, pngPath, dimensions };
    calls.push(call);
    options.onCall?.(call);
    const error = options.fail?.(pngPath);
    if (error) throw error;
    await Deno.writeTextFile(pngPath, `png:${html.length}`);
  };
  return { convert, calls };
}

async function setup() {
  const { id } = await createProject("Generation Test");
  return {
    outputDir: getProjectOutputDir(id),
    assetsDir: getProjectAssetsDir(id),
  };
}

Deno.test("planGeneration: one item per screenshot, unique role-numbered file names, role-aware dimensions", () => {
  const config = makeConfig();
  // Two more iOS shots named "Hero" collide with the first
  config.languages[0].platforms.ios.screenshots.push(
    { ...makeDefaultScreenshot(), id: "hero-b" },
    { ...makeDefaultScreenshot(), id: "hero-c" },
  );

  const items = planGeneration(config, "/out");

  assertEquals(items.map((i) => i.relativePath), [
    "en/android/feature-graphic.png",
    "en/android/1-screenshot.png",
    "en/ios/hero.png",
    "en/ios/hero-2.png",
    "en/ios/hero-3.png",
  ]);
  assertEquals(items[0].dimensions, FEATURE_GRAPHIC_SIZE);
  assertEquals(items[1].dimensions, DEFAULT_DIMENSIONS.android);
  assertEquals(items[1].displayName, "1-screenshot");
});

Deno.test("generateAll: emits start/progress/complete, writes PNGs and a manifest", async () => {
  await withTempProjectsDir(async () => {
    const { outputDir, assetsDir } = await setup();
    const { convert, calls } = stubConverter();
    const events: GenerationProgressEvent[] = [];

    const manifest = await generateAll(makeConfig(), {
      outputDir,
      assetsDir,
      convert,
      onEvent: (e) => events.push(e),
    });

    assertEquals(events.map((e) => e.type), [
      "start",
      "progress",
      "progress",
      "progress",
      "complete",
    ]);
    assertEquals(events[0], { type: "start", total: 3 });
    assertEquals(events[1], {
      type: "progress",
      current: 1,
      total: 3,
      item: "en/android: Feature graphic",
    });

    assertEquals(calls.length, 3);
    // Rendered documents point assets at the project's assets dir over file://
    assertStringIncludes(calls[0].html, "file:///");
    assertStringIncludes(calls[0].html, "images/screen.png");
    assertEquals(calls[0].dimensions, FEATURE_GRAPHIC_SIZE);

    for (
      const path of [
        "en/android/feature-graphic.png",
        "en/android/1-screenshot.png",
        "en/ios/hero.png",
      ]
    ) {
      assert(await exists(join(outputDir, ...path.split("/"))), path);
    }

    assertEquals(manifest.completed, true);
    assertEquals(
      manifest.results.map((r) => [r.relativePath, r.status, r.screenshotId]),
      [
        ["en/android/feature-graphic.png", "success", "fg-1"],
        ["en/android/1-screenshot.png", "success", "unnamed"],
        ["en/ios/hero.png", "success", "shot-1"],
      ],
    );
    assertEquals(await readManifest(outputDir), manifest);

    const complete = events.at(-1);
    assert(complete?.type === "complete");
    assertEquals(complete.results, manifest.results);
    assertEquals(complete.outputDir, outputDir);
  });
});

Deno.test("generateAll: a config without screenshots still completes and writes a manifest", async () => {
  await withTempProjectsDir(async () => {
    const { outputDir, assetsDir } = await setup();
    const events: GenerationProgressEvent[] = [];

    const manifest = await generateAll(getDefaultConfig(), {
      outputDir,
      assetsDir,
      convert: stubConverter().convert,
      onEvent: (e) => events.push(e),
    });

    assertEquals(events.map((e) => e.type), ["start", "complete"]);
    assertEquals(manifest.results, []);
    assertEquals((await readManifest(outputDir))?.completed, true);
  });
});

Deno.test("generateAll: prunes orphans and leftovers first, keeps current PNGs", async () => {
  await withTempProjectsDir(async () => {
    const { outputDir, assetsDir } = await setup();
    await ensureDir(join(outputDir, "en", "ios"));
    await ensureDir(join(outputDir, "de", "android"));
    // Renamed screenshot, pre-#63 intermediate file, deleted language
    await Deno.writeTextFile(join(outputDir, "en", "ios", "old-name.png"), "");
    await Deno.writeTextFile(join(outputDir, "en", "ios", "hero.html"), "");
    await Deno.writeTextFile(join(outputDir, "de", "android", "x.png"), "");
    // Current screenshot: stays, then gets overwritten
    await Deno.writeTextFile(join(outputDir, "en", "ios", "hero.png"), "stale");
    await Deno.writeTextFile(join(outputDir, MANIFEST_FILE), "{}");

    await generateAll(makeConfig(), {
      outputDir,
      assetsDir,
      convert: stubConverter().convert,
    });

    assertFalse(await exists(join(outputDir, "en", "ios", "old-name.png")));
    assertFalse(await exists(join(outputDir, "en", "ios", "hero.html")));
    assertFalse(await exists(join(outputDir, "de")));
    assertStringIncludes(
      await Deno.readTextFile(join(outputDir, "en", "ios", "hero.png")),
      "png:",
    );
    const entries = (await Array.fromAsync(Deno.readDir(outputDir)))
      .map((e) => e.name).sort();
    assertEquals(entries, ["en", MANIFEST_FILE]);
  });
});

Deno.test("generateAll: a converter failure keeps the real message and removes the stale PNG", async () => {
  await withTempProjectsDir(async () => {
    const { outputDir, assetsDir } = await setup();
    const heroPath = join(outputDir, "en", "ios", "hero.png");
    await ensureDir(dirname(heroPath));
    await Deno.writeTextFile(heroPath, "stale");
    const reason =
      "Chrome failed to start (C:\\nowhere\\chrome.exe): spawn ENOENT";
    const { convert } = stubConverter({
      fail: (p) => p === heroPath ? new Error(reason) : undefined,
    });
    const events: GenerationProgressEvent[] = [];

    const manifest = await generateAll(makeConfig(), {
      outputDir,
      assetsDir,
      convert,
      onEvent: (e) => events.push(e),
    });

    const hero = manifest.results.find((r) =>
      r.relativePath === "en/ios/hero.png"
    );
    assertEquals(hero?.status, "error");
    assertEquals(hero?.error, reason);
    assertFalse(await exists(heroPath));
    assertEquals(
      manifest.results.filter((r) => r.status === "success").length,
      2,
    );
    // One failure does not stop the run
    assertEquals(events.at(-1)?.type, "complete");
    assertEquals(manifest.completed, true);
  });
});

Deno.test("generateAll: aborting stops after the screenshot in flight", async () => {
  await withTempProjectsDir(async () => {
    const { outputDir, assetsDir } = await setup();
    const abort = new AbortController();
    // Cancel while the first screenshot is converting
    const { convert, calls } = stubConverter({ onCall: () => abort.abort() });
    const events: GenerationProgressEvent[] = [];

    const manifest = await generateAll(makeConfig(), {
      outputDir,
      assetsDir,
      convert,
      onEvent: (e) => events.push(e),
      signal: abort.signal,
    });

    assertEquals(calls.length, 1);
    assertEquals(events.map((e) => e.type), ["start", "progress"]);
    assertEquals(manifest.completed, false);
    assertEquals(manifest.results.map((r) => r.status), ["success"]);
    // The first PNG landed, the rest were never written
    assert(
      await exists(join(outputDir, "en", "android", "feature-graphic.png")),
    );
    assertFalse(await exists(join(outputDir, "en", "ios", "hero.png")));
    // The partial run is still on record
    assertEquals((await readManifest(outputDir))?.completed, false);
  });
});

Deno.test("readManifest: null when nothing has been generated", async () => {
  await withTempProjectsDir(async () => {
    const { outputDir } = await setup();
    assertEquals(await readManifest(outputDir), null);
    assertEquals(await readManifest(join(outputDir, "nope")), null);
  });
});
