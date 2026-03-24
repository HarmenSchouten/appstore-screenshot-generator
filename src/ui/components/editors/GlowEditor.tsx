/**
 * GlowEditor — edit glow color, size, blur, position, and opacity.
 */

import { useCallback } from "react";
import type { GlowLayerProps } from "@types";
import { ColorInput, Slider } from "@ui/components/inputs/index.ts";
import { SectionHeading } from "./SectionHeading.tsx";

interface GlowEditorProps {
  layer: GlowLayerProps;
  onUpdate: (updates: Partial<GlowLayerProps>) => void;
}

export function GlowEditor({ layer, onUpdate }: GlowEditorProps) {
  const set = useCallback(
    <K extends keyof GlowLayerProps>(
      key: K,
      value: GlowLayerProps[K],
    ) => onUpdate({ [key]: value }),
    [onUpdate],
  );

  return (
    <div className="space-y-6">
      {/* ── Color & Size ─────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Color &amp; Size</SectionHeading>

        <ColorInput
          value={layer.color}
          onChange={(v: string) => set("color", v)}
        />

        <Slider
          label="Size"
          value={layer.size}
          onChange={(v: number) => set("size", v)}
          min={10}
          max={750}
          step={5}
          unit="px"
        />

        <Slider
          label="Blur"
          value={layer.blur ?? 80}
          onChange={(v: number) => set("blur", v)}
          min={0}
          max={200}
          step={5}
          unit="px"
        />
      </section>

      {/* ── Position & Appearance ────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Position &amp; Appearance</SectionHeading>

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
          label="Opacity"
          value={Math.round((layer.opacity ?? 1) * 100)}
          onChange={(v: number) => set("opacity", v / 100)}
          min={0}
          max={100}
          step={1}
          unit="%"
        />
      </section>
    </div>
  );
}
