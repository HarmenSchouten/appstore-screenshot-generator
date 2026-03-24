import type { StateCreator } from "zustand";
import type { AppState, UISlice } from "./types.ts";

export const createUISlice: StateCreator<
  AppState,
  [],
  [],
  UISlice
> = (set) => ({
  projectModalOpen: false,
  themeEditorOpen: false,
  mediaManagerOpen: false,
  openProjectModal: () => set({ projectModalOpen: true }),
  closeProjectModal: () => set({ projectModalOpen: false }),
  openThemeEditor: () => set({ themeEditorOpen: true }),
  closeThemeEditor: () => set({ themeEditorOpen: false }),
  openMediaManager: () => set({ mediaManagerOpen: true }),
  closeMediaManager: () => set({ mediaManagerOpen: false }),
});
