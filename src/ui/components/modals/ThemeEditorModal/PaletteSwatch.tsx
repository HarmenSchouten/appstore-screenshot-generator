/**
 * PaletteSwatch — one preset palette: its three colours as a joined strip,
 * then its name.
 */

import type { ColorPalette } from "@app-types";
import { cn } from "@ui/utils/cn.ts";
import { PALETTE_KEYS } from "./PaletteSection.tsx";

/** Only the ends of the strip are rounded. */
const SWATCH_ROUNDING: Record<keyof ColorPalette, string> = {
  primary: "rounded-l",
  secondary: "",
  accent: "rounded-r",
};

interface PaletteSwatchProps {
  name: string;
  palette: ColorPalette;
  onSelect: () => void;
}

export function PaletteSwatch({ name, palette, onSelect }: PaletteSwatchProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex items-center gap-2 px-3 py-1.5 rounded text-xs bg-zinc-800 hover:bg-zinc-700"
      title={name}
    >
      <div className="flex">
        {PALETTE_KEYS.map((key) => (
          <div
            key={key}
            className={cn("w-3 h-3", SWATCH_ROUNDING[key])}
            style={{ background: palette[key] }}
          />
        ))}
      </div>
      {name}
    </button>
  );
}
