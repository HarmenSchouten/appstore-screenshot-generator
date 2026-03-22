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
  setConfig: (config: Config) => void;
  /** Update config in state AND debounce-persist to server. */
  saveConfig: (config: Config) => void;
  /** Flush any pending debounced save immediately. */
  flush: () => Promise<void>;
  /** Add a new language, optionally copying from an existing one. */
  addLanguage: (language: string, copyFrom: string | null) => Promise<void>;
  /** Copy one platform's config to another within the selected language. */
  copyPlatformConfig: (
    sourcePlatform: "android" | "ios",
    targetPlatform: "android" | "ios",
  ) => Promise<void>;
}

export interface ProjectSlice {
  projects: ProjectInfo[];
  currentProject: string;
  switchProject: (projectId: string) => Promise<void>;
  createProject: (name: string) => Promise<void>;
  removeProject: (projectId: string) => Promise<void>;
  renameProject: (projectId: string, newName: string) => Promise<void>;
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
  refreshAssets: () => Promise<void>;
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
  generateAll: () => Promise<void>;
  closeGenerateModal: () => void;
  viewLastGenerated: () => void;
  refreshLastGenerated: () => Promise<void>;
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
