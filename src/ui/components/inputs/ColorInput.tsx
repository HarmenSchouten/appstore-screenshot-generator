/**
 * ColorInput Component
 *
 * Color picker with swatch, hex input, and palette presets.
 */

import { useEffect, useRef, useState } from "react";
import type { Palette } from "../../types";

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  palette?: Palette | null;
  className?: string;
}

const COMMON_COLORS = [
  "#ffffff",
  "#f5f5f5",
  "#d4d4d4",
  "#a3a3a3",
  "#737373",
  "#525252",
  "#262626",
  "#000000",
  "#fef2f2",
  "#fee2e2",
  "#fecaca",
  "#f87171",
  "#ef4444",
  "#dc2626",
  "#b91c1c",
  "#7f1d1d",
  "#fef9c3",
  "#fef08a",
  "#fde047",
  "#facc15",
  "#eab308",
  "#ca8a04",
  "#a16207",
  "#713f12",
  "#dcfce7",
  "#bbf7d0",
  "#86efac",
  "#4ade80",
  "#22c55e",
  "#16a34a",
  "#15803d",
  "#14532d",
  "#e0f2fe",
  "#bae6fd",
  "#7dd3fc",
  "#38bdf8",
  "#0ea5e9",
  "#0284c7",
  "#0369a1",
  "#0c4a6e",
  "#ede9fe",
  "#ddd6fe",
  "#c4b5fd",
  "#a78bfa",
  "#8b5cf6",
  "#7c3aed",
  "#6d28d9",
  "#4c1d95",
  "#fce7f3",
  "#fbcfe8",
  "#f9a8d4",
  "#f472b6",
  "#ec4899",
  "#db2777",
  "#be185d",
  "#9d174d",
];

export function ColorInput({
  value,
  onChange,
  palette = null,
  className = "",
}: ColorInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value || "#ffffff");
  const containerRef = useRef<HTMLDivElement>(null);

  // Update hexInput when value changes externally
  useEffect(() => {
    setHexInput(value || "#ffffff");
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHexInput(newValue);
    // Only update if valid hex
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleHexBlur = () => {
    // Reset to current value if invalid
    if (!/^#[0-9A-Fa-f]{6}$/.test(hexInput)) {
      setHexInput(value || "#ffffff");
    }
  };

  const selectColor = (color: string) => {
    onChange(color);
    setHexInput(color);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-stretch h-8 min-w-0">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 rounded-l border border-zinc-700 hover:border-zinc-500 transition-colors flex-shrink-0"
          style={{ backgroundColor: value || "#ffffff" }}
          title="Click to open color picker"
        />
        <input
          type="text"
          value={hexInput}
          onInput={handleHexChange}
          onBlur={handleHexBlur}
          maxLength={7}
          className="flex-1 min-w-0 px-2 text-sm bg-zinc-800 border-y border-r border-zinc-700 rounded-r focus:outline-none focus:border-indigo-500 font-mono uppercase"
          placeholder="#ffffff"
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 p-3 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl w-64 left-0">
          {palette && (
            <div className="mb-3">
              <div className="text-xs text-zinc-500 mb-1.5">Palette</div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => selectColor(palette.primary)}
                  className="flex-1 h-8 rounded border border-zinc-600 hover:border-zinc-400 transition-colors"
                  style={{ backgroundColor: palette.primary }}
                  title="Primary"
                />
                <button
                  type="button"
                  onClick={() => selectColor(palette.secondary)}
                  className="flex-1 h-8 rounded border border-zinc-600 hover:border-zinc-400 transition-colors"
                  style={{ backgroundColor: palette.secondary }}
                  title="Secondary"
                />
                <button
                  type="button"
                  onClick={() => selectColor(palette.accent)}
                  className="flex-1 h-8 rounded border border-zinc-600 hover:border-zinc-400 transition-colors"
                  style={{ backgroundColor: palette.accent }}
                  title="Accent"
                />
              </div>
            </div>
          )}

          <div>
            <div className="text-xs text-zinc-500 mb-1.5">Colors</div>
            <div className="grid grid-cols-8 gap-1">
              {COMMON_COLORS.map((color) => (
                <button
                  type="button"
                  onClick={() => selectColor(color)}
                  className={`w-6 h-6 rounded border transition-colors ${
                    color === value
                      ? "border-white ring-1 ring-white"
                      : "border-zinc-600 hover:border-zinc-400"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
