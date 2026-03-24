import type { StateCreator } from "zustand";
import { fetchAssets } from "../utils/api.ts";
import type { AppState, AssetsSlice } from "./types.ts";

export const createAssetsSlice: StateCreator<
  AppState,
  [],
  [],
  AssetsSlice
> = (set) => ({
  assets: { images: [] },
  setAssets: (assets) => set({ assets }),
  refreshAssets: async () => {
    const assets = await fetchAssets();
    set({ assets });
  },
});
