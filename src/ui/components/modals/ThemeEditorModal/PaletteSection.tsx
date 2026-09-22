/**
 * PaletteSection — the three palette colours and the preset palettes that
 * fill all three at once.
 */

import type { ColorPalette } from "@app-types";
import { ColorInput } from "@ui/components/inputs/ColorInput.tsx";
import { DEFAULT_PALETTES, PALETTE_KEYS } from "@lib";
import { PaletteSwatch } from "./PaletteSwatch.tsx";

const PALETTE_LABELS: Record<keyof ColorPalette, string> = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
};

interface PaletteSectionProps {
  palette: ColorPalette;
  onChange: (palette: ColorPalette) => void;
}

export function PaletteSection({ palette, onChange }: PaletteSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Color Palette</h3>
      <div className="grid grid-cols-3 gap-4">
        {PALETTE_KEYS.map((key) => (
          <div key={key}>
            <label className="text-xs text-zinc-500 block mb-1">
              {PALETTE_LABELS[key]}
            </label>
            <ColorInput
              value={palette[key]}
              onChange={(v) => onChange({ ...palette, [key]: v })}
            />
          </div>
        ))}
      </div>

      {/* Preset Palettes */}
      <div className="mt-4">
        <label className="text-xs text-zinc-500 block mb-2">
          Preset Palettes
        </label>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_PALETTES.map((preset) => (
            <PaletteSwatch
              key={preset.name}
              name={preset.name}
              palette={preset.palette}
              // Copy: the draft is edited in place by key, DEFAULT_PALETTES must stay pristine
              onSelect={() => onChange({ ...preset.palette })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
