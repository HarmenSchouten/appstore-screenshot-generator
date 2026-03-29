import type { StateCreator } from "zustand";
import type { AppState, GenerationSlice } from "./types.ts";

export const createGenerationSlice: StateCreator<
  AppState,
  [],
  [],
  GenerationSlice
> = (set, get) => ({
  generating: false,
  generateProgress: {
    current: 0,
    total: 0,
    item: "",
    results: null,
    outputDir: "",
  },
  showGenerateModal: false,
  lastGenerated: null,

  closeGenerateModal: () => set({ showGenerateModal: false }),

  viewLastGenerated: () => {
    const { lastGenerated } = get();
    if (lastGenerated) {
      set({
        generateProgress: {
          current: lastGenerated.results.length,
          total: lastGenerated.results.length,
          item: "",
          results: lastGenerated.results,
          outputDir: lastGenerated.outputDir,
        },
        showGenerateModal: true,
      });
    }
  },
});
