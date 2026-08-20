/**
 * Store-integration test for the config auto-save wiring (#58):
 * a failed save must keep the store dirty, toast once, and retry
 * until the server comes back.
 */

import { assert, assertEquals } from "@std/assert";
import { FakeTime } from "@std/testing/time";
import { createConfigAutoSaver } from "./useConfigAutoSave.ts";
import { useAppStore } from "@ui/store/index.ts";
import { RETRY_DELAYS_MS, SAVE_DEBOUNCE_MS } from "@ui/utils/auto-saver.ts";

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
