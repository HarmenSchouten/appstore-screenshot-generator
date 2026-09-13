/**
 * BackgroundEditor — edit gradient type, color stops, and direction.
 *
 * Visual controls are always shown. A CSS field below auto-updates from
 * the visual controls and can also be edited directly for full control.
 *
 * Empty values inherit from the project theme; editing overrides them.
 * "Reset to theme" clears all overrides.
 */

import type { BackgroundLayerProps } from "@app-types";
import {
  buildGradientCSS,
  DEFAULT_GRADIENT_DIRECTION,
  type GradientParts,
  type GradientType,
  parseGradientCSS,
} from "@lib";
import { useAppStore } from "@ui/store/index.ts";
import { SegmentedControl } from "@ui/components/inputs/index.ts";
import { OpacitySlider } from "../PositionControls.tsx";
import { ColorStopList } from "./ColorStopList.tsx";
import { DirectionPicker } from "./DirectionPicker.tsx";
import { GradientCSSField } from "./GradientCSSField.tsx";

interface BackgroundEditorProps {
  layer: BackgroundLayerProps;
  onUpdate: (updates: Partial<BackgroundLayerProps>) => void;
}

const GRADIENT_TYPES: { value: GradientType; label: string; icon: string }[] = [
  { value: "solid", label: "Solid", icon: "fa-solid fa-square" },
  { value: "linear", label: "Linear", icon: "fa-solid fa-arrow-right-long" },
  { value: "radial", label: "Radial", icon: "fa-solid fa-circle" },
];

/** Only used when the theme has no background to start from. */
const DEFAULT_COLORS = ["#8b5cf6", "#3b82f6"];

/** No override at all: the layer renders the theme background. */
const THEME_INHERITED: Partial<BackgroundLayerProps> = {
  gradient: undefined,
  gradientType: undefined,
  colors: undefined,
  direction: undefined,
};

export function BackgroundEditor({ layer, onUpdate }: BackgroundEditorProps) {
  const themeCSS = useAppStore(
    (s) => s.config.theme?.background?.gradient?.trim() ?? "",
  );

  // ── Resolve display values ────────────────────────────────
  const parts: GradientParts = {
    gradientType: layer.gradientType ?? "linear",
    colors: layer.colors ?? DEFAULT_COLORS,
    direction: layer.direction ?? DEFAULT_GRADIENT_DIRECTION,
  };
  const isCustomized = layer.colors !== undefined ||
    layer.gradient !== undefined;
  // Is the raw CSS field driving the output? (user typed custom CSS)
  const isCSSDriven = layer.gradient !== undefined;

  const cssFromVisual = buildGradientCSS(
    parts.gradientType,
    parts.colors,
    parts.direction,
  );
  const previewCSS = !isCustomized
    ? themeCSS || "transparent"
    : isCSSDriven
    ? layer.gradient || "transparent"
    : cssFromVisual;

  // ── Handlers ──────────────────────────────────────────────
  // A visual edit writes all three parts and clears the raw override, so
  // the controls drive the output again
  const setParts = (patch: Partial<GradientParts>) =>
    onUpdate({ ...parts, ...patch, gradient: undefined });

  const commitCSS = (text: string) => {
    const trimmed = text.trim();
    // Unchanged from the visual output: just clear any override
    if (trimmed === cssFromVisual) {
      onUpdate({ gradient: undefined });
      return;
    }
    if (!trimmed) return;
    // Decomposable into the visual controls, or kept as a raw override
    const parsed = parseGradientCSS(trimmed);
    onUpdate(
      parsed ? { gradient: undefined, ...parsed } : { gradient: trimmed },
    );
  };

  // Start from what the layer shows right now, i.e. the theme gradient:
  // decomposed into stops when the visual controls can express it, kept as
  // raw CSS when they cannot (positional stops, radial shapes, layered
  // backgrounds) so customizing never silently changes the rendering (#65).
  const startCustomizing = () => {
    const parsed = parseGradientCSS(themeCSS);
    if (parsed) {
      onUpdate({ gradient: undefined, ...parsed });
    } else if (themeCSS) {
      onUpdate({ ...THEME_INHERITED, gradient: themeCSS });
    } else {
      onUpdate({
        gradient: undefined,
        gradientType: "linear",
        colors: [...DEFAULT_COLORS],
        direction: DEFAULT_GRADIENT_DIRECTION,
      });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs text-zinc-500 block mb-1.5">Preview</label>
        <div
          className="h-12 rounded-lg border border-zinc-700/60"
          style={{ background: previewCSS }}
        />
      </div>

      {!isCustomized
        ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <i className="fa-solid fa-link text-[10px]" />
              Using global theme
            </div>
            <button
              type="button"
              onClick={startCustomizing}
              className="w-full py-2.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-pen text-[10px]" />
              Customize background
            </button>
          </div>
        )
        : (
          <>
            <SegmentedControl
              label="Type"
              options={GRADIENT_TYPES}
              value={parts.gradientType}
              onChange={(gradientType) => setParts({ gradientType })}
            />

            <ColorStopList
              colors={parts.colors}
              onChange={(colors) => setParts({ colors })}
            />

            {parts.gradientType === "linear" && (
              <DirectionPicker
                value={parts.direction}
                onChange={(direction) => setParts({ direction })}
              />
            )}

            <GradientCSSField
              css={isCSSDriven ? layer.gradient ?? "" : cssFromVisual}
              isOverride={isCSSDriven}
              onCommit={commitCSS}
            />

            <OpacitySlider
              value={layer.opacity}
              onChange={(v) => onUpdate({ opacity: v })}
            />

            <button
              type="button"
              onClick={() => onUpdate(THEME_INHERITED)}
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
