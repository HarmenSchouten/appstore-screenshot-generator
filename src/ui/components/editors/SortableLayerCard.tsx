/**
 * SortableLayerCard — a single draggable layer row in the layer list.
 */

import { useEffect, useState } from "react";
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
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Auto-dismiss after 2.5 s of inaction
  useEffect(() => {
    if (!confirmingDelete) return;
    const timer = setTimeout(() => setConfirmingDelete(false), 2500);
    return () => clearTimeout(timer);
  }, [confirmingDelete]);

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

  const handleClick = () => {
    setConfirmingDelete(false);
    onClick();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${
        isDragging
          ? "bg-zinc-700/80 border-indigo-500/50 shadow-lg shadow-black/30"
          : "bg-zinc-800/60 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600"
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <i className="fa-solid fa-grip-vertical text-xs" />
      </button>

      {/* Label area */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <i
          className={`${meta.icon} ${meta.color} text-sm w-4 text-center shrink-0`}
        />
        <span className="text-sm text-zinc-200 truncate">
          {layerDisplayName(layer, index)}
        </span>
      </div>

      {/* Opacity indicator (only when not full) */}
      {!confirmingDelete && (layer.opacity ?? 1) < 1 && (
        <span className="text-[10px] text-zinc-500 tabular-nums">
          {Math.round((layer.opacity ?? 1) * 100)}%
        </span>
      )}

      {/* Actions — relative wrapper so confirm overlay doesn't shift height */}
      <div
        className="relative flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon buttons (always in flow to define size) */}
        <div
          className={`flex gap-0.5 transition-opacity ${
            confirmingDelete
              ? "opacity-0 pointer-events-none"
              : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <button
            type="button"
            onClick={onDuplicate}
            className="p-1 text-zinc-500 hover:text-zinc-300 rounded"
            title="Duplicate layer"
          >
            <i className="fa-solid fa-clone text-xs" />
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="p-1 text-zinc-500 hover:text-red-400 rounded"
            title="Delete layer"
          >
            <i className="fa-solid fa-trash-can text-xs" />
          </button>
        </div>

        {/* Confirm overlay — absolutely positioned over icon buttons */}
        {confirmingDelete && (
          <div className="absolute right-0 inset-y-0 flex items-center gap-1 animate-[fadeIn_150ms_ease-out]">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="px-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 rounded whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="px-1.5 text-[11px] text-red-400 hover:text-red-300 font-medium rounded whitespace-nowrap"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
