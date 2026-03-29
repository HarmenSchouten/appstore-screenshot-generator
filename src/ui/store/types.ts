import type {
  Assets,
  Config,
  DevicePresetId,
  GenerateProgress,
  GenerateResult,
  ProjectInfo,
  Screenshot,
  SelectedItem,
} from "../types.ts";

// ── Slice interfaces ────────────────────────────────────────────────

export interface ConfigSlice {
  config: Config;
  _configDirty: boolean;
  /** Hydrate config from server — does NOT trigger auto-save. */
  setConfig: (config: Config) => void;
  /** Apply a local edit — triggers auto-save via the subscriber. */
  updateConfig: (config: Config) => void;
}

export interface ProjectSlice {
  projects: ProjectInfo[];
  currentProject: string;
  initialProjectId: string;
}

export interface SelectionSlice {
  selectedLang: string;
  selectedPlatform: "android" | "ios";
  selectedItem: SelectedItem;
  setSelectedLang: (lang: string) => void;
  setSelectedPlatform: (platform: "android" | "ios") => void;
  setSelectedItem: (item: SelectedItem) => void;
}

export interface AssetsSlice {
  assets: Assets;
  setAssets: (assets: Assets) => void;
}

export interface ScreenshotSlice {
  addScreenshot: () => void;
  addFeatureGraphic: () => void;
  removeScreenshot: (id: string) => void;
  updateScreenshot: (id: string, updates: Partial<Screenshot>) => void;
  removeFeatureGraphic: () => void;
}

export interface DevicePresetSlice {
  getDefaultDevicePreset: (
    platform?: "android" | "ios",
  ) => DevicePresetId;
  updateDefaultDevicePreset: (
    platform: "android" | "ios",
    presetId: DevicePresetId,
  ) => void;
}

export interface GenerationSlice {
  generating: boolean;
  generateProgress: GenerateProgress;
  showGenerateModal: boolean;
  lastGenerated: { results: GenerateResult[]; outputDir: string } | null;
  closeGenerateModal: () => void;
  viewLastGenerated: () => void;
}

export interface UISlice {
  projectModalOpen: boolean;
  themeEditorOpen: boolean;
  mediaManagerOpen: boolean;
  openProjectModal: () => void;
  closeProjectModal: () => void;
  openThemeEditor: () => void;
  closeThemeEditor: () => void;
  openMediaManager: () => void;
  closeMediaManager: () => void;
}

// ── Combined store type ─────────────────────────────────────────────

export type AppState =
  & ConfigSlice
  & ProjectSlice
  & SelectionSlice
  & AssetsSlice
  & ScreenshotSlice
  & DevicePresetSlice
  & GenerationSlice
  & UISlice;
