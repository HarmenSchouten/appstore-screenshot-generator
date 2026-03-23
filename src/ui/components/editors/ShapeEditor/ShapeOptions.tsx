/**
 * Shape-specific option panels.
 *
 * Each panel renders only the controls relevant to a particular shape
 * (or family of shapes). They receive the full layer + a `set` helper.
 */

import type { ShapeLayerProps, ShapeType } from "@types";
import { Slider } from "@ui/components/inputs/index.ts";
import { SegmentedControl } from "@ui/components/inputs/SegmentedControl.tsx";

type Set = <K extends keyof ShapeLayerProps>(
  key: K,
  value: ShapeLayerProps[K],
) => void;

interface OptionsProps {
  layer: ShapeLayerProps;
  set: Set;
}

// ── Helpers ─────────────────────────────────────────────────

/** Which shapes support a filled / outline toggle? */
const SUPPORTS_FILL: ShapeType[] = [
  "rectangle",
  "pill",
  "triangle",
  "diamond",
  "hexagon",
  "star",
  "sparkle",
  "cross",
  "blob",
];

/** Which shapes are always stroked (never filled)? */
const ALWAYS_STROKED: ShapeType[] = [
  "ring",
  "curved-line",
  "s-curve",
  "wave-line",
  "chevron",
  "double-chevron",
  "arrow",
];

export function supportsFill(t: ShapeType) {
  return SUPPORTS_FILL.includes(t);
}
export function showStrokeWidth(t: ShapeType, filled?: boolean) {
  return ALWAYS_STROKED.includes(t) || (SUPPORTS_FILL.includes(t) && !filled);
}

// ── Panels ──────────────────────────────────────────────────

export function RectangleOptions({ layer, set }: OptionsProps) {
  return (
    <Slider
      label="Corner Radius"
      value={layer.borderRadius ?? 0}
      onChange={(v: number) => set("borderRadius", v)}
      min={0}
      max={50}
      step={1}
    />
  );
}

export function LineOptions({ layer, set }: OptionsProps) {
  return (
    <>
      <SegmentedControl
        label="Orientation"
        value={layer.orientation ?? "horizontal"}
        onChange={(v) => set("orientation", v)}
        options={[
          { value: "horizontal", label: "─" },
          { value: "vertical", label: "│" },
          { value: "diagonal-down", label: "╲" },
          { value: "diagonal-up", label: "╱" },
        ]}
      />
      <Slider
        label="Curvature"
        value={layer.curvature ?? 30}
        onChange={(v: number) => set("curvature", v)}
        min={-100}
        max={100}
        step={1}
      />
      <SegmentedControl
        label="Dash Style"
        value={layer.dashStyle ?? "solid"}
        onChange={(v) => set("dashStyle", v)}
        options={[
          { value: "solid", label: "Solid" },
          { value: "dashed", label: "Dashed" },
          { value: "dotted", label: "Dotted" },
        ]}
      />
      <SegmentedControl
        label="Line Cap"
        value={layer.lineCap ?? "round"}
        onChange={(v) => set("lineCap", v)}
        options={[
          { value: "round", label: "Round" },
          { value: "square", label: "Square" },
          { value: "butt", label: "Butt" },
        ]}
      />
    </>
  );
}

export function WaveOptions({ layer, set }: OptionsProps) {
  return (
    <>
      <LineOptions layer={layer} set={set} />
      <Slider
        label="Waves"
        value={layer.count ?? 3}
        onChange={(v: number) => set("count", v)}
        min={1}
        max={10}
        step={1}
      />
    </>
  );
}

export function DirectionOptions({ layer, set }: OptionsProps) {
  return (
    <SegmentedControl
      label="Direction"
      value={layer.direction ?? "right"}
      onChange={(v) => set("direction", v)}
      options={[
        { value: "up", label: "↑" },
        { value: "right", label: "→" },
        { value: "down", label: "↓" },
        { value: "left", label: "←" },
      ]}
    />
  );
}

export function ChevronOptions({ layer, set }: OptionsProps) {
  return (
    <>
      <DirectionOptions layer={layer} set={set} />
      <Slider
        label="Angle"
        value={layer.angle ?? 45}
        onChange={(v: number) => set("angle", v)}
        min={30}
        max={120}
        step={1}
        unit="°"
      />
    </>
  );
}

export function DoubleChevronOptions({ layer, set }: OptionsProps) {
  return (
    <>
      <ChevronOptions layer={layer} set={set} />
      <Slider
        label="Gap"
        value={layer.gap ?? 15}
        onChange={(v: number) => set("gap", v)}
        min={5}
        max={40}
        step={1}
        unit="px"
      />
    </>
  );
}

export function StarOptions({ layer, set }: OptionsProps) {
  return (
    <>
      <Slider
        label="Points"
        value={layer.points ?? 5}
        onChange={(v: number) => set("points", v)}
        min={3}
        max={12}
        step={1}
      />
      <Slider
        label="Inner Radius"
        value={Math.round((layer.innerRadius ?? 0.4) * 100)}
        onChange={(v: number) => set("innerRadius", v / 100)}
        min={10}
        max={80}
        step={1}
        unit="%"
      />
    </>
  );
}

export function BlobOptions({ layer, set }: OptionsProps) {
  return (
    <>
      <Slider
        label="Complexity"
        value={layer.complexity ?? 6}
        onChange={(v: number) => set("complexity", v)}
        min={3}
        max={12}
        step={1}
      />
      <Slider
        label="Seed"
        value={layer.seed ?? 1}
        onChange={(v: number) => set("seed", v)}
        min={1}
        max={100}
        step={1}
      />
    </>
  );
}

export function CrescentOptions({ layer, set }: OptionsProps) {
  return (
    <Slider
      label="Inner Radius"
      value={Math.round((layer.innerRadius ?? 0.7) * 100)}
      onChange={(v: number) => set("innerRadius", v / 100)}
      min={20}
      max={90}
      step={1}
      unit="%"
    />
  );
}

export function DotsGridOptions({ layer, set }: OptionsProps) {
  return (
    <>
      <Slider
        label="Rows"
        value={layer.rows ?? 4}
        onChange={(v: number) => set("rows", v)}
        min={1}
        max={10}
        step={1}
      />
      <Slider
        label="Columns"
        value={layer.columns ?? 4}
        onChange={(v: number) => set("columns", v)}
        min={1}
        max={10}
        step={1}
      />
      <Slider
        label="Spacing"
        value={layer.spacing ?? 20}
        onChange={(v: number) => set("spacing", v)}
        min={5}
        max={40}
        step={1}
      />
      <Slider
        label="Dot Size"
        value={layer.dotSize ?? 3}
        onChange={(v: number) => set("dotSize", v)}
        min={1}
        max={10}
        step={0.5}
      />
    </>
  );
}

export function ScatteredDotsOptions({ layer, set }: OptionsProps) {
  return (
    <>
      <Slider
        label="Count"
        value={layer.count ?? 12}
        onChange={(v: number) => set("count", v)}
        min={3}
        max={50}
        step={1}
      />
      <Slider
        label="Dot Size"
        value={layer.dotSize ?? 2}
        onChange={(v: number) => set("dotSize", v)}
        min={1}
        max={10}
        step={0.5}
      />
      <Slider
        label="Seed"
        value={layer.seed ?? 1}
        onChange={(v: number) => set("seed", v)}
        min={1}
        max={100}
        step={1}
      />
    </>
  );
}
