import type { StateCreator } from "zustand";
import type { AppState, ConfigSlice } from "./types.ts";
import type { Config } from "../types.ts";

export const createConfigSlice: StateCreator<
  AppState,
  [],
  [],
  ConfigSlice
> = (set) => ({
  config: {} as Config,
  _configDirty: false,

  setConfig: (config) => set({ config, _configDirty: false }),
  updateConfig: (config) => set({ config, _configDirty: true }),
});
