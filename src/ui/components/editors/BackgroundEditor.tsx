/**
 * BackgroundEditor — edit gradient type, color stops, and direction.
 *
 * Empty values inherit from the project theme; editing overrides them.
 * "Reset to theme" clears all overrides.
 */

import { useCallback, useMemo } from "react";
import type { BackgroundLayerProps } from "@types";
import type { GradientType } from "@renderer/layers/BackgroundLayer.tsx";
import { buildGradientCSS } from "@renderer/layers/BackgroundLayer.tsx";
import { useAppStore } from "@ui/store/index.ts";
import { ColorInput, Slider } from "@ui/components/inputs/index.ts";

interface BackgroundEditorProps {
  layer: BackgroundLayerProps;
  onUpdate: (updates: Partial<BackgroundLayerProps>) => void;
}

const GRADIENT_TYPES: { value: GradientType; label: string; icon: string }[] = [
  { value: "solid", label: "Solid", icon: "fa-solid fa-square" },
  { value: "linear", label: "Linear", icon: "fa-solid fa-arrow-right-long" },
  { value: "radial", label: "Radial", icon: "fa-solid fa-circle" },
];

const DIRECTION_PRESETS = [
  { deg: 0, icon: "fa-solid fa-arrow-up" },
  {
    deg: 45,
    icon: "fa-solid fa-arrow-up fa-rotate-by",
    style: { "--fa-rotate-angle": "45deg" } as React.CSSProperties,
  },
  { deg: 90, icon: "fa-solid fa-arrow-right" },
  {
    deg: 135,
    icon: "fa-solid fa-arrow-down fa-rotate-by",
    style: { "--fa-rotate-angle": "-45deg" } as React.CSSProperties,
  },
  { deg: 180, icon: "fa-solid fa-arrow-down" },
  {
    deg: 225,
    icon: "fa-solid fa-arrow-down fa-rotate-by",
    style: { "--fa-rotate-angle": "45deg" } as React.CSSProperties,
  },
  { deg: 270, icon: "fa-solid fa-arrow-left" },
  {
    deg: 315,
    icon: "fa-solid fa-arrow-up fa-rotate-by",
    style: { "--fa-rotate-angle": "-45deg" } as React.CSSProperties,
  },
];

export function BackgroundEditor({ layer, onUpdate }: BackgroundEditorProps) {
  const themeBackground = useAppStore((s) => s.config.theme?.background);

  // Resolve display values (layer overrides or theme fallback)
  const gradientType: GradientType = layer.gradientType ?? "linear";
  const colors: string[] = layer.colors ??
    themeBackground?.colors ?? ["#8b5cf6", "#3b82f6"];
  const direction: number = layer.direction ?? themeBackground?.direction ??
    180;
  const isCustomized = layer.colors !== undefined;

  // Live preview CSS — when inheriting, show the actual theme gradient string
  const previewCSS = useMemo(
    () =>
      isCustomized
        ? buildGradientCSS(gradientType, colors, direction)
        : themeBackground?.gradient ?? "transparent",
    [isCustomized, gradientType, colors, direction, themeBackground?.gradient],
  );

  // Helpers
  const startCustomizing = useCallback(() => {
    // Copy resolved theme values into the layer so the user edits from there
    const themeColors = themeBackground?.colors ?? ["#8b5cf6", "#3b82f6"];
    const themeDirection = themeBackground?.direction ?? 180;
    onUpdate({
      gradientType: "linear",
      colors: [...themeColors],
      direction: themeDirection,
    });
  }, [themeBackground, onUpdate]);

  const setType = useCallback(
    (t: GradientType) => onUpdate({ gradientType: t, colors, direction }),
    [colors, direction, onUpdate],
  );

  const setDirection = useCallback(
    (d: number) => onUpdate({ direction: d, colors, gradientType }),
    [colors, gradientType, onUpdate],
  );

  const setColor = useCallback(
    (index: number, color: string) => {
      const next = [...colors];
      next[index] = color;
      onUpdate({ colors: next, direction, gradientType });
    },
    [colors, direction, gradientType, onUpdate],
  );

  const addColor = useCallback(() => {
    const last = colors[colors.length - 1] ?? "#000000";
    onUpdate({ colors: [...colors, last], direction, gradientType });
  }, [colors, direction, gradientType, onUpdate]);

  const removeColor = useCallback(
    (index: number) => {
      if (colors.length <= 1) return;
      onUpdate({
        colors: colors.filter((_, i) => i !== index),
        direction,
        gradientType,
      });
    },
    [colors, direction, gradientType, onUpdate],
  );

  const resetToTheme = useCallback(() => {
    onUpdate({
      gradient: undefined,
      gradientType: undefined,
      colors: undefined,
      direction: undefined,
    });
  }, [onUpdate]);

  return (
    <div className="space-y-5">
      {/* Preview bar */}
      <div>
        <label className="text-xs text-zinc-500 block mb-1.5">Preview</label>
        <div
          className="h-12 rounded-lg border border-zinc-700/60"
          style={{ background: previewCSS }}
        />
      </div>

      {!isCustomized
        ? (
          /* ── Theme-inherited state ─────────────────────────── */
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <i className="fa-solid fa-link text-[10px]" />
              Using global theme
            </div>
            <button
              onClick={startCustomizing}
              className="w-full py-2.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-pen text-[10px]" />
              Customize background
            </button>
          </div>
        )
        : (
          /* ── Custom editor controls ────────────────────────── */
          <>
            {/* Gradient type */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1.5">Type</label>
              <div className="grid grid-cols-3 gap-1 bg-zinc-800 rounded-lg p-1">
                {GRADIENT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      gradientType === t.value
                        ? "bg-zinc-700 text-zinc-100"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <i className={`${t.icon} text-[10px]`} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color stops */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-zinc-500">Colors</label>
                <button
                  onClick={addColor}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <i className="fa-solid fa-plus mr-1 text-[10px]" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {colors.map((color, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1">
                      <ColorInput
                        value={color}
                        onChange={(c: string) =>
                          setColor(i, c)}
                      />
                    </div>
                    {colors.length > 1 && (
                      <button
                        onClick={() => removeColor(i)}
                        className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                      >
                        <i className="fa-solid fa-xmark text-xs" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Direction (linear only) */}
            {gradientType === "linear" && (
              <div>
                <Slider
                  label="Direction"
                  value={direction}
                  onChange={setDirection}
                  min={0}
                  max={360}
                  step={1}
                  unit="°"
                />
                <div className="flex gap-1 mt-2">
                  {DIRECTION_PRESETS.map((p) => (
                    <button
                      key={p.deg}
                      onClick={() => setDirection(p.deg)}
                      className={`flex-1 py-1.5 rounded text-xs transition-colors flex items-center justify-center ${
                        direction === p.deg
                          ? "bg-zinc-700 text-zinc-200"
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      <i className={p.icon} style={p.style} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Opacity */}
            <Slider
              label="Opacity"
              value={layer.opacity}
              onChange={(v: number) => onUpdate({ opacity: v })}
              min={0}
              max={1}
              step={0.01}
            />

            {/* Reset to theme */}
            <button
              onClick={resetToTheme}
              className="w-full py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 border border-zinc-700/60 hover:border-zinc-600 transition-colors"
            >
              <i className="fa-solid fa-rotate-left mr-1.5" />
              Reset to theme
            </button>
          </>
        )}
    </div>
  );
}
