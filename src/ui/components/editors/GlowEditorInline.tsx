/**
 * GlowEditorInline Component
 * 
 * Inline editor for managing background glows.
 */

import { NumberInput, ColorInput } from '../inputs/index';
import type { Glow, Palette } from '../../types';

interface GlowEditorInlineProps {
  glows: Glow[];
  onChange: (glows: Glow[]) => void;
  palette?: Palette;
}

// Glow color constants for backwards compatibility
const GLOW_COLORS: Record<string, string> = {
  purple: '#a855f7',
  blue: '#6366f1',
  pink: '#ec4899',
  orange: '#f97316',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#eab308',
  cyan: '#06b6d4',
};

export function GlowEditorInline({ glows = [], onChange, palette }: GlowEditorInlineProps) {
  const defaultPalette = { primary: '#a855f7', secondary: '#6366f1', accent: '#ec4899' };
  const p = palette || defaultPalette;

  const addGlow = () => {
    // Use palette primary color as default
    onChange([...glows, { color: p.primary, size: 400, top: '20%', left: '20%' }]);
  };

  const updateGlow = (index: number, updates: Partial<Glow>) => {
    const newGlows = [...glows];
    newGlows[index] = { ...newGlows[index], ...updates };
    onChange(newGlows);
  };

  const removeGlow = (index: number) => {
    onChange(glows.filter((_, i) => i !== index));
  };

  // Get current color value (for color picker)
  const getColorValue = (color: string) => {
    if (color.startsWith('#')) return color;
    return GLOW_COLORS[color] || '#a855f7';
  };

  return (
    <div className="space-y-3">
      {glows.map((glow, i) => (
        <div key={i} className="p-3 bg-zinc-800/50 rounded space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-400">Glow {i + 1}</span>
            <button
              onClick={() => removeGlow(i)}
              className="text-zinc-500 hover:text-red-400"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Color</label>
              <ColorInput
                value={getColorValue(glow.color)}
                onChange={(v) => updateGlow(i, { color: v })}
                palette={p}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Size</label>
              <NumberInput
                value={glow.size}
                onChange={(v) => updateGlow(i, { size: v })}
                min={50}
                max={1000}
                step={50}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(['top', 'right', 'bottom', 'left'] as const).map((pos) => (
              <div key={pos}>
                <label className="text-xs text-zinc-500 block mb-1">{pos}</label>
                <input
                  type="text"
                  value={glow[pos] || ''}
                  onInput={(e) => updateGlow(i, { [pos]: (e.target as HTMLInputElement).value || undefined })}
                  placeholder="-"
                  className="w-full px-2 py-1 rounded text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <button
        onClick={addGlow}
        className="w-full py-2 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600"
      >
        <i className="fa-solid fa-plus mr-1" /> Add Glow Effect
      </button>
    </div>
  );
}
