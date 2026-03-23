/**
 * BackgroundEditor — edit gradient type, color stops, and direction.
 *
 * Visual controls are always shown. A CSS field below auto-updates from
 * the visual controls and can also be edited directly for full control.
 *
 * Empty values inherit from the project theme; editing overrides them.
 * "Reset to theme" clears all overrides.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { BackgroundLayerProps } from "@types";
import type { GradientType } from "@renderer/layers/BackgroundLayer.tsx";
import { buildGradientCSS } from "@renderer/layers/BackgroundLayer.tsx";
import { useAppStore } from "@ui/store/index.ts";
import {
  ColorInput,
  SegmentedControl,
  Slider,
} from "@ui/components/inputs/index.ts";

interface BackgroundEditorProps {
  layer: BackgroundLayerProps;
  onUpdate: (updates: Partial<BackgroundLayerProps>) => void;
}

/** Try to decompose a CSS background string into visual control values. */
function parseGradientCSS(
  css: string,
): { gradientType: GradientType; colors: string[]; direction: number } | null {
  const trimmed = css.trim();
  if (!trimmed) return null;

  // linear-gradient(<deg>deg, <color>, ...)
  const linearRe = /^linear-gradient\(\s*(\d+(?:\.\d+)?)deg\s*,\s*(.+)\)$/i;
  const linearMatch = trimmed.match(linearRe);
  if (linearMatch) {
    const direction = Math.round(Number(linearMatch[1])) % 360;
    const colors = linearMatch[2].split(",").map((c) => c.trim()).filter(Boolean);
    if (colors.length >= 1) return { gradientType: "linear", colors, direction };
  }

  // radial-gradient(circle, <color>, ...)
  const radialRe = /^radial-gradient\(\s*circle\s*,\s*(.+)\)$/i;
  const radialMatch = trimmed.match(radialRe);
  if (radialMatch) {
    const colors = radialMatch[1].split(",").map((c) => c.trim()).filter(Boolean);
    if (colors.length >= 1) return { gradientType: "radial", colors, direction: 180 };
  }

  // Bare color value (hex, rgb, hsl, named)
  const colorRe = /^(#[\da-f]{3,8}|rgba?\(.+\)|hsla?\(.+\)|[a-z]+)$/i;
  if (colorRe.test(trimmed)) {
    return { gradientType: "solid", colors: [trimmed], direction: 180 };
  }

  return null;
}

const GRADIENT_TYPES: { value: GradientType; label: string; icon: string }[] = [
  { value: "solid", label: "Solid", icon: "fa-solid fa-square" },
  { value: "linear", label: "Linear", icon: "fa-solid fa-arrow-right-long" },
  { value: "radial", label: "Radial", icon: "fa-solid fa-circle" },
];

// ── Sortable color stop row ──────────────────────────────
function SortableColorStop({
  id,
  color,
  onChange,
  onRemove,
  canRemove,
}: {
  id: string;
  color: string;
  onChange: (c: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    transition: { duration: 200, easing: "cubic-bezier(0.25, 1, 0.5, 1)" },
  });

  const style = {
    transform: transform
      ? `translate3d(${Math.round(transform.x)}px, ${Math.round(transform.y)}px, 0)`
      : undefined,
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 ${
        isDragging ? "opacity-80" : ""
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <i className="fa-solid fa-grip-vertical text-xs" />
      </button>
      <div className="flex-1">
        <ColorInput value={color} onChange={onChange} />
      </div>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-zinc-600 hover:text-red-400 transition-colors p-1"
        >
          <i className="fa-solid fa-xmark text-xs" />
        </button>
      )}
    </div>
  );
}

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // ── Resolve display values ────────────────────────────────
  const gradientType: GradientType = layer.gradientType ?? "linear";
  const colors: string[] = layer.colors ??
    themeBackground?.colors ?? ["#8b5cf6", "#3b82f6"];
  const direction: number = layer.direction ?? themeBackground?.direction ??
    180;
  const isCustomized = layer.colors !== undefined ||
    layer.gradient !== undefined;

  // Is the raw CSS field driving the output? (user typed custom CSS)
  const isCSSDriven = layer.gradient !== undefined;

  // ── Stable IDs for sortable color stops ───────────────────
  // A monotonic counter ensures IDs never collide or recycle.
  const nextColorId = useRef(colors.length);
  const colorStopIds = useRef<string[]>(colors.map((_, i) => String(i)));
  // Keep the ID array in sync with the colors array length.
  // Only add/trim — never regenerate — so existing items keep their ID.
  if (colorStopIds.current.length < colors.length) {
    while (colorStopIds.current.length < colors.length) {
      colorStopIds.current.push(String(nextColorId.current++));
    }
  } else if (colorStopIds.current.length > colors.length) {
    colorStopIds.current = colorStopIds.current.slice(0, colors.length);
  }

  // ── CSS field state ───────────────────────────────────────
  // Local draft avoids a render storm while typing.
  // Synced to the layer on blur.
  const cssFromVisual = useMemo(
    () => buildGradientCSS(gradientType, colors, direction),
    [gradientType, colors, direction],
  );

  const [cssDraft, setCssDraft] = useState(
    layer.gradient ?? cssFromVisual,
  );
  const isFocused = useRef(false);

  // Keep the draft in sync when visual controls change (but not while editing)
  useEffect(() => {
    if (!isFocused.current && !isCSSDriven) {
      setCssDraft(cssFromVisual);
    }
  }, [cssFromVisual, isCSSDriven]);

  // ── Live preview CSS ──────────────────────────────────────
  const previewCSS = useMemo(() => {
    if (!isCustomized) {
      return themeBackground?.gradient ?? "transparent";
    }
    if (isCSSDriven) {
      return layer.gradient || "transparent";
    }
    return cssFromVisual;
  }, [isCustomized, isCSSDriven, layer.gradient, cssFromVisual, themeBackground?.gradient]);

  // ── CSS field handlers ────────────────────────────────────
  const commitCSS = useCallback(() => {
    isFocused.current = false;
    const trimmed = cssDraft.trim();
    // If unchanged from visual output, just clear any override
    if (trimmed === cssFromVisual) {
      onUpdate({ gradient: undefined });
      return;
    }
    if (!trimmed) return;
    // Try to decompose the CSS back into visual controls
    const parsed = parseGradientCSS(trimmed);
    if (parsed) {
      onUpdate({
        gradient: undefined,
        gradientType: parsed.gradientType,
        colors: parsed.colors,
        direction: parsed.direction,
      });
    } else {
      // Not parseable — store as raw CSS override
      onUpdate({ gradient: trimmed });
    }
  }, [cssDraft, cssFromVisual, onUpdate]);

  // ── Visual mode handlers ──────────────────────────────────
  const startCustomizing = useCallback(() => {
    const themeColors = themeBackground?.colors ?? ["#8b5cf6", "#3b82f6"];
    const themeDirection = themeBackground?.direction ?? 180;
    onUpdate({
      gradient: undefined,
      gradientType: "linear",
      colors: [...themeColors],
      direction: themeDirection,
    });
  }, [themeBackground, onUpdate]);

  const setType = useCallback(
    (t: GradientType) =>
      onUpdate({ gradientType: t, colors, direction, gradient: undefined }),
    [colors, direction, onUpdate],
  );

  const setDirection = useCallback(
    (d: number) =>
      onUpdate({ direction: d, colors, gradientType, gradient: undefined }),
    [colors, gradientType, onUpdate],
  );

  const setColor = useCallback(
    (index: number, color: string) => {
      const next = [...colors];
      next[index] = color;
      onUpdate({ colors: next, direction, gradientType, gradient: undefined });
    },
    [colors, direction, gradientType, onUpdate],
  );

  const addColor = useCallback(() => {
    const last = colors[colors.length - 1] ?? "#000000";
    // Push a new stable ID before updating so the ref is ready for the next render
    colorStopIds.current.push(String(nextColorId.current++));
    onUpdate({
      colors: [...colors, last],
      direction,
      gradientType,
      gradient: undefined,
    });
  }, [colors, direction, gradientType, onUpdate]);

  const removeColor = useCallback(
    (index: number) => {
      if (colors.length <= 1) return;
      // Remove the matching stable ID so it stays in sync
      colorStopIds.current.splice(index, 1);
      onUpdate({
        colors: colors.filter((_, i) => i !== index),
        direction,
        gradientType,
        gradient: undefined,
      });
    },
    [colors, direction, gradientType, onUpdate],
  );

  const handleColorDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const ids = colorStopIds.current;
      const oldIndex = ids.indexOf(active.id as string);
      const newIndex = ids.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return;
      // Reorder both the stable IDs and the colors together
      colorStopIds.current = arrayMove(ids, oldIndex, newIndex);
      onUpdate({
        colors: arrayMove([...colors], oldIndex, newIndex),
        direction,
        gradientType,
        gradient: undefined,
      });
    },
    [colors, direction, gradientType, onUpdate],
  );

  const resetToTheme = useCallback(() => {
    setCssDraft("");
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
          /* ── Custom editor controls ────────────────────────── */
          <>
            {/* Gradient type */}
            <SegmentedControl
              label="Type"
              options={GRADIENT_TYPES}
              value={gradientType}
              onChange={setType}
            />

            {/* Color stops */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-zinc-500">Colors</label>
                <button
                  type="button"
                  onClick={addColor}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <i className="fa-solid fa-plus mr-1 text-[10px]" />
                  Add
                </button>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleColorDragEnd}
              >
                <SortableContext
                  items={colorStopIds.current}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {colors.map((color, i) => (
                      <SortableColorStop
                        key={colorStopIds.current[i]}
                        id={colorStopIds.current[i]}
                        color={color}
                        onChange={(c: string) => setColor(i, c)}
                        onRemove={() => removeColor(i)}
                        canRemove={colors.length > 1}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
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
                      type="button"
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

            {/* CSS output — auto-syncs from visual controls, also editable */}
            <div>
              <label className="text-xs text-zinc-500 block mb-1.5">
                CSS
              </label>
              <textarea
                value={cssDraft}
                onChange={(e) => setCssDraft(e.target.value)}
                onFocus={() => { isFocused.current = true; }}
                onBlur={() => { isFocused.current = false; commitCSS(); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    commitCSS();
                  }
                }}
                spellCheck={false}
                rows={2}
                placeholder="linear-gradient(135deg, #a855f7, #0a0a0a)"
                className={`w-full bg-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 font-mono placeholder:text-zinc-600 focus:outline-none resize-y border ${
                  isCSSDriven
                    ? "border-amber-500/50 focus:border-amber-400"
                    : "border-zinc-700/60 focus:border-zinc-500"
                }`}
              />
              {isCSSDriven && (
                <p className="text-[10px] text-amber-500/70 mt-1.5">
                  <i className="fa-solid fa-pen-fancy mr-1" />
                  Custom CSS active — visual controls won't apply until reset.
                </p>
              )}
            </div>

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
              type="button"
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
