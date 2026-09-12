/**
 * SidebarItemCard — a single card for screenshots / feature graphics.
 *
 * With `sortable` (from `useSortableRow`) the card renders a drag handle and
 * applies drag transforms; without it, a static card (the feature graphic).
 */

import {
  ConfirmBar,
  type SortableProps,
  useConfirm,
} from "@ui/components/primitives/index.ts";
import { cn } from "@ui/utils/cn.ts";

export function SidebarItemCard({
  title,
  isSelected,
  onSelect,
  onDelete,
  sortable,
}: {
  title: string;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  sortable?: SortableProps;
}) {
  const confirmDelete = useConfirm();

  return (
    <div
      ref={sortable?.setNodeRef}
      style={sortable?.style}
      role="button"
      tabIndex={0}
      onClick={() => {
        confirmDelete.disarm();
        onSelect();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      className={cn(
        "group relative flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-colors cursor-pointer",
        sortable?.isDragging
          ? "bg-zinc-700/80 border-indigo-500/50 shadow-lg shadow-black/30"
          : isSelected
          ? "bg-indigo-900/50 border-indigo-500"
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

      {/* Title */}
      <span className="text-sm text-zinc-200 truncate flex-1 min-w-0">
        {title}
      </span>

      {/* Delete button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          confirmDelete.arm();
        }}
        className={cn(
          "btn-icon hover:text-red-400",
          confirmDelete.armed
            ? "invisible"
            : "opacity-0 group-hover:opacity-100",
        )}
        title="Delete"
      >
        <i className="fa-solid fa-trash-can text-xs" />
      </button>

      {confirmDelete.armed && (
        <ConfirmBar
          className="absolute inset-0"
          message="Delete?"
          onConfirm={onDelete}
          onCancel={confirmDelete.disarm}
        />
      )}
    </div>
  );
}
