/**
 * ColorStopList — the gradient's colors as a sortable list.
 *
 * The layer stores plain strings; a sortable row needs an identity that
 * survives reorders and edits. The list keeps `{ id, color }` stops in
 * state: local edits move the ids with their colors, and a `colors` prop
 * that no longer matches (a reset, a parsed CSS commit) is adopted by
 * position — the React "adjust state on a prop change" pattern, no refs
 * mutated during render (#70).
 */

import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { ColorInput } from "@ui/components/inputs/index.ts";
import {
  SortableList,
  useSortableRow,
} from "@ui/components/primitives/index.ts";
import { cn } from "@ui/utils/cn.ts";

interface ColorStop {
  id: string;
  color: string;
}

let nextStopId = 1;
const mintId = () => `stop-${nextStopId++}`;

/** Colors by position, keeping the id already at that position. */
function adopt(colors: string[], previous: ColorStop[]): ColorStop[] {
  return colors.map((color, i) => ({ id: previous[i]?.id ?? mintId(), color }));
}

function sameColors(stops: ColorStop[], colors: string[]): boolean {
  return stops.length === colors.length &&
    stops.every((s, i) => s.color === colors[i]);
}

interface ColorStopListProps {
  colors: string[];
  onChange: (colors: string[]) => void;
}

export function ColorStopList({ colors, onChange }: ColorStopListProps) {
  const [stored, setStored] = useState(() => adopt(colors, []));
  const stops = sameColors(stored, colors) ? stored : adopt(colors, stored);
  if (stops !== stored) setStored(stops);

  const commit = (next: ColorStop[]) => {
    setStored(next);
    onChange(next.map((s) => s.color));
  };

  const setColor = (id: string, color: string) =>
    commit(stops.map((s) => (s.id === id ? { ...s, color } : s)));

  const add = () =>
    commit([
      ...stops,
      { id: mintId(), color: stops[stops.length - 1]?.color ?? "#000000" },
    ]);

  const remove = (id: string) => {
    if (stops.length <= 1) return;
    commit(stops.filter((s) => s.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-zinc-500">Colors</label>
        <button
          type="button"
          onClick={add}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <i className="fa-solid fa-plus mr-1 text-[10px]" />
          Add
        </button>
      </div>
      <SortableList
        ids={stops.map((s) => s.id)}
        onMove={(from, to) => commit(arrayMove(stops, from, to))}
      >
        <div className="space-y-2">
          {stops.map((stop) => (
            <ColorStopRow
              key={stop.id}
              id={stop.id}
              color={stop.color}
              onChange={(color) => setColor(stop.id, color)}
              onRemove={stops.length > 1 ? () => remove(stop.id) : undefined}
            />
          ))}
        </div>
      </SortableList>
    </div>
  );
}

function ColorStopRow({ id, color, onChange, onRemove }: {
  id: string;
  color: string;
  onChange: (color: string) => void;
  /** Absent for the last remaining stop, which cannot be removed. */
  onRemove?: () => void;
}) {
  const { attributes, listeners, setNodeRef, style, isDragging } =
    useSortableRow(id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("flex items-center gap-2", isDragging && "opacity-80")}
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
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-zinc-600 hover:text-red-400 transition-colors p-1"
          aria-label="Remove color"
        >
          <i className="fa-solid fa-xmark text-xs" />
        </button>
      )}
    </div>
  );
}
