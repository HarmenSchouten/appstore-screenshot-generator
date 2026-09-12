/**
 * ImageEditor — edit image source, size, position, border radius, and appearance.
 */

import type { ImageLayerProps } from "@app-types";
import { useAssets, useLayerSetter } from "@hooks";
import { ImageSelect, Slider } from "@ui/components/inputs/index.ts";
import { SectionHeading } from "./SectionHeading.tsx";
import { OpacitySlider, PositionControls } from "./PositionControls.tsx";

interface ImageEditorProps {
  layer: ImageLayerProps;
  onUpdate: (updates: Partial<ImageLayerProps>) => void;
}

export function ImageEditor({ layer, onUpdate }: ImageEditorProps) {
  const assets = useAssets();
  const set = useLayerSetter(onUpdate);

  return (
    <div className="space-y-6">
      {/* ── Image ────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Image</SectionHeading>

        <ImageSelect
          label="Source"
          value={layer.imagePath}
          onChange={(v: string) => set("imagePath", v)}
          options={assets.images}
          placeholder="Select image…"
        />
      </section>

      {/* ── Size & Position ──────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Size &amp; Position</SectionHeading>

        <Slider
          label="Size"
          value={layer.size}
          onChange={(v: number) => set("size", v)}
          min={1}
          max={100}
          step={1}
          unit="%"
        />

        <PositionControls layer={layer} onChange={onUpdate} />

        <Slider
          label="Border Radius"
          value={layer.borderRadius ?? 0}
          onChange={(v: number) => set("borderRadius", v)}
          min={0}
          max={1000}
          step={1}
          unit="px"
        />
      </section>

      {/* ── Appearance ───────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Appearance</SectionHeading>

        <OpacitySlider
          value={layer.opacity}
          onChange={(v) => set("opacity", v)}
        />
      </section>
    </div>
  );
}
