/**
 * MediaTile — one image in the media manager: the thumbnail with its hover
 * actions, its rename form, or its delete confirm. The modal decides which,
 * so that at most one tile is in a secondary state.
 */

import { useState } from "react";
import { ConfirmBar } from "@ui/components/primitives/index.ts";
import { cn } from "@ui/utils/cn.ts";
import { assetUrlPrefix } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";

export type MediaTileMode = "view" | "rename" | "confirm-delete";

interface MediaTileProps {
  path: string;
  mode: MediaTileMode;
  onModeChange: (mode: MediaTileMode) => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
  /** Filename without its extension; what the rename form starts from. */
  initialName: string;
}

export function MediaTile({
  path,
  mode,
  onModeChange,
  onRename,
  onDelete,
  initialName,
}: MediaTileProps) {
  const projectId = useAppStore((s) => s.currentProject);
  const filename = path.split("/").pop() || "";
  const isConfirming = mode === "confirm-delete";

  return (
    <div className="bg-zinc-800 rounded overflow-hidden group">
      <div className="aspect-square bg-zinc-700 relative">
        <img
          src={assetUrlPrefix(projectId) + path.replace(/^assets\//, "")}
          alt={filename}
          className="w-full h-full object-contain"
          loading="lazy"
        />
        {/* Overlay actions */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity flex items-center justify-center gap-2",
            isConfirming ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          {isConfirming
            ? (
              <ConfirmBar
                className="mx-2 py-1.5"
                message="Delete?"
                onConfirm={onDelete}
                onCancel={() => onModeChange("view")}
              />
            )
            : (
              <>
                <button
                  type="button"
                  onClick={() => onModeChange("rename")}
                  className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded"
                  title="Rename"
                >
                  <i className="fa-solid fa-pen" />
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange("confirm-delete")}
                  className="p-2 bg-red-900/80 hover:bg-red-800 rounded"
                  title="Delete"
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </>
            )}
        </div>
      </div>

      {mode === "rename"
        ? (
          <RenameForm
            initialName={initialName}
            onSave={onRename}
            onCancel={() => onModeChange("view")}
          />
        )
        : (
          <div
            className="p-2 text-xs text-zinc-400 truncate"
            title={filename}
          >
            {filename}
          </div>
        )}
    </div>
  );
}

/** Mounted only while renaming, so the draft starts fresh each time. */
function RenameForm({ initialName, onSave, onCancel }: {
  initialName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialName);
  const canSave = name.trim().length > 0;
  const save = () => {
    if (canSave) onSave(name.trim());
  };

  return (
    <div className="p-2">
      <input
        type="text"
        value={name}
        onInput={(e) => setName((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") {
            // Cancels the edit only; the modal stays
            e.stopPropagation();
            onCancel();
          }
        }}
        className="input px-2 py-1 text-xs"
        autoFocus
      />
      <div className="flex gap-1 mt-1">
        <button
          type="button"
          onClick={save}
          disabled={!canSave}
          className="flex-1 px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 rounded disabled:opacity-40"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
