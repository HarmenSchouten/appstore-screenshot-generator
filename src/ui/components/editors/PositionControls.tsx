/**
 * The sliders every positioned layer shares (#69). Rendered as siblings,
 * not a section, so an editor can put its own size or padding sliders
 * around them and keep its layout.
 */

import { Slider } from "@ui/components/inputs/index.ts";

interface Positioned {
  posX: number;
  posY: number;
  rotation: number;
}

interface PositionControlsProps {
  layer: Positioned;
  onChange: (updates: Partial<Positioned>) => void;
  /** Off for layers where rotation has no visible effect (a radial glow). */
  rotation?: boolean;
}

export function PositionControls(
  { layer, onChange, rotation = true }: PositionControlsProps,
) {
  return (
    <>
      <Slider
        label="Position X"
        value={layer.posX}
        onChange={(v) => onChange({ posX: v })}
        min={0}
        max={100}
        step={1}
        unit="%"
      />
      <Slider
        label="Position Y"
        value={layer.posY}
        onChange={(v) => onChange({ posY: v })}
        min={0}
        max={100}
        step={1}
        unit="%"
      />
      {rotation && (
        <Slider
          label="Rotation"
          value={layer.rotation}
          onChange={(v) => onChange({ rotation: v })}
          min={-180}
          max={180}
          step={1}
          unit="°"
        />
      )}
    </>
  );
}

/**
 * Opacity on the one scale: the layer stores 0–1, the slider shows whole
 * percent. Half the editors used to show 0–1 with a 0.01 step.
 */
export function OpacitySlider(
  { value, onChange }: {
    value: number | undefined;
    onChange: (opacity: number) => void;
  },
) {
  return (
    <Slider
      label="Opacity"
      value={Math.round((value ?? 1) * 100)}
      onChange={(v) => onChange(v / 100)}
      min={0}
      max={100}
      step={1}
      unit="%"
    />
  );
}
