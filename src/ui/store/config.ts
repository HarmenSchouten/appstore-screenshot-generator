import type { StateCreator } from "zustand";
import { saveConfig as apiSaveConfig } from "../utils/api.ts";
import type { AppState, ConfigSlice } from "./types.ts";
import type { Config } from "../types.ts";

const SAVE_DEBOUNCE_MS = 50;

// Module-level singleton debounce state (shared across all consumers)
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
let pendingConfig: Config | null = null;

async function persistPending() {
  if (!pendingConfig) return;
  const config = pendingConfig;
  pendingConfig = null;
  await apiSaveConfig(config);
}

export const createConfigSlice: StateCreator<
  AppState,
  [],
  [],
  ConfigSlice
> = (set) => ({
  config: {} as Config,

  setConfig: (config) => set({ config }),

  saveConfig: (config) => {
    set({ config });
    pendingConfig = config;
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      saveTimeout = null;
      persistPending();
    }, SAVE_DEBOUNCE_MS);
  },

  flush: async () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      saveTimeout = null;
    }
    await persistPending();
  },
});
