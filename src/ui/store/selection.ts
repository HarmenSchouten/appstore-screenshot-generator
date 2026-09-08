import type { StateCreator } from "zustand";
import type { AppState, SelectionSlice } from "./types.ts";

export const createSelectionSlice: StateCreator<
  AppState,
  [],
  [],
  SelectionSlice
> = (set) => ({
  selectedLang: "en",
  selectedPlatform: "android",
  selectedScreenshotId: null,

  // Screenshot ids are scoped to one language/platform, so a switch always
  // invalidates the selection. Clearing it here rather than in an effect in
  // App keeps it to a single store update — and a single `replace`
  // navigation instead of two (#64).
  setSelectedLang: (selectedLang) =>
    set((s) =>
      s.selectedLang === selectedLang
        ? s
        : { selectedLang, selectedScreenshotId: null }
    ),

  setSelectedPlatform: (selectedPlatform) =>
    set((s) =>
      s.selectedPlatform === selectedPlatform
        ? s
        : { selectedPlatform, selectedScreenshotId: null }
    ),

  setSelectedScreenshotId: (selectedScreenshotId) =>
    set({ selectedScreenshotId }),
});
