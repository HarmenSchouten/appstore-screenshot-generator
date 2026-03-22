/**
 * ThemeEditor Modal Component
 *
 * Modal for editing theme colors, gradients, and typography.
 */

import { useState } from "react";
import { ColorInput } from "../inputs/ColorInput";
import type { Config } from "../../types";

// Constants imported from lib
const GRADIENT_TEMPLATES = [
  { id: "solid-primary", name: "Solid Primary", template: "{primary}" },
  { id: "solid-secondary", name: "Solid Secondary", template: "{secondary}" },
  {
    id: "primary-dark",
    name: "Primary to Dark",
    template: "linear-gradient(135deg, {primary} 0%, #0a0a0a 100%)",
  },
  {
    id: "primary-secondary",
    name: "Primary to Secondary",
    template: "linear-gradient(135deg, {primary} 0%, {secondary} 100%)",
  },
  {
    id: "secondary-primary",
    name: "Secondary to Primary",
    template: "linear-gradient(135deg, {secondary} 0%, {primary} 100%)",
  },
  {
    id: "radial-primary",
    name: "Radial Primary",
    template: "radial-gradient(circle at 30% 30%, {primary} 0%, #0a0a0a 70%)",
  },
  {
    id: "radial-secondary",
    name: "Radial Secondary",
    template: "radial-gradient(circle at 30% 30%, {secondary} 0%, #0a0a0a 70%)",
  },
  {
    id: "mesh-primary",
    name: "Mesh Primary",
    template:
      "linear-gradient(135deg, {primary}22 0%, transparent 50%), linear-gradient(225deg, {secondary}22 0%, transparent 50%), #0a0a0a",
  },
  {
    id: "diagonal-split",
    name: "Diagonal Split",
    template:
      "linear-gradient(135deg, {primary} 0%, {primary} 50%, {secondary} 50%, {secondary} 100%)",
  },
  {
    id: "triple-gradient",
    name: "Triple Gradient",
    template:
      "linear-gradient(135deg, {primary} 0%, {secondary} 50%, {accent} 100%)",
  },
];

const DEFAULT_PALETTES = [
  {
    name: "Purple Night",
    palette: { primary: "#a855f7", secondary: "#6366f1", accent: "#ec4899" },
  },
  {
    name: "Ocean Blue",
    palette: { primary: "#3b82f6", secondary: "#06b6d4", accent: "#22c55e" },
  },
  {
    name: "Sunset",
    palette: { primary: "#f97316", secondary: "#ef4444", accent: "#f59e0b" },
  },
  {
    name: "Forest",
    palette: { primary: "#22c55e", secondary: "#14b8a6", accent: "#84cc16" },
  },
  {
    name: "Rose",
    palette: { primary: "#ec4899", secondary: "#f43f5e", accent: "#a855f7" },
  },
  {
    name: "Midnight",
    palette: { primary: "#6366f1", secondary: "#8b5cf6", accent: "#3b82f6" },
  },
  {
    name: "Ember",
    palette: { primary: "#ef4444", secondary: "#f97316", accent: "#fbbf24" },
  },
  {
    name: "Teal",
    palette: { primary: "#14b8a6", secondary: "#06b6d4", accent: "#22c55e" },
  },
];

function applyPaletteToGradient(
  template: string,
  palette: { primary: string; secondary: string; accent: string },
): string {
  return template
    .replace(/\{primary\}/g, palette.primary)
    .replace(/\{secondary\}/g, palette.secondary)
    .replace(/\{accent\}/g, palette.accent);
}

interface ThemeEditorModalProps {
  config: Config;
  onClose: () => void;
  onSave: (newConfig: Config) => void;
}

