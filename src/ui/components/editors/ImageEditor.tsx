/**
 * ImageEditor — edit image source, size, position, border radius, and appearance.
 */

import { useCallback } from "react";
import type { ImageLayerProps } from "@types";
import { useAppStore } from "@ui/store/index.ts";
import { ImageSelect, Slider } from "@ui/components/inputs/index.ts";
import { SectionHeading } from "./SectionHeading.tsx";
import { SegmentedControl } from "@ui/components/inputs/SegmentedControl.tsx";

interface ImageEditorProps {
  layer: ImageLayerProps;
  onUpdate: (updates: Partial<ImageLayerProps>) => void;
}

export function ImageEditor({ layer, onUpdate }: ImageEditorProps) {
  const assets = useAppStore((s) => s.assets);
  const refreshAssets = useAppStore((s) => s.refreshAssets);

  const set = useCallback(
    <K extends keyof ImageLayerProps>(
      key: K,
      value: ImageLayerProps[K],
    ) => onUpdate({ [key]: value }),
    [onUpdate],
  );

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
          onAssetsRefresh={refreshAssets}
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

        <Slider
          label="Position X"
          value={layer.posX}
          onChange={(v: number) => set("posX", v)}
          min={0}
          max={100}
          step={1}
          unit="%"
        />

        <Slider
          label="Position Y"
          value={layer.posY}
          onChange={(v: number) => set("posY", v)}
          min={0}
          max={100}
          step={1}
          unit="%"
        />

        <Slider
          label="Rotation"
          value={layer.rotation}
          onChange={(v: number) => set("rotation", v)}
          min={-180}
          max={180}
          step={1}
          unit="°"
        />

        <Slider
          label="Border Radius"
          value={layer.borderRadius ?? 0}
          onChange={(v: number) => set("borderRadius", v)}
          min={0}
          max={50}
          step={1}
          unit="%"
        />
      </section>

      {/* ── Appearance ───────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Appearance</SectionHeading>

        <Slider
          label="Opacity"
          value={Math.round((layer.opacity ?? 1) * 100)}
          onChange={(v: number) => set("opacity", v / 100)}
          min={0}
          max={100}
          step={1}
          unit="%"
        />

        <div>
          <label className="text-xs text-zinc-500 block mb-1.5">Fit</label>
          <SegmentedControl
            value={layer.objectFit ?? "contain"}
            onChange={(v) => set("objectFit", v)}
            options={[
              { value: "contain", label: "Contain" },
              { value: "cover", label: "Cover" },
              { value: "fill", label: "Fill" },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
