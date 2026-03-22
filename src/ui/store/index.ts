import { create } from "zustand";
import { createConfigSlice } from "./config.ts";
import { createProjectSlice } from "./projects.ts";
import { createSelectionSlice } from "./selection.ts";
import { createAssetsSlice } from "./assets.ts";
import { createScreenshotSlice } from "./screenshots.ts";
import { createDevicePresetSlice } from "./device-presets.ts";
import { createGenerationSlice } from "./generation.ts";
import { createUISlice } from "./ui.ts";
import type { AppState } from "./types.ts";
import type { Screenshot } from "../types.ts";

// ── Store ───────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()((...a) => ({
  ...createConfigSlice(...a),
  ...createProjectSlice(...a),
  ...createSelectionSlice(...a),
  ...createAssetsSlice(...a),
  ...createScreenshotSlice(...a),
  ...createDevicePresetSlice(...a),
  ...createGenerationSlice(...a),
  ...createUISlice(...a),
}));

// ── Selectors ───────────────────────────────────────────────────────

export const selectScreenshots = (state: AppState): Screenshot[] => {
  const langConfig = state.config.languages?.find(
    (l) => l.language === state.selectedLang,
  );
  return langConfig?.platforms?.[state.selectedPlatform]?.screenshots ?? [];
};

export const selectDimensions = (state: AppState) => {
  const langConfig = state.config.languages?.find(
    (l) => l.language === state.selectedLang,
  );
  const platformConfig = langConfig?.platforms?.[state.selectedPlatform];
  return platformConfig?.dimensions || { width: 1242, height: 2688 };
};

// Re-export types for convenience
export type { AppState } from "./types.ts";
