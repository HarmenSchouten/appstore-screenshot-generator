/**
 * Config persistence
 *
 * The debounced auto-saver for the project config, as a plain module: React
 * (`useConfigAutoSave` in App) starts the store subscription, and the
 * mutations that edit the config server-side (`useSwitchProject`,
 * `useAddLanguage`, …) call `flushPersist()` first. Both import this file
 * directly — the saver used to live inside the hook, which needed a
 * register-at-mount bridge for anyone outside React to reach it (#68).
 *
 * Debounce, retry and flush semantics are `createAutoSaver`'s; this file
 * only wires them to the store and the API.
 */

import type { Config } from "@ui/types.ts";
import { saveConfig } from "./api.ts";
import { type AutoSaver, createAutoSaver } from "./auto-saver.ts";
import { useAppStore } from "@ui/store/index.ts";

/**
 * Wires the auto-saver to the app store. Exported with an injectable save
 * function so the store integration is testable without the network.
 */
export function createConfigAutoSaver(save = saveConfig): AutoSaver<Config> {
  return createAutoSaver(save, {
    onSaved: () => useAppStore.setState({ _configDirty: false }),
    onSaveError: (err, firstFailure) => {
      useAppStore.setState({ _configDirty: true });
      if (firstFailure) {
        console.error(err);
        useAppStore.getState().addToast({
          type: "error",
          message: "Failed to save config — retrying",
        });
      }
    },
    onRecovered: () =>
      useAppStore.getState().addToast({
        type: "success",
        message: "Config saved",
      }),
  });
}

const saver = createConfigAutoSaver();

/**
 * Save any pending config edit now. Resolves immediately when nothing is
 * pending; rejects if the save fails, leaving the retry schedule in place.
 */
export function flushPersist(): Promise<void> {
  return saver.flush();
}

/**
 * Schedule a save for every dirty config change. Returns the unsubscribe;
 * a save already scheduled still runs after it.
 */
export function startConfigAutoSave(
  target: AutoSaver<Config> = saver,
): () => void {
  return useAppStore.subscribe((state, prev) => {
    if (state.config !== prev.config && state._configDirty) {
      target.schedule(state.config);
    }
  });
}
