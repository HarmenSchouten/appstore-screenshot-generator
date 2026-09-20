/**
 * ShapeTypeSelect — categorised dropdown for picking a shape type.
 * Groups and labels come from `SHAPE_META`, so a new shape only registers once.
 */

import type { ShapeFamily, ShapeType } from "@app-types";
import { SHAPE_FAMILY_LABELS, SHAPE_META, SHAPE_TYPES } from "@lib";
import { Select, type SelectGroup } from "@ui/components/inputs/index.ts";

const SHAPE_GROUPS: SelectGroup<ShapeType>[] = (
  Object.keys(SHAPE_FAMILY_LABELS) as ShapeFamily[]
).map((family) => ({
  label: SHAPE_FAMILY_LABELS[family],
  options: SHAPE_TYPES
    .filter((type) => SHAPE_META[type].family === family)
    .map((type) => ({ value: type, label: SHAPE_META[type].label })),
}));

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
