import type { StateCreator } from "zustand";
import { fetchGenerated } from "../utils/api.ts";
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

  generateAll: async () => {
    await get().flush();

    set({
      showGenerateModal: true,
      generating: true,
      generateProgress: {
        current: 0,
        total: 0,
        item: "Starting...",
        results: null,
        outputDir: "",
      },
    });

    try {
      const response = await fetch("/api/generate/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "start") {
              set((s) => ({
                generateProgress: { ...s.generateProgress, total: data.total },
              }));
            } else if (data.type === "progress") {
              set((s) => ({
                generateProgress: {
                  ...s.generateProgress,
                  current: data.current,
                  item: data.item,
                },
              }));
            } else if (data.type === "complete") {
              set((s) => ({
                generateProgress: {
                  ...s.generateProgress,
                  results: data.results,
                  outputDir: data.outputDir,
                  current: s.generateProgress.total,
                },
              }));
            }
          } catch {
            // Ignore parse errors from partial SSE chunks
          }
        }
      }
    } catch (error) {
      alert("Generation failed: " + (error as Error).message);
      set({ showGenerateModal: false });
    }

    set({ generating: false });
    await get().refreshLastGenerated();
  },

  closeGenerateModal: () => set({ showGenerateModal: false }),

  viewLastGenerated: () => {
    const { lastGenerated } = get();
    console.log(lastGenerated)
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

  refreshLastGenerated: async () => {
    const data = await fetchGenerated();
    set({
      lastGenerated: data as {
        results: import("../types.ts").GenerateResult[];
        outputDir: string;
      } | null,
    });
  },
});
