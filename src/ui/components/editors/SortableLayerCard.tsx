/**
 * SortableLayerCard — a single draggable layer row in the layer list.
 */

import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import type { Layer } from "@types";
import { LAYER_META, layerDisplayName } from "./layer-meta.ts";

/** True when a layer expects an image but none has been picked yet. */
function isMissingImage(layer: Layer): boolean {
  if (layer.type === "phone-frame") return !layer.imagePath;
  if (layer.type === "image") return !layer.imagePath;
  return false;
}

export function SortableLayerCard({
  id,
  layer,
  allLayers,
  onClick,
  onDuplicate,
  onDelete,
}: {
  id: string;
  layer: Layer;
  allLayers: Layer[];
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
  const missingImage = isMissingImage(layer);

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
      className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${
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
        <i className="fa-solid fa-grip-vertical text-sm" />
      </button>

      {/* Label area */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <i
          className={`${meta.icon} ${meta.color} text-sm w-4 text-center shrink-0`}
        />
        <span className="text-sm text-zinc-200 truncate">
          {layerDisplayName(layer, allLayers)}
        </span>

        {missingImage && (
          <span className="relative shrink-0 group/warn">
            <i className="fa-solid fa-triangle-exclamation text-xs text-zinc-500" />
            <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 whitespace-nowrap rounded-md bg-zinc-900 border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 opacity-0 group-hover/warn:opacity-100 transition-opacity duration-150 shadow-lg shadow-black/40">
              No image selected
            </span>
          </span>
        )}
      </div>

      {/* Actions */}
      <div
        className={`flex gap-0.5 transition-opacity ${
          confirmingDelete ? "invisible" : "opacity-0 group-hover:opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
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

      {/* Confirm delete — full-width overlay */}
      {confirmingDelete && (
        <div
          className="absolute inset-0 flex items-center justify-between rounded-lg bg-zinc-900/95 border border-red-500/30 px-3 animate-[fadeIn_150ms_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-xs text-zinc-400">Delete this layer?</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="px-2.5 py-1 text-xs text-zinc-300 hover:text-white bg-zinc-700 hover:bg-zinc-600 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="px-2.5 py-1 text-xs text-white bg-red-600 hover:bg-red-500 rounded font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
