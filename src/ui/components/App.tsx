/**
 * App Component
 *
 * Slim shell — the document lives in the Zustand store, the selection in the
 * URL; `useRouteReconciler` is the one place either is corrected.
 *
 * App subscribes to the narrowest slices it actually renders. Selecting the
 * whole `config` here made every keystroke re-render the entire tree, which
 * no amount of selectors in the children could undo (#64).
 */

import { useCallback } from "react";
import { TopBar } from "./TopBar/TopBar.tsx";
import { Sidebar } from "./Sidebar.tsx";
import { Preview } from "./Preview.tsx";
import { ScreenshotEditor } from "./editors/ScreenshotEditor.tsx";
import { ProjectModal } from "./modals/ProjectModal.tsx";
import { GenerateModal } from "./modals/GenerateModal/GenerateModal.tsx";
import { ThemeEditorModal } from "./modals/ThemeEditorModal/ThemeEditorModal.tsx";
import { MediaManagerModal } from "./modals/MediaManagerModal/MediaManagerModal.tsx";
import { ShortcutCheatSheetModal } from "./modals/ShortcutCheatSheetModal.tsx";
import { ToastContainer } from "./ToastContainer.tsx";
import {
  selectDimensions,
  selectScreenshots,
  useAppStore,
} from "@ui/store/index.ts";
import { EmptyState } from "@ui/components/EmptyState.tsx";
import type { Screenshot } from "@ui/types.ts";
import {
  useAppHotkeys,
  useConfigAutoSave,
  useRouteReconciler,
  useScreenshotActions,
  useSelection,
} from "@hooks";

export function App() {
  useRouteReconciler();
  useConfigAutoSave();
  useAppHotkeys();

  const selection = useSelection();
  const { update } = useScreenshotActions();

  const theme = useAppStore((s) => s.config.theme);
  const app = useAppStore((s) => s.config.app);
  const currentProject = useAppStore((s) => s.currentProject);
  const screenshots = useAppStore((s) =>
    selectScreenshots(s, selection.lang, selection.platform)
  );
  const dimensions = useAppStore((s) =>
    selectDimensions(s, selection.lang, selection.platform)
  );

  // Reads config, so it must be a subscription rather than a getState() call
  const defaultDevicePresetId = useAppStore((s) =>
    s.getDefaultDevicePreset(selection.platform)
  );
  const androidDevicePresetId = useAppStore((s) =>
    s.getDefaultDevicePreset("android")
  );

  const projects = useAppStore((s) => s.projects);
  const generating = useAppStore((s) => s.generating);
  const generateProgress = useAppStore((s) => s.generateProgress);
  const activeModal = useAppStore((s) => s.activeModal);
  const closeModal = useAppStore((s) => s.closeModal);

  const selectedScreenshot = selection.screenshotId
    ? screenshots.find((s) => s.id === selection.screenshotId)
    : undefined;

  const isFeatureGraphic = selectedScreenshot?.role === "feature-graphic";

  const handleScreenshotUpdate = useCallback(
    (updates: Partial<Screenshot>) => {
      if (selection.screenshotId) update(selection.screenshotId, updates);
    },
    [selection.screenshotId, update],
  );

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      <TopBar />

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
                  platform={isFeatureGraphic ? "android" : selection.platform}
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

      {activeModal === "projects" && (
        <ProjectModal
          projects={projects}
          currentProject={currentProject}
        />
      )}

      {activeModal === "generate" && (
        <GenerateModal
          progress={generateProgress}
          generating={generating}
          onClose={closeModal}
        />
      )}

      {activeModal === "theme" && (
        <ThemeEditorModal
          onClose={closeModal}
          onSave={(newConfig) => {
            useAppStore.getState().updateConfig(newConfig);
            closeModal();
          }}
        />
      )}

      {activeModal === "media" && <MediaManagerModal onClose={closeModal} />}

      {activeModal === "shortcuts" && (
        <ShortcutCheatSheetModal onClose={closeModal} />
      )}

      <ToastContainer />
    </div>
  );
}
