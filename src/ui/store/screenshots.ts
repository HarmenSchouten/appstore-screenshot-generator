import type { StateCreator } from "zustand";
import type { AppState } from "./types.ts";
import type { Config, Screenshot } from "@ui/types.ts";
import type { Platform } from "@app-types";
import { generateLayerId } from "@lib";

/**
 * Rebuild `config` with a new screenshots array for one language/platform,
 * cloning only the spine (config → languages → language → platforms →
 * platform) and sharing every other branch by reference.
 *
 * A `structuredClone` of the whole project here would run on every slider
 * tick and keystroke, and — worse — hand back a brand-new `theme`, `app` and
 * `dimensions` each time, so narrow store selectors could never hold an
 * identity and half the tree would re-render (#64).
 *
 * `update` returns the next screenshots array, or null when there is nothing
 * to change; the caller then skips the write (and the save it would trigger).
 */
function withScreenshots(
  config: Config,
  lang: string,
  platform: Platform,
  update: (screenshots: Screenshot[]) => Screenshot[] | null,
): Config | null {
  const languages = config.languages;
  const langIndex = languages?.findIndex((l) => l.language === lang) ?? -1;
  if (!languages || langIndex === -1) return null;

  const langConfig = languages[langIndex];
  const platformConfig = langConfig.platforms?.[platform];
  if (!platformConfig) return null;

  const screenshots = update(platformConfig.screenshots);
  if (!screenshots || screenshots === platformConfig.screenshots) return null;

  const nextPlatforms = { ...langConfig.platforms };
  nextPlatforms[platform] = { ...platformConfig, screenshots };

  const nextLanguages = [...languages];
  nextLanguages[langIndex] = { ...langConfig, platforms: nextPlatforms };

  return { ...config, languages: nextLanguages };
}

function newScreenshot(
  id: string,
  name: string,
  role: Screenshot["role"],
): Screenshot {
  return {
    id,
    name,
    role,
    layers: [{ id: generateLayerId(), type: "background", opacity: 1 }],
  };
}

export type ScreenshotActions = Pick<
  AppState,
  | "addScreenshot"
  | "addFeatureGraphic"
  | "removeScreenshot"
  | "updateScreenshot"
  | "reorderScreenshots"
  | "removeFeatureGraphic"
>;

export const createScreenshotActions: StateCreator<
  AppState,
  [],
  [],
  ScreenshotActions
> = (_set, get) => ({
  addScreenshot: () => {
    const { config, selectedLang, selectedPlatform } = get();
    const id = globalThis.crypto.randomUUID();

    const next = withScreenshots(
      config,
      selectedLang,
      selectedPlatform,
      (screenshots) => {
        const count = screenshots.filter(
          (s) => s.role === "screenshot",
        ).length;
        return [
          ...screenshots,
          newScreenshot(id, `Screenshot ${count + 1}`, "screenshot"),
        ];
      },
    );
    if (!next) return;

    get().updateConfig(next);
    get().setSelectedScreenshotId(id);
  },

  addFeatureGraphic: () => {
    const { config, selectedLang, selectedPlatform } = get();
    const id = globalThis.crypto.randomUUID();

    const next = withScreenshots(
      config,
      selectedLang,
      selectedPlatform,
      (screenshots) => {
        // Enforce uniqueness: only one feature-graphic per platform
        if (screenshots.some((s) => s.role === "feature-graphic")) return null;
        return [
          ...screenshots,
          newScreenshot(id, "Feature Graphic", "feature-graphic"),
        ];
      },
    );
    if (!next) return;

    get().updateConfig(next);
    get().setSelectedScreenshotId(id);
  },

  removeScreenshot: (id) => {
    const { config, selectedLang, selectedPlatform, selectedScreenshotId } =
      get();

    const next = withScreenshots(
      config,
      selectedLang,
      selectedPlatform,
      (screenshots) =>
        screenshots.some((s) => s.id === id)
          ? screenshots.filter((s) => s.id !== id)
          : null,
    );
    if (!next) return;

    get().updateConfig(next);
    if (selectedScreenshotId === id) get().setSelectedScreenshotId(null);
  },

  updateScreenshot: (id, updates) => {
    const { config, selectedLang, selectedPlatform } = get();

    const next = withScreenshots(
      config,
      selectedLang,
      selectedPlatform,
      (screenshots) => {
        const index = screenshots.findIndex((s) => s.id === id);
        if (index === -1) return null;
        const updated = [...screenshots];
        updated[index] = { ...updated[index], ...updates };
        return updated;
      },
    );
    if (!next) return;

    get().updateConfig(next);
  },

  reorderScreenshots: (orderedIds) => {
    const { config, selectedLang, selectedPlatform } = get();

    const next = withScreenshots(
      config,
      selectedLang,
      selectedPlatform,
      (screenshots) => {
        const byId = new Map(screenshots.map((s) => [s.id, s]));
        // Keep feature graphics in place, reorder only screenshots
        const featureGraphics = screenshots.filter(
          (s) => s.role === "feature-graphic",
        );
        const reordered = orderedIds
          .map((id) => byId.get(id))
          .filter((s): s is Screenshot => s != null && s.role === "screenshot");
        return [...reordered, ...featureGraphics];
      },
    );
    if (!next) return;

    get().updateConfig(next);
  },

  removeFeatureGraphic: () => {
    const { config, selectedLang, selectedPlatform, selectedScreenshotId } =
      get();

    // A holder, not a `let`: TypeScript keeps the narrowing from the
    // initialiser for a `let` assigned only inside a callback.
    const removed: { id?: string } = {};
    const next = withScreenshots(
      config,
      selectedLang,
      selectedPlatform,
      (screenshots) => {
        const featureGraphic = screenshots.find(
          (s) => s.role === "feature-graphic",
        );
        if (!featureGraphic) return null;
        removed.id = featureGraphic.id;
        return screenshots.filter((s) => s.role !== "feature-graphic");
      },
    );
    if (!next) return;

    get().updateConfig(next);
    if (removed.id && selectedScreenshotId === removed.id) {
      get().setSelectedScreenshotId(null);
    }
  },
});
