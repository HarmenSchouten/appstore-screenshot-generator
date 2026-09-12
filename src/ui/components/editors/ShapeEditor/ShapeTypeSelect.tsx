/**
 * ShapeTypeSelect — categorised dropdown for picking a shape type.
 */

import type { ShapeType } from "@app-types";
import { Select, type SelectGroup } from "@ui/components/inputs/index.ts";

const SHAPE_GROUPS: SelectGroup<ShapeType>[] = [
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
    <Select
      label="Shape"
      value={value}
      onChange={onChange}
      groups={SHAPE_GROUPS}
    />
  );
}
