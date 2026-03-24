/**
 * ShapeTypeSelect — categorised dropdown for picking a shape type.
 */

import type { ShapeType } from "@types";

const SHAPE_GROUPS: {
  label: string;
  options: { value: ShapeType; label: string }[];
}[] = [
  {
    label: "Basic",
    options: [
      { value: "circle", label: "Circle" },
      { value: "ring", label: "Ring" },
      { value: "rectangle", label: "Rectangle" },
      { value: "pill", label: "Pill" },
    ],
  },
  {
    label: "Lines & Curves",
    options: [
      { value: "curved-line", label: "Curved Line" },
      { value: "s-curve", label: "S-Curve" },
      { value: "wave-line", label: "Wave Line" },
    ],
  },
  {
    label: "Arrows & Chevrons",
    options: [
      { value: "chevron", label: "Chevron" },
      { value: "double-chevron", label: "Double Chevron" },
      { value: "arrow", label: "Arrow" },
    ],
  },
  {
    label: "Geometric",
    options: [
      { value: "triangle", label: "Triangle" },
      { value: "diamond", label: "Diamond" },
      { value: "hexagon", label: "Hexagon" },
      { value: "star", label: "Star" },
      { value: "sparkle", label: "Sparkle" },
      { value: "cross", label: "Cross" },
    ],
  },
  {
    label: "Organic",
    options: [
      { value: "blob", label: "Blob" },
      { value: "crescent", label: "Crescent" },
    ],
  },
  {
    label: "Patterns",
    options: [
      { value: "dots-grid", label: "Dots Grid" },
      { value: "scattered-dots", label: "Scattered Dots" },
    ],
  },
];

interface ShapeTypeSelectProps {
  value: ShapeType;
  onChange: (value: ShapeType) => void;
}

export function ShapeTypeSelect({ value, onChange }: ShapeTypeSelectProps) {
  return (
    <div>
      <label className="text-xs text-zinc-500 block mb-1.5">Shape</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ShapeType)}
        className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-800 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
      >
        {SHAPE_GROUPS.map((group) => (
          <optgroup
            key={group.label}
            label={group.label}
            style={{
              fontStyle: "normal",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: "11px",
            }}
          >
            {group.options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                style={{
                  textTransform: "none",
                  letterSpacing: "normal",
                  fontSize: "14px",
                }}
              >
                {opt.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
