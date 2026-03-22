import type { StateCreator } from "zustand";
import type { AppState, ScreenshotSlice } from "./types.ts";
import type { Screenshot } from "../types.ts";

export const createScreenshotSlice: StateCreator<
  AppState,
  [],
  [],
  ScreenshotSlice
> = (_set, get) => ({
  addScreenshot: () => {
    const { config, selectedLang, selectedPlatform, saveConfig } = get();
    const id = "screenshot-" + Date.now();
    const newScreenshot: Screenshot = {
      id,
      role: "screenshot",
      layers: [],
    };

    const newConfig = { ...config };
    const langConfig = newConfig.languages?.find(
      (l) => l.language === selectedLang,
    );
    if (langConfig?.platforms?.[selectedPlatform]) {
      langConfig.platforms[selectedPlatform].screenshots.push(newScreenshot);
      saveConfig(newConfig);
      get().setSelectedItem({ type: "screenshot", id });
    }
  },

  removeScreenshot: (id) => {
    const {
      config,
      selectedLang,
      selectedPlatform,
      selectedItem,
      saveConfig,
      setSelectedItem,
    } = get();

    const newConfig = { ...config };
    const langConfig = newConfig.languages?.find(
      (l) => l.language === selectedLang,
    );
    if (langConfig?.platforms?.[selectedPlatform]) {
      langConfig.platforms[selectedPlatform].screenshots = langConfig
        .platforms[selectedPlatform].screenshots.filter((s) => s.id !== id);
      saveConfig(newConfig);
      if (selectedItem?.type === "screenshot" && selectedItem.id === id) {
        setSelectedItem(null);
      }
    }
  },

  updateScreenshot: (id, updates) => {
    const { config, selectedLang, selectedPlatform, saveConfig } = get();

    const newConfig = { ...config };
    const langConfig = newConfig.languages?.find(
      (l) => l.language === selectedLang,
    );
    const platformConfig = langConfig?.platforms?.[selectedPlatform];
    if (platformConfig) {
      const idx = platformConfig.screenshots.findIndex((s) => s.id === id);
      if (idx !== -1) {
        platformConfig.screenshots[idx] = {
          ...platformConfig.screenshots[idx],
          ...updates,
        };
        saveConfig(newConfig);
      }
    }
  },

  removeFeatureGraphic: () => {
    const {
      config,
      selectedLang,
      selectedPlatform,
      selectedItem,
      saveConfig,
      setSelectedItem,
    } = get();

    const newConfig = { ...config };
    const langConfig = newConfig.languages?.find(
      (l) => l.language === selectedLang,
    );
    if (langConfig?.platforms?.[selectedPlatform]) {
      langConfig.platforms[selectedPlatform].screenshots = langConfig
        .platforms[selectedPlatform].screenshots.filter(
          (s) => s.role !== "feature-graphic",
        );
      saveConfig(newConfig);
      if (selectedItem?.type === "feature-graphic") {
        setSelectedItem(null);
      }
    }
  },
});