export function ThemeEditorModal(
  { config, onClose, onSave }: ThemeEditorModalProps,
) {
  const defaultPalette = {
    primary: "#a855f7",
    secondary: "#6366f1",
    accent: "#ec4899",
  };
  const currentPalette = config.palette || defaultPalette;
  const currentGradient = config.theme?.background?.gradient || "";

  // Detect which gradient template matches current gradient
  const detectSelectedGradient = () => {
    for (const t of GRADIENT_TEMPLATES) {
      const css = applyPaletteToGradient(t.template, currentPalette);
      if (css === currentGradient) {
        return t.id;
      }
    }
    return "custom";
  };

  const [palette, setPalette] = useState(currentPalette);
  const [selectedGradient, setSelectedGradient] = useState(
    detectSelectedGradient,
  );
  const [customGradient, setCustomGradient] = useState(currentGradient);
  const [fontFamily, setFontFamily] = useState(
    config.theme?.fontFamily || "Inter, sans-serif",
  );
  const [googleFontsUrl, setGoogleFontsUrl] = useState(
    config.theme?.googleFontsUrl || "",
  );

  // Generate gradients from palette
  const gradients = GRADIENT_TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    css: applyPaletteToGradient(t.template, palette),
  }));

  const updatePalette = (updates: Partial<typeof palette>) => {
    setPalette((p) => ({ ...p, ...updates }));
  };

  const handleSave = () => {
    const gradient = selectedGradient === "custom"
      ? customGradient
      : gradients.find((g) => g.id === selectedGradient)?.css || customGradient;

    onSave({
      ...config,
      palette,
      theme: {
        ...config.theme,
        background: { gradient },
        fontFamily,
        googleFontsUrl: googleFontsUrl || undefined,
      },
    });
  };

  const applyPreset = (presetPalette: typeof palette) => {
    setPalette(presetPalette);
  };

  const currentPreviewGradient = selectedGradient === "custom"
    ? customGradient
    : gradients.find((g) => g.id === selectedGradient)?.css || "";

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="font-bold text-lg">
            <i className="fa-solid fa-palette mr-2" />
            Theme & Colors
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xl"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Color Palette Section */}
          <div>
            <h3 className="text-sm font-medium mb-3">Color Palette</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Primary
                </label>
                <ColorInput
                  value={palette.primary}
                  onChange={(v) => updatePalette({ primary: v })}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Secondary
                </label>
                <ColorInput
                  value={palette.secondary}
                  onChange={(v) => updatePalette({ secondary: v })}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Accent
                </label>
                <ColorInput
                  value={palette.accent}
                  onChange={(v) => updatePalette({ accent: v })}
                />
              </div>
            </div>

            {/* Preset Palettes */}
            <div className="mt-4">
              <label className="text-xs text-zinc-500 block mb-2">
                Preset Palettes
              </label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_PALETTES.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.palette)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded text-xs bg-zinc-800 hover:bg-zinc-700"
                    title={preset.name}
                  >
                    <div className="flex">
                      <div
                        className="w-3 h-3 rounded-l"
                        style={{ background: preset.palette.primary }}
                      />
                      <div
                        className="w-3 h-3"
                        style={{ background: preset.palette.secondary }}
                      />
                      <div
                        className="w-3 h-3 rounded-r"
                        style={{ background: preset.palette.accent }}
                      />
                    </div>
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Background Gradient Section */}
          <div>
            <h3 className="text-sm font-medium mb-3">Background Gradient</h3>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {gradients.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGradient(g.id)}
                  className={`p-1 rounded border-2 ${
                    selectedGradient === g.id
                      ? "border-indigo-500"
                      : "border-transparent hover:border-zinc-600"
                  }`}
                >
                  <div className="h-12 rounded" style={{ background: g.css }} />
                  <div className="text-xs text-zinc-400 mt-1 truncate">
                    {g.name}
                  </div>
                </button>
              ))}
              <button
                onClick={() => setSelectedGradient("custom")}
                className={`p-1 rounded border-2 ${
                  selectedGradient === "custom"
                    ? "border-indigo-500"
                    : "border-transparent hover:border-zinc-600"
                }`}
              >
                <div className="h-12 rounded bg-zinc-800 flex items-center justify-center">
                  <i className="fa-solid fa-code text-zinc-500" />
                </div>
                <div className="text-xs text-zinc-400 mt-1">Custom</div>
              </button>
            </div>

            {selectedGradient === "custom" && (
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Custom CSS Gradient
                </label>
                <input
                  type="text"
                  value={customGradient}
                  onInput={(e) =>
                    setCustomGradient((e.target as HTMLInputElement).value)}
                  className="w-full px-3 py-2 rounded text-sm font-mono bg-zinc-800 border border-zinc-700"
                  placeholder="linear-gradient(135deg, #a855f7 0%, #0a0a0a 100%)"
                />
                <div
                  className="mt-2 h-16 rounded"
                  style={{ background: customGradient }}
                />
              </div>
            )}

            {/* Preview */}
            <div className="mt-3">
              <label className="text-xs text-zinc-500 block mb-1">
                Preview
              </label>
              <div
                className="h-20 rounded"
                style={{ background: currentPreviewGradient }}
              />
            </div>
          </div>

          {/* Typography Section */}
          <div>
            <h3 className="text-sm font-medium mb-3">Typography</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Font Family
                </label>
                <input
                  type="text"
                  value={fontFamily}
                  onInput={(e) =>
                    setFontFamily((e.target as HTMLInputElement).value)}
                  className="w-full px-3 py-2 rounded text-sm bg-zinc-800 border border-zinc-700"
                  placeholder="Inter, sans-serif"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Google Fonts URL (optional)
                </label>
                <input
                  type="text"
                  value={googleFontsUrl}
                  onInput={(e) =>
                    setGoogleFontsUrl((e.target as HTMLInputElement).value)}
                  className="w-full px-3 py-2 rounded text-sm font-mono bg-zinc-800 border border-zinc-700"
                  placeholder="@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm"
          >
            <i className="fa-solid fa-check mr-1" /> Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
}
