import type { StateCreator } from "zustand";
import type { AppState, AssetsSlice } from "./types.ts";

export const createAssetsSlice: StateCreator<
  AppState,
  [],
  [],
  AssetsSlice
> = (set) => ({
  assets: { images: [] },
  setAssets: (assets) => set({ assets }),
});
