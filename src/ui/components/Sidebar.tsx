/**
 * Sidebar Component
 * 
 * Left sidebar with project selection, language/platform tabs, and screenshot list.
 */

import { useState } from 'react';
import { getDevicePresetSummary, getDevicePresetsForPlatform } from '../../device-presets/index';
import type { Config, ProjectInfo, Screenshot, FeatureGraphic, SelectedItem, Assets, DevicePresetId } from '../types';
import { SidebarItemCard } from './SidebarItemCard';

interface SidebarProps {
  config: Config;
  projects: ProjectInfo[];
  currentProject: string | null;
  selectedLang: string;
  selectedPlatform: 'android' | 'ios';
  selectedItem: SelectedItem;
  screenshots: Screenshot[];
  featureGraphic?: FeatureGraphic;
  platformDefaultDevicePresetId: DevicePresetId;
  assets?: Assets;
  onSelectLang: (lang: string) => void;
  onSelectPlatform: (platform: 'android' | 'ios') => void;
  onSelectItem: (item: SelectedItem) => void;
  onAddScreenshot: () => void;
  onAddFeatureGraphic: () => void;
  onDeleteFeatureGraphic: () => void;
  onDeleteScreenshot: (id: string) => void;
  onSwitchProject: (projectId: string) => void;
  onShowProjectModal: () => void;
  onGenerate: () => void;
  onAddLanguage: (lang: string, copyFrom: string | null) => void;
  onCopyPlatformConfig: (source: 'android' | 'ios', target: 'android' | 'ios') => void;
  onUpdatePlatformDefaultDevicePreset: (platform: 'android' | 'ios', devicePresetId: DevicePresetId) => void;
  onShowThemeEditor: () => void;
  onShowMediaManager: () => void;
  generating: boolean;
  lastGenerated?: { results: { relativePath: string; status: string }[]; outputDir: string } | null;
  onViewLastGenerated?: () => void;
}

