/**
 * ShapeEditorInline Component
 *
 * Inline editor for managing decorative shapes with presets.
 */

import { useEffect, useRef, useState } from "react";
import { ColorInput, NumberInput } from "../inputs/index";
import type { Palette, Shape, ShapeType } from "../../types";

interface ShapeEditorInlineProps {
  shapes: Shape[];
  onChange: (shapes: Shape[]) => void;
  palette?: Palette;
}

const SHAPE_TYPES = [
  { value: "circle", label: "Circle", icon: "fa-circle" },
  { value: "ring", label: "Ring", icon: "fa-circle-notch" },
  { value: "rectangle", label: "Rectangle", icon: "fa-square" },
  { value: "pill", label: "Pill", icon: "fa-capsules" },
  { value: "curved-line", label: "Curved Line", icon: "fa-bezier-curve" },
  { value: "s-curve", label: "S-Curve", icon: "fa-wave-square" },
  { value: "wave-line", label: "Wave Line", icon: "fa-water" },
  { value: "chevron", label: "Chevron", icon: "fa-chevron-right" },
  { value: "double-chevron", label: "Double Chevron", icon: "fa-angles-right" },
  { value: "arrow", label: "Arrow", icon: "fa-arrow-right" },
  { value: "triangle", label: "Triangle", icon: "fa-play" },
  { value: "diamond", label: "Diamond", icon: "fa-diamond" },
  { value: "hexagon", label: "Hexagon", icon: "fa-hexagon-nodes" },
  { value: "star", label: "Star", icon: "fa-star" },
  { value: "sparkle", label: "Sparkle", icon: "fa-sparkles" },
  { value: "cross", label: "Cross", icon: "fa-plus" },
  { value: "blob", label: "Blob", icon: "fa-cloud" },
  { value: "crescent", label: "Crescent", icon: "fa-moon" },
  { value: "dots-grid", label: "Dots Grid", icon: "fa-grip" },
  { value: "scattered-dots", label: "Scattered Dots", icon: "fa-ellipsis" },
];

const SHAPE_PRESETS = [
  {
    name: "Nested Rings",
    shapes: [
      {
        type: "ring",
        size: 50,
        color: "#ffffff",
        opacity: 0.08,
        strokeWidth: 2,
        posX: 70,
        posY: 50,
        zIndex: 0,
      },
      {
        type: "ring",
        size: 35,
        color: "#ffffff",
        opacity: 0.12,
        strokeWidth: 1.5,
        posX: 70,
        posY: 50,
        zIndex: 0,
      },
    ],
  },
  {
    name: "Corner Chevron",
    shapes: [
      {
        type: "chevron",
        size: 15,
        color: "#ffffff",
        opacity: 0.2,
        strokeWidth: 3,
        direction: "right",
        posX: 90,
        posY: 20,
        zIndex: 5,
      },
    ],
  },
  {
    name: "Floating Arc",
    shapes: [
      {
        type: "curved-line",
        size: 60,
        color: "#ffffff",
        opacity: 0.15,
        strokeWidth: 2,
        orientation: "horizontal",
        curvature: 30,
        posX: 50,
        posY: 80,
        zIndex: 0,
      },
    ],
  },
  {
    name: "Dot Pattern",
    shapes: [
      {
        type: "dots-grid",
        size: 40,
        color: "#ffffff",
        opacity: 0.1,
        rows: 4,
        columns: 4,
        spacing: 8,
        dotSize: 1,
        posX: 85,
        posY: 15,
        zIndex: 0,
      },
    ],
  },
];

