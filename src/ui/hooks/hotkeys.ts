/**
 * Keyboard shortcuts and the overlays they defer to.
 *
 * Bindings come from `SHORTCUTS` — the table the cheat sheet displays —
 * through `useShortcut`. Overlays (modals, pickers, menus) register with
 * `useOverlay`; the one Escape binding closes the topmost of them, and the
 * editor shortcuts stand down while any is open (#69).
 */

import { useCallback, useEffect, useRef } from "react";
import { type RegisterableHotkey, useHotkeys } from "@tanstack/react-hotkeys";
import {
  selectNoOverlayOpen,
  selectScreenshots,
  useAppStore,
} from "@ui/store/index.ts";
import { useOpenOutputFolder } from "./generation.ts";
import { type ShortcutId, SHORTCUTS } from "./shortcut-definitions.ts";

const CONFIRM_WINDOW_MS = 1500;

// ── Overlays ────────────────────────────────────────────────────────

/**
 * Close callbacks of the open overlays, innermost last. Module state rather
 * than store state: the store keeps the count for selectors, functions have
 * no business in devtools.
 */
const overlayStack: Array<() => void> = [];

function closeTopOverlay(): boolean {
  const close = overlayStack[overlayStack.length - 1];
  if (!close) return false;
  close();
  return true;
}

/**
 * Register an open overlay — modal, picker, dropdown, menu — for as long as
 * `open` is true. While any overlay is open the editor shortcuts are off
 * (`selectNoOverlayOpen`) and Escape closes the most recently opened one, so
 * a colour picker inside a modal closes before the modal does.
 */
export function useOverlay(open: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const close = () => onCloseRef.current();
    overlayStack.push(close);
    useAppStore.getState().overlayOpened();
    return () => {
      const index = overlayStack.lastIndexOf(close);
      if (index !== -1) overlayStack.splice(index, 1);
      useAppStore.getState().overlayClosed();
    };
  }, [open]);
}

// ── Bindings ────────────────────────────────────────────────────────

function isInputFocused() {
  const el = document.activeElement;
  return el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement;
}

/** Bind one entry of `SHORTCUTS` — its keys and alternates, its options. */
export function useShortcut(
  id: ShortcutId,
  callback: () => void,
  enabled = true,
) {
  const def: (typeof SHORTCUTS)[ShortcutId] = SHORTCUTS[id];
  // The library types hotkey strings as a closed union that does not know
  // shifted punctuation ("Shift+?"); its parser does, so the table keeps
  // plain strings and they are asserted here
  useHotkeys(
    [def.keys, ...("altKeys" in def ? def.altKeys : [])].map((hotkey) => ({
      hotkey: hotkey as RegisterableHotkey,
      callback,
    })),
    {
      enabled,
      preventDefault: "preventDefault" in def ? def.preventDefault : true,
      ignoreInputs: "ignoreInputs" in def ? def.ignoreInputs : false,
    },
  );
}

interface AppHotkeyHandlers {
  /** Start an export run — App's single `useGenerateAll` instance. */
  onGenerate: () => void;
}

export function useAppHotkeys({ onGenerate }: AppHotkeyHandlers) {
  const selectedScreenshotId = useAppStore((s) => s.selectedScreenshotId);
  const enabled = useAppStore(selectNoOverlayOpen);
  const openOutputFolder = useOpenOutputFolder();

  // ── Tier 1 — EmptyState shortcuts ──────────────────────────────────

  useShortcut("addScreenshot", () => {
    useAppStore.getState().addScreenshot();
  }, enabled);

  useShortcut("generateAll", () => {
    if (!useAppStore.getState().generating) onGenerate();
  }, enabled);

  useShortcut("openThemeEditor", () => {
    useAppStore.getState().openModal("theme");
  }, enabled);

  useShortcut("openMediaManager", () => {
    useAppStore.getState().openModal("media");
  }, enabled);

  useShortcut("togglePlatform", () => {
    const state = useAppStore.getState();
    state.setSelectedPlatform(
      state.selectedPlatform === "android" ? "ios" : "android",
    );
  }, enabled);

  const cycleLanguage = useCallback((direction: 1 | -1) => {
    const state = useAppStore.getState();
    const languages = state.config.languages ?? [];
    if (languages.length < 2) return;
    const currentIndex = languages.findIndex(
      (l) => l.language === state.selectedLang,
    );
    const nextIndex = (currentIndex + direction + languages.length) %
      languages.length;
    state.setSelectedLang(languages[nextIndex].language);
  }, []);

  useShortcut("nextLanguage", () => cycleLanguage(1), enabled);
  useShortcut("prevLanguage", () => cycleLanguage(-1), enabled);

  // ── Tier 2 — Power-user shortcuts ─────────────────────────────────

  useShortcut("openProjects", () => {
    useAppStore.getState().openModal("projects");
  }, enabled);

  const deleteArmedAt = useRef(0);

  useShortcut("deleteScreenshot", () => {
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
    const screenshot = selectScreenshots(state).find((s) => s.id === id);
    if (screenshot?.role === "feature-graphic") {
      state.removeFeatureGraphic();
    } else {
      state.removeScreenshot(id);
    }
  }, enabled && selectedScreenshotId !== null);

  useShortcut("openOutputFolder", () => {
    openOutputFolder.mutate();
  }, enabled);

  // ── Screenshot selection ───────────────────────────────────────────

  const stepScreenshot = useCallback((direction: 1 | -1) => {
    const state = useAppStore.getState();
    const items = selectScreenshots(state).filter(
      (s) => s.role === "screenshot",
    );
    if (items.length === 0) return;
    const currentIndex = items.findIndex(
      (s) => s.id === state.selectedScreenshotId,
    );
    // If nothing (or the feature graphic) is selected, jump to first/last.
    const nextIndex = currentIndex === -1
      ? (direction === 1 ? 0 : items.length - 1)
      : (currentIndex + direction + items.length) % items.length;
    state.setSelectedScreenshotId(items[nextIndex].id);
  }, []);

  useShortcut("nextScreenshot", () => stepScreenshot(1), enabled);
  useShortcut("prevScreenshot", () => stepScreenshot(-1), enabled);

  useShortcut("selectFeatureGraphic", () => {
    const state = useAppStore.getState();
    if (state.selectedPlatform !== "android") return;
    const fg = selectScreenshots(state).find(
      (s) => s.role === "feature-graphic",
    );
    if (fg) state.setSelectedScreenshotId(fg.id);
  }, enabled);

  // ── Cheat sheet ────────────────────────────────────────────────────

  useShortcut("showShortcuts", () => {
    useAppStore.getState().openModal("shortcuts");
  }, enabled);

  // ── Escape — close the topmost overlay, else deselect ─────────────

  useShortcut("closeOrDeselect", () => {
    if (closeTopOverlay()) return;
    // Escape in the text layer's field must not unmount the editor under it
    if (isInputFocused()) return;
    const state = useAppStore.getState();
    if (state.selectedScreenshotId) state.setSelectedScreenshotId(null);
  });
}
