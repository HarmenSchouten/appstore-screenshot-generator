/**
 * App Component
 *
 * Slim shell — all state lives in the Zustand store,
 * URL is managed by React Router via useStoreRouteSync.
 *
 * App subscribes to the narrowest slices it actually renders. Selecting the
 * whole `config` here made every keystroke re-render the entire tree, which
 * no amount of selectors in the children could undo (#64).
 */

import { useCallback, useEffect } from "react";
import { TopBar } from "./TopBar.tsx";
import { Sidebar } from "./Sidebar.tsx";
import { Preview } from "./Preview.tsx";
import { ScreenshotEditor } from "./editors/ScreenshotEditor.tsx";
import { ProjectModal } from "./modals/ProjectModal.tsx";
import { GenerateModal } from "./modals/GenerateModal.tsx";
import { ThemeEditorModal } from "./modals/ThemeEditorModal.tsx";
import { MediaManagerModal } from "./modals/MediaManagerModal.tsx";
import { ShortcutCheatSheetModal } from "./modals/ShortcutCheatSheetModal.tsx";
import { ToastContainer } from "./ToastContainer.tsx";
import {
  selectDimensions,
  selectScreenshots,
  useAppStore,
} from "@ui/store/index.ts";
import { useStoreRouteSync } from "@ui/utils/routing.ts";
import { EmptyState } from "@ui/components/EmptyState.tsx";
import type { Screenshot } from "@ui/types.ts";
import {
  useAppHotkeys,
  useAssetsQuery,
  useConfigAutoSave,
  useGenerateAll,
} from "@hooks";

export function App() {
  useStoreRouteSync();
  useConfigAutoSave();
  useAssetsQuery();
  useAppHotkeys();

  const { mutate: generate, cancel: cancelGenerate } = useGenerateAll();

  const theme = useAppStore((s) => s.config.theme);
  const app = useAppStore((s) => s.config.app);
  const selectedScreenshotId = useAppStore((s) => s.selectedScreenshotId);
  const selectedPlatform = useAppStore((s) => s.selectedPlatform);
  const assets = useAppStore((s) => s.assets);
  const currentProject = useAppStore((s) => s.currentProject);
  const screenshots = useAppStore(selectScreenshots);
  const dimensions = useAppStore(selectDimensions);

  // Reads config, so it must be a subscription rather than a getState() call
  const defaultDevicePresetId = useAppStore((s) => s.getDefaultDevicePreset());
  const androidDevicePresetId = useAppStore((s) =>
    s.getDefaultDevicePreset("android")
  );

  const projects = useAppStore((s) => s.projects);
  const projectModalOpen = useAppStore((s) => s.projectModalOpen);
  const themeEditorOpen = useAppStore((s) => s.themeEditorOpen);
  const mediaManagerOpen = useAppStore((s) => s.mediaManagerOpen);
  const generating = useAppStore((s) => s.generating);
  const generateProgress = useAppStore((s) => s.generateProgress);
  const showGenerateModal = useAppStore((s) => s.showGenerateModal);
  const shortcutCheatSheetOpen = useAppStore(
    (s) => s.shortcutCheatSheetOpen,
  );

  const {
    updateConfig,
    setSelectedScreenshotId,
    updateScreenshot,
    closeGenerateModal,
    closeThemeEditor,
    closeMediaManager,
    closeShortcutCheatSheet,
  } = useAppStore.getState();

  const selectedScreenshot = selectedScreenshotId
    ? screenshots.find((s) => s.id === selectedScreenshotId)
    : undefined;

  const isFeatureGraphic = selectedScreenshot?.role === "feature-graphic";

  // Safety net for a selection whose screenshot disappeared some other way;
  // lang/platform switches clear it in the store, not here.
  useEffect(() => {
    if (selectedScreenshotId && !selectedScreenshot) {
      setSelectedScreenshotId(null);
    }
  }, [selectedScreenshotId, selectedScreenshot]);

  const handleScreenshotUpdate = useCallback(
    (updates: Partial<Screenshot>) => {
      const id = useAppStore.getState().selectedScreenshotId;
      if (id) updateScreenshot(id, updates);
    },
    [updateScreenshot],
  );

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      <TopBar onGenerate={generate} />

      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex items-center justify-center p-4 bg-zinc-900/50">
            {selectedScreenshot
              ? (
                <Preview
                  screenshot={selectedScreenshot}
                  theme={theme}
                  app={app}
                  platform={isFeatureGraphic ? "android" : selectedPlatform}
                  defaultDevicePresetId={isFeatureGraphic
                    ? androidDevicePresetId
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
            onUpdate={handleScreenshotUpdate}
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
          onCancel={cancelGenerate}
        />
      )}

      {themeEditorOpen && (
        <ThemeEditorModal
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

      {shortcutCheatSheetOpen && (
        <ShortcutCheatSheetModal onClose={closeShortcutCheatSheet} />
      )}

      <ToastContainer />
    </div>
  );
}
