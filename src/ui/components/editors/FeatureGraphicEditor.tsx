/**
 * FeatureGraphicEditor Component
 *
 * Full editor panel for configuring feature graphic settings including
 * content, icon, phone screenshot, glows, shapes, and mascot.
 */

import { ImageSelect, LabeledColorInput, Slider } from "../inputs/index";
import { CollapsibleSection } from "../CollapsibleSection";
import { GlowEditorInline } from "./GlowEditorInline";
import { ShapeEditorInline } from "./ShapeEditorInline";
import { MascotEditorInline } from "./MascotEditorInline";
import type { Assets, Config, FeatureGraphic } from "../../types";

interface FeatureGraphicEditorProps {
  featureGraphic: FeatureGraphic;
  assets: Assets;
  config: Config;
  onUpdate: (updates: Partial<FeatureGraphic>) => void;
  onUpdateConfig: (config: Config) => void;
  onAssetsRefresh: () => Promise<void>;
}

export function FeatureGraphicEditor({
  featureGraphic,
  assets,
  config,
  onUpdate,
  onUpdateConfig,
  onAssetsRefresh,
}: FeatureGraphicEditorProps) {
  const fg = featureGraphic || ({} as FeatureGraphic);

  return (
    <div className="editor-sidebar bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
      <div className="p-4 space-y-3">
        <h2 className="font-bold text-lg mb-4">Feature Graphic</h2>

        {/* Content Section */}
        <CollapsibleSection title="Content" defaultOpen={true}>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Headline</label>
            <input
              type="text"
              value={fg.headline || ""}
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
              value={fg.subtitle || ""}
              onInput={(e) =>
                onUpdate({ subtitle: (e.target as HTMLInputElement).value })}
              className="w-full px-3 py-2 rounded text-sm"
              placeholder="A compelling subtitle..."
            />
          </div>
          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={fg.showIcon !== false}
                onChange={(e) =>
                  onUpdate({
                    showIcon: (e.target as HTMLInputElement).checked,
                  })}
                className="rounded"
              />
              Show App Icon
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={fg.showAppName !== false}
                onChange={(e) =>
                  onUpdate({
                    showAppName: (e.target as HTMLInputElement).checked,
                  })}
                className="rounded"
              />
              Show App Name
            </label>
          </div>

          {fg.showIcon !== false && (
            <>
              <ImageSelect
                label="App Icon"
                value={config.app?.iconPath || ""}
                onChange={(v) =>
                  onUpdateConfig({
                    ...config,
                    app: { ...config.app, iconPath: v },
                  })}
                options={assets.icons || []}
                category="icons"
                onAssetsRefresh={onAssetsRefresh}
              />
              <div className="text-xs text-zinc-400 mt-3 mb-1">Icon Box</div>
              <div className="grid grid-cols-2 gap-3">
                <Slider
                  label="Size"
                  value={fg.iconBoxScale ?? 100}
                  onChange={(v) => onUpdate({ iconBoxScale: v })}
                  min={50}
                  max={200}
                  step={5}
                  unit="%"
                />
                <Slider
                  label="Radius"
                  value={fg.iconBoxRadius ?? 16}
                  onChange={(v) => onUpdate({ iconBoxRadius: v })}
                  min={0}
                  max={50}
                  step={1}
                  unit="px"
                />
              </div>
              <LabeledColorInput
                label="Background"
                value={fg.iconBoxColor || "rgba(255,255,255,0.15)"}
                onChange={(v) => onUpdate({ iconBoxColor: v })}
                placeholder="rgba(255,255,255,0.15)"
              />
              <div className="text-xs text-zinc-400 mt-3 mb-1">Icon Image</div>
              <div className="grid grid-cols-2 gap-3">
                <Slider
                  label="Scale"
                  value={fg.iconScale ?? 100}
                  onChange={(v) => onUpdate({ iconScale: v })}
                  min={50}
                  max={150}
                  step={5}
                  unit="%"
                />
                <Slider
                  label="Radius"
                  value={fg.iconRadius ?? 0}
                  onChange={(v) => onUpdate({ iconRadius: v })}
                  min={0}
                  max={50}
                  step={1}
                  unit="px"
                />
                <Slider
                  label="Offset X"
                  value={fg.iconOffsetX ?? 0}
                  onChange={(v) => onUpdate({ iconOffsetX: v })}
                  min={-20}
                  max={20}
                  step={1}
                  unit="px"
                />
                <Slider
                  label="Offset Y"
                  value={fg.iconOffsetY ?? 0}
                  onChange={(v) => onUpdate({ iconOffsetY: v })}
                  min={-20}
                  max={20}
                  step={1}
                  unit="px"
                />
              </div>
            </>
          )}
        </CollapsibleSection>

        {/* Phone Screenshot Section */}
        <CollapsibleSection title="Phone Screenshot" defaultOpen={true}>
          <ImageSelect
            label="Image"
            value={fg.imagePath || ""}
            onChange={(v) => onUpdate({ imagePath: v })}
            options={assets.screenshots || []}
            category="screenshots"
            onAssetsRefresh={onAssetsRefresh}
          />
          <div className="grid grid-cols-2 gap-3">
            <Slider
              label="Rotation"
              value={fg.phoneRotation ?? 5}
              onChange={(v) => onUpdate({ phoneRotation: v })}
              min={-15}
              max={15}
              step={1}
              unit="°"
            />
            <Slider
              label="Scale"
              value={fg.phoneScale ?? 100}
              onChange={(v) => onUpdate({ phoneScale: v })}
              min={50}
              max={150}
              step={5}
              unit="%"
            />
            <Slider
              label="Position X"
              value={fg.phoneX ?? 0}
              onChange={(v) => onUpdate({ phoneX: v })}
              min={-50}
              max={50}
              step={1}
              unit="%"
            />
            <Slider
              label="Position Y"
              value={fg.phoneY ?? 0}
              onChange={(v) => onUpdate({ phoneY: v })}
              min={-50}
              max={50}
              step={1}
              unit="%"
            />
          </div>
        </CollapsibleSection>

        {/* Glows Section */}
        <CollapsibleSection title="Background Glows" defaultOpen={false}>
          <GlowEditorInline
            glows={fg.glows || []}
            onChange={(glows) => onUpdate({ glows })}
            palette={config.palette}
          />
        </CollapsibleSection>

        {/* Shapes Section */}
        <CollapsibleSection title="Decorative Shapes" defaultOpen={false}>
          <ShapeEditorInline
            shapes={fg.shapes || []}
            onChange={(shapes) => onUpdate({ shapes })}
            palette={config.palette}
          />
        </CollapsibleSection>

        {/* Mascot Section */}
        <CollapsibleSection title="Mascot" defaultOpen={false}>
          <MascotEditorInline
            mascot={fg.mascot || null}
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
