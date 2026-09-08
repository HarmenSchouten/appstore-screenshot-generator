/**
 * Store tests for hydration (#65): server state comes in clean, so the
 * auto-saver — which only writes a dirty config — never echoes a load back.
 */

import { assertEquals, assertStrictEquals } from "@std/assert";
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
