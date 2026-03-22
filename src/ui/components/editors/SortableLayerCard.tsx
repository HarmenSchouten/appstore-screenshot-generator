/**
 * SortableLayerCard — a single draggable layer row in the layer list.
 */

import { useSortable } from "@dnd-kit/sortable";
import type { Layer } from "@types";
import { LAYER_META, layerDisplayName } from "./layer-meta.ts";

export function SortableLayerCard({
  id,
  layer,
  index,
  onClick,
  onDuplicate,
  onDelete,
}: {
  id: string;
  layer: Layer;
  index: number;
  onClick: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
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
    transition: {
      duration: 200,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const meta = LAYER_META[layer.type];

  const style = {
    // Translate-only (no scale) for a cleaner drag feel
    transform: transform
      ? `translate3d(${Math.round(transform.x)}px, ${
        Math.round(transform.y)
      }px, 0)`
      : undefined,
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-colors ${
        isDragging
          ? "bg-zinc-700/80 border-indigo-500/50 shadow-lg shadow-black/30"
          : "bg-zinc-800/60 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600"
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <i className="fa-solid fa-grip-vertical text-xs" />
      </button>

      {/* Clickable label area */}
      <button
        onClick={onClick}
        className="flex items-center gap-2 flex-1 min-w-0 text-left"
      >
        <i
          className={`${meta.icon} ${meta.color} text-sm w-4 text-center shrink-0`}
        />
        <span className="text-sm text-zinc-200 truncate">
          {layerDisplayName(layer, index)}
        </span>
      </button>

      {/* Opacity indicator (only when not full) */}
      {(layer.opacity ?? 1) < 1 && (
        <span className="text-[10px] text-zinc-500 tabular-nums">
          {Math.round((layer.opacity ?? 1) * 100)}%
        </span>
      )}

      {/* Actions */}
      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onDuplicate}
          className="p-1 text-zinc-500 hover:text-zinc-300 rounded"
          title="Duplicate layer"
        >
          <i className="fa-solid fa-clone text-xs" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-zinc-500 hover:text-red-400 rounded"
          title="Delete layer"
        >
          <i className="fa-solid fa-trash-can text-xs" />
        </button>
      </div>
    </div>
  );
}
