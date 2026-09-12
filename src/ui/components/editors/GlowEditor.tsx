/**
 * GlowEditor — edit glow color, size, blur, position, and opacity.
 */

import type { GlowLayerProps } from "@app-types";
import { useLayerSetter } from "@hooks";
import { ColorInput, Slider } from "@ui/components/inputs/index.ts";
import { SectionHeading } from "./SectionHeading.tsx";
import { OpacitySlider, PositionControls } from "./PositionControls.tsx";

interface GlowEditorProps {
  layer: GlowLayerProps;
  onUpdate: (updates: Partial<GlowLayerProps>) => void;
}

export function GlowEditor({ layer, onUpdate }: GlowEditorProps) {
  const set = useLayerSetter(onUpdate);

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

        {/* A glow is radial: rotating it changes nothing */}
        <PositionControls layer={layer} onChange={onUpdate} rotation={false} />

        <OpacitySlider
          value={layer.opacity}
          onChange={(v) => set("opacity", v)}
        />
      </section>
    </div>
  );
}
