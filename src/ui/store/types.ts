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
 */
export interface AppState {
  // ── Project & config ─────────────────────────────────────────────
  config: Config;
  /** A local edit not yet on the server; the auto-saver only writes dirty. */
  _configDirty: boolean;
  projects: ProjectInfo[];
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

  // ── Selection ────────────────────────────────────────────────────
  selectedLang: string;
  selectedPlatform: Platform;
  /** Id of the selected screenshot or feature graphic; null = nothing selected */
  selectedScreenshotId: string | null;
  setSelectedLang: (lang: string) => void;
  setSelectedPlatform: (platform: Platform) => void;
  setSelectedScreenshotId: (id: string | null) => void;

  // ── Screenshots (implemented in screenshots.ts) ──────────────────
  addScreenshot: () => void;
  addFeatureGraphic: () => void;
  removeScreenshot: (id: string) => void;
  updateScreenshot: (id: string, updates: Partial<Screenshot>) => void;
  reorderScreenshots: (orderedIds: string[]) => void;
  removeFeatureGraphic: () => void;

  // ── Device presets ───────────────────────────────────────────────
  getDefaultDevicePreset: (platform?: Platform) => DevicePresetId;
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
