/**
 * App Component
 * 
 * Main application component for the screenshot editor.
 * Manages the application state and coordinates between sidebar, preview, and editors.
 */

import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { Preview } from './Preview';
import { ScreenshotEditor, FeatureGraphicEditor } from './editors/index';
import { ProjectModal } from './modals/ProjectModal';
import { GenerateModal } from './modals/GenerateModal';
import { ThemeEditorModal } from './modals/ThemeEditorModal';
import { MediaManagerModal } from './modals/MediaManagerModal';
import { parseUrlParams, buildUrl } from '../utils/routing';
import { saveConfig as apiSaveConfig, fetchAssets, activateProject, createProject, deleteProject, renameProject } from '../utils/api';
import { getDefaultDevicePresetId } from '../../device-presets/index';
import type { AppData, Assets, DevicePresetId, SelectedItem, Config, Screenshot, FeatureGraphic, GenerateProgress, GenerateResult } from '../types';

// Access app data from window (set by main.tsx after API fetch)
declare global {
  interface Window {
    __APP_DATA__: AppData;
  }
}

export function App() {
  const appData = window.__APP_DATA__;

  // Parse URL for initial state
  const urlParams = parseUrlParams();
  const validProject = appData.projects.find(p => p.id === urlParams.project);
  const initialProject = validProject ? urlParams.project : appData.projectId;

  // State
  const [config, setConfig] = useState<Config>(appData.config);
  const [projects, setProjects] = useState(appData.projects);
  const [currentProject, setCurrentProject] = useState(initialProject);
  const [selectedLang, setSelectedLang] = useState(() => {
    if (urlParams.lang && config.languages?.find(l => l.language === urlParams.lang)) {
      return urlParams.lang;
    }
    return config.languages?.[0]?.language || 'en';
  });
  const [selectedPlatform, setSelectedPlatform] = useState<'android' | 'ios'>(() => {
    if (urlParams.platform && ['android', 'ios'].includes(urlParams.platform)) {
      return urlParams.platform as 'android' | 'ios';
    }
    return 'android';
  });
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(() => {
    if (urlParams.screenshotId === 'feature-graphic') {
      return { type: 'feature-graphic' };
    }
    if (urlParams.screenshotId) {
      return { type: 'screenshot', id: urlParams.screenshotId };
    }
    return null;
  });
  const [assets, setAssets] = useState<Assets>({ screenshots: [], icons: [], mascots: [] });
  const [generating, setGenerating] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<{ results: GenerateResult[]; outputDir: string } | null>(null);
  const [generateProgress, setGenerateProgress] = useState<GenerateProgress>({
    current: 0,
    total: 0,
    item: '',
    results: null,
    outputDir: '',
  });

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingConfigRef = useRef<Config | null>(null);
  const SAVE_DEBOUNCE_MS = 50;

  // Fetch previously generated images
  const fetchLastGenerated = async () => {
    try {
      const res = await fetch('/api/generated');
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setLastGenerated(data);
      } else {
        setLastGenerated(null);
      }
    } catch {
      setLastGenerated(null);
    }
  };

  // On mount, sync server to URL-specified project if they differ
  const initialSyncDone = useRef(false);
  useEffect(() => {
    if (!initialSyncDone.current) {
      initialSyncDone.current = true;
      if (initialProject !== appData.projectId) {
        // URL says a different project than the server's active one — sync it
        activateProject(initialProject).then((data) => {
          setConfig(data.config);
          setSelectedLang(data.config.languages?.[0]?.language || 'en');
          setSelectedItem(null);
          fetchAssets().then(setAssets);
          fetchLastGenerated();
        });
        return;
      }
    }
    fetchAssets().then(setAssets);
    fetchLastGenerated();
  }, [currentProject]);

  // Update URL when selections change
  useEffect(() => {
    if (!currentProject) return;
    const screenshotId = selectedItem?.type === 'feature-graphic'
      ? 'feature-graphic'
      : selectedItem?.type === 'screenshot' ? selectedItem.id : null;
    const newUrl = buildUrl(currentProject, selectedLang, selectedPlatform, screenshotId);
    if (location.pathname !== newUrl) {
      history.pushState({}, '', newUrl);
    }
  }, [currentProject, selectedLang, selectedPlatform, selectedItem]);

  // Helpers
  const getLangConfig = () => config.languages?.find(l => l.language === selectedLang);
  const getPlatformConfig = () => getLangConfig()?.platforms?.[selectedPlatform];
  const getScreenshots = (): Screenshot[] => getPlatformConfig()?.screenshots || [];
  const getFeatureGraphic = (): FeatureGraphic | undefined => getLangConfig()?.platforms?.android?.featureGraphic ?? undefined;

  const persistConfig = async (configToPersist: Config) => {
    await apiSaveConfig(configToPersist);
  };

  const flushPendingSave = async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    if (!pendingConfigRef.current) return;

    const configToPersist = pendingConfigRef.current;
    pendingConfigRef.current = null;
    await persistConfig(configToPersist);
    // Preview auto-updates via React state
  };

  const saveConfig = (newConfig: Config) => {
    setConfig(newConfig);
    pendingConfigRef.current = newConfig;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Save immediately - preview auto-updates via React state
    saveTimeoutRef.current = setTimeout(async () => {
      await flushPendingSave();
    }, SAVE_DEBOUNCE_MS);
  };

  const updateScreenshot = (id: string, updates: Partial<Screenshot>) => {
    const newConfig = { ...config };
    const langConfig = newConfig.languages?.find(l => l.language === selectedLang);
    const platformConfig = langConfig?.platforms?.[selectedPlatform];
    if (platformConfig) {
      const idx = platformConfig.screenshots.findIndex(s => s.id === id);
      if (idx !== -1) {
        platformConfig.screenshots[idx] = { ...platformConfig.screenshots[idx], ...updates };
        saveConfig(newConfig);
      }
    }
  };

  const updateFeatureGraphic = (updates: Partial<FeatureGraphic>) => {
    const newConfig = { ...config };
    const langConfig = newConfig.languages?.find(l => l.language === selectedLang);
    if (langConfig?.platforms?.android) {
      langConfig.platforms.android.featureGraphic = {
        ...(langConfig.platforms.android.featureGraphic || {} as FeatureGraphic),
        ...updates,
      };
      saveConfig(newConfig);
    }
  };

  const updatePlatformDefaultDevicePreset = (platform: 'android' | 'ios', devicePresetId: DevicePresetId) => {
    const newConfig = {
      ...config,
      platformDefaults: {
        ...config.platformDefaults,
        [platform]: {
          ...config.platformDefaults[platform],
          defaultDevicePresetId: devicePresetId,
        },
      },
    };
    saveConfig(newConfig);
  };

  const addFeatureGraphic = () => {
    const newConfig = { ...config };
    const langConfig = newConfig.languages?.find(l => l.language === selectedLang);
    const androidConfig = langConfig?.platforms?.android;
    if (!androidConfig) return;

    androidConfig.featureGraphic = {
      headline: 'Feature Graphic Headline',
      subtitle: 'Add a compelling subtitle',
      imagePath: '',
      glows: [],
      showIcon: true,
      showAppName: true,
      phoneRotation: 5,
      phoneScale: 100,
      phoneX: 0,
      phoneY: 0,
    };

    saveConfig(newConfig);
    setSelectedItem({ type: 'feature-graphic' });
  };

  const addScreenshot = () => {
    const id = 'screenshot-' + Date.now();
    const newScreenshot: Screenshot = {
      id,
      headline: 'New Screenshot',
      subtitle: 'Add a subtitle',
      imagePath: '',
      glows: [],
      phoneFrame: { scale: 70, bottomOffset: 6 },
      typography: {
        headlineFontSize: 8
      }
    };

    const newConfig = { ...config };
    const langConfig = newConfig.languages?.find(l => l.language === selectedLang);
    if (langConfig?.platforms?.[selectedPlatform]) {
      langConfig.platforms[selectedPlatform].screenshots.push(newScreenshot);
      saveConfig(newConfig);
      setSelectedItem({ type: 'screenshot', id });
    }
  };

  const deleteScreenshot = (id: string) => {
    const newConfig = { ...config };
    const langConfig = newConfig.languages?.find(l => l.language === selectedLang);
    if (langConfig?.platforms?.[selectedPlatform]) {
      langConfig.platforms[selectedPlatform].screenshots =
        langConfig.platforms[selectedPlatform].screenshots.filter(s => s.id !== id);
      saveConfig(newConfig);
      if (selectedItem?.type === 'screenshot' && selectedItem.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const deleteFeatureGraphic = () => {
    const newConfig = { ...config };
    const langConfig = newConfig.languages?.find(l => l.language === selectedLang);
    if (langConfig?.platforms?.android) {
      delete langConfig.platforms.android.featureGraphic;
      saveConfig(newConfig);
      if (selectedItem?.type === 'feature-graphic') {
        setSelectedItem(null);
      }
    }
  };

  const refreshAssets = async () => {
    const newAssets = await fetchAssets();
    setAssets(newAssets);
  };

  const switchProject = async (projectId: string) => {
    await flushPendingSave();
    setLastGenerated(null);
    const data = await activateProject(projectId);
    setCurrentProject(projectId);
    setConfig(data.config);
    setSelectedLang(data.config.languages?.[0]?.language || 'en');
    setSelectedItem(null);
    const newAssets = await fetchAssets();
    setAssets(newAssets);
  };

  const addLanguage = async (language: string, copyFrom: string | null) => {
    const res = await fetch('/api/config/language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, copyFrom }),
    });
    if (res.ok) {
      const newLang = await res.json();
      const newConfig = { ...config };
      if (!newConfig.languages) newConfig.languages = [];
      newConfig.languages.push(newLang);
      setConfig(newConfig);
      setSelectedLang(language);
    }
  };

  const copyPlatformConfig = async (sourcePlatform: 'android' | 'ios', targetPlatform: 'android' | 'ios') => {
    const res = await fetch('/api/config/copy-platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: selectedLang,
        sourcePlatform,
        targetPlatform,
      }),
    });
    if (res.ok) {
      const updatedLang = await res.json();
      const newConfig = { ...config };
      const langIndex = newConfig.languages?.findIndex(l => l.language === selectedLang) ?? -1;
      if (langIndex >= 0 && newConfig.languages) {
        newConfig.languages[langIndex] = updatedLang;
      }
      setConfig(newConfig);
      setSelectedPlatform(targetPlatform);
      setSelectedItem(null);
    }
  };

  const handleCreateProject = async (name: string) => {
    const project = await createProject(name);
    setProjects([...projects, project]);
    await switchProject(project.id);
    setShowProjectModal(false);
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId);
    setProjects(projects.filter(p => p.id !== projectId));
    // If deleted the current project, switch to default
    if (currentProject === projectId && projects.length > 1) {
      const remaining = projects.filter(p => p.id !== projectId);
      if (remaining.length > 0) {
        await switchProject(remaining[0].id);
      }
    }
  };

  const handleRenameProject = async (projectId: string, newName: string) => {
    const updated = await renameProject(projectId, newName);
    setProjects(projects.map(p => p.id === projectId ? updated : p));
    // If renamed current project, reload config
    if (currentProject === projectId) {
      const config = await fetch('/api/config').then(r => r.json());
      setConfig(config);
    }
  };

  const generateAll = async () => {
    await flushPendingSave();
    setShowGenerateModal(true);
    setGenerateProgress({ current: 0, total: 0, item: 'Starting...', results: null, outputDir: '' });
    setGenerating(true);

    try {
      const response = await fetch('/api/generate/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n').filter(l => l.startsWith('data: '));

        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'start') {
              setGenerateProgress(prev => ({ ...prev, total: data.total }));
            } else if (data.type === 'progress') {
              setGenerateProgress(prev => ({ ...prev, current: data.current, item: data.item }));
            } else if (data.type === 'complete') {
              setGenerateProgress(prev => ({ ...prev, results: data.results, outputDir: data.outputDir, current: prev.total }));
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    } catch (error) {
      alert('Generation failed: ' + (error as Error).message);
      setShowGenerateModal(false);
    }
    setGenerating(false);
    fetchLastGenerated(); // Refresh last generated list
  };

  // View previously generated images
  const viewLastGenerated = () => {
    if (lastGenerated) {
      setGenerateProgress({
        current: lastGenerated.results.length,
        total: lastGenerated.results.length,
        item: '',
        results: lastGenerated.results,
        outputDir: lastGenerated.outputDir,
      });
      setShowGenerateModal(true);
    }
  };

  // Get selected screenshot
  const getSelectedScreenshot = (): Screenshot | undefined => {
    if (selectedItem?.type === 'screenshot') {
      return getScreenshots().find(s => s.id === selectedItem.id);
    }
    return undefined;
  };

  // Get platform dimensions for preview
  const getDimensions = () => {
    const platformConfig = getPlatformConfig();
    return platformConfig?.dimensions || { width: 1242, height: 2688 };
  };

  const getPlatformDefaultDevicePresetId = (platform: 'android' | 'ios' = selectedPlatform) => {
    return config.platformDefaults?.[platform]?.defaultDevicePresetId ?? getDefaultDevicePresetId(platform);
  };

  const selectedScreenshot = getSelectedScreenshot();
  const featureGraphic = getFeatureGraphic();
  const dimensions = getDimensions();
  const defaultDevicePresetId = getPlatformDefaultDevicePresetId();

  // A missing feature-graphic should not stay selected.
  useEffect(() => {
    if (selectedItem?.type === 'feature-graphic' && !featureGraphic) {
      setSelectedItem(null);
    }
  }, [selectedItem, featureGraphic]);

  // Check if we have content to preview
  const hasPreviewContent = selectedItem?.type === 'screenshot'
    ? !!selectedScreenshot
    : selectedItem?.type === 'feature-graphic'
      ? !!featureGraphic
      : false;

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar
        config={config}
        projects={projects}
        currentProject={currentProject}
        selectedLang={selectedLang}
        selectedPlatform={selectedPlatform}
        selectedItem={selectedItem}
        screenshots={getScreenshots()}
        featureGraphic={featureGraphic}
        platformDefaultDevicePresetId={defaultDevicePresetId}
        assets={assets}
        onSelectLang={setSelectedLang}
        onSelectPlatform={setSelectedPlatform}
        onSelectItem={setSelectedItem}
        onAddScreenshot={addScreenshot}
        onAddFeatureGraphic={addFeatureGraphic}
        onDeleteFeatureGraphic={deleteFeatureGraphic}
        onDeleteScreenshot={deleteScreenshot}
        onSwitchProject={switchProject}
        onShowProjectModal={() => setShowProjectModal(true)}
        onGenerate={generateAll}
        onAddLanguage={addLanguage}
        onCopyPlatformConfig={copyPlatformConfig}
        onUpdatePlatformDefaultDevicePreset={updatePlatformDefaultDevicePreset}
        onShowThemeEditor={() => setShowThemeEditor(true)}
        onShowMediaManager={() => setShowMediaManager(true)}
        generating={generating}
        lastGenerated={lastGenerated}
        onViewLastGenerated={viewLastGenerated}
      />

      {/* Preview Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex items-center justify-center p-8 bg-zinc-900/50">
          {hasPreviewContent ? (
            <Preview
              type={selectedItem?.type === 'feature-graphic' ? 'feature-graphic' : 'screenshot'}
              screenshot={selectedScreenshot}
              featureGraphic={featureGraphic}
              theme={config.theme}
              app={config.app}
              platform={selectedItem?.type === 'feature-graphic' ? 'android' : selectedPlatform}
              defaultDevicePresetId={selectedItem?.type === 'feature-graphic' ? getPlatformDefaultDevicePresetId('android') : defaultDevicePresetId}
              dimensions={dimensions}
            />
          ) : (
            <div className="text-zinc-500">
              Select a screenshot or feature graphic to preview
            </div>
          )}
        </div>
      </div>

      {/* Right Editor Panel */}
      {selectedScreenshot && (
        <ScreenshotEditor
          screenshot={selectedScreenshot}
          assets={assets}
          config={config}
          selectedPlatform={selectedPlatform}
          onUpdate={(updates) => updateScreenshot(selectedScreenshot.id, updates)}
          onUpdateConfig={saveConfig}
          onAssetsRefresh={refreshAssets}
        />
      )}

      {selectedItem?.type === 'feature-graphic' && featureGraphic && (
        <FeatureGraphicEditor
          featureGraphic={featureGraphic}
          assets={assets}
          config={config}
          onUpdate={updateFeatureGraphic}
          onUpdateConfig={saveConfig}
          onAssetsRefresh={refreshAssets}
        />
      )}

      {/* Modals */}
      {showProjectModal && (
        <ProjectModal
          projects={projects}
          currentProject={currentProject}
          onClose={() => setShowProjectModal(false)}
          onCreate={handleCreateProject}
          onSwitch={switchProject}
          onDelete={handleDeleteProject}
          onRename={handleRenameProject}
        />
      )}

      {showGenerateModal && (
        <GenerateModal
          progress={generateProgress}
          generating={generating}
          onClose={() => setShowGenerateModal(false)}
        />
      )}

      {showThemeEditor && (
        <ThemeEditorModal
          config={config}
          onClose={() => setShowThemeEditor(false)}
          onSave={(newConfig) => {
            saveConfig(newConfig);
            setShowThemeEditor(false);
          }}
        />
      )}

      {showMediaManager && (
        <MediaManagerModal
          assets={assets}
          onClose={() => setShowMediaManager(false)}
          onRefresh={refreshAssets}
        />
      )}
    </div>
  );
}
