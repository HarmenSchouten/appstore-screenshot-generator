/**
 * Keyboard shortcuts — the global editor hotkeys and the popover contract
 * they stand down for. The user-facing list lives in
 * `shortcut-definitions.ts`; keep the two in step.
 */

import { useCallback, useEffect, useRef } from "react";
import { useHotkey } from "@tanstack/react-hotkeys";
import {
  selectNoModalOpen,
  selectScreenshots,
  useAppStore,
} from "@ui/store/index.ts";
import { useOpenOutputFolder } from "./generation.ts";

const INPUT_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);
const CONFIRM_WINDOW_MS = 1500;

function isInputFocused() {
  const tag = document.activeElement?.tagName;
  return tag ? INPUT_TAGS.has(tag) : false;
}

interface AppHotkeyHandlers {
  /** Start an export run — App's single `useGenerateAll` instance. */
  onGenerate: () => void;
}

export function useAppHotkeys({ onGenerate }: AppHotkeyHandlers) {
  const selectedScreenshotId = useAppStore((s) => s.selectedScreenshotId);
  const noModalOpen = useAppStore(selectNoModalOpen);
  const openOutputFolder = useOpenOutputFolder();

  // ── Tier 1 — EmptyState shortcuts ──────────────────────────────────

  useHotkey("Mod+Shift+A", () => {
    useAppStore.getState().addScreenshot();
  }, { enabled: noModalOpen });

  useHotkey("Mod+Shift+G", () => {
    if (!useAppStore.getState().generating) onGenerate();
  }, { enabled: noModalOpen });

  useHotkey("Mod+Shift+E", () => {
    useAppStore.getState().openModal("theme");
  }, { enabled: noModalOpen });

  useHotkey("Mod+Shift+M", () => {
    useAppStore.getState().openModal("media");
  }, { enabled: noModalOpen });

  useHotkey("Mod+Shift+F", () => {
    const state = useAppStore.getState();
    state.setSelectedPlatform(
      state.selectedPlatform === "android" ? "ios" : "android",
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
    useAppStore.getState().openModal("projects");
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
    const id = state.selectedScreenshotId;
    if (!id) return;
    const screenshots = selectScreenshots(state);
    const screenshot = screenshots.find((s) => s.id === id);
    if (screenshot?.role === "feature-graphic") {
      state.removeFeatureGraphic();
    } else {
      state.removeScreenshot(id);
    }
  }, []);

  useHotkey("Delete", handleDeleteScreenshot, {
    enabled: noModalOpen && selectedScreenshotId !== null,
    preventDefault: false,
  });

  useHotkey("Backspace", handleDeleteScreenshot, {
    enabled: noModalOpen && selectedScreenshotId !== null,
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
    const currentId = state.selectedScreenshotId;
    const currentIndex = items.findIndex((s) => s.id === currentId);
    // If nothing (or the feature graphic) is selected, jump to first/last.
    const nextIndex = currentIndex === -1
      ? (direction === 1 ? 0 : items.length - 1)
      : (currentIndex + direction + items.length) % items.length;
    state.setSelectedScreenshotId(items[nextIndex].id);
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
      state.setSelectedScreenshotId(fg.id);
    }
  }, { enabled: noModalOpen, preventDefault: false });

  // ── Cheat sheet ────────────────────────────────────────────────────

  useHotkey({ key: "/", shift: true }, () => {
    if (isInputFocused()) return;
    useAppStore.getState().openModal("shortcuts");
  }, { enabled: noModalOpen });

  // ── Escape — close what is open, else deselect ────────────────────

  useHotkey("Escape", () => {
    if (isInputFocused()) return;
    const state = useAppStore.getState();
    // An open popover owns Escape (see usePopover); closing it must not
    // also drop the selection behind it
    if (state.openPopovers > 0) return;
    if (state.activeModal) {
      state.closeModal();
    } else if (state.selectedScreenshotId) {
      state.setSelectedScreenshotId(null);
    }
  }, {
    preventDefault: false,
    // Open popovers register their own Escape on the same target (see
    // usePopover) and mount before this one; the overlap is intended
    conflictBehavior: "allow",
  });
}

/**
 * Registers a transient popover — picker, dropdown, menu — with the store
 * while it is open, so the global hotkeys treat it like a modal: Escape
 * closes the popover instead of deselecting the screenshot behind it, and
 * the editor shortcuts stay off until it is gone (#65).
 *
 * Modals proper are `activeModal` in the store; this is for the small
 * things that are component-local state.
 */
export function usePopover(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const { popoverOpened, popoverClosed } = useAppStore.getState();
    popoverOpened();
    return popoverClosed;
  }, [open]);

  // Stacks next to the global Escape chain on the same target; the manager
  // warns on every duplicate registration unless told the overlap is intended
  useHotkey("Escape", onClose, {
    enabled: open,
    preventDefault: false,
    conflictBehavior: "allow",
  });
}
