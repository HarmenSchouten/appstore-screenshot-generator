/**
 * App Component
 *
 * Slim shell — all state lives in the Zustand store,
 * URL is managed by React Router via useStoreRouteSync.
 */

import { useEffect } from "react";
import { TopBar } from "./TopBar.tsx";
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
import { useStoreRouteSync } from "../utils/routing.ts";
import { EmptyState } from "@ui/components/EmptyState.tsx";
import {
  useAssetsQuery,
  useConfigAutoSave,
  useGenerateAll,
  useLastGeneratedQuery,
  useSwitchProject,
} from "@hooks";

export function App() {
  useStoreRouteSync();
  useConfigAutoSave();
  useAssetsQuery();

  const switchProject = useSwitchProject();
  const generateAll = useGenerateAll();

  useLastGeneratedQuery();

  const config = useAppStore((s) => s.config);
  const selectedItem = useAppStore((s) => s.selectedItem);
  const selectedPlatform = useAppStore((s) => s.selectedPlatform);
  const assets = useAppStore((s) => s.assets);
  const currentProject = useAppStore((s) => s.currentProject);
  const initialProjectId = useAppStore((s) => s.initialProjectId);
  const screenshots = useAppStore(selectScreenshots);
  const dimensions = useAppStore(selectDimensions);

  const projects = useAppStore((s) => s.projects);
  const projectModalOpen = useAppStore((s) => s.projectModalOpen);
  const themeEditorOpen = useAppStore((s) => s.themeEditorOpen);
  const mediaManagerOpen = useAppStore((s) => s.mediaManagerOpen);
  const generating = useAppStore((s) => s.generating);
  const generateProgress = useAppStore((s) => s.generateProgress);
  const showGenerateModal = useAppStore((s) => s.showGenerateModal);

  const {
    updateConfig,
    setSelectedItem,
    updateScreenshot,
    getDefaultDevicePreset,
    closeGenerateModal,
    closeThemeEditor,
    closeMediaManager,
  } = useAppStore.getState();

  const selectedScreenshot = selectedItem?.type === "screenshot"
    ? screenshots.find((s) => s.id === selectedItem.id)
    : undefined;

  const defaultDevicePresetId = getDefaultDevicePreset();

  useEffect(() => {
    if (currentProject !== initialProjectId) {
      switchProject.mutate(currentProject);
    }
  }, []);

  useEffect(() => {
    if (selectedItem?.type === "screenshot" && !selectedScreenshot) {
      setSelectedItem(null);
    }
  }, [selectedItem, selectedScreenshot]);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      <TopBar onGenerate={() => generateAll.mutate()} />

      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex items-center justify-center p-8 bg-zinc-900/50">
            {selectedScreenshot
              ? (
                <Preview
                  screenshot={selectedScreenshot}
                  theme={config.theme}
                  app={config.app}
                  platform={selectedScreenshot?.role === "feature-graphic"
                    ? "android"
                    : selectedPlatform}
                  defaultDevicePresetId={selectedScreenshot?.role ===
                      "feature-graphic"
                    ? getDefaultDevicePreset("android")
                    : defaultDevicePresetId}
                  dimensions={dimensions}
                />
              )
              : <EmptyState />}
          </div>
        </div>

        {selectedScreenshot && (
          <ScreenshotEditor
            screenshot={selectedScreenshot}
            onUpdate={(updates) =>
              updateScreenshot(selectedScreenshot.id, updates)}
          />
        )}
      </div>

      {projectModalOpen && (
        <ProjectModal
          projects={projects}
          currentProject={currentProject}
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
            updateConfig(newConfig);
            closeThemeEditor();
          }}
        />
      )}

      {mediaManagerOpen && (
        <MediaManagerModal
          assets={assets}
          onClose={closeMediaManager}
        />
      )}
    </div>
  );
}
