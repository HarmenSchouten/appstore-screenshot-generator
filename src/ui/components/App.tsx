/**
 * App Component
 *
 * Slim shell — all state lives in the Zustand store.
 */

import { useEffect } from "react";
import { Sidebar } from "./Sidebar.tsx";
import { Preview } from "./Preview.tsx";
import { ScreenshotEditor } from "./editors/index.ts";
import { ProjectModal } from "./modals/ProjectModal.tsx";
import { GenerateModal } from "./modals/GenerateModal.tsx";
import { ThemeEditorModal } from "./modals/ThemeEditorModal.tsx";
import { MediaManagerModal } from "./modals/MediaManagerModal.tsx";
import {
  selectDimensions,
  selectScreenshots,
  useAppStore,
} from "../store/index.ts";
import { activateProject, fetchAssets } from "../utils/api.ts";
import { buildUrl, parseUrlParams } from "../utils/routing.ts";
import type { AppData } from "../types.ts";

declare global {
  interface Window {
    __APP_DATA__: AppData;
  }
}

export function App() {
  const appData = window.__APP_DATA__;
  const urlParams = parseUrlParams();
  const validProject = appData.projects.find((p) => p.id === urlParams.project);
  const initialProject = validProject ? urlParams.project : appData.projectId;

  const config = useAppStore((s) => s.config);
  const selectedItem = useAppStore((s) => s.selectedItem);
  const selectedLang = useAppStore((s) => s.selectedLang);
  const selectedPlatform = useAppStore((s) => s.selectedPlatform);
  const assets = useAppStore((s) => s.assets);
  const currentProject = useAppStore((s) => s.currentProject);
  const screenshots = useAppStore(selectScreenshots);
  const dimensions = useAppStore(selectDimensions);

  const {
    setConfig,
    setSelectedLang,
    setSelectedItem,
    saveConfig,
    updateScreenshot,
    refreshAssets,
    getDefaultDevicePreset,
    // Generation
    generating,
    generateProgress,
    showGenerateModal,
    lastGenerated,
    generateAll,
    closeGenerateModal,
    viewLastGenerated,
    refreshLastGenerated,
    // Projects
    projects,
    switchProject,
    createProject,
    removeProject,
    renameProject,
    // UI modals
    projectModalOpen,
    themeEditorOpen,
    mediaManagerOpen,
    openProjectModal,
    closeProjectModal,
    openThemeEditor,
    closeThemeEditor,
    openMediaManager,
    closeMediaManager,
    setSelectedPlatform,
  } = useAppStore.getState();

  const selectedScreenshot = (() => {
    if (selectedItem?.type === "screenshot") {
      return screenshots.find((s) => s.id === selectedItem.id);
    }
    return screenshots.find((s) => s.role === "feature-graphic");
  })();

  const defaultDevicePresetId = getDefaultDevicePreset();

  // On mount, sync server to URL-specified project if they differ
  useEffect(() => {
    if (initialProject !== appData.projectId) {
      activateProject(initialProject).then((data) => {
        setConfig(data.config);
        setSelectedLang(data.config.languages?.[0]?.language || "en");
        setSelectedItem(null);
        fetchAssets().then(useAppStore.getState().setAssets);
        refreshLastGenerated();
      });
      return;
    }
    refreshAssets();
    refreshLastGenerated();
  }, [currentProject]);

  // Deselect missing feature-graphic
  useEffect(() => {
    if (selectedItem?.type === "feature-graphic" && !selectedScreenshot) {
      setSelectedItem(null);
    }
  }, [selectedItem, selectedScreenshot]);

  // URL sync
  useEffect(() => {
    if (!currentProject) return;
    const screenshotId = selectedItem?.type === "feature-graphic"
      ? "feature-graphic"
      : selectedItem?.type === "screenshot"
      ? selectedItem.id
      : null;
    const newUrl = buildUrl(
      currentProject,
      selectedLang,
      selectedPlatform,
      screenshotId,
    );
    if (location.pathname !== newUrl) {
      history.pushState({}, "", newUrl);
    }
  }, [currentProject, selectedLang, selectedPlatform, selectedItem]);

  const handleCreateProject = async (name: string) => {
    await createProject(name);
    closeProjectModal();
  };

  const addLanguage = async (language: string, copyFrom: string | null) => {
    const res = await fetch("/api/config/language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, copyFrom }),
    });
    if (res.ok) {
      const newLang = await res.json();
      const { config } = useAppStore.getState();
      const newConfig = { ...config };
      if (!newConfig.languages) newConfig.languages = [];
      newConfig.languages.push(newLang);
      setConfig(newConfig);
      setSelectedLang(language);
    }
  };

  const copyPlatformConfig = async (
    sourcePlatform: "android" | "ios",
    targetPlatform: "android" | "ios",
  ) => {
    const res = await fetch("/api/config/copy-platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: useAppStore.getState().selectedLang,
        sourcePlatform,
        targetPlatform,
      }),
    });
    if (res.ok) {
      const updatedLang = await res.json();
      const { config } = useAppStore.getState();
      const newConfig = { ...config };
      const langIndex = newConfig.languages?.findIndex(
        (l) => l.language === useAppStore.getState().selectedLang,
      ) ?? -1;
      if (langIndex >= 0 && newConfig.languages) {
        newConfig.languages[langIndex] = updatedLang;
      }
      setConfig(newConfig);
      setSelectedPlatform(targetPlatform);
      setSelectedItem(null);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      <Sidebar
        onGenerate={generateAll}
        onAddLanguage={addLanguage}
        onCopyPlatformConfig={copyPlatformConfig}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex items-center justify-center p-8 bg-zinc-900/50">
          {selectedScreenshot
            ? (
              <Preview
                screenshot={selectedScreenshot}
                theme={config.theme}
                app={config.app}
                platform={selectedItem?.type === "feature-graphic"
                  ? "android"
                  : selectedPlatform}
                defaultDevicePresetId={selectedItem?.type === "feature-graphic"
                  ? getDefaultDevicePreset("android")
                  : defaultDevicePresetId}
                dimensions={dimensions}
              />
            )
            : (
              <div className="text-zinc-500">
                Select a screenshot or feature graphic to preview
              </div>
            )}
        </div>
      </div>

      {selectedScreenshot && (
        <ScreenshotEditor
          screenshot={selectedScreenshot}
          assets={assets}
          config={config}
          selectedPlatform={selectedPlatform}
          onUpdate={(updates) =>
            updateScreenshot(selectedScreenshot.id, updates)}
          onUpdateConfig={saveConfig}
          onAssetsRefresh={refreshAssets}
        />
      )}

      {projectModalOpen && (
        <ProjectModal
          projects={projects}
          currentProject={currentProject}
          onClose={closeProjectModal}
          onCreate={handleCreateProject}
          onSwitch={switchProject}
          onDelete={removeProject}
          onRename={renameProject}
        />
      )}

      {showGenerateModal && (
        <GenerateModal
          progress={generateProgress}
          generating={generating}
          onClose={closeGenerateModal}
        />
      )}

      {themeEditorOpen && (
        <ThemeEditorModal
          config={config}
          onClose={closeThemeEditor}
          onSave={(newConfig) => {
            saveConfig(newConfig);
            closeThemeEditor();
          }}
        />
      )}

      {mediaManagerOpen && (
        <MediaManagerModal
          assets={assets}
          onClose={closeMediaManager}
          onRefresh={refreshAssets}
        />
      )}
    </div>
  );
}
