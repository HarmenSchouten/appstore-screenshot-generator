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
import { useGenerateAll, useOpenOutputFolder } from "./generation.ts";
import { useNavigateSelection, useSelection } from "./routing.ts";
import { useScreenshotActions } from "./screenshots.ts";
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

/**
 * The callbacks below close over the selection instead of reading it back
 * imperatively: `useHotkeys` re-points every registration at the latest
 * callback on each render, so the closure cannot go stale.
 */
export function useAppHotkeys() {
  const selection = useSelection();
  const navigateSelection = useNavigateSelection();
  const screenshotActions = useScreenshotActions();
  const enabled = useAppStore(selectNoOverlayOpen);
  const openOutputFolder = useOpenOutputFolder();
  const generateAll = useGenerateAll();

  // ── Tier 1 — EmptyState shortcuts ──────────────────────────────────

  useShortcut("addScreenshot", screenshotActions.add, enabled);

  useShortcut("generateAll", () => {
    if (!useAppStore.getState().generating) generateAll.mutate();
  }, enabled);

  useShortcut("openThemeEditor", () => {
    useAppStore.getState().openModal("theme");
  }, enabled);

  useShortcut("openMediaManager", () => {
    useAppStore.getState().openModal("media");
  }, enabled);

  useShortcut("togglePlatform", () => {
    navigateSelection({
      platform: selection.platform === "android" ? "ios" : "android",
    });
  }, enabled);

  const cycleLanguage = useCallback((direction: 1 | -1) => {
    const languages = useAppStore.getState().config.languages ?? [];
    if (languages.length < 2) return;
    const currentIndex = languages.findIndex(
      (l) => l.language === selection.lang,
    );
    const nextIndex = (currentIndex + direction + languages.length) %
      languages.length;
    navigateSelection({ lang: languages[nextIndex].language });
  }, [selection.lang, navigateSelection]);

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
    const id = selection.screenshotId;
    if (!id) return;
    const screenshot = selectScreenshots(
      useAppStore.getState(),
      selection.lang,
      selection.platform,
    ).find((s) => s.id === id);
    if (screenshot?.role === "feature-graphic") {
      screenshotActions.removeFeatureGraphic();
    } else {
      screenshotActions.remove(id);
    }
  }, enabled && selection.screenshotId !== null);

  useShortcut("openOutputFolder", () => {
    openOutputFolder.mutate(useAppStore.getState().currentProject);
  }, enabled);

  // ── Screenshot selection ───────────────────────────────────────────

  const stepScreenshot = useCallback((direction: 1 | -1) => {
    const items = selectScreenshots(
      useAppStore.getState(),
      selection.lang,
      selection.platform,
    ).filter((s) => s.role === "screenshot");
    if (items.length === 0) return;
    const currentIndex = items.findIndex(
      (s) => s.id === selection.screenshotId,
    );
    // If nothing (or the feature graphic) is selected, jump to first/last.
    const nextIndex = currentIndex === -1
      ? (direction === 1 ? 0 : items.length - 1)
      : (currentIndex + direction + items.length) % items.length;
    screenshotActions.select(items[nextIndex].id);
  }, [selection, screenshotActions]);

  useShortcut("nextScreenshot", () => stepScreenshot(1), enabled);
  useShortcut("prevScreenshot", () => stepScreenshot(-1), enabled);

  useShortcut("selectFeatureGraphic", () => {
    if (selection.platform !== "android") return;
    const fg = selectScreenshots(
      useAppStore.getState(),
      selection.lang,
      selection.platform,
    ).find((s) => s.role === "feature-graphic");
    if (fg) screenshotActions.select(fg.id);
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
    if (selection.screenshotId) screenshotActions.select(null);
  });
}
