import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getDefaultDevicePresetId } from "@device-presets";
import { DEFAULT_DIMENSIONS } from "@lib";
import type { Platform } from "@app-types";
import {
  type ResolvedRoute,
  resolveSelection,
  resolveTarget,
  type RouteSegments,
} from "@ui/utils/route-selection.ts";
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

      // ── Screenshots ────────────────────────────────────────────────
      ...createScreenshotActions(set, get, store),

      // ── Device presets ─────────────────────────────────────────────
      getDefaultDevicePreset: (platform) =>
        get().config.platformDefaults?.[platform]?.defaultDevicePresetId ??
          getDefaultDevicePresetId(platform),

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
        projectId: "",
        current: 0,
        total: 0,
        item: "",
        results: null,
        outputDir: "",
        error: null,
      },

      viewLastGenerated: ({ projectId, results, outputDir }) =>
        set({
          generateProgress: {
            projectId,
            current: results.length,
            total: results.length,
            item: "",
            results,
            outputDir,
            error: null,
          },
          activeModal: "generate",
        }),

      // ── Modals & overlays ──────────────────────────────────────────
      activeModal: null,
      openModal: (activeModal) => set({ activeModal }),
      closeModal: () => set({ activeModal: null }),

      openOverlays: 0,
      overlayOpened: () => set((s) => ({ openOverlays: s.openOverlays + 1 })),
      overlayClosed: () =>
        set((s) => ({ openOverlays: Math.max(0, s.openOverlays - 1) })),

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

/**
 * The language and platform are arguments rather than state: they come from
 * the URL, which a store selector cannot see.
 */
export const selectScreenshots = (
  state: AppState,
  lang: string,
  platform: Platform,
): Screenshot[] =>
  state.config.languages?.find((l) => l.language === lang)
    ?.platforms?.[platform]?.screenshots ?? EMPTY_SCREENSHOTS;

export const selectDimensions = (
  state: AppState,
  lang: string,
  platform: Platform,
) =>
  state.config.languages?.find((l) => l.language === lang)
    ?.platforms?.[platform]?.dimensions ?? DEFAULT_DIMENSIONS[platform];

const selectScreenshotIds = (
  state: AppState,
  lang: string,
  platform: Platform,
): string[] => selectScreenshots(state, lang, platform).map((s) => s.id);

/**
 * Resolve a path against the loaded config — the one composition of
 * `resolveTarget` and `resolveSelection`, so the routing hooks and the
 * project mutations cannot drift on what a path means.
 */
export const selectRoute = (
  state: AppState,
  segments: RouteSegments,
): ResolvedRoute => {
  const target = resolveTarget(segments, {
    loadedProject: state.currentProject,
    projectIds: state.projects.map((p) => p.id),
    languages: state.config.languages?.map((l) => l.language) ?? [],
  });
  return resolveSelection(
    target,
    selectScreenshotIds(state, target.lang, target.platform),
  );
};

/**
 * Nothing is layered over the editor — no modal, picker or menu: the editor
 * shortcuts are live and Escape falls through to the selection.
 */
export const selectNoOverlayOpen = (state: AppState): boolean =>
  state.openOverlays === 0;

export type { AppState, ModalId, ToastItem } from "./types.ts";
