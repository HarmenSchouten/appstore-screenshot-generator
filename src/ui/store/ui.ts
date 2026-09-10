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
  shortcutCheatSheetOpen: false,
  openPopovers: 0,
  openProjectModal: () => set({ projectModalOpen: true }),
  closeProjectModal: () => set({ projectModalOpen: false }),
  openThemeEditor: () => set({ themeEditorOpen: true }),
  closeThemeEditor: () => set({ themeEditorOpen: false }),
  openMediaManager: () => set({ mediaManagerOpen: true }),
  closeMediaManager: () => set({ mediaManagerOpen: false }),
  openShortcutCheatSheet: () => set({ shortcutCheatSheetOpen: true }),
  closeShortcutCheatSheet: () => set({ shortcutCheatSheetOpen: false }),
  popoverOpened: () => set((s) => ({ openPopovers: s.openPopovers + 1 })),
  popoverClosed: () =>
    set((s) => ({ openPopovers: Math.max(0, s.openPopovers - 1) })),
});
