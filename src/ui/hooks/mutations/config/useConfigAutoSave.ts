/**
 * useConfigAutoSave Hook
 *
 * Reactive auto-persistence for config changes.
 * Subscribes to Zustand `config` state and delegates debounce, retry
 * and flush semantics to the `createAutoSaver` state machine.
 *
 * Mount once in a top-level component (App). The flush bridge
 * in `config-persistence.ts` lets non-React code (generation,
 * project-switch) force pending saves through.
 */

import { useEffect } from "react";
import { saveConfig } from "@ui/utils/api.ts";
import { createAutoSaver } from "@ui/utils/auto-saver.ts";
import { useAppStore } from "@ui/store/index.ts";
import { registerFlush } from "@ui/utils/config-persistence.ts";

/**
 * Wires the auto-saver to the app store. Exported with an injectable
 * save function so the store integration is testable without React.
 */
export function createConfigAutoSaver(save = saveConfig) {
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

export function useConfigAutoSave() {
  useEffect(() => {
    const saver = createConfigAutoSaver();
    registerFlush(() => saver.flush());

    const unsub = useAppStore.subscribe((state, prev) => {
      if (state.config !== prev.config && state._configDirty) {
        saver.schedule(state.config);
      }
    });

    return () => {
      unsub();
      saver.dispose();
      registerFlush(() => Promise.resolve());
    };
  }, []);
}
