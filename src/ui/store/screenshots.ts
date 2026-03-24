import type { StateCreator } from "zustand";
import type { AppState, ScreenshotSlice } from "./types.ts";
import type { Config, Screenshot } from "../types.ts";
import type { Platform, PlatformConfig } from "@types";
import { generateLayerId } from "../components/editors/layer-meta.ts";

/**
 * Clone the config down to the selected platform's screenshots array
 * so that mutations never touch the previous Zustand state tree.
 */
function cloneConfigForPlatform(
  config: Config,
  lang: string,
  platform: Platform,
): { newConfig: Config; platformConfig: PlatformConfig } | null {
  const newConfig = structuredClone(config);
  const langConfig = newConfig.languages?.find((l) => l.language === lang);
  const platformConfig = langConfig?.platforms?.[platform];
  if (!platformConfig) return null;
  return { newConfig, platformConfig };
}

export const createScreenshotSlice: StateCreator<
  AppState,
  [],
  [],
  ScreenshotSlice
> = (_set, get) => ({
  addScreenshot: () => {
    const { config, selectedLang, selectedPlatform, saveConfig } = get();
    const id = globalThis.crypto.randomUUID();
    const newScreenshot: Screenshot = {
      id,
      role: "screenshot",
      layers: [{
        id: generateLayerId(),
        type: "background",
        opacity: 1,
      }],
    };

    const result = cloneConfigForPlatform(
      config,
      selectedLang,
      selectedPlatform,
    );
    if (result) {
      result.platformConfig.screenshots.push(newScreenshot);
      saveConfig(result.newConfig);
      get().setSelectedItem({ type: "screenshot", id });
    }
  },

  addFeatureGraphic: () => {
    const { config, selectedLang, selectedPlatform, saveConfig } = get();

    const result = cloneConfigForPlatform(
      config,
      selectedLang,
      selectedPlatform,
    );
    if (!result) return;

    // Enforce uniqueness: only one feature-graphic per platform
    const existing = result.platformConfig.screenshots.find(
      (s) => s.role === "feature-graphic",
    );
    if (existing) return;

    const id = globalThis.crypto.randomUUID();
    const newScreenshot: Screenshot = {
      id,
      role: "feature-graphic",
      layers: [{
        id: generateLayerId(),
        type: "background",
        opacity: 1,
      }],
    };

    result.platformConfig.screenshots.push(newScreenshot);
    saveConfig(result.newConfig);
    get().setSelectedItem({ type: "screenshot", id });
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

    const result = cloneConfigForPlatform(
      config,
      selectedLang,
      selectedPlatform,
    );
    if (result) {
      result.platformConfig.screenshots = result.platformConfig.screenshots
        .filter((s) => s.id !== id);
      saveConfig(result.newConfig);
      if (selectedItem?.type === "screenshot" && selectedItem.id === id) {
        setSelectedItem(null);
      }
    }
  },

  updateScreenshot: (id, updates) => {
    const { config, selectedLang, selectedPlatform, saveConfig } = get();

    const result = cloneConfigForPlatform(
      config,
      selectedLang,
      selectedPlatform,
    );
    if (result) {
      const idx = result.platformConfig.screenshots.findIndex((s) =>
        s.id === id
      );
      if (idx !== -1) {
        result.platformConfig.screenshots[idx] = {
          ...result.platformConfig.screenshots[idx],
          ...updates,
        };
        saveConfig(result.newConfig);
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

    const result = cloneConfigForPlatform(
      config,
      selectedLang,
      selectedPlatform,
    );
    if (result) {
      const fgId = result.platformConfig.screenshots.find(
        (s) => s.role === "feature-graphic",
      )?.id;
      result.platformConfig.screenshots = result.platformConfig.screenshots
        .filter((s) => s.role !== "feature-graphic");
      saveConfig(result.newConfig);
      if (
        fgId &&
        selectedItem?.type === "screenshot" &&
        selectedItem.id === fgId
      ) {
        setSelectedItem(null);
      }
    }
  },
});
