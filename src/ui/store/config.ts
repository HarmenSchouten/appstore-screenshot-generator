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
> = (set, get) => ({
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

  addLanguage: async (language, copyFrom) => {
    const res = await fetch("/api/config/language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, copyFrom }),
    });
    if (res.ok) {
      const newLang = await res.json();
      const { config } = get();
      const newConfig = { ...config };
      if (!newConfig.languages) newConfig.languages = [];
      newConfig.languages.push(newLang);
      set({ config: newConfig, selectedLang: language });
    }
  },

  copyPlatformConfig: async (sourcePlatform, targetPlatform) => {
    const { selectedLang, config } = get();
    const res = await fetch("/api/config/copy-platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: selectedLang,
        sourcePlatform,
        targetPlatform,
      }),
    });
    if (res.ok) {
      const updatedLang = await res.json();
      const newConfig = { ...config };
      const langIndex = newConfig.languages?.findIndex(
        (l) => l.language === selectedLang,
      ) ?? -1;
      if (langIndex >= 0 && newConfig.languages) {
        newConfig.languages[langIndex] = updatedLang;
      }
      set({
        config: newConfig,
        selectedPlatform: targetPlatform,
        selectedItem: null,
      });
    }
  },
});
