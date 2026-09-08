/**
 * Store tests for the screenshot slice (#64).
 *
 * The point of these is structural sharing: an edit must rebuild only the
 * spine down to the touched screenshot. A `structuredClone` of the whole
 * config passes every behavioural assertion here and still re-renders the
 * entire app on each keystroke, because `theme`, `app` and `dimensions` come
 * back as new objects that no selector can hold an identity on.
 */

import { assert, assertEquals, assertStrictEquals } from "@std/assert";
import { useAppStore } from "./index.ts";
import { getDefaultConfig } from "@/projects.ts";
import { makeDefaultScreenshot, makeFeatureGraphic } from "@/test-helpers.ts";
import type { Config } from "@ui/types.ts";

/** en + de, android carrying a screenshot and a feature graphic. */
function makeConfig(): Config {
  const base = getDefaultConfig("Test App");
  const en = base.languages[0];
  en.platforms.android.screenshots = [
    makeDefaultScreenshot(),
    { ...makeDefaultScreenshot(), id: "shot-2", name: "Second" },
    makeFeatureGraphic(),
  ];
  return {
    ...base,
    languages: [en, { ...structuredClone(en), language: "de" }],
  };
}

function seedStore(): Config {
  const config = makeConfig();
  useAppStore.setState({
    config,
    _configDirty: false,
    selectedLang: "en",
    selectedPlatform: "android",
    selectedScreenshotId: null,
  });
  return config;
}

const androidOf = (config: Config, lang = "en") =>
  config.languages.find((l) => l.language === lang)!.platforms.android;

Deno.test("updateScreenshot rebuilds only the path to the edited screenshot", () => {
  const before = seedStore();

  useAppStore.getState().updateScreenshot("shot-1", { name: "Renamed" });

  const after = useAppStore.getState().config;
  assert(after !== before, "config identity changes so the auto-saver fires");
  assertEquals(androidOf(after).screenshots[0].name, "Renamed");

  // Untouched branches keep their identity — this is what lets App subscribe
  // to `config.theme` / `config.app` and Preview memoise on its props.
  assertStrictEquals(after.theme, before.theme);
  assertStrictEquals(after.app, before.app);
  assertStrictEquals(after.platformDefaults, before.platformDefaults);
  assertStrictEquals(androidOf(after).dimensions, androidOf(before).dimensions);
  assertStrictEquals(
    after.languages.find((l) => l.language === "de"),
    before.languages.find((l) => l.language === "de"),
  );
  assertStrictEquals(
    after.languages.find((l) => l.language === "en")!.platforms.ios,
    before.languages.find((l) => l.language === "en")!.platforms.ios,
  );

  // Siblings are shared; only the edited screenshot is a new object.
  assertStrictEquals(
    androidOf(after).screenshots[1],
    androidOf(before).screenshots[1],
  );
  assertStrictEquals(
    androidOf(after).screenshots[2],
    androidOf(before).screenshots[2],
  );
  assert(androidOf(after).screenshots[0] !== androidOf(before).screenshots[0]);
});

Deno.test("updateScreenshot leaves the previous config untouched", () => {
  const before = seedStore();
  const layerCountBefore = androidOf(before).screenshots[0].layers.length;

  useAppStore.getState().updateScreenshot("shot-1", {
    name: "Renamed",
    layers: [{ id: "bg", type: "background", opacity: 0.5 }],
  });

  assertEquals(androidOf(before).screenshots[0].name, "Hero");
  assertEquals(
    androidOf(before).screenshots[0].layers.length,
    layerCountBefore,
  );
});

Deno.test("an update that changes nothing does not touch the store", () => {
  const before = seedStore();

  useAppStore.getState().updateScreenshot("does-not-exist", { name: "x" });
  assertStrictEquals(useAppStore.getState().config, before);
  assertEquals(useAppStore.getState()._configDirty, false);

  useAppStore.getState().removeScreenshot("does-not-exist");
  assertStrictEquals(useAppStore.getState().config, before);
  assertEquals(useAppStore.getState()._configDirty, false);

  // Only one feature graphic per platform
  useAppStore.getState().addFeatureGraphic();
  assertStrictEquals(useAppStore.getState().config, before);
  assertEquals(useAppStore.getState()._configDirty, false);
});

Deno.test("add, remove and reorder keep working", () => {
  seedStore();
  const store = useAppStore.getState();

  store.addScreenshot();
  const added = useAppStore.getState().selectedScreenshotId!;
  const withAdded = androidOf(useAppStore.getState().config).screenshots;
  assertEquals(withAdded.length, 4);
  assertEquals(withAdded[3].id, added);
  assertEquals(withAdded[3].name, "Screenshot 3");

  store.reorderScreenshots([added, "shot-2", "shot-1"]);
  assertEquals(
    androidOf(useAppStore.getState().config).screenshots.map((s) => s.id),
    [added, "shot-2", "shot-1", "fg-1"],
  );

  store.removeScreenshot(added);
  assertEquals(
    androidOf(useAppStore.getState().config).screenshots.map((s) => s.id),
    ["shot-2", "shot-1", "fg-1"],
  );
  // The removed screenshot was selected, so the selection is cleared
  assertEquals(useAppStore.getState().selectedScreenshotId, null);

  store.setSelectedScreenshotId("fg-1");
  store.removeFeatureGraphic();
  assertEquals(
    androidOf(useAppStore.getState().config).screenshots.map((s) => s.id),
    ["shot-2", "shot-1"],
  );
  assertEquals(useAppStore.getState().selectedScreenshotId, null);
});

Deno.test("switching language or platform clears the selection in one update", () => {
  seedStore();
  const store = useAppStore.getState();

  let notifications = 0;
  const unsubscribe = useAppStore.subscribe(() => notifications++);
  try {
    store.setSelectedScreenshotId("shot-1");
    notifications = 0;

    // Screenshot ids are scoped to a language/platform: the selection cannot
    // survive the switch, and clearing it here saves a second navigation.
    store.setSelectedPlatform("ios");
    assertEquals(useAppStore.getState().selectedScreenshotId, null);
    assertEquals(notifications, 1);

    store.setSelectedScreenshotId("shot-1");
    notifications = 0;
    store.setSelectedLang("de");
    assertEquals(useAppStore.getState().selectedScreenshotId, null);
    assertEquals(notifications, 1);

    // Re-selecting the same value is not a change
    notifications = 0;
    store.setSelectedLang("de");
    store.setSelectedPlatform("ios");
    assertEquals(notifications, 0);
  } finally {
    unsubscribe();
  }
});
