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
  selectedItem: null,
  setSelectedLang: (selectedLang) => set({ selectedLang }),
  setSelectedPlatform: (selectedPlatform) => set({ selectedPlatform }),
  setSelectedItem: (selectedItem) => set({ selectedItem }),
});
