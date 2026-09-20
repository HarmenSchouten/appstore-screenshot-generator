/**
 * ShapeEditor — main editor for shape layers.
 *
 * Sections:
 * 1. Shape        — type selector (categorised dropdown)
 * 2. Color & Style — color picker, filled/outline toggle, stroke width
 * 3. Shape Options — conditional controls per shape type (hidden when none)
 * 4. Size & Position — size, position, rotation, blur, opacity
 */

import type { ReactElement } from "react";
import type { ShapeLayerProps } from "@app-types";
import { type LayerSetter, useLayerSetter } from "@hooks";
import { assertNever, isStroked, resolveShape, SHAPE_META } from "@lib";
import { ColorInput, Slider } from "@ui/components/inputs/index.ts";
import { SegmentedControl } from "@ui/components/inputs/SegmentedControl.tsx";
import { SectionHeading } from "@ui/components/editors/SectionHeading.tsx";
import {
  OpacitySlider,
  PositionControls,
} from "@ui/components/editors/PositionControls.tsx";
import { ShapeTypeSelect } from "./ShapeTypeSelect.tsx";
import {
  BlobOptions,
  ChevronOptions,
  CrescentOptions,
  DirectionOptions,
  DotsGridOptions,
  DoubleChevronOptions,
  LineOptions,
  RectangleOptions,
  ScatteredDotsOptions,
  StarOptions,
  WaveOptions,
} from "./ShapeOptions.tsx";

interface ShapeEditorProps {
  layer: ShapeLayerProps;
  onUpdate: (updates: Partial<ShapeLayerProps>) => void;
}

export function ShapeEditor({ layer, onUpdate }: ShapeEditorProps) {
  const set = useLayerSetter(onUpdate);
  const s = resolveShape(layer);
  const { paint } = SHAPE_META[s.shapeType];

  const shapeOptions = renderShapeOptions(layer, set);

  return (
    <div className="space-y-6">
      {/* ── Shape ────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Shape</SectionHeading>
        <ShapeTypeSelect
          value={s.shapeType}
          onChange={(v) => set("shapeType", v)}
        />
      </section>

      {/* ── Color & Style ────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Color &amp; Style</SectionHeading>

        <div>
          <label className="text-xs text-zinc-500 block mb-1.5">Color</label>
          <ColorInput
            value={s.color}
            onChange={(v: string) => set("color", v)}
          />
        </div>

        {paint === "toggle" && (
          <SegmentedControl
            label="Fill"
            value={s.filled ? "filled" : "outline"}
            onChange={(v) => set("filled", v === "filled")}
            options={[
              { value: "outline", label: "Outline" },
              { value: "filled", label: "Filled" },
            ]}
          />
        )}

        {isStroked(s.shapeType, s.filled) && (
          <Slider
            label="Stroke Width"
            value={s.strokeWidth}
            onChange={(v: number) => set("strokeWidth", v)}
            min={1}
            max={20}
            step={0.5}
            unit="px"
          />
        )}
      </section>

      {/* ── Shape Options (conditional) ──────────────────── */}
      {shapeOptions && (
        <section className="space-y-3">
          <SectionHeading>Shape Options</SectionHeading>
          {shapeOptions}
        </section>
      )}

      {/* ── Size & Position ──────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Size &amp; Position</SectionHeading>

        <Slider
          label="Size"
          value={s.size}
          onChange={(v: number) => set("size", v)}
          min={10}
          max={2000}
          step={5}
          unit="px"
        />

        <PositionControls layer={layer} onChange={onUpdate} />

        <Slider
          label="Blur"
          value={s.blur}
          onChange={(v: number) => set("blur", v)}
          min={0}
          max={50}
          step={1}
          unit="px"
        />

        <OpacitySlider
          value={s.opacity}
          onChange={(v) => set("opacity", v)}
        />
      </section>
    </div>
  );
}

// ── Conditional options dispatcher ──────────────────────────

/** The family panel for the shape, or null for shapes with no extra options. */
function renderShapeOptions(
  layer: ShapeLayerProps,
  set: LayerSetter<ShapeLayerProps>,
): ReactElement | null {
  switch (layer.shapeType) {
    case "circle":
    case "ring":
    case "pill":
    case "triangle":
    case "diamond":
    case "hexagon":
    case "sparkle":
    case "cross":
      return null;
    case "rectangle":
      return <RectangleOptions layer={layer} set={set} />;
    case "curved-line":
    case "s-curve":
      return <LineOptions layer={layer} set={set} />;
    case "wave-line":
      return <WaveOptions layer={layer} set={set} />;
    case "chevron":
      return <ChevronOptions layer={layer} set={set} />;
    case "double-chevron":
      return <DoubleChevronOptions layer={layer} set={set} />;
    case "arrow":
      return <DirectionOptions layer={layer} set={set} />;
    case "star":
      return <StarOptions layer={layer} set={set} />;
    case "blob":
      return <BlobOptions layer={layer} set={set} />;
    case "crescent":
      return <CrescentOptions layer={layer} set={set} />;
    case "dots-grid":
      return <DotsGridOptions layer={layer} set={set} />;
    case "scattered-dots":
      return <ScatteredDotsOptions layer={layer} set={set} />;
    default:
      return assertNever(layer);
  }
}
