/**
 * Config persistence
 *
 * The debounced auto-saver for the project config, as a plain module: React
 * (`useConfigAutoSave` in App) starts the store subscription, and the
 * mutations that edit the config server-side (`useAddLanguage`,
 * `useCopyPlatformConfig`, …) call `flushPersist()` first. Both import this
 * file directly — the saver used to live inside the hook, which needed a
 * register-at-mount bridge for anyone outside React to reach it (#68).
 *
 * There is one saver per project, and each saves only to its own project. An
 * edit still waiting when the editor switches to another project is saved to
 * the project it was made in, and never replaced by the next project's
 * edits (#136).
 *
 * Debounce, retry and flush semantics are `createAutoSaver`'s; this file
 * only wires them to the store and the API.
 */

import type { Config } from "@ui/types.ts";
import { ApiError, saveConfig } from "./api.ts";
import { type AutoSaver, createAutoSaver } from "./auto-saver.ts";
import { useAppStore } from "@ui/store/index.ts";

/**
 * A 4xx won't go away on its own: the project was deleted, or the server
 * refused the config. Retrying it on a timer would only repeat the error.
 */
function isRetryable(error: unknown): boolean {
  return !(error instanceof ApiError && error.status >= 400 &&
    error.status < 500 && error.status !== 408 && error.status !== 429);
}

/**
 * Wires an auto-saver for one project to the app store. Exported with an
 * injectable save function so the store integration is testable without the
 * network.
 */
export function createConfigAutoSaver(
  projectId: string,
  save = saveConfig,
): AutoSaver<Config> {
  // The dirty flag describes the config on screen; a save for a project the
  // editor has since left must not touch it
  const onScreen = () => useAppStore.getState().currentProject === projectId;

  return createAutoSaver((config) => save(projectId, config), {
    onSaved: () => {
      if (onScreen()) useAppStore.setState({ _configDirty: false });
    },
    onSaveError: (err, firstFailure) => {
      if (onScreen()) useAppStore.setState({ _configDirty: true });
      if (firstFailure) {
        console.error(err);
        useAppStore.getState().addToast({
          type: "error",
          message: isRetryable(err)
            ? "Failed to save config — retrying"
            : `Failed to save config: ${
              err instanceof Error ? err.message : String(err)
            }`,
        });
      }
    },
    onRecovered: () =>
      useAppStore.getState().addToast({
        type: "success",
        message: "Config saved",
      }),
  }, { isRetryable });
}

const savers = new Map<string, AutoSaver<Config>>();

function saverFor(projectId: string): AutoSaver<Config> {
  let saver = savers.get(projectId);
  if (!saver) {
    saver = createConfigAutoSaver(projectId);
    savers.set(projectId, saver);
  }
  return saver;
}

/**
 * Save any pending edit to a project — by default the one being edited —
 * now. Resolves immediately when nothing is pending; rejects if the save
 * fails, leaving the retry schedule in place.
 */
export function flushPersist(
  projectId = useAppStore.getState().currentProject,
): Promise<void> {
  return savers.get(projectId)?.flush() ?? Promise.resolve();
}

/** Drop a deleted project's saver, and with it any edit still waiting. */
export function discardPersist(projectId: string): void {
  savers.get(projectId)?.dispose();
  savers.delete(projectId);
}

/**
 * Schedule a save for every dirty config change, on the saver of the
 * project the change was made in. Returns the unsubscribe; a save already
 * scheduled still runs after it.
 */
export function startConfigAutoSave(
  target: (projectId: string) => AutoSaver<Config> = saverFor,
): () => void {
  return useAppStore.subscribe((state, prev) => {
    if (state.config !== prev.config && state._configDirty) {
      target(state.currentProject).schedule(state.config);
    }
  });
}
