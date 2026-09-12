/**
 * LayerCard — display component for a single layer row.
 *
 * With `sortable` (from `useSortableRow`) the card renders a drag handle and
 * applies drag transforms; without it, a static card.
 */

import type { Layer } from "@app-types";
import { LAYER_META, layerDisplayName } from "./layer-meta.ts";
import {
  ConfirmBar,
  type SortableProps,
  useConfirm,
} from "@ui/components/primitives/index.ts";
import { cn } from "@ui/utils/cn.ts";

/** True when a layer expects an image but none has been picked yet. */
function isMissingImage(layer: Layer): boolean {
  if (layer.type === "phone-frame") return !layer.imagePath;
  if (layer.type === "image") return !layer.imagePath;
  return false;
}

export function LayerCard({
  layer,
  allLayers,
  onClick,
  onDuplicate,
  onDelete,
  sortable,
}: {
  layer: Layer;
  allLayers: Layer[];
  onClick: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  sortable?: SortableProps;
}) {
  const confirmDelete = useConfirm();

  const meta = LAYER_META[layer.type];
  const missingImage = isMissingImage(layer);

  const handleClick = () => {
    confirmDelete.disarm();
    onClick();
  };

  return (
    <div
      ref={sortable?.setNodeRef}
      style={sortable?.style}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      className={cn(
        "group relative flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-colors cursor-pointer",
        sortable?.isDragging
          ? "bg-zinc-700/80 border-indigo-500/50 shadow-lg shadow-black/30"
          : "bg-zinc-800/60 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600",
      )}
    >
      {/* Drag handle */}
      {sortable && (
        <button
          type="button"
          {...sortable.attributes}
          {...(sortable.listeners ?? {})}
          onClick={(e) => e.stopPropagation()}
          className="text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          <i className="fa-solid fa-grip-vertical text-sm" />
        </button>
      )}

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

      {/* Opacity indicator (only when not full) */}
      {(layer.opacity ?? 1) < 1 && (
        <span
          className={cn(
            "text-[10px] text-zinc-500 tabular-nums",
            confirmDelete.armed && "invisible",
          )}
        >
          {Math.round((layer.opacity ?? 1) * 100)}%
        </span>
      )}

      {/* Actions */}
      <div
        className={cn(
          "flex gap-0.5 transition-opacity",
          confirmDelete.armed
            ? "invisible"
            : "opacity-0 group-hover:opacity-100",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onDuplicate}
          className="btn-icon"
          title="Duplicate layer"
        >
          <i className="fa-solid fa-clone text-xs" />
        </button>
        <button
          type="button"
          onClick={() => confirmDelete.arm()}
          className="btn-icon hover:text-red-400"
          title="Delete layer"
        >
          <i className="fa-solid fa-trash-can text-xs" />
        </button>
      </div>

      {confirmDelete.armed && (
        <ConfirmBar
          className="absolute inset-0"
          message="Delete this layer?"
          onConfirm={onDelete}
          onCancel={confirmDelete.disarm}
        />
      )}
    </div>
  );
}
