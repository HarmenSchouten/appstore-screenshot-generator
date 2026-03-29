import type { StateCreator } from "zustand";
import type { AppState, ProjectSlice } from "./types.ts";

export const createProjectSlice: StateCreator<
  AppState,
  [],
  [],
  ProjectSlice
> = () => ({
  projects: [],
  currentProject: "",
  initialProjectId: "",
});
