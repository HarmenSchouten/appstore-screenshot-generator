/**
 * Sidebar Component
 *
 * Left sidebar with project selection, language/platform tabs, and screenshot list.
 * Reads state directly from the Zustand store.
 */

import { useState } from "react";
import {
  getDevicePresetsForPlatform,
  getDevicePresetSummary,
} from "@device-presets";
import type { DevicePresetId } from "../types.ts";
import { SidebarItemCard } from "./SidebarItemCard.tsx";
import { selectScreenshots, useAppStore } from "../store/index.ts";

interface SidebarProps {
  onGenerate: () => void;
}

export function Sidebar({
  onGenerate,
}: SidebarProps) {
  // Store state (reactive selectors)
  const config = useAppStore((s) => s.config);
  const projects = useAppStore((s) => s.projects);
  const currentProject = useAppStore((s) => s.currentProject);
  const selectedLang = useAppStore((s) => s.selectedLang);
  const selectedPlatform = useAppStore((s) => s.selectedPlatform);
  const selectedItem = useAppStore((s) => s.selectedItem);
  const assets = useAppStore((s) => s.assets);
  const generating = useAppStore((s) => s.generating);
  const lastGenerated = useAppStore((s) => s.lastGenerated);
  const screenshots = useAppStore(selectScreenshots);

  // Store actions (stable refs from getState — never cause re-renders)
  const {
    setSelectedLang,
    setSelectedPlatform,
    setSelectedItem,
    switchProject,
    addLanguage,
    copyPlatformConfig,
    addScreenshot,
    addFeatureGraphic,
    removeScreenshot,
    removeFeatureGraphic,
    getDefaultDevicePreset,
    updateDefaultDevicePreset,
    openProjectModal,
    openThemeEditor,
    openMediaManager,
    viewLastGenerated,
  } = useAppStore.getState();

  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);
  const currentProjectInfo = projects.find((p) => p.id === currentProject);
  const languages = config.languages || [];
  const assetCount = assets.screenshots.length + assets.mascots.length +
    assets.icons.length;
  const platformPresets = getDevicePresetsForPlatform(selectedPlatform);
  const platformDefaultDevicePresetId = getDefaultDevicePreset();

  return (
    <div className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Project Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-lg font-bold flex-1 truncate">
            {currentProjectInfo?.name || "Screenshot Editor"}
          </h1>
          <button
            type="button"
            onClick={openProjectModal}
            className="p-2 hover:bg-zinc-800 rounded"
            title="Manage Projects"
          >
            <i className="fa-solid fa-folder text-zinc-400" />
          </button>
        </div>

        {/* Project Selector */}
        <select
          value={currentProject ?? ""}
          onChange={(e) => switchProject((e.target as HTMLSelectElement).value)}
          className="w-full px-3 py-2 rounded text-sm bg-zinc-800 border border-zinc-700"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Language Tabs */}
      <div className="px-4 pt-3 pb-2 border-b border-zinc-800">
        <div className="flex gap-1 flex-wrap">
          {languages.map((lang) => (
            <button
              type="button"
              key={lang.language}
              onClick={() => setSelectedLang(lang.language)}
              className={`px-3 py-1.5 rounded text-xs uppercase font-medium ${
                selectedLang === lang.language
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {lang.language}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const lang = prompt("Enter language code (e.g., fr, de, es):");
              if (lang) {
                const copyFrom =
                  confirm("Copy screenshots from current language?")
                    ? selectedLang
                    : null;
                addLanguage(lang, copyFrom);
              }
            }}
            className="px-2 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 rounded"
            title="Add Language"
          >
            <i className="fa-solid fa-plus" />
          </button>
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="px-4 pt-3 pb-2 border-b border-zinc-800">
        <div className="flex gap-2">
          {(["android", "ios"] as const).map((platform) => (
            <button
              type="button"
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`flex-1 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 ${
                selectedPlatform === platform
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              <i
                className={`fa-brands fa-${
                  platform === "ios" ? "apple" : "android"
                }`}
              />
              {platform === "ios" ? "iOS" : "Android"}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const sourcePlatform = selectedPlatform;
              const targetPlatform = sourcePlatform === "android"
                ? "ios"
                : "android";
              if (
                confirm(
                  `Copy all ${sourcePlatform} screenshots to ${targetPlatform}? This will replace existing ${targetPlatform} screenshots.`,
                )
              ) {
                copyPlatformConfig(sourcePlatform, targetPlatform);
              }
            }}
            className="px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded"
            title={`Copy ${selectedPlatform} screenshots to ${
              selectedPlatform === "android" ? "iOS" : "Android"
            }`}
          >
            <i className="fa-solid fa-clone" />
          </button>
        </div>
        <div className="mt-3 rounded border border-zinc-800 bg-zinc-950/40 p-3">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">
            Platform Device
          </div>
          <select
            value={platformDefaultDevicePresetId}
            onChange={(e) =>
              updateDefaultDevicePreset(
                selectedPlatform,
                (e.target as HTMLSelectElement).value as DevicePresetId,
              )}
            className="w-full px-3 py-2 rounded text-sm bg-zinc-800 border border-zinc-700"
          >
            {platformPresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
          <div className="mt-2 text-xs text-zinc-500">
            {getDevicePresetSummary(platformDefaultDevicePresetId)}
          </div>
        </div>
      </div>

      {/* Screenshot List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
          Screenshots
        </div>

        {screenshots.filter((x) => x.role === "screenshot").map((
          screenshot,
          index,
        ) => (
          <SidebarItemCard
            key={screenshot.id}
            title={`Screenshot ${index + 1}`}
            subtitle="Screenshot details..."
            index={index}
            isSelected={selectedItem?.type === "screenshot" &&
              selectedItem.id === screenshot.id}
            confirmingDelete={confirmDeleteKey === screenshot.id}
            onSelect={() =>
              setSelectedItem({ type: "screenshot", id: screenshot.id })}
            onRequestDelete={() => setConfirmDeleteKey(screenshot.id)}
            onConfirmDelete={() => {
              removeScreenshot(screenshot.id);
              setConfirmDeleteKey(null);
            }}
            onCancelDelete={() => setConfirmDeleteKey(null)}
          />
        ))}

        <button
          type="button"
          onClick={addScreenshot}
          className="w-full py-2 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600"
        >
          <i className="fa-solid fa-plus mr-1" /> Add Screenshot
        </button>

        {/* Feature Graphic (Android only) */}
        {selectedPlatform === "android" && (() => {
          const fg = screenshots.find((x) => x.role === "feature-graphic");
          return (
            <>
              <div className="text-xs text-zinc-500 uppercase tracking-wider mt-4 mb-2">
                Feature Graphic
              </div>
              {fg
                ? (
                  <SidebarItemCard
                    title="Feature Graphic"
                    subtitle="Feature Graphic details..."
                    isSelected={selectedItem?.type === "screenshot" &&
                      selectedItem.id === fg.id}
                    confirmingDelete={confirmDeleteKey ===
                      "__feature-graphic__"}
                    onSelect={() =>
                      setSelectedItem({ type: "screenshot", id: fg.id })}
                    onRequestDelete={() =>
                      setConfirmDeleteKey("__feature-graphic__")}
                    onConfirmDelete={() => {
                      removeFeatureGraphic();
                      setConfirmDeleteKey(null);
                    }}
                    onCancelDelete={() => setConfirmDeleteKey(null)}
                  />
                )
                : (
                  <button
                    type="button"
                    onClick={addFeatureGraphic}
                    className="w-full py-2 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600"
                  >
                    <i className="fa-solid fa-plus mr-1" /> Add Feature Graphic
                  </button>
                )}
            </>
          );
        })()}
      </div>

      {/* Theme & Colors */}
      <div className="p-3 border-t border-zinc-800">
        <button
          type="button"
          onClick={openThemeEditor}
          className="w-full p-3 rounded bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-palette text-purple-400" />
              <div>
                <div className="text-sm font-medium">Theme & Colors</div>
                <div className="text-xs text-zinc-500">
                  Palette, gradients, fonts
                </div>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-zinc-600 group-hover:text-zinc-400 text-xs" />
          </div>
        </button>
      </div>

      {/* Media Library */}
      <div className="p-3 border-t border-zinc-800">
        <button
          type="button"
          onClick={openMediaManager}
          className="w-full p-3 rounded bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-images text-indigo-400" />
              <div>
                <div className="text-sm font-medium">Media Library</div>
                <div className="text-xs text-zinc-500">{assetCount} files</div>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-zinc-600 group-hover:text-zinc-400 text-xs" />
          </div>
        </button>
      </div>

      {/* Generate Button */}
      <div className="p-4 border-t border-zinc-800 space-y-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className={`w-full py-3 rounded font-medium flex items-center justify-center gap-2 ${
            generating
              ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          }`}
        >
          {generating
            ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" />
                Generating...
              </>
            )
            : (
              <>
                <i className="fa-solid fa-wand-magic-sparkles" />
                Generate All
              </>
            )}
        </button>
        {lastGenerated && (
          <button
            type="button"
            onClick={viewLastGenerated}
            className="w-full py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm font-medium flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-images" />
            View Last Results ({lastGenerated.results.length})
          </button>
        )}
      </div>
    </div>
  );
}
