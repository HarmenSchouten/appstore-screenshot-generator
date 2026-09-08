import type { StateCreator } from "zustand";
import type { AppState, ConfigSlice } from "./types.ts";
import type { Config } from "@ui/types.ts";

export const createConfigSlice: StateCreator<
  AppState,
  [],
  [],
  ConfigSlice
> = (set) => ({
  config: {} as Config,
  _configDirty: false,

  hydrate: ({ projectId, config, projects }) =>
    set((s) => ({
      config,
      currentProject: projectId,
      projects: projects ?? s.projects,
      _configDirty: false,
    })),

  updateConfig: (config) => set({ config, _configDirty: true }),
});
