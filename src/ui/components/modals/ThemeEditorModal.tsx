/**
 * ThemeEditor Modal Component
 *
 * Modal for editing theme colors, gradients, and typography.
 */

import { useState } from "react";
import { ColorInput } from "@ui/components/inputs/ColorInput.tsx";
import {
  Modal,
  ModalBody,
  ModalFooter,
} from "@ui/components/primitives/index.ts";
import type { Config } from "@ui/types.ts";
import { useAppStore } from "@ui/store/index.ts";
import {
  applyPaletteToGradient,
  DEFAULT_PALETTES,
  GRADIENT_TEMPLATES,
} from "@lib";
import { cn } from "@ui/utils/cn.ts";

interface ThemeEditorModalProps {
  onClose: () => void;
  onSave: (newConfig: Config) => void;
}

export function ThemeEditorModal({ onClose, onSave }: ThemeEditorModalProps) {
  // Read here rather than take a prop: this modal only mounts while it is
  // open, so App no longer has to subscribe to the whole config for it (#64).
  const config = useAppStore((s) => s.config);

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

    // Merge onto the store's current config, not this render's: a save that
    // lands while the modal is open (auto-save retry, another edit) must not
    // be overwritten with a stale snapshot (#65)
    const current = useAppStore.getState().config;
    onSave({
      ...current,
      palette,
      theme: {
        ...current.theme,
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
    <Modal
      title="Theme & Colors"
      icon="fa-solid fa-palette"
      size="xl"
      onClose={onClose}
    >
      <ModalBody className="space-y-6 pt-1">
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
                  type="button"
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
                type="button"
                key={g.id}
                onClick={() => setSelectedGradient(g.id)}
                className={cn(
                  "p-1 rounded border-2",
                  selectedGradient === g.id
                    ? "border-indigo-500"
                    : "border-transparent hover:border-zinc-600",
                )}
              >
                <div className="h-12 rounded" style={{ background: g.css }} />
                <div className="text-xs text-zinc-400 mt-1 truncate">
                  {g.name}
                </div>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelectedGradient("custom")}
              className={cn(
                "p-1 rounded border-2",
                selectedGradient === "custom"
                  ? "border-indigo-500"
                  : "border-transparent hover:border-zinc-600",
              )}
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
                className="input font-mono"
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
                className="input"
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
                className="input font-mono"
                placeholder="@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');"
              />
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm"
        >
          <i className="fa-solid fa-check mr-1" /> Apply Theme
        </button>
      </ModalFooter>
    </Modal>
  );
}
