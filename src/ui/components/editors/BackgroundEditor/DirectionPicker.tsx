/**
 * DirectionPicker — the linear gradient's angle: a slider plus the eight
 * compass presets.
 */

import type { CSSProperties } from "react";
import { Slider } from "@ui/components/inputs/index.ts";
import { cn } from "@ui/utils/cn.ts";

const rotated = (angle: string): CSSProperties =>
  ({ "--fa-rotate-angle": angle }) as CSSProperties;

const PRESETS: { deg: number; icon: string; style?: CSSProperties }[] = [
  { deg: 0, icon: "fa-solid fa-arrow-up" },
  {
    deg: 45,
    icon: "fa-solid fa-arrow-up fa-rotate-by",
    style: rotated("45deg"),
  },
  { deg: 90, icon: "fa-solid fa-arrow-right" },
  {
    deg: 135,
    icon: "fa-solid fa-arrow-down fa-rotate-by",
    style: rotated("-45deg"),
  },
  { deg: 180, icon: "fa-solid fa-arrow-down" },
  {
    deg: 225,
    icon: "fa-solid fa-arrow-down fa-rotate-by",
    style: rotated("45deg"),
  },
  { deg: 270, icon: "fa-solid fa-arrow-left" },
  {
    deg: 315,
    icon: "fa-solid fa-arrow-up fa-rotate-by",
    style: rotated("-45deg"),
  },
];

interface DirectionPickerProps {
  value: number;
  onChange: (degrees: number) => void;
}

export function DirectionPicker({ value, onChange }: DirectionPickerProps) {
  return (
    <div>
      <Slider
        label="Direction"
        value={value}
        onChange={onChange}
        min={0}
        max={360}
        step={1}
        unit="°"
      />
      <div className="flex gap-1 mt-2">
        {PRESETS.map((p) => (
          <button
            type="button"
            key={p.deg}
            onClick={() => onChange(p.deg)}
            title={`${p.deg}°`}
            className={cn(
              "flex-1 py-1.5 rounded text-xs transition-colors flex items-center justify-center",
              value === p.deg
                ? "bg-zinc-700 text-zinc-200"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800",
            )}
          >
            <i className={p.icon} style={p.style} />
          </button>
        ))}
      </div>
    </div>
  );
}
