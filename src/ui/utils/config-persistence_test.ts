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
  createConfigPersistence,
} from "./config-persistence.ts";
import { useAppStore } from "@ui/store/index.ts";
import { ApiError } from "./api.ts";
import { RETRY_DELAYS_MS, SAVE_DEBOUNCE_MS } from "./auto-saver.ts";
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

/** A persistence instance whose saves are recorded instead of sent. */
function recordingPersistence() {
  const saved: { projectId: string; name: string; config: Config }[] = [];
  const persistence = createConfigPersistence((projectId, config) => {
    saved.push({ projectId, name: config.app.name, config });
    return Promise.resolve();
  });
  return { persistence, saved };
}

const renamed = (config: Config, name: string): Config => ({
  ...config,
  app: { ...config.app, name },
});

Deno.test("the subscription saves local edits and ignores hydration", async () => {
  using time = new FakeTime();
  const { persistence, saved } = recordingPersistence();
  const stop = persistence.start();

  try {
    // Server state comes in clean: nothing to write back
    const loaded = getDefaultConfig("Test App");
    useAppStore.getState().hydrate({ projectId: "a", config: loaded });
    await time.tickAsync(SAVE_DEBOUNCE_MS);
    assertEquals(saved.length, 0);

    // A local edit is dirty: one debounced save with the latest config
    const edit1 = renamed(loaded, "Edit 1");
    const edit2 = renamed(loaded, "Edit 2");
    useAppStore.getState().updateConfig(edit1);
    useAppStore.getState().updateConfig(edit2);
    await time.tickAsync(SAVE_DEBOUNCE_MS);
    assertEquals(saved.length, 1);
    assertStrictEquals(saved[0].config, edit2);
    assertEquals(saved[0].projectId, "a");
    assertEquals(useAppStore.getState()._configDirty, false);

    // Unsubscribed: further edits are nobody's business
    stop();
    useAppStore.getState().updateConfig(edit1);
    await time.tickAsync(SAVE_DEBOUNCE_MS);
    assertEquals(saved.length, 1);
  } finally {
    stop();
  }
});

Deno.test("an edit still waiting when the editor switches is saved to its own project (#136)", async () => {
  using time = new FakeTime();
  const { persistence, saved } = recordingPersistence();
  const stop = persistence.start();

  try {
    const alpha = getDefaultConfig("Alpha");
    const beta = getDefaultConfig("Beta");
    useAppStore.getState().hydrate({ projectId: "alpha", config: alpha });
    useAppStore.getState().updateConfig(renamed(alpha, "Alpha, edited"));

    // The switch lands inside the debounce window, and beta is edited too
    useAppStore.getState().hydrate({ projectId: "beta", config: beta });
    useAppStore.getState().updateConfig(renamed(beta, "Beta, edited"));
    await time.tickAsync(SAVE_DEBOUNCE_MS);

    assertEquals(saved.map(({ projectId, name }) => ({ projectId, name })), [
      { projectId: "alpha", name: "Alpha, edited" },
      { projectId: "beta", name: "Beta, edited" },
    ]);
  } finally {
    stop();
  }
});

Deno.test("flush(id) saves a waiting edit of a project the editor has left", async () => {
  // What a switch back into that project relies on: the edit reaches the
  // server before the project's config is read back
  using _time = new FakeTime();
  const { persistence, saved } = recordingPersistence();
  const stop = persistence.start();

  try {
    const alpha = getDefaultConfig("Alpha");
    useAppStore.getState().hydrate({ projectId: "alpha", config: alpha });
    useAppStore.getState().updateConfig(renamed(alpha, "Alpha, edited"));
    useAppStore.getState().hydrate({
      projectId: "beta",
      config: getDefaultConfig("Beta"),
    });

    // No time passes: the debounce hasn't fired, flush sends it now
    await persistence.flush("alpha");
    assertEquals(saved.map((s) => s.name), ["Alpha, edited"]);

    // Nothing waiting for beta: resolves without a save
    await persistence.flush("beta");
    assertEquals(saved.length, 1);
  } finally {
    stop();
  }
});

Deno.test("discard drops a deleted project's waiting edit", async () => {
  using time = new FakeTime();
  const { persistence, saved } = recordingPersistence();
  const stop = persistence.start();

  try {
    const doomed = getDefaultConfig("Doomed");
    useAppStore.getState().hydrate({ projectId: "doomed", config: doomed });
    useAppStore.getState().updateConfig(renamed(doomed, "Doomed, edited"));
    persistence.discard("doomed");
    await time.tickAsync(SAVE_DEBOUNCE_MS * 4);
    assertEquals(saved.length, 0);
  } finally {
    stop();
  }
});

Deno.test("408 and 429 are retried like a server error", async () => {
  for (const status of [408, 429]) {
    using time = new FakeTime();
    useAppStore.setState({ currentProject: "a", toasts: [] });
    let saves = 0;
    const saver = createConfigAutoSaver("a", () => {
      saves++;
      return Promise.reject(new ApiError(status, "try later"));
    });
    try {
      saver.schedule(useAppStore.getState().config);
      await time.tickAsync(SAVE_DEBOUNCE_MS);
      await time.tickAsync(RETRY_DELAYS_MS[0]);
      assertEquals(saves, 2, `${status}`);
      assertEquals(
        errorToasts()[0].message,
        "Failed to save config — retrying",
      );
    } finally {
      saver.dispose();
    }
  }
});
