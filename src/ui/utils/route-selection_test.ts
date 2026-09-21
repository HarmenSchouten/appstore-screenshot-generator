/**
 * The URL is the source of truth for project, language, platform and
 * selection, so these are the rules the panels are rendered from: what each
 * slot means, what an unknown value falls back to, and which paths are a
 * request to activate another project rather than a statement about this one.
 *
 * `canonicalPath` is a fixed point on purpose — the effect that corrects the
 * URL navigates to it, and a path that resolved to a different one on the
 * second pass would loop.
 */

import { assert, assertEquals } from "@std/assert";
import {
  buildPath,
  nextSelection,
  parseSegments,
  requestSegments,
  resolveSelection,
  resolveTarget,
  type Selection,
  type TargetContext,
} from "./route-selection.ts";

/** alpha is loaded, beta exists, and alpha speaks en and de. */
const CTX: TargetContext = {
  loadedProject: "alpha",
  projectIds: ["alpha", "beta"],
  languages: ["en", "de"],
};

const SHOTS = ["shot-1", "shot-2"];

const resolve = (
  pathname: string,
  ctx: TargetContext = CTX,
  screenshotIds: readonly string[] = SHOTS,
) =>
  resolveSelection(resolveTarget(parseSegments(pathname), ctx), screenshotIds);

Deno.test("segments round-trip through a path", () => {
  for (
    const path of [
      "/",
      "/alpha",
      "/alpha/en",
      "/alpha/en/android",
      "/alpha/en/android/shot-1",
    ]
  ) {
    assertEquals(buildPath(parseSegments(path)), path);
  }

  assertEquals(parseSegments("/alpha/en/android/shot-1"), {
    project: "alpha",
    lang: "en",
    platform: "android",
    screenshotId: "shot-1",
  });

  // A trailing slash and a doubled one name the same route
  assertEquals(parseSegments("/alpha//en/"), parseSegments("/alpha/en"));

  // A project name with a space survives both ways
  assertEquals(parseSegments("/my%20app/en").project, "my app");
  assertEquals(buildPath(parseSegments("/my%20app/en")), "/my%20app/en");
});

Deno.test("a deep link into the loaded project resolves as written", () => {
  const { selection, canonicalPath, switchTo } = resolve(
    "/alpha/de/ios/shot-2",
  );

  assertEquals(selection, {
    project: "alpha",
    lang: "de",
    platform: "ios",
    screenshotId: "shot-2",
  });
  assertEquals(canonicalPath, "/alpha/de/ios/shot-2");
  assertEquals(switchTo, null);
});

Deno.test("a deep link into another project asks for it and keeps its tail", () => {
  const { selection, canonicalPath, switchTo } = resolve(
    "/beta/fr/ios/beta-shot",
  );

  assert(switchTo !== null, "a known project that is not the loaded one");
  assertEquals(switchTo.projectId, "beta");
  assertEquals(switchTo.tail, {
    lang: "fr",
    platform: "ios",
    screenshotId: "beta-shot",
  });
  // The URL stands as written until beta is loaded: canonicalising it against
  // alpha's config would throw away everything the link asked for
  assertEquals(canonicalPath, "/beta/fr/ios/beta-shot");
  // Meanwhile the panels keep rendering the project whose config is loaded
  assertEquals(selection.project, "alpha");

  // Once beta is loaded, the same tail is resolved against beta's own config
  const loaded = resolveSelection(
    resolveTarget(requestSegments(switchTo), {
      loadedProject: "beta",
      projectIds: ["alpha", "beta"],
      languages: ["fr", "en"],
    }),
    ["beta-shot"],
  );
  assertEquals(loaded.selection, {
    project: "beta",
    lang: "fr",
    platform: "ios",
    screenshotId: "beta-shot",
  });
  assertEquals(loaded.canonicalPath, "/beta/fr/ios/beta-shot");
  assertEquals(loaded.switchTo, null);
});

Deno.test("a tail that the requested project cannot honour is corrected", () => {
  const { switchTo } = resolve("/beta/fr/ios/beta-shot");
  assert(switchTo !== null);

  const loaded = resolveSelection(
    resolveTarget(requestSegments(switchTo), {
      loadedProject: "beta",
      projectIds: ["alpha", "beta"],
      languages: ["nl"],
    }),
    [],
  );
  assertEquals(loaded.canonicalPath, "/beta/nl/ios");
});

