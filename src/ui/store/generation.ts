import type { StateCreator } from "zustand";
import type { AppState, GenerationSlice } from "./types.ts";

export const createGenerationSlice: StateCreator<
  AppState,
  [],
  [],
  GenerationSlice
> = (set) => ({
  generating: false,
  generateProgress: {
    current: 0,
    total: 0,
    item: "",
    results: null,
    outputDir: "",
    error: null,
  },
  showGenerateModal: false,

  closeGenerateModal: () => set({ showGenerateModal: false }),

  viewLastGenerated: ({ results, outputDir }) =>
    set({
      generateProgress: {
        current: results.length,
        total: results.length,
        item: "",
        results,
        outputDir,
        error: null,
      },
      showGenerateModal: true,
    }),
});
