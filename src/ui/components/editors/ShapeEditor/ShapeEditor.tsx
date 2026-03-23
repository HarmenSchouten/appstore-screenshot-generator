/**
 * ShapeEditor — main editor for shape layers.
 *
 * Sections:
 * 1. Shape        — type selector (categorised dropdown)
 * 2. Color & Style — color picker, filled/outline toggle, stroke width
 * 3. Shape Options — conditional controls per shape type (hidden when none)
 * 4. Size & Position — size, position, rotation, blur, opacity
 */

import { useCallback } from "react";
import type { ShapeLayerProps } from "@types";
import { ColorInput, Slider } from "@ui/components/inputs/index.ts";
import { SegmentedControl } from "@ui/components/inputs/SegmentedControl.tsx";
import { SectionHeading } from "../SectionHeading.tsx";
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
  showStrokeWidth,
  StarOptions,
  supportsFill,
  WaveOptions,
} from "./ShapeOptions.tsx";

interface ShapeEditorProps {
  layer: ShapeLayerProps;
  onUpdate: (updates: Partial<ShapeLayerProps>) => void;
}

export function ShapeEditor({ layer, onUpdate }: ShapeEditorProps) {
  const set = useCallback(
    <K extends keyof ShapeLayerProps>(
      key: K,
      value: ShapeLayerProps[K],
    ) => onUpdate({ [key]: value }),
    [onUpdate],
  );

  const shapeOptions = renderShapeOptions(layer, set);

  return (
    <div className="space-y-6">
      {/* ── Shape ────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Shape</SectionHeading>
        <ShapeTypeSelect
          value={layer.shapeType}
          onChange={(v) => set("shapeType", v)}
        />
      </section>

      {/* ── Color & Style ────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Color &amp; Style</SectionHeading>

        <div>
          <label className="text-xs text-zinc-500 block mb-1.5">Color</label>
          <ColorInput
            value={layer.color}
            onChange={(v: string) => set("color", v)}
          />
        </div>

        {supportsFill(layer.shapeType) && (
          <SegmentedControl
            label="Fill"
            value={layer.filled ? "filled" : "outline"}
            onChange={(v) => set("filled", v === "filled")}
            options={[
              { value: "outline", label: "Outline" },
              { value: "filled", label: "Filled" },
            ]}
          />
        )}

        {showStrokeWidth(layer.shapeType, layer.filled) && (
          <Slider
            label="Stroke Width"
            value={layer.strokeWidth ?? 2}
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
          value={layer.size}
          onChange={(v: number) => set("size", v)}
          min={10}
          max={2000}
          step={5}
          unit="px"
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
          label="Blur"
          value={layer.blur ?? 0}
          onChange={(v: number) => set("blur", v)}
          min={0}
          max={50}
          step={1}
          unit="px"
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

// ── Conditional options dispatcher ──────────────────────────

type Set = <K extends keyof ShapeLayerProps>(
  key: K,
  value: ShapeLayerProps[K],
) => void;

function renderShapeOptions(
  layer: ShapeLayerProps,
  set: Set,
): JSX.Element | null {
  switch (layer.shapeType) {
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
      return null;
  }
}
