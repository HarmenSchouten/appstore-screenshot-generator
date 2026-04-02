/**
 * SidebarItemCard — a single card for screenshots / feature graphics.
 *
 * When `sortableProps` are provided (from useSortable), the card renders
 * a drag handle and applies drag transforms. Without them it renders
 * as a static card (used for the feature graphic).
 */

import { useEffect, useState } from "react";
import type { SortableProps } from "./sortable-types.ts";

export function SidebarItemCard({
  title,
  isSelected,
  onSelect,
  onDelete,
  sortableProps,
}: {
  title: string;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  sortableProps?: SortableProps;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Auto-dismiss after 2.5s
  useEffect(() => {
    if (!confirmingDelete) return;
    const timer = setTimeout(() => setConfirmingDelete(false), 2500);
    return () => clearTimeout(timer);
  }, [confirmingDelete]);

  return (
    <div
      ref={sortableProps?.setNodeRef}
      style={sortableProps?.style}
      role="button"
      tabIndex={0}
      onClick={() => {
        setConfirmingDelete(false);
        onSelect();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${
        sortableProps?.isDragging
          ? "bg-zinc-700/80 border-indigo-500/50 shadow-lg shadow-black/30"
          : isSelected
          ? "bg-indigo-900/50 border-indigo-500"
          : "bg-zinc-800/60 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600"
      }`}
    >
      {/* Drag handle */}
      {sortableProps && (
        <button
          {...sortableProps.attributes}
          {...(sortableProps.listeners ?? {})}
          onClick={(e) => e.stopPropagation()}
          className="text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          <i className="fa-solid fa-grip-vertical text-sm" />
        </button>
      )}

      {/* Title */}
      <span className="text-sm text-zinc-200 truncate flex-1 min-w-0">
        {title}
      </span>

      {/* Delete button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setConfirmingDelete(true);
        }}
        className={`p-1 text-zinc-500 hover:text-red-400 rounded transition-opacity ${
          confirmingDelete ? "invisible" : "opacity-0 group-hover:opacity-100"
        }`}
        title="Delete"
      >
        <i className="fa-solid fa-trash-can text-xs" />
      </button>

      {/* Confirm delete overlay */}
      {confirmingDelete && (
        <div
          className="absolute inset-0 flex items-center justify-between rounded-lg bg-zinc-900/95 border border-red-500/30 px-3 animate-[fadeIn_150ms_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-xs text-zinc-400">Delete?</span>
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
