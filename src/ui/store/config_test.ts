/**
 * Store tests for hydration (#65): server state comes in clean, so the
 * auto-saver — which only writes a dirty config — never echoes a load back.
 * The canvas test lives here too: like the device default, it edits the spine
 * down to one platform and must leave the rest of the config alone.
 */

import {
  assertEquals,
  assertNotStrictEquals,
  assertStrictEquals,
} from "@std/assert";
import { useAppStore } from "./index.ts";
import { getDefaultConfig } from "@/projects.ts";
import type { Config } from "@ui/types.ts";

const project = (id: string) => ({
  id,
  name: id,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

Deno.test("hydrate loads server state clean and keeps the project list unless given one", () => {
  useAppStore.setState({
    config: {} as Config,
    _configDirty: true,
    projects: [project("a")],
    currentProject: "",
  });
  const config = getDefaultConfig("Test App");

  useAppStore.getState().hydrate({ projectId: "a", config });

  let state = useAppStore.getState();
  assertStrictEquals(state.config, config);
  assertEquals(state._configDirty, false);
  assertEquals(state.currentProject, "a");
  assertEquals(state.projects.map((p) => p.id), ["a"]);

  useAppStore.getState().hydrate({
    projectId: "b",
    config,
    projects: [project("a"), project("b")],
  });
  state = useAppStore.getState();
  assertEquals(state.currentProject, "b");
  assertEquals(state.projects.map((p) => p.id), ["a", "b"]);
});

Deno.test("a local edit after hydration is dirty again", () => {
  const config = getDefaultConfig("Test App");
  useAppStore.getState().hydrate({ projectId: "a", config });
  useAppStore.getState().updateConfig({ ...config });
  assertEquals(useAppStore.getState()._configDirty, true);
});

Deno.test("updateDimensions edits every language of the platform", () => {
  const config = getDefaultConfig("Test App");
  useAppStore.setState({ config, _configDirty: false });
  const before = useAppStore.getState().config;
  const languageCount = before.languages.length;

  useAppStore.getState().updateDimensions("ios", {
    width: 2007,
    height: 2853,
  });

  const after = useAppStore.getState().config;
  const platformOf = (c: Config, platform: "ios" | "android") =>
    c.languages[0].platforms[platform];

  // Every language, not only the one being edited. A canvas is a property of
  // the store, so German must not keep exporting 1242 x 2688 after English
  // was switched to the Duo's display (#162).
  assertEquals(after.languages.length, languageCount);
  for (const language of after.languages) {
    assertEquals(language.platforms.ios.dimensions, {
      width: 2007,
      height: 2853,
    });
  }

  // The dimensions object is replaced, not mutated in place: phone-frame
  // geometry derives from the canvas width, so identity is what makes the
  // preview redraw at the new size.
  assertNotStrictEquals(
    platformOf(after, "ios").dimensions,
    platformOf(before, "ios").dimensions,
  );
  // The other platform is untouched, identity included.
  assertStrictEquals(
    platformOf(after, "android"),
    platformOf(before, "android"),
  );
  assertStrictEquals(after.theme, before.theme);
  assertEquals(useAppStore.getState()._configDirty, true);
});
