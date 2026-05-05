import { useCallback, useRef } from "react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { selectScreenshots, useAppStore } from "@ui/store/index.ts";
import { useGenerateAll, useOpenOutputFolder } from "@hooks";

const INPUT_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);
const CONFIRM_WINDOW_MS = 1500;

function isInputFocused() {
  const tag = document.activeElement?.tagName;
  return tag ? INPUT_TAGS.has(tag) : false;
}

export function useAppHotkeys() {
  const generating = useAppStore((s) => s.generating);
  const projectModalOpen = useAppStore((s) => s.projectModalOpen);
  const themeEditorOpen = useAppStore((s) => s.themeEditorOpen);
  const mediaManagerOpen = useAppStore((s) => s.mediaManagerOpen);
  const showGenerateModal = useAppStore((s) => s.showGenerateModal);
  const selectedItem = useAppStore((s) => s.selectedItem);
  const selectedPlatform = useAppStore((s) => s.selectedPlatform);

  const shortcutCheatSheetOpen = useAppStore(
    (s) => s.shortcutCheatSheetOpen,
  );

  const noModalOpen = !projectModalOpen &&
    !themeEditorOpen &&
    !mediaManagerOpen &&
    !showGenerateModal &&
    !shortcutCheatSheetOpen;

  const generateAll = useGenerateAll();
  const openOutputFolder = useOpenOutputFolder();

  // ── Tier 1 — EmptyState shortcuts ──────────────────────────────────

  useHotkey("Mod+Shift+A", () => {
    useAppStore.getState().addScreenshot();
  }, { enabled: noModalOpen });

  useHotkey("Mod+Shift+G", () => {
    if (!generating) generateAll.mutate();
  }, { enabled: noModalOpen });

  useHotkey("Mod+Shift+E", () => {
    useAppStore.getState().openThemeEditor();
  }, { enabled: noModalOpen });

  useHotkey("Mod+Shift+M", () => {
    useAppStore.getState().openMediaManager();
  }, { enabled: noModalOpen });

  useHotkey("Mod+Shift+F", () => {
    useAppStore.getState().setSelectedPlatform(
      selectedPlatform === "android" ? "ios" : "android",
    );
  }, { enabled: noModalOpen });

  useHotkey("Mod+Shift+K", () => {
    const state = useAppStore.getState();
    const languages = state.config.languages ?? [];
    if (languages.length < 2) return;
    const currentIndex = languages.findIndex(
      (l) => l.language === state.selectedLang,
    );
    const nextIndex = (currentIndex + 1) % languages.length;
    state.setSelectedLang(languages[nextIndex].language);
  }, { enabled: noModalOpen });

  useHotkey("Mod+Shift+J", () => {
    const state = useAppStore.getState();
    const languages = state.config.languages ?? [];
    if (languages.length < 2) return;
    const currentIndex = languages.findIndex(
      (l) => l.language === state.selectedLang,
    );
    const prevIndex = (currentIndex - 1 + languages.length) % languages.length;
    state.setSelectedLang(languages[prevIndex].language);
  }, { enabled: noModalOpen });

  // ── Tier 2 — Power-user shortcuts ─────────────────────────────────

  useHotkey("Mod+Shift+P", () => {
    useAppStore.getState().openProjectModal();
  }, { enabled: noModalOpen });

  const deleteArmedAt = useRef(0);

  const handleDeleteScreenshot = useCallback(() => {
    if (isInputFocused()) return;
    const now = Date.now();
    if (now - deleteArmedAt.current > CONFIRM_WINDOW_MS) {
      // First press — arm the shortcut
      deleteArmedAt.current = now;
      useAppStore.getState().addToast({
        type: "info",
        message: "Press again to delete",
        duration: CONFIRM_WINDOW_MS,
      });
      return;
    }
    // Second press within window — execute
    deleteArmedAt.current = 0;
    const state = useAppStore.getState();
    const item = state.selectedItem;
    if (!item) return;
    const screenshots = selectScreenshots(state);
    const screenshot = screenshots.find((s) => s.id === item.id);
    if (screenshot?.role === "feature-graphic") {
      state.removeFeatureGraphic();
    } else {
      state.removeScreenshot(item.id);
    }
  }, []);

  useHotkey("Delete", handleDeleteScreenshot, {
    enabled: noModalOpen && selectedItem !== null,
    preventDefault: false,
  });

  useHotkey("Backspace", handleDeleteScreenshot, {
    enabled: noModalOpen && selectedItem !== null,
    preventDefault: false,
  });

  useHotkey("Mod+Shift+D", () => {
    openOutputFolder.mutate();
  }, { enabled: noModalOpen });

  // ── Screenshot selection ───────────────────────────────────────────

  const stepScreenshot = useCallback((direction: 1 | -1) => {
    if (isInputFocused()) return;
    const state = useAppStore.getState();
    const screenshots = selectScreenshots(state);
    const items = screenshots.filter((s) => s.role === "screenshot");
    if (items.length === 0) return;
    const currentId = state.selectedItem?.id;
    const currentIndex = items.findIndex((s) => s.id === currentId);
    // If nothing (or the feature graphic) is selected, jump to first/last.
    const nextIndex = currentIndex === -1
      ? (direction === 1 ? 0 : items.length - 1)
      : (currentIndex + direction + items.length) % items.length;
    state.setSelectedItem({ type: "screenshot", id: items[nextIndex].id });
  }, []);

  useHotkey("]", () => stepScreenshot(1), {
    enabled: noModalOpen,
    preventDefault: false,
  });

  useHotkey("[", () => stepScreenshot(-1), {
    enabled: noModalOpen,
    preventDefault: false,
  });

  useHotkey("G", () => {
    if (isInputFocused()) return;
    const state = useAppStore.getState();
    if (state.selectedPlatform !== "android") return;
    const screenshots = selectScreenshots(state);
    const fg = screenshots.find((s) => s.role === "feature-graphic");
    if (fg) {
      state.setSelectedItem({ type: "screenshot", id: fg.id });
    }
  }, { enabled: noModalOpen, preventDefault: false });

  // ── Cheat sheet ────────────────────────────────────────────────────

  useHotkey({ key: "/", shift: true }, () => {
    if (isInputFocused()) return;
    useAppStore.getState().openShortcutCheatSheet();
  }, { enabled: noModalOpen });

  // ── Escape — priority chain ───────────────────────────────────────

  useHotkey("Escape", () => {
    if (isInputFocused()) return;
    const state = useAppStore.getState();
    if (state.shortcutCheatSheetOpen) {
      state.closeShortcutCheatSheet();
    } else if (state.showGenerateModal) {
      state.closeGenerateModal();
    } else if (state.themeEditorOpen) {
      state.closeThemeEditor();
    } else if (state.mediaManagerOpen) {
      state.closeMediaManager();
    } else if (state.projectModalOpen) {
      state.closeProjectModal();
    } else if (state.selectedItem) {
      state.setSelectedItem(null);
    }
  }, { preventDefault: false });
}