Deno.test("an unknown project means the loaded one, tail intact", () => {
  const { selection, canonicalPath, switchTo } = resolve("/deleted/de/ios");

  assertEquals(switchTo, null);
  assertEquals(selection.project, "alpha");
  assertEquals(canonicalPath, "/alpha/de/ios");
});

Deno.test("an unknown language falls back to the first one", () => {
  const { selection, canonicalPath } = resolve("/alpha/fr/ios/shot-1");

  assertEquals(selection.lang, "en");
  assertEquals(canonicalPath, "/alpha/en/ios/shot-1");
});

Deno.test("an unknown platform falls back to android", () => {
  const { selection, canonicalPath } = resolve("/alpha/de/windows/shot-1");

  assertEquals(selection.platform, "android");
  assertEquals(canonicalPath, "/alpha/de/android/shot-1");
});

Deno.test("a platform in the language slot is promoted and the tail shifts", () => {
  const short = resolve("/alpha/ios");
  assertEquals(short.selection.lang, "en");
  assertEquals(short.selection.platform, "ios");
  assertEquals(short.canonicalPath, "/alpha/en/ios");

  const deep = resolve("/alpha/ios/shot-2");
  assertEquals(deep.selection.platform, "ios");
  assertEquals(deep.selection.screenshotId, "shot-2");
  assertEquals(deep.canonicalPath, "/alpha/en/ios/shot-2");
});

Deno.test("a language wins the slot from a platform of the same name", () => {
  const ctx: TargetContext = { ...CTX, languages: ["ios", "en"] };
  const { selection, canonicalPath } = resolve(
    "/alpha/ios/android/shot-1",
    ctx,
  );

  assertEquals(selection.lang, "ios");
  assertEquals(selection.platform, "android");
  assertEquals(canonicalPath, "/alpha/ios/android/shot-1");
});

Deno.test("a stale screenshot id selects nothing", () => {
  const { selection, canonicalPath } = resolve(
    "/alpha/en/android/deleted",
    CTX,
    ["shot-1"],
  );

  assertEquals(selection.screenshotId, null);
  assertEquals(canonicalPath, "/alpha/en/android");
});

Deno.test("an empty path resolves to the loaded project", () => {
  assertEquals(resolve("/").canonicalPath, "/alpha/en/android");
});

Deno.test("a project with no languages stops the path at the project", () => {
  const ctx: TargetContext = { ...CTX, languages: [] };
  const { selection, canonicalPath } = resolve("/alpha/en/android", ctx, []);

  assertEquals(selection.lang, "");
  assertEquals(canonicalPath, "/alpha");
});

Deno.test("canonicalPath is a fixed point", () => {
  for (
    const path of [
      "/",
      "/alpha",
      "/alpha/ios",
      "/alpha/ios/shot-2",
      "/deleted/fr/windows/gone",
      "/alpha/de/ios/shot-2",
      "/beta/fr/ios/beta-shot",
    ]
  ) {
    const once = resolve(path).canonicalPath;
    assertEquals(resolve(once).canonicalPath, once, path);
  }
});

Deno.test("changing language or platform drops the screenshot", () => {
  const current: Selection = {
    project: "alpha",
    lang: "en",
    platform: "android",
    screenshotId: "shot-1",
  };

  // Screenshot ids are scoped to one language and platform
  assertEquals(nextSelection(current, { lang: "de" }).screenshotId, null);
  assertEquals(nextSelection(current, { platform: "ios" }).screenshotId, null);

  // Re-picking the value it already has is not a scope change, so the
  // screenshot stays selected and the path does not lose it
  assertEquals(
    buildPath(nextSelection(current, { lang: "en" })),
    buildPath(current),
  );
  assertEquals(
    buildPath(nextSelection(current, { platform: "android" })),
    "/alpha/en/android/shot-1",
  );

  // Selecting and deselecting within one language and platform
  assertEquals(
    nextSelection(current, { screenshotId: "shot-2" }).screenshotId,
    "shot-2",
  );
  assertEquals(
    nextSelection(current, { screenshotId: null }).screenshotId,
    null,
  );

  // A patch that names a replacement keeps it
  assertEquals(nextSelection(current, { lang: "de", screenshotId: "shot-9" }), {
    project: "alpha",
    lang: "de",
    platform: "android",
    screenshotId: "shot-9",
  });
});
