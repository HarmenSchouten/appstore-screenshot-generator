/**
 * ScreenshotEditor Component
 * 
 * Full editor panel for configuring screenshot settings including
 * content, typography, layout, phone frame, glows, shapes, and mascot.
 */

import { Slider, ColorInput, ImageSelect } from '../inputs/index';
import { CollapsibleSection } from '../CollapsibleSection';
import { GlowEditorInline } from './GlowEditorInline';
import { ShapeEditorInline } from './ShapeEditorInline';
import { MascotEditorInline } from './MascotEditorInline';
import type { Screenshot, Assets, Config } from '../../types';

interface ScreenshotEditorProps {
  screenshot: Screenshot;
  assets: Assets;
  config: Config;
  onUpdate: (updates: Partial<Screenshot>) => void;
  onUpdateConfig: (config: Config) => void;
  onAssetsRefresh: () => Promise<void>;
}

export function ScreenshotEditor({
  screenshot,
  assets,
  config,
  onUpdate,
  onUpdateConfig: _onUpdateConfig,
  onAssetsRefresh,
}: ScreenshotEditorProps) {
  const isDual = Array.isArray(screenshot.imagePath);
  const typo = screenshot.typography || {};

  const updateTypography = (updates: Record<string, unknown>) => {
    onUpdate({ typography: { ...typo, ...updates } });
  };

  return (
    <div className="editor-sidebar bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
      <div className="p-4 space-y-3">
        <h2 className="font-bold text-lg mb-4">Screenshot Editor</h2>

        {/* Content Section */}
        <CollapsibleSection title="Content" defaultOpen={true}>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Headline</label>
            <input
              type="text"
              value={screenshot.headline || ''}
              onInput={(e) => onUpdate({ headline: (e.target as HTMLInputElement).value })}
              className="w-full px-3 py-2 rounded text-sm"
              placeholder="Your headline here..."
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Subtitle</label>
            <input
              type="text"
              value={screenshot.subtitle || ''}
              onInput={(e) => onUpdate({ subtitle: (e.target as HTMLInputElement).value })}
              className="w-full px-3 py-2 rounded text-sm"
              placeholder="A compelling subtitle..."
            />
          </div>
        </CollapsibleSection>

        {/* Typography Section */}
        <CollapsibleSection title="Typography" defaultOpen={false}>
          <div className="grid grid-cols-2 gap-3">
            <Slider
              label="Headline Size"
              value={typo.headlineFontSize ?? 5.2}
              onChange={(v) => updateTypography({ headlineFontSize: v })}
              min={3}
              max={8}
              step={0.1}
              unit="%"
            />
            <Slider
              label="Subtitle Size"
              value={typo.subtitleFontSize ?? 2.4}
              onChange={(v) => updateTypography({ subtitleFontSize: v })}
              min={1.5}
              max={4}
              step={0.1}
              unit="%"
            />
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Headline Weight</label>
              <select
                value={typo.headlineFontWeight ?? 800}
                onChange={(e) => updateTypography({ headlineFontWeight: Number((e.target as HTMLSelectElement).value) })}
                className="w-full px-3 py-2 rounded text-sm"
              >
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semibold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">Extra Bold (800)</option>
                <option value="900">Black (900)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Subtitle Weight</label>
              <select
                value={typo.subtitleFontWeight ?? 500}
                onChange={(e) => updateTypography({ subtitleFontWeight: Number((e.target as HTMLSelectElement).value) })}
                className="w-full px-3 py-2 rounded text-sm"
              >
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semibold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Slider
              label="Line Height"
              value={typo.headlineLineHeight ?? 1.15}
              onChange={(v) => updateTypography({ headlineLineHeight: v })}
              min={1}
              max={1.5}
              step={0.05}
            />
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Text Align</label>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    onClick={() => updateTypography({ textAlign: align })}
                    className={`flex-1 px-2 py-1.5 rounded text-xs ${
                      (typo.textAlign ?? 'center') === align ? 'bg-indigo-600' : 'bg-zinc-800 hover:bg-zinc-700'
                    }`}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Text Color</label>
              <ColorInput
                value={typo.textColor ?? '#ffffff'}
                onChange={(v) => updateTypography({ textColor: v })}
              />
            </div>
            <Slider
              label="Padding"
              value={typo.horizontalPadding ?? 6}
              onChange={(v) => updateTypography({ horizontalPadding: v })}
              min={2}
              max={15}
              step={1}
              unit="%"
            />
          </div>
        </CollapsibleSection>

        {/* Layout Section */}
        <CollapsibleSection title="Layout" defaultOpen={false}>
          <Slider
            label="Title Offset from Top"
            value={screenshot.headlineOffset ?? 0}
            onChange={(v) => onUpdate({ headlineOffset: v })}
            min={0}
            max={30}
            step={1}
            unit="%"
          />
        </CollapsibleSection>

        {/* Images Section */}
        <CollapsibleSection title="Phone Screenshot" defaultOpen={true}>
          <div className="flex justify-end mb-2">
            <button
              onClick={() => {
                if (isDual) {
                  onUpdate({ imagePath: (screenshot.imagePath as string[])[0] || '' });
                } else {
                  onUpdate({ imagePath: [(screenshot.imagePath as string) || '', ''] });
                }
              }}
              className="text-xs px-3 py-1.5 bg-zinc-800 rounded hover:bg-zinc-700"
            >
              {isDual ? '← Single Phone' : 'Dual Phones →'}
            </button>
          </div>

          {isDual ? (
            <div className="space-y-3">
              <ImageSelect
                label="Left Phone"
                value={(screenshot.imagePath as string[])[0] || ''}
                onChange={(v) => onUpdate({ imagePath: [v, (screenshot.imagePath as string[])[1] || ''] })}
                options={assets.screenshots || []}
                category="screenshots"
                onAssetsRefresh={onAssetsRefresh}
              />
              <ImageSelect
                label="Right Phone"
                value={(screenshot.imagePath as string[])[1] || ''}
                onChange={(v) => onUpdate({ imagePath: [(screenshot.imagePath as string[])[0] || '', v] })}
                options={assets.screenshots || []}
                category="screenshots"
                onAssetsRefresh={onAssetsRefresh}
              />
            </div>
          ) : (
            <ImageSelect
              value={(screenshot.imagePath as string) || ''}
              onChange={(v) => onUpdate({ imagePath: v })}
              options={assets.screenshots || []}
              category="screenshots"
              onAssetsRefresh={onAssetsRefresh}
            />
          )}
        </CollapsibleSection>

        {/* Phone Frame Section */}
        <CollapsibleSection title="Phone Frame" defaultOpen={false}>
          <div className="grid grid-cols-2 gap-3">
            <Slider
              label="Scale"
              value={screenshot.phoneFrame?.scale ?? (isDual ? 42 : 70)}
              onChange={(v) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, scale: v } })}
              min={isDual ? 30 : 50}
              max={100}
              step={1}
              unit="%"
            />
            <Slider
              label="Bottom Offset"
              value={screenshot.phoneFrame?.bottomOffset ?? 6}
              onChange={(v) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, bottomOffset: v } })}
              min={0}
              max={100}
              step={1}
              unit="%"
            />
            {isDual && (
              <>
                <Slider
                  label="Rotation"
                  value={screenshot.phoneFrame?.dualRotation ?? 6}
                  onChange={(v) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, dualRotation: v } })}
                  min={0}
                  max={15}
                  step={1}
                  unit="°"
                />
                <Slider
                  label="Gap"
                  value={screenshot.phoneFrame?.dualGap ?? 2}
                  onChange={(v) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, dualGap: v } })}
                  min={0}
                  max={10}
                  step={0.5}
                  unit="%"
                />
              </>
            )}
          </div>
        </CollapsibleSection>

        {/* Glows Section */}
        <CollapsibleSection title="Background Glows" defaultOpen={false}>
          <GlowEditorInline
            glows={screenshot.glows || []}
            onChange={(glows) => onUpdate({ glows })}
            palette={config.palette}
          />
        </CollapsibleSection>

        {/* Shapes Section */}
        <CollapsibleSection title="Decorative Shapes" defaultOpen={false}>
          <ShapeEditorInline
            shapes={screenshot.shapes || []}
            onChange={(shapes) => onUpdate({ shapes })}
            palette={config.palette}
          />
        </CollapsibleSection>

        {/* Mascot Section */}
        <CollapsibleSection title="Mascot" defaultOpen={false}>
          <MascotEditorInline
            mascot={screenshot.mascot || null}
            assets={assets}
            config={config}
            onChange={(mascot) => onUpdate({ mascot })}
            onAssetsRefresh={onAssetsRefresh}
          />
        </CollapsibleSection>
      </div>
    </div>
  );
}
