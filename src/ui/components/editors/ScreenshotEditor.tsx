/**
 * ScreenshotEditor Component
 *
 * Full editor panel for configuring screenshot settings including
 * content, typography, layout, phone frame, glows, shapes, and mascot.
 */

import { ColorInput, Slider } from "../inputs/index";
import { CollapsibleSection } from "../CollapsibleSection";
import { DeviceMockupEditor } from "./DeviceMockupEditor";
import { GlowEditorInline } from "./GlowEditorInline";
import { ShapeEditorInline } from "./ShapeEditorInline";
import { MascotEditorInline } from "./MascotEditorInline";
import type { Assets, Config, Screenshot } from "../../types";

interface ScreenshotEditorProps {
  screenshot: Screenshot;
  assets: Assets;
  config: Config;
  selectedPlatform: "android" | "ios";
  onUpdate: (updates: Partial<Screenshot>) => void;
  onUpdateConfig: (config: Config) => void;
  onAssetsRefresh: () => Promise<void>;
}

export function ScreenshotEditor({
  screenshot,
  assets,
  config,
  selectedPlatform,
  onUpdate,
  onUpdateConfig: _onUpdateConfig,
  onAssetsRefresh,
}: ScreenshotEditorProps) {
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
              value={screenshot.headline || ""}
              onInput={(e) =>
                onUpdate({ headline: (e.target as HTMLInputElement).value })}
              className="w-full px-3 py-2 rounded text-sm"
              placeholder="Your headline here..."
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Subtitle</label>
            <input
              type="text"
              value={screenshot.subtitle || ""}
              onInput={(e) =>
                onUpdate({ subtitle: (e.target as HTMLInputElement).value })}
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
              max={12}
              step={0.1}
              unit="%"
            />
            <Slider
              label="Subtitle Size"
              value={typo.subtitleFontSize ?? 2.4}
              onChange={(v) => updateTypography({ subtitleFontSize: v })}
              min={1.5}
              max={8}
              step={0.1}
              unit="%"
            />
            <div>
              <label className="text-xs text-zinc-500 block mb-1">
                Headline Weight
              </label>
              <select
                value={typo.headlineFontWeight ?? 800}
                onChange={(e) =>
                  updateTypography({
                    headlineFontWeight: Number(
                      (e.target as HTMLSelectElement).value,
                    ),
                  })}
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
              <label className="text-xs text-zinc-500 block mb-1">
                Subtitle Weight
              </label>
              <select
                value={typo.subtitleFontWeight ?? 500}
                onChange={(e) =>
                  updateTypography({
                    subtitleFontWeight: Number(
                      (e.target as HTMLSelectElement).value,
                    ),
                  })}
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
              max={2}
              step={0.05}
            />
            <div>
              <label className="text-xs text-zinc-500 block mb-1">
                Text Align
              </label>
              <div className="flex gap-1">
                {(["left", "center", "right"] as const).map((align) => (
                  <button
                    onClick={() => updateTypography({ textAlign: align })}
                    className={`flex-1 px-2 py-1.5 rounded text-xs ${
                      (typo.textAlign ?? "center") === align
                        ? "bg-indigo-600"
                        : "bg-zinc-800 hover:bg-zinc-700"
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
              <label className="text-xs text-zinc-500 block mb-1">
                Text Color
              </label>
              <ColorInput
                value={typo.textColor ?? "#ffffff"}
                onChange={(v) => updateTypography({ textColor: v })}
              />
            </div>
            <Slider
              label="Padding"
              value={typo.horizontalPadding ?? 6}
              onChange={(v) => updateTypography({ horizontalPadding: v })}
              min={2}
              max={25}
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
            max={100}
            step={1}
            unit="%"
          />
        </CollapsibleSection>

        {/* Device Mockup Section */}
        <CollapsibleSection title="Device Mockup" defaultOpen={true}>
          <DeviceMockupEditor
            screenshot={screenshot}
            assets={assets}
            config={config}
            selectedPlatform={selectedPlatform}
            onUpdate={onUpdate}
            onAssetsRefresh={onAssetsRefresh}
          />
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
