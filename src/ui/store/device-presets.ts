import type { StateCreator } from "zustand";
import { getDefaultDevicePresetId } from "@device-presets";
import type { AppState, DevicePresetSlice } from "./types.ts";
import type { DevicePresetId } from "../types.ts";

export const createDevicePresetSlice: StateCreator<
  AppState,
  [],
  [],
  DevicePresetSlice
> = (_set, get) => ({
  getDefaultDevicePreset: (
    platform?: "android" | "ios",
  ): DevicePresetId => {
    const { config, selectedPlatform } = get();
    const p = platform ?? selectedPlatform;
    return config.platformDefaults?.[p]?.defaultDevicePresetId ??
      getDefaultDevicePresetId(p);
  },

  updateDefaultDevicePreset: (platform, presetId) => {
    const { config, saveConfig } = get();
    saveConfig({
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
});
