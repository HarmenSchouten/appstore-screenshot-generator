/** Reusable sidebar card for screenshots and feature graphics */
export function SidebarItemCard({
  title,
  subtitle,
  index,
  isSelected,
  confirmingDelete,
  onSelect,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
}: {
  title: string;
  subtitle?: string;
  index?: number;
  isSelected: boolean;
  confirmingDelete: boolean;
  onSelect: () => void;
  onRequestDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  return (
    <div
      className={`p-3 rounded border ${
        isSelected
          ? "bg-indigo-900/50 border-indigo-500"
          : "bg-zinc-800/50 border-transparent hover:bg-zinc-800"
      }`}
    >
      {confirmingDelete
        ? (
          <div className="text-center">
            <p className="text-sm text-red-400 mb-2">Delete this item?</p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={onConfirmDelete}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={onCancelDelete}
                className="px-3 py-1 bg-zinc-600 hover:bg-zinc-500 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )
        : (
          <div
            onClick={onSelect}
            className="flex justify-between items-start gap-2 cursor-pointer"
          >
            <div className="min-w-0 flex-1">
              {index != null && (
                <div className="text-xs text-zinc-500 mb-1">#{index + 1}</div>
              )}
              <div className="font-medium text-sm truncate">{title}</div>
              {subtitle && (
                <div className="text-xs text-zinc-400 truncate">{subtitle}</div>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRequestDelete();
              }}
              className="text-zinc-500 hover:text-red-400 text-lg flex-shrink-0"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        )}
    </div>
  );
}
