import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getDefaultDevicePresetId } from "@device-presets";
import { DEFAULT_DIMENSIONS } from "@lib";
import type { Config, Screenshot } from "@ui/types.ts";
import type { AppState, ToastItem } from "./types.ts";
import { createScreenshotActions } from "./screenshots.ts";

const TOAST_DURATION_MS: Record<ToastItem["type"], number> = {
  error: 6000,
  success: 4000,
  info: 4000,
};

// ── Store ───────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  devtools(
    (set, get, store) => ({
      // ── Project & config ───────────────────────────────────────────
      config: {} as Config,
      _configDirty: false,
      projects: [],
      currentProject: "",

      hydrate: ({ projectId, config, projects }) =>
        set((s) => ({
          config,
          currentProject: projectId,
          projects: projects ?? s.projects,
          _configDirty: false,
        })),

      updateConfig: (config) => set({ config, _configDirty: true }),

      // ── Selection ──────────────────────────────────────────────────
      selectedLang: "en",
      selectedPlatform: "android",
      selectedScreenshotId: null,

      // Screenshot ids are scoped to one language/platform, so a switch
      // always invalidates the selection. Clearing it here rather than in an
      // effect in App keeps it to a single store update — and a single
      // `replace` navigation instead of two (#64).
      setSelectedLang: (selectedLang) =>
        set((s) =>
          s.selectedLang === selectedLang
            ? s
            : { selectedLang, selectedScreenshotId: null }
        ),

      setSelectedPlatform: (selectedPlatform) =>
        set((s) =>
          s.selectedPlatform === selectedPlatform
            ? s
            : { selectedPlatform, selectedScreenshotId: null }
        ),

      setSelectedScreenshotId: (selectedScreenshotId) =>
        set({ selectedScreenshotId }),

      // ── Screenshots ────────────────────────────────────────────────
      ...createScreenshotActions(set, get, store),

      // ── Device presets ─────────────────────────────────────────────
      getDefaultDevicePreset: (platform) => {
        const { config, selectedPlatform } = get();
        const p = platform ?? selectedPlatform;
        return config.platformDefaults?.[p]?.defaultDevicePresetId ??
          getDefaultDevicePresetId(p);
      },

      updateDefaultDevicePreset: (platform, presetId) => {
        const { config, updateConfig } = get();
        updateConfig({
          ...config,
          platformDefaults: {
            ...config.platformDefaults,
            [platform]: {
              ...config.platformDefaults[platform],
              defaultDevicePresetId: presetId,
            },
          },
        });
      },

      // ── Generation ─────────────────────────────────────────────────
      generating: false,
      generateProgress: {
        current: 0,
        total: 0,
        item: "",
        results: null,
        outputDir: "",
        error: null,
      },

      viewLastGenerated: ({ results, outputDir }) =>
        set({
          generateProgress: {
            current: results.length,
            total: results.length,
            item: "",
            results,
            outputDir,
            error: null,
          },
          activeModal: "generate",
        }),

      // ── Modals & popovers ──────────────────────────────────────────
      activeModal: null,
      openModal: (activeModal) => set({ activeModal }),
      closeModal: () => set({ activeModal: null }),

      openPopovers: 0,
      popoverOpened: () => set((s) => ({ openPopovers: s.openPopovers + 1 })),
      popoverClosed: () =>
        set((s) => ({ openPopovers: Math.max(0, s.openPopovers - 1) })),

      // ── Toasts ─────────────────────────────────────────────────────
      toasts: [],
      addToast: (toast) => {
        const id = globalThis.crypto.randomUUID();
        const duration = toast.duration ?? TOAST_DURATION_MS[toast.type];
        set({ toasts: [...get().toasts, { ...toast, id }] });
        setTimeout(() => get().removeToast(id), duration);
      },
      removeToast: (id) => {
        set({ toasts: get().toasts.filter((t) => t.id !== id) });
      },
    }),
    { name: "AppStore" },
  ),
);

// ── Selectors ───────────────────────────────────────────────────────

const EMPTY_SCREENSHOTS: Screenshot[] = [];

export const selectScreenshots = (state: AppState): Screenshot[] => {
  const langConfig = state.config.languages?.find(
    (l) => l.language === state.selectedLang,
  );
  return langConfig?.platforms?.[state.selectedPlatform]?.screenshots ??
    EMPTY_SCREENSHOTS;
};

export const selectDimensions = (state: AppState) => {
  const langConfig = state.config.languages?.find(
    (l) => l.language === state.selectedLang,
  );
  const platformConfig = langConfig?.platforms?.[state.selectedPlatform];
  return platformConfig?.dimensions ||
    DEFAULT_DIMENSIONS[state.selectedPlatform];
};

/**
 * Nothing is layered over the editor: the global hotkeys are live and
 * Escape falls through to the selection. Modals and popovers both count.
 */
export const selectNoModalOpen = (state: AppState): boolean =>
  state.activeModal === null && state.openPopovers === 0;

export type { AppState, ModalId, ToastItem } from "./types.ts";