export function Sidebar({
  config,
  projects,
  currentProject,
  selectedLang,
  selectedPlatform,
  selectedItem,
  screenshots,
  featureGraphic,
  platformDefaultDevicePresetId,
  assets,
  onSelectLang,
  onSelectPlatform,
  onSelectItem,
  onAddScreenshot,
  onAddFeatureGraphic,
  onDeleteFeatureGraphic,
  onDeleteScreenshot,
  onSwitchProject,
  onShowProjectModal,
  onGenerate,
  onAddLanguage,
  onCopyPlatformConfig,
  onUpdatePlatformDefaultDevicePreset,
  onShowThemeEditor,
  onShowMediaManager,
  generating,
  lastGenerated,
  onViewLastGenerated,
}: SidebarProps) {
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);
  const currentProjectInfo = projects.find(p => p.id === currentProject);
  const languages = config.languages || [];
  const assetCount = assets ? assets.screenshots.length + assets.mascots.length + assets.icons.length : 0;
  const platformPresets = getDevicePresetsForPlatform(selectedPlatform);

  return (
    <div className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Project Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-lg font-bold flex-1 truncate">
            {currentProjectInfo?.name || 'Screenshot Editor'}
          </h1>
          <button
            onClick={onShowProjectModal}
            className="p-2 hover:bg-zinc-800 rounded"
            title="Manage Projects"
          >
            <i className="fa-solid fa-folder text-zinc-400" />
          </button>
        </div>

        {/* Project Selector */}
        <select
          value={currentProject ?? ''}
          onChange={(e) => onSwitchProject((e.target as HTMLSelectElement).value)}
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
              key={lang.language}
              onClick={() => onSelectLang(lang.language)}
              className={`px-3 py-1.5 rounded text-xs uppercase font-medium ${
                selectedLang === lang.language
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {lang.language}
            </button>
          ))}
          <button
            onClick={() => {
              const lang = prompt('Enter language code (e.g., fr, de, es):');
              if (lang) {
                const copyFrom = confirm('Copy screenshots from current language?') ? selectedLang : null;
                onAddLanguage(lang, copyFrom);
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
          {(['android', 'ios'] as const).map((platform) => (
            <button
              key={platform}
              onClick={() => onSelectPlatform(platform)}
              className={`flex-1 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 ${
                selectedPlatform === platform
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              <i className={`fa-brands fa-${platform === 'ios' ? 'apple' : 'android'}`} />
              {platform === 'ios' ? 'iOS' : 'Android'}
            </button>
          ))}
          <button
            onClick={() => {
              const sourcePlatform = selectedPlatform;
              const targetPlatform = sourcePlatform === 'android' ? 'ios' : 'android';
              if (confirm(`Copy all ${sourcePlatform} screenshots to ${targetPlatform}? This will replace existing ${targetPlatform} screenshots.`)) {
                onCopyPlatformConfig(sourcePlatform, targetPlatform);
              }
            }}
            className="px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded"
            title={`Copy ${selectedPlatform} screenshots to ${selectedPlatform === 'android' ? 'iOS' : 'Android'}`}
          >
            <i className="fa-solid fa-clone" />
          </button>
        </div>
        <div className="mt-3 rounded border border-zinc-800 bg-zinc-950/40 p-3">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">Platform Device</div>
          <select
            value={platformDefaultDevicePresetId}
            onChange={(e) => onUpdatePlatformDefaultDevicePreset(selectedPlatform, (e.target as HTMLSelectElement).value as DevicePresetId)}
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
        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Screenshots</div>

        {screenshots.map((screenshot, index) => (
          <SidebarItemCard
            key={screenshot.id}
            title={screenshot.headline || `Screenshot ${index + 1}`}
            subtitle={screenshot.subtitle}
            index={index}
            isSelected={selectedItem?.type === 'screenshot' && selectedItem.id === screenshot.id}
            confirmingDelete={confirmDeleteKey === screenshot.id}
            onSelect={() => onSelectItem({ type: 'screenshot', id: screenshot.id })}
            onRequestDelete={() => setConfirmDeleteKey(screenshot.id)}
            onConfirmDelete={() => { onDeleteScreenshot(screenshot.id); setConfirmDeleteKey(null); }}
            onCancelDelete={() => setConfirmDeleteKey(null)}
          />
        ))}

        <button
          onClick={onAddScreenshot}
          className="w-full py-2 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600"
        >
          <i className="fa-solid fa-plus mr-1" /> Add Screenshot
        </button>

        {/* Feature Graphic (Android only) */}
        {selectedPlatform === 'android' && (
          <>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mt-4 mb-2">Feature Graphic</div>
            {featureGraphic ? (
              <SidebarItemCard
                title={featureGraphic.headline || 'Feature Graphic'}
                subtitle={featureGraphic.subtitle}
                isSelected={selectedItem?.type === 'feature-graphic'}
                confirmingDelete={confirmDeleteKey === '__feature-graphic__'}
                onSelect={() => onSelectItem({ type: 'feature-graphic' })}
                onRequestDelete={() => setConfirmDeleteKey('__feature-graphic__')}
                onConfirmDelete={() => { onDeleteFeatureGraphic(); setConfirmDeleteKey(null); }}
                onCancelDelete={() => setConfirmDeleteKey(null)}
              />
            ) : (
              <button
                onClick={onAddFeatureGraphic}
                className="w-full py-2 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600"
              >
                <i className="fa-solid fa-plus mr-1" /> Add Feature Graphic
              </button>
            )}
          </>
        )}
      </div>

      {/* Theme & Colors */}
      <div className="p-3 border-t border-zinc-800">
        <button
          onClick={onShowThemeEditor}
          className="w-full p-3 rounded bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-palette text-purple-400" />
              <div>
                <div className="text-sm font-medium">Theme & Colors</div>
                <div className="text-xs text-zinc-500">Palette, gradients, fonts</div>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-zinc-600 group-hover:text-zinc-400 text-xs" />
          </div>
        </button>
      </div>

      {/* Media Library */}
      <div className="p-3 border-t border-zinc-800">
        <button
          onClick={onShowMediaManager}
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
          onClick={onGenerate}
          disabled={generating}
          className={`w-full py-3 rounded font-medium flex items-center justify-center gap-2 ${
            generating
              ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {generating ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" />
              Generating...
            </>
          ) : (
            <>
              <i className="fa-solid fa-wand-magic-sparkles" />
              Generate All
            </>
          )}
        </button>
        {lastGenerated && onViewLastGenerated && (
          <button
            onClick={onViewLastGenerated}
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
