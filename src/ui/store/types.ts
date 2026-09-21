import type { Platform } from "@app-types";
import type {
  Config,
  DevicePresetId,
  GenerateProgress,
  LastGenerated,
  ProjectInfo,
  Screenshot,
} from "@ui/types.ts";

/** The modals App renders; at most one is open at a time. */
export type ModalId = "projects" | "generate" | "theme" | "media" | "shortcuts";

/** The language and platform a screenshot action works in. */
export interface ScreenshotTarget {
  lang: string;
  platform: Platform;
}

export interface ToastItem {
  id: string;
  type: "error" | "success" | "info";
  message: string;
  duration?: number;
}

/**
 * The whole client-side state, one interface. Grouped by concern rather than
 * split into slice files — ~15 fields do not need nine modules (#68).
 *
 * Two idioms for reaching it, and only two: `useAppStore(selector)` for
 * anything a render depends on (state and actions alike — actions are stable
 * references, so selecting one never re-renders), and `useAppStore.getState()`
 * inside handlers, effects and mutation callbacks.
 *
 * What is *not* here: the project, language, platform and selected
 * screenshot. Those live in the URL — `useSelection()` resolves them — and
 * the actions below take the language and platform they act on as an
 * argument rather than reading a selection back out of the store.
 */
export interface AppState {
  // ── Project & config ─────────────────────────────────────────────
  config: Config;
  /** A local edit not yet on the server; the auto-saver only writes dirty. */
  _configDirty: boolean;
  projects: ProjectInfo[];
  /** The project the loaded `config` belongs to — the server's active one. */
  currentProject: string;
  /**
   * Load a project from the server — on init and on project switch. Marks
   * the config clean, so the auto-saver does not write back what was just
   * read. Local edits go through `updateConfig`.
   */
  hydrate: (
    data: { projectId: string; config: Config; projects?: ProjectInfo[] },
  ) => void;
  /** Apply a local edit — triggers auto-save via the subscriber. */
  updateConfig: (config: Config) => void;

  // ── Screenshots (implemented in screenshots.ts) ──────────────────
  /** Appends a screenshot and returns its id; null when nothing changed. */
  addScreenshot: (target: ScreenshotTarget) => string | null;
  /** Appends the feature graphic; null when the platform already has one. */
  addFeatureGraphic: (target: ScreenshotTarget) => string | null;
  removeScreenshot: (target: ScreenshotTarget, id: string) => void;
  updateScreenshot: (
    target: ScreenshotTarget,
    id: string,
    updates: Partial<Screenshot>,
  ) => void;
  reorderScreenshots: (target: ScreenshotTarget, orderedIds: string[]) => void;
  removeFeatureGraphic: (target: ScreenshotTarget) => void;

  // ── Device presets ───────────────────────────────────────────────
  getDefaultDevicePreset: (platform: Platform) => DevicePresetId;
  updateDefaultDevicePreset: (
    platform: Platform,
    presetId: DevicePresetId,
  ) => void;

  // ── Generation ───────────────────────────────────────────────────
  generating: boolean;
  generateProgress: GenerateProgress;
  /** Reopen the results modal on a previous run (from the manifest query). */
  viewLastGenerated: (last: LastGenerated) => void;

  // ── Modals & overlays ────────────────────────────────────────────
  /** Which of App's modals is mounted; each registers itself as an overlay. */
  activeModal: ModalId | null;
  openModal: (id: ModalId) => void;
  closeModal: () => void;
  /**
   * Overlays — modals, pickers, dropdowns, menus — currently open, counted
   * by `useOverlay`. While above zero the editor shortcuts stand down and
   * Escape belongs to the topmost overlay.
   */
  openOverlays: number;
  overlayOpened: () => void;
  overlayClosed: () => void;

  // ── Toasts ───────────────────────────────────────────────────────
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}
