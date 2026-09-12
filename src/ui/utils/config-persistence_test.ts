/**
 * Store-integration tests for config persistence (#58, #68):
 * a failed save must keep the store dirty, toast once, and retry until the
 * server comes back; and the subscription must save local edits only —
 * never echo a hydration back.
 */

import { assert, assertEquals, assertStrictEquals } from "@std/assert";
import { FakeTime } from "@std/testing/time";
import {
  createConfigAutoSaver,
  startConfigAutoSave,
} from "./config-persistence.ts";
import { useAppStore } from "@ui/store/index.ts";
import { RETRY_DELAYS_MS, SAVE_DEBOUNCE_MS } from "./auto-saver.ts";
import { getDefaultConfig } from "@/projects.ts";
import type { Config } from "@ui/types.ts";

Deno.test("failed save keeps the store dirty, toasts once, and retries until the server recovers", async () => {
  using time = new FakeTime();
  useAppStore.setState({ _configDirty: false, toasts: [] });

  let failing = true;
  let saves = 0;
  const saver = createConfigAutoSaver(() => {
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
    const errorToasts = useAppStore.getState().toasts.filter(
      (t) => t.type === "error",
    );
    assertEquals(errorToasts.length, 1);

    // retry is scheduled without further edits; second failure doesn't re-toast
    await time.tickAsync(RETRY_DELAYS_MS[0]);
    assertEquals(saves, 2);
    assertEquals(
      useAppStore.getState().toasts.filter((t) => t.type === "error").length,
      1,
    );

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

Deno.test("the subscription saves local edits and ignores hydration", async () => {
  using time = new FakeTime();
  const saved: Config[] = [];
  const saver = createConfigAutoSaver((config) => {
    saved.push(config);
    return Promise.resolve();
  });
  const stop = startConfigAutoSave(saver);

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
