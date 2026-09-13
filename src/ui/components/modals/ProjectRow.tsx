/**
 * ProjectRow — one project in the projects modal: the row itself, or its
 * rename form, or its delete confirm. The modal decides which, so that at
 * most one row is in a secondary state.
 */

import { useState } from "react";
import type { ProjectInfo } from "@ui/types.ts";
import { ConfirmBar } from "@ui/components/primitives/index.ts";
import { cn } from "@ui/utils/cn.ts";

export type ProjectRowMode = "view" | "rename" | "confirm-delete";

interface ProjectRowProps {
  project: ProjectInfo;
  isCurrent: boolean;
  /** The last project cannot be deleted. */
  canDelete: boolean;
  mode: ProjectRowMode;
  onModeChange: (mode: ProjectRowMode) => void;
  onSwitch: () => void;
  onRename: (name: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function ProjectRow({
  project,
  isCurrent,
  canDelete,
  mode,
  onModeChange,
  onSwitch,
  onRename,
  onDuplicate,
  onDelete,
}: ProjectRowProps) {
  if (mode === "confirm-delete") {
    return (
      <ConfirmBar
        className="py-3"
        message={
          <>
            Delete &ldquo;{project.name}&rdquo;?{" "}
            <span className="text-zinc-500">
              All project data will be permanently removed.
            </span>
          </>
        }
        onConfirm={onDelete}
        onCancel={() => onModeChange("view")}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border transition-colors",
        isCurrent
          ? "bg-indigo-900/30 border-indigo-500/50"
          : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600",
      )}
    >
      {mode === "rename"
        ? (
          <RenameForm
            initialName={project.name}
            onSave={onRename}
            onCancel={() => onModeChange("view")}
          />
        )
        : (
          <div className="p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0 cursor-pointer" onClick={onSwitch}>
              <div className="flex items-center gap-2">
                <i
                  className={cn(
                    "fa-solid fa-cube text-xs",
                    isCurrent ? "text-indigo-400" : "text-zinc-600",
                  )}
                />
                <span className="font-medium text-sm truncate">
                  {project.name}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 ml-5">
                {project.createdAt && (
                  <span className="text-[11px] text-zinc-500">
                    Created {formatDate(project.createdAt)}
                  </span>
                )}
                {project.updatedAt && project.updatedAt !== project.createdAt &&
                  (
                    <span className="text-[11px] text-zinc-500">
                      Updated {formatDate(project.updatedAt)}
                    </span>
                  )}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onModeChange("rename")}
                className="btn-icon"
                title="Rename"
              >
                <i className="fa-solid fa-pen text-xs" />
              </button>
              <button
                type="button"
                onClick={onDuplicate}
                className="btn-icon"
                title="Duplicate"
              >
                <i className="fa-solid fa-copy text-xs" />
              </button>
              {canDelete && (
                <button
                  type="button"
                  onClick={() => onModeChange("confirm-delete")}
                  className="btn-icon hover:text-red-400"
                  title="Delete"
                >
                  <i className="fa-solid fa-trash-can text-xs" />
                </button>
              )}
            </div>
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
    <div className="p-3 flex gap-2">
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
        className="input flex-1 py-1.5"
        autoFocus
      />
      <button
        type="button"
        onClick={save}
        disabled={!canSave}
        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-sm disabled:opacity-40 transition-colors"
      >
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-sm transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
