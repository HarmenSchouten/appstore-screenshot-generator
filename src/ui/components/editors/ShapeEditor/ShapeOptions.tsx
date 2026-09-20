/**
 * Shape-specific option panels.
 *
 * Each panel renders only the controls relevant to a particular shape
 * family. It receives the layer narrowed to that family — so its sliders
 * read the family's resolved defaults — plus the editor's `set` helper.
 */

import type {
  ArrowShapeProps,
  BasicShapeProps,
  GeometricShapeProps,
  LineShapeProps,
  OrganicShapeProps,
  PatternShapeProps,
  ShapeLayerProps,
} from "@app-types";
import type { LayerSetter } from "@hooks";
import { resolveShape } from "@lib";
import { Slider } from "@ui/components/inputs/index.ts";
import { SegmentedControl } from "@ui/components/inputs/SegmentedControl.tsx";

interface OptionsProps<L extends ShapeLayerProps> {
  layer: L;
  set: LayerSetter<ShapeLayerProps>;
}

// ── Basic ───────────────────────────────────────────────────

export function RectangleOptions(
  { layer, set }: OptionsProps<BasicShapeProps>,
) {
  const s = resolveShape(layer);
  return (
    <Slider
      label="Corner Radius"
      value={s.borderRadius}
      onChange={(v: number) => set("borderRadius", v)}
      min={0}
      max={50}
      step={1}
    />
  );
}

// ── Lines ───────────────────────────────────────────────────

export function LineOptions({ layer, set }: OptionsProps<LineShapeProps>) {
  const s = resolveShape(layer);
  return (
    <>
      <SegmentedControl
        label="Orientation"
        value={s.orientation}
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
        value={s.curvature}
        onChange={(v: number) => set("curvature", v)}
        min={-100}
        max={100}
        step={1}
      />
      <SegmentedControl
        label="Dash Style"
        value={s.dashStyle}
        onChange={(v) => set("dashStyle", v)}
        options={[
          { value: "solid", label: "Solid" },
          { value: "dashed", label: "Dashed" },
          { value: "dotted", label: "Dotted" },
        ]}
      />
      <SegmentedControl
        label="Line Cap"
        value={s.lineCap}
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

export function WaveOptions({ layer, set }: OptionsProps<LineShapeProps>) {
  const s = resolveShape(layer);
  return (
    <>
      <LineOptions layer={layer} set={set} />
      <Slider
        label="Waves"
        value={s.count}
        onChange={(v: number) => set("count", v)}
        min={1}
        max={10}
        step={1}
      />
    </>
  );
}

// ── Arrows & chevrons ───────────────────────────────────────

export function DirectionOptions(
  { layer, set }: OptionsProps<ArrowShapeProps>,
) {
  const s = resolveShape(layer);
  return (
    <SegmentedControl
      label="Direction"
      value={s.direction}
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

export function ChevronOptions({ layer, set }: OptionsProps<ArrowShapeProps>) {
  const s = resolveShape(layer);
  return (
    <>
      <DirectionOptions layer={layer} set={set} />
      <Slider
        label="Angle"
        value={s.angle}
        onChange={(v: number) => set("angle", v)}
        min={30}
        max={120}
        step={1}
        unit="°"
      />
    </>
  );
}

export function DoubleChevronOptions(
  { layer, set }: OptionsProps<ArrowShapeProps>,
) {
  const s = resolveShape(layer);
  return (
    <>
      <ChevronOptions layer={layer} set={set} />
      <Slider
        label="Gap"
        value={s.gap}
        onChange={(v: number) => set("gap", v)}
        min={5}
        max={40}
        step={1}
        unit="px"
      />
    </>
  );
}

// ── Geometric ───────────────────────────────────────────────

export function StarOptions(
  { layer, set }: OptionsProps<GeometricShapeProps>,
) {
  const s = resolveShape(layer);
  return (
    <>
      <Slider
        label="Points"
        value={s.points}
        onChange={(v: number) => set("points", v)}
        min={3}
        max={12}
        step={1}
      />
      <Slider
        label="Inner Radius"
        value={Math.round(s.innerRadius * 100)}
        onChange={(v: number) => set("innerRadius", v / 100)}
        min={10}
        max={80}
        step={1}
        unit="%"
      />
    </>
  );
}

// ── Organic ─────────────────────────────────────────────────

export function BlobOptions({ layer, set }: OptionsProps<OrganicShapeProps>) {
  const s = resolveShape(layer);
  return (
    <>
      <Slider
        label="Complexity"
        value={s.complexity}
        onChange={(v: number) => set("complexity", v)}
        min={3}
        max={12}
        step={1}
      />
      <Slider
        label="Seed"
        value={s.seed}
        onChange={(v: number) => set("seed", v)}
        min={1}
        max={100}
        step={1}
      />
    </>
  );
}

export function CrescentOptions(
  { layer, set }: OptionsProps<OrganicShapeProps>,
) {
  const s = resolveShape(layer);
  return (
    <Slider
      label="Inner Radius"
      value={Math.round(s.innerRadius * 100)}
      onChange={(v: number) => set("innerRadius", v / 100)}
      min={20}
      max={90}
      step={1}
      unit="%"
    />
  );
}

// ── Patterns ────────────────────────────────────────────────

export function DotsGridOptions(
  { layer, set }: OptionsProps<PatternShapeProps>,
) {
  const s = resolveShape(layer);
  return (
    <>
      <Slider
        label="Rows"
        value={s.rows}
        onChange={(v: number) => set("rows", v)}
        min={1}
        max={10}
        step={1}
      />
      <Slider
        label="Columns"
        value={s.columns}
        onChange={(v: number) => set("columns", v)}
        min={1}
        max={10}
        step={1}
      />
      <Slider
        label="Spacing"
        value={s.spacing}
        onChange={(v: number) => set("spacing", v)}
        min={5}
        max={40}
        step={1}
      />
      <Slider
        label="Dot Size"
        value={s.dotSize}
        onChange={(v: number) => set("dotSize", v)}
        min={1}
        max={10}
        step={0.5}
      />
    </>
  );
}

export function ScatteredDotsOptions(
  { layer, set }: OptionsProps<PatternShapeProps>,
) {
  const s = resolveShape(layer);
  return (
    <>
      <Slider
        label="Count"
        value={s.count}
        onChange={(v: number) => set("count", v)}
        min={3}
        max={50}
        step={1}
      />
      <Slider
        label="Dot Size"
        value={s.dotSize}
        onChange={(v: number) => set("dotSize", v)}
        min={1}
        max={10}
        step={0.5}
      />
      <Slider
        label="Seed"
        value={s.seed}
        onChange={(v: number) => set("seed", v)}
        min={1}
        max={100}
        step={1}
      />
    </>
  );
}