export function ShapeEditorInline(
  { shapes = [], onChange, palette }: ShapeEditorInlineProps,
) {
  const defaultPalette = {
    primary: "#a855f7",
    secondary: "#6366f1",
    accent: "#ec4899",
  };
  const p = palette || defaultPalette;
  const [showPresets, setShowPresets] = useState(false);
  const presetButtonRef = useRef<HTMLButtonElement>(null);
  const presetMenuRef = useRef<HTMLDivElement>(null);
  const [presetMenuStyle, setPresetMenuStyle] = useState<
    Record<string, string>
  >({});

  const addShape = (type: ShapeType = "ring") => {
    const newShape: Shape = {
      type,
      size: 30,
      color: p.primary,
      opacity: 0.15,
      strokeWidth: 2,
      filled: false,
      posX: 50,
      posY: 50,
      zIndex: 5,
    };
    onChange([...shapes, newShape]);
  };

  const addPreset = (preset: typeof SHAPE_PRESETS[0]) => {
    onChange([...shapes, ...preset.shapes.map((s) => ({ ...s } as Shape))]);
    setShowPresets(false);
  };

  const updateShape = (index: number, updates: Partial<Shape>) => {
    const newShapes = [...shapes];
    newShapes[index] = { ...newShapes[index], ...updates };
    onChange(newShapes);
  };

  const removeShape = (index: number) => {
    onChange(shapes.filter((_, i) => i !== index));
  };

  const duplicateShape = (index: number) => {
    const newShapes = [...shapes];
    const copy = { ...newShapes[index] };
    copy.posX = ((copy.posX ?? 50) + 5) % 100;
    copy.posY = ((copy.posY ?? 50) + 5) % 100;
    newShapes.splice(index + 1, 0, copy);
    onChange(newShapes);
  };

  const updatePresetMenuPosition = () => {
    if (!presetButtonRef.current) return;

    const rect = presetButtonRef.current.getBoundingClientRect();
    const menuWidth = Math.max(rect.width, 260);
    const horizontalPadding = 8;
    const verticalGap = 6;
    const estimatedMenuHeight = Math.min(320, 40 + SHAPE_PRESETS.length * 46);
    const spaceBelow = innerHeight - rect.bottom;
    const openUp = spaceBelow < estimatedMenuHeight && rect.top > spaceBelow;

    const left = Math.min(
      Math.max(horizontalPadding, rect.left),
      innerWidth - menuWidth - horizontalPadding,
    );

    setPresetMenuStyle({
      position: "fixed",
      zIndex: "60",
      left: left + "px",
      width: menuWidth + "px",
      maxHeight: "320px",
      ...(openUp
        ? { bottom: (innerHeight - rect.top + verticalGap) + "px" }
        : { top: (rect.bottom + verticalGap) + "px" }),
    });
  };

  useEffect(() => {
    if (!showPresets) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (presetButtonRef.current?.contains(e.target as Node)) return;
      if (presetMenuRef.current?.contains(e.target as Node)) return;
      setShowPresets(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPresets(false);
    };

    const handleViewportChange = () => updatePresetMenuPosition();

    updatePresetMenuPosition();
    addEventListener("mousedown", handleClickOutside);
    addEventListener("keydown", handleKeyDown);
    addEventListener("resize", handleViewportChange);
    addEventListener("scroll", handleViewportChange, true);

    return () => {
      removeEventListener("mousedown", handleClickOutside);
      removeEventListener("keydown", handleKeyDown);
      removeEventListener("resize", handleViewportChange);
      removeEventListener("scroll", handleViewportChange, true);
    };
  }, [showPresets]);

  const renderShapeControls = (shape: Shape, index: number) => {
    const type = shape.type;
    const isLine = ["curved-line", "s-curve", "wave-line"].includes(type);
    const isChevron = ["chevron", "double-chevron", "arrow"].includes(type);
    const isStar = ["star", "sparkle"].includes(type);
    const isPattern = ["dots-grid", "scattered-dots"].includes(type);
    const isBlob = type === "blob";
    const isCrescent = type === "crescent";
    const hasFill = !isLine && !isChevron;
    const hasStroke = [
      "ring",
      "rectangle",
      "pill",
      "curved-line",
      "s-curve",
      "wave-line",
      "chevron",
      "double-chevron",
      "arrow",
      "triangle",
      "diamond",
      "hexagon",
      "star",
      "sparkle",
      "cross",
    ].includes(type);

    return (
      <>
        {/* Basic Controls */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Color</label>
            <ColorInput
              value={shape.color || "#ffffff"}
              onChange={(v) => updateShape(index, { color: v })}
              palette={p}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Size %</label>
            <NumberInput
              value={shape.size ?? 30}
              onChange={(v) => updateShape(index, { size: v })}
              min={1}
              max={500}
              step={5}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Opacity</label>
            <input
              type="range"
              value={(shape.opacity ?? 0.2) * 100}
              onInput={(e) =>
                updateShape(index, {
                  opacity: Number((e.target as HTMLInputElement).value) / 100,
                })}
              min="0"
              max="100"
              className="w-full"
            />
            <div className="text-xs text-zinc-500 text-center">
              {Math.round((shape.opacity ?? 0.2) * 100)}%
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Blur</label>
            <NumberInput
              value={shape.blur ?? 0}
              onChange={(v) => updateShape(index, { blur: v })}
              min={0}
              max={50}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Z-Index</label>
            <select
              value={shape.zIndex ?? 5}
              onChange={(e) =>
                updateShape(index, {
                  zIndex: Number((e.target as HTMLSelectElement).value),
                })}
              className="w-full h-8 px-2 rounded text-sm bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-indigo-500"
            >
              <option value={0}>Behind (0)</option>
              <option value={5}>Default (5)</option>
              <option value={10}>Front (10)</option>
              <option value={15}>Above All (15)</option>
            </select>
          </div>
        </div>

        {/* Position Controls */}
        <div className="space-y-2">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">
              X Position{" "}
              <span className="text-zinc-600">(← 0 | 50 center | 100 →)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                value={shape.posX ?? 50}
                onInput={(e) =>
                  updateShape(index, {
                    posX: Number((e.target as HTMLInputElement).value),
                  })}
                min="0"
                max="100"
                className="flex-1"
              />
              <input
                type="number"
                value={shape.posX ?? 50}
                onInput={(e) =>
                  updateShape(index, {
                    posX: Number((e.target as HTMLInputElement).value),
                  })}
                min={0}
                max={100}
                className="w-14 px-1 py-0.5 rounded text-xs text-center"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">
              Y Position{" "}
              <span className="text-zinc-600">(↑ 0 | 50 center | 100 ↓)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                value={shape.posY ?? 50}
                onInput={(e) =>
                  updateShape(index, {
                    posY: Number((e.target as HTMLInputElement).value),
                  })}
                min="0"
                max="100"
                className="flex-1"
              />
              <input
                type="number"
                value={shape.posY ?? 50}
                onInput={(e) =>
                  updateShape(index, {
                    posY: Number((e.target as HTMLInputElement).value),
                  })}
                min={0}
                max={100}
                className="w-14 px-1 py-0.5 rounded text-xs text-center"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Rotation</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                value={shape.rotation ?? 0}
                onInput={(e) =>
                  updateShape(index, {
                    rotation: Number((e.target as HTMLInputElement).value),
                  })}
                min="-180"
                max="180"
                className="flex-1"
              />
              <span className="text-xs text-zinc-400 w-10">
                {shape.rotation ?? 0}°
              </span>
            </div>
          </div>
          {hasFill && (
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Style</label>
              <div className="flex gap-1">
                <button
                  onClick={() => updateShape(index, { filled: false })}
                  className={`flex-1 px-2 py-1 rounded text-xs ${
                    !shape.filled ? "bg-indigo-600" : "bg-zinc-800"
                  }`}
                >
                  Outline
                </button>
                <button
                  onClick={() => updateShape(index, { filled: true })}
                  className={`flex-1 px-2 py-1 rounded text-xs ${
                    shape.filled ? "bg-indigo-600" : "bg-zinc-800"
                  }`}
                >
                  Filled
                </button>
              </div>
            </div>
          )}
        </div>

        {hasStroke && !shape.filled && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">
              Stroke Width
            </label>
            <input
              type="range"
              value={shape.strokeWidth ?? 2}
              onInput={(e) =>
                updateShape(index, {
                  strokeWidth: Number((e.target as HTMLInputElement).value),
                })}
              min={0.25}
              max={20}
              step={0.25}
              className="w-full"
            />
            <div className="text-xs text-zinc-500 text-center">
              {shape.strokeWidth ?? 2}px
            </div>
          </div>
        )}

        {/* Line-specific controls */}
        {isLine && (
          <div className="border-t border-zinc-700 pt-2 mt-2">
            <div className="text-xs text-zinc-400 mb-2">Line Settings</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Direction
                </label>
                <select
                  value={shape.orientation ?? "horizontal"}
                  onChange={(e) =>
                    updateShape(index, {
                      orientation: (e.target as HTMLSelectElement)
                        .value as Shape["orientation"],
                    })}
                  className="w-full px-2 py-1 rounded text-sm"
                >
                  <option value="horizontal">← Horizontal →</option>
                  <option value="vertical">↑ Vertical ↓</option>
                  <option value="diagonal-down">↘ Diagonal Down</option>
                  <option value="diagonal-up">↗ Diagonal Up</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Curvature
                </label>
                <input
                  type="range"
                  value={shape.curvature ?? 30}
                  min={-100}
                  max={100}
                  onInput={(e) =>
                    updateShape(index, {
                      curvature: Number((e.target as HTMLInputElement).value),
                    })}
                  className="w-full"
                />
                <div className="text-xs text-zinc-500 text-center">
                  {shape.curvature ?? 30} ({(shape.curvature ?? 30) > 0
                    ? "↑"
                    : (shape.curvature ?? 30) < 0
                    ? "↓"
                    : "—"})
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Dash Style
                </label>
                <select
                  value={shape.dashStyle ?? "solid"}
                  onChange={(e) =>
                    updateShape(index, {
                      dashStyle: (e.target as HTMLSelectElement)
                        .value as Shape["dashStyle"],
                    })}
                  className="w-full px-2 py-1 rounded text-sm"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Line Cap
                </label>
                <select
                  value={shape.lineCap ?? "round"}
                  onChange={(e) =>
                    updateShape(index, {
                      lineCap: (e.target as HTMLSelectElement)
                        .value as Shape["lineCap"],
                    })}
                  className="w-full px-2 py-1 rounded text-sm"
                >
                  <option value="round">Round</option>
                  <option value="square">Square</option>
                  <option value="butt">Butt</option>
                </select>
              </div>
            </div>
            {type === "wave-line" && (
              <div className="mt-2">
                <label className="text-xs text-zinc-500 block mb-1">
                  Waves Count
                </label>
                <NumberInput
                  value={shape.count ?? 3}
                  onChange={(v) => updateShape(index, { count: v })}
                  min={1}
                  max={10}
                />
              </div>
            )}
          </div>
        )}

        {/* Chevron-specific controls */}
        {isChevron && (
          <div className="border-t border-zinc-700 pt-2 mt-2">
            <div className="text-xs text-zinc-400 mb-2">Chevron Settings</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Direction
                </label>
                <select
                  value={shape.direction ?? "right"}
                  onChange={(e) =>
                    updateShape(index, {
                      direction: (e.target as HTMLSelectElement)
                        .value as Shape["direction"],
                    })}
                  className="w-full px-2 py-1 rounded text-sm"
                >
                  <option value="right">→ Right</option>
                  <option value="left">← Left</option>
                  <option value="up">↑ Up</option>
                  <option value="down">↓ Down</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Angle
                </label>
                <input
                  type="range"
                  value={shape.angle ?? 60}
                  min={30}
                  max={120}
                  onInput={(e) =>
                    updateShape(index, {
                      angle: Number((e.target as HTMLInputElement).value),
                    })}
                  className="w-full"
                />
                <div className="text-xs text-zinc-500 text-center">
                  {shape.angle ?? 60}°
                </div>
              </div>
            </div>
            {type === "double-chevron" && (
              <div className="mt-2">
                <label className="text-xs text-zinc-500 block mb-1">Gap</label>
                <input
                  type="range"
                  value={shape.gap ?? 15}
                  min={5}
                  max={40}
                  onInput={(e) =>
                    updateShape(index, {
                      gap: Number((e.target as HTMLInputElement).value),
                    })}
                  className="w-full"
                />
                <div className="text-xs text-zinc-500 text-center">
                  {shape.gap ?? 15}px
                </div>
              </div>
            )}
          </div>
        )}

        {/* Star/Sparkle controls */}
        {isStar && (
          <div className="border-t border-zinc-700 pt-2 mt-2">
            <div className="text-xs text-zinc-400 mb-2">Star Settings</div>
            <div className="grid grid-cols-2 gap-2">
              {type === "star" && (
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">
                    Points
                  </label>
                  <NumberInput
                    value={shape.points ?? 5}
                    onChange={(v) => updateShape(index, { points: v })}
                    min={4}
                    max={8}
                  />
                </div>
              )}
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Inner Radius
                </label>
                <input
                  type="range"
                  value={(shape.innerRadius ?? 0.4) * 100}
                  min={20}
                  max={80}
                  onInput={(e) =>
                    updateShape(index, {
                      innerRadius:
                        Number((e.target as HTMLInputElement).value) / 100,
                    })}
                  className="w-full"
                />
                <div className="text-xs text-zinc-500 text-center">
                  {Math.round((shape.innerRadius ?? 0.4) * 100)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pattern controls */}
        {isPattern && (
          <div className="border-t border-zinc-700 pt-2 mt-2">
            <div className="text-xs text-zinc-400 mb-2">Pattern Settings</div>
            <div className="grid grid-cols-2 gap-2">
              {type === "dots-grid"
                ? (
                  <>
                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">
                        Rows
                      </label>
                      <NumberInput
                        value={shape.rows ?? 4}
                        onChange={(v) => updateShape(index, { rows: v })}
                        min={1}
                        max={10}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">
                        Columns
                      </label>
                      <NumberInput
                        value={shape.columns ?? 4}
                        onChange={(v) => updateShape(index, { columns: v })}
                        min={1}
                        max={10}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">
                        Spacing
                      </label>
                      <NumberInput
                        value={shape.spacing ?? 20}
                        onChange={(v) => updateShape(index, { spacing: v })}
                        min={5}
                        max={50}
                      />
                    </div>
                  </>
                )
                : (
                  <>
                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">
                        Count
                      </label>
                      <NumberInput
                        value={shape.count ?? 12}
                        onChange={(v) => updateShape(index, { count: v })}
                        min={1}
                        max={50}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">
                        Seed
                      </label>
                      <NumberInput
                        value={shape.seed ?? 1}
                        onChange={(v) => updateShape(index, { seed: v })}
                        min={1}
                        max={100}
                      />
                    </div>
                  </>
                )}
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Dot Size
                </label>
                <NumberInput
                  value={shape.dotSize ?? 2}
                  onChange={(v) => updateShape(index, { dotSize: v })}
                  min={1}
                  max={10}
                />
              </div>
            </div>
          </div>
        )}

        {/* Blob controls */}
        {isBlob && (
          <div className="border-t border-zinc-700 pt-2 mt-2">
            <div className="text-xs text-zinc-400 mb-2">Blob Settings</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  Complexity
                </label>
                <NumberInput
                  value={shape.complexity ?? 6}
                  onChange={(v) => updateShape(index, { complexity: v })}
                  min={3}
                  max={8}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Seed</label>
                <NumberInput
                  value={shape.seed ?? 1}
                  onChange={(v) => updateShape(index, { seed: v })}
                  min={1}
                  max={100}
                />
              </div>
            </div>
          </div>
        )}

        {/* Crescent controls */}
        {isCrescent && (
          <div className="border-t border-zinc-700 pt-2 mt-2">
            <div className="text-xs text-zinc-400 mb-2">Crescent Settings</div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">
                Arc Percentage
              </label>
              <input
                type="range"
                value={shape.arcPercentage ?? 70}
                min={10}
                max={90}
                onInput={(e) =>
                  updateShape(index, {
                    arcPercentage: Number((e.target as HTMLInputElement).value),
                  })}
                className="w-full"
              />
              <div className="text-xs text-zinc-500 text-center">
                {shape.arcPercentage ?? 70}%
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-3">
      {shapes.map((shape, i) => (
        <div key={i} className="p-3 bg-zinc-800/50 rounded space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <i
                className={`fa-solid ${
                  SHAPE_TYPES.find((t) => t.value === shape.type)?.icon ||
                  "fa-shapes"
                } text-zinc-400`}
              />
              <select
                value={shape.type}
                onChange={(e) =>
                  updateShape(i, {
                    type: (e.target as HTMLSelectElement).value as ShapeType,
                  })}
                className="px-2 py-1 rounded text-xs bg-zinc-700"
              >
                <optgroup label="Basic">
                  {SHAPE_TYPES.slice(0, 4).map((t) => (
                    <option value={t.value}>{t.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Lines & Curves">
                  {SHAPE_TYPES.slice(4, 7).map((t) => (
                    <option value={t.value}>{t.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Arrows & Chevrons">
                  {SHAPE_TYPES.slice(7, 10).map((t) => (
                    <option value={t.value}>{t.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Geometric">
                  {SHAPE_TYPES.slice(10, 16).map((t) => (
                    <option value={t.value}>{t.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Organic">
                  {SHAPE_TYPES.slice(16, 18).map((t) => (
                    <option value={t.value}>{t.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Patterns">
                  {SHAPE_TYPES.slice(18).map((t) => (
                    <option value={t.value}>{t.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() =>
                  duplicateShape(i)}
                className="text-zinc-500 hover:text-zinc-300 px-1"
                title="Duplicate"
              >
                <i className="fa-solid fa-copy text-xs" />
              </button>
              <button
                onClick={() => removeShape(i)}
                className="text-zinc-500 hover:text-red-400 px-1"
                title="Remove"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          </div>
          {renderShapeControls(shape, i)}
        </div>
      ))}

      {/* Add Shape Buttons */}
      <div className="flex gap-2">
        <button
          ref={presetButtonRef}
          onClick={() => setShowPresets((v) => !v)}
          className="flex-1 h-8 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600 flex items-center justify-center"
        >
          <i className="fa-solid fa-wand-magic-sparkles mr-1" /> Add Preset
          <i
            className={`fa-solid ml-2 text-[10px] ${
              showPresets ? "fa-chevron-up" : "fa-chevron-down"
            }`}
          />
        </button>
        <button
          onClick={() => addShape("ring")}
          className="flex-1 h-8 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600 flex items-center justify-center"
        >
          <i className="fa-solid fa-plus mr-1" /> Add Shape
        </button>
      </div>

      {showPresets && (
        <div
          ref={presetMenuRef}
          style={presetMenuStyle}
          className="bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-y-auto"
        >
          <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-zinc-400 border-b border-zinc-700">
            Shape Presets
          </div>
          {SHAPE_PRESETS.map((preset) => (
            <button
              onClick={() => addPreset(preset)}
              className="w-full px-3 py-2.5 text-left hover:bg-zinc-700 border-b border-zinc-700/60 last:border-b-0"
            >
              <div className="text-xs text-zinc-100">{preset.name}</div>
              <div className="text-[11px] text-zinc-400">
                {preset.shapes.length}{" "}
                shape{preset.shapes.length === 1 ? "" : "s"}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
