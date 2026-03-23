import type { StateCreator } from "zustand";
import {
  activateProject,
  createProject,
  deleteProject,
  fetchAssets,
  renameProject,
} from "../utils/api.ts";
import type { AppState, ProjectSlice } from "./types.ts";

export const createProjectSlice: StateCreator<
  AppState,
  [],
  [],
  ProjectSlice
> = (set, get) => ({
  projects: [],
  currentProject: "",
  initialProjectId: "",

  switchProject: async (projectId) => {
    await get().flush();
    const data = await activateProject(projectId);
    set({
      currentProject: projectId,
      config: data.config,
      selectedLang: data.config.languages?.[0]?.language || "en",
      selectedItem: null,
    });
    const newAssets = await fetchAssets();
    set({ assets: newAssets });
  },

  createProject: async (name) => {
    const project = await createProject(name);
    set((s) => ({ projects: [...s.projects, project] }));
    await get().switchProject(project.id);
  },

  removeProject: async (projectId) => {
    await deleteProject(projectId);
    const { currentProject, projects, switchProject } = get();
    const remaining = projects.filter((p) => p.id !== projectId);
    set({ projects: remaining });
    if (currentProject === projectId && remaining.length > 0) {
      await switchProject(remaining[0].id);
    }
  },

  renameProject: async (projectId, newName) => {
    const updated = await renameProject(projectId, newName);
    set((s) => ({
      projects: s.projects.map((p) => p.id === projectId ? updated : p),
    }));
    if (get().currentProject === projectId) {
      const config = await fetch("/api/config").then((r) => r.json());
      set({ config });
    }
  },
});
