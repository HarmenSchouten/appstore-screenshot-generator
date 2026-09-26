/**
 * Store-integration tests for config persistence (#58, #68, #136):
 * a failed save must keep the store dirty, toast once, and retry until the
 * server comes back, unless the server refused it outright; the subscription
 * must save local edits only — never echo a hydration back — and each edit
 * goes to the project it was made in.
 */

import { assert, assertEquals, assertStrictEquals } from "@std/assert";
import { FakeTime } from "@std/testing/time";
import {
  createConfigAutoSaver,
  startConfigAutoSave,
} from "./config-persistence.ts";
import { useAppStore } from "@ui/store/index.ts";
import { ApiError } from "./api.ts";
import {
  type AutoSaver,
  RETRY_DELAYS_MS,
  SAVE_DEBOUNCE_MS,
} from "./auto-saver.ts";
import { getDefaultConfig } from "@/projects.ts";
import type { Config } from "@ui/types.ts";

const errorToasts = () =>
  useAppStore.getState().toasts.filter((t) => t.type === "error");

Deno.test("failed save keeps the store dirty, toasts once, and retries until the server recovers", async () => {
  using time = new FakeTime();
  useAppStore.setState({
    currentProject: "a",
    _configDirty: false,
    toasts: [],
  });

  let failing = true;
  let saves = 0;
  const saver = createConfigAutoSaver("a", () => {
    saves++;
    return failing ? Promise.reject(new Error("HTTP 500")) : Promise.resolve();
  });

  try {
    useAppStore.setState({ _configDirty: true });
    saver.schedule(useAppStore.getState().config);
    await time.tickAsync(SAVE_DEBOUNCE_MS);

    // save failed: dirty flag survives, exactly one error toast
    assertEquals(saves, 1);
    assertEquals(useAppStore.getState()._configDirty, true);
    assertEquals(errorToasts().length, 1);

    // retry is scheduled without further edits; second failure doesn't re-toast
    await time.tickAsync(RETRY_DELAYS_MS[0]);
    assertEquals(saves, 2);
    assertEquals(errorToasts().length, 1);

    // server comes back: config lands, store goes clean
    failing = false;
    await time.tickAsync(RETRY_DELAYS_MS[1]);
    assertEquals(saves, 3);
    assertEquals(useAppStore.getState()._configDirty, false);
    assert(useAppStore.getState().toasts.some((t) => t.type === "success"));
  } finally {
    saver.dispose();
  }
});

Deno.test("a save the server refuses is not retried on a timer, and the toast says why", async () => {
  using time = new FakeTime();
  useAppStore.setState({
    currentProject: "gone",
    _configDirty: true,
    toasts: [],
  });

  let saves = 0;
  const saver = createConfigAutoSaver("gone", () => {
    saves++;
    return Promise.reject(new ApiError(404, "Project not found"));
  });

  try {
    saver.schedule(useAppStore.getState().config);
    await time.tickAsync(SAVE_DEBOUNCE_MS);
    assertEquals(saves, 1);
    assertEquals(errorToasts().map((t) => t.message), [
      "Failed to save config: Project not found",
    ]);

    // No retry loop against a project that no longer exists
    await time.tickAsync(RETRY_DELAYS_MS.reduce((a, b) => a + b) * 3);
    assertEquals(saves, 1);
    assertEquals(useAppStore.getState()._configDirty, true);

    // The next edit tries again, without another toast (the first one has
    // timed out by now, so any toast left would be a new one)
    useAppStore.setState({ toasts: [] });
    saver.schedule(useAppStore.getState().config);
    await time.tickAsync(SAVE_DEBOUNCE_MS);
    assertEquals(saves, 2);
    assertEquals(errorToasts().length, 0);
  } finally {
    saver.dispose();
  }
});

Deno.test("a save for a project the editor has left leaves the dirty flag alone", async () => {
  using time = new FakeTime();
  const saver = createConfigAutoSaver("a", () => Promise.resolve());

  try {
    saver.schedule(useAppStore.getState().config);
    // The editor moved to b and b has an unsaved edit of its own
    useAppStore.setState({ currentProject: "b", _configDirty: true });
    await time.tickAsync(SAVE_DEBOUNCE_MS);
    assertEquals(useAppStore.getState()._configDirty, true);
  } finally {
    saver.dispose();
  }
});

Deno.test("the subscription saves local edits and ignores hydration", async () => {
  using time = new FakeTime();
  const saved: Config[] = [];
  const saver = createConfigAutoSaver("a", (_projectId, config) => {
    saved.push(config);
    return Promise.resolve();
  });
  const stop = startConfigAutoSave(() => saver);

  try {
    // Server state comes in clean: nothing to write back
    const loaded = getDefaultConfig("Test App");
    useAppStore.getState().hydrate({ projectId: "a", config: loaded });
    await time.tickAsync(SAVE_DEBOUNCE_MS);
    assertEquals(saved.length, 0);

    // A local edit is dirty: one debounced save with the latest config
    const edit1 = { ...loaded, app: { ...loaded.app, name: "Edit 1" } };
    const edit2 = { ...loaded, app: { ...loaded.app, name: "Edit 2" } };
    useAppStore.getState().updateConfig(edit1);
    useAppStore.getState().updateConfig(edit2);
    await time.tickAsync(SAVE_DEBOUNCE_MS);
    assertEquals(saved.length, 1);
    assertStrictEquals(saved[0], edit2);
    assertEquals(useAppStore.getState()._configDirty, false);

    // Unsubscribed: further edits are nobody's business
    stop();
    useAppStore.getState().updateConfig(edit1);
    await time.tickAsync(SAVE_DEBOUNCE_MS);
    assertEquals(saved.length, 1);
  } finally {
    stop();
    saver.dispose();
  }
});

Deno.test("an edit still waiting when the editor switches is saved to its own project (#136)", async () => {
  using time = new FakeTime();
  const saved: { projectId: string; name: string }[] = [];
  const savers = new Map<string, AutoSaver<Config>>();
  const saverFor = (projectId: string) => {
    let saver = savers.get(projectId);
    if (!saver) {
      saver = createConfigAutoSaver(projectId, (id, config) => {
        saved.push({ projectId: id, name: config.app.name });
        return Promise.resolve();
      });
      savers.set(projectId, saver);
    }
    return saver;
  };
  const stop = startConfigAutoSave(saverFor);

  try {
    const alpha = getDefaultConfig("Alpha");
    const beta = getDefaultConfig("Beta");
    useAppStore.getState().hydrate({ projectId: "alpha", config: alpha });
    useAppStore.getState().updateConfig({
      ...alpha,
      app: { ...alpha.app, name: "Alpha, edited" },
    });

    // The switch lands inside the debounce window, and beta is edited too
    useAppStore.getState().hydrate({ projectId: "beta", config: beta });
    useAppStore.getState().updateConfig({
      ...beta,
      app: { ...beta.app, name: "Beta, edited" },
    });
    await time.tickAsync(SAVE_DEBOUNCE_MS);

    assertEquals(saved, [
      { projectId: "alpha", name: "Alpha, edited" },
      { projectId: "beta", name: "Beta, edited" },
    ]);
  } finally {
    stop();
    for (const saver of savers.values()) saver.dispose();
  }
});
