/**
 * ProjectModal Component
 *
 * Modal for managing projects — rename, duplicate, and delete.
 * Quick-create lives in the TopBar dropdown; this modal is for deeper management.
 */

import { useState } from "react";
import type { ProjectInfo } from "@ui/types.ts";
import { useAppStore } from "../../store/index.ts";
import {
  useDeleteProject,
  useDuplicateProject,
  useRenameProject,
  useSwitchProject,
} from "@hooks";

interface ProjectModalProps {
  projects: ProjectInfo[];
  currentProject: string | null;
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

export function ProjectModal({
  projects,
  currentProject,
}: ProjectModalProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const { closeProjectModal } = useAppStore.getState();

  const renameProject = useRenameProject();
  const switchProject = useSwitchProject();
  const deleteProject = useDeleteProject();
  const duplicateProject = useDuplicateProject();

  const handleRename = (projectId: string) => {
    if (!editName.trim()) return;

    renameProject.mutate({ projectId, name: editName.trim() }, {
      onSuccess: () => {
        setEditingProject(null);
        setEditName("");
      },
    });
  };

  const handleSwitch = (projectId: string) => {
    switchProject.mutate(projectId, {
      onSuccess: () => closeProjectModal(),
    });
  };

  const handleDelete = (projectId: string) => {
    deleteProject.mutate(projectId, {
      onSuccess: () => setConfirmDelete(null),
    });
  };

  const handleDuplicate = (project: ProjectInfo) => {
    duplicateProject.mutate(
      { projectId: project.id, name: `${project.name} (copy)` },
      { onSuccess: () => closeProjectModal() },
    );
  };

  const startEditing = (project: ProjectInfo) => {
    setEditingProject(project.id);
    setEditName(project.name);
    setConfirmDelete(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={closeProjectModal}
    >
      <div
        className="bg-zinc-900 rounded-lg w-[480px] max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 pt-5 pb-3">
          <div>
            <h2 className="font-bold text-lg">Projects</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Rename, duplicate, or delete your projects
            </p>
          </div>
          <button
            type="button"
            onClick={closeProjectModal}
            className="text-zinc-500 hover:text-white text-xl p-1"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Project list */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2">
          {projects.map((p) => (
            <div
              key={p.id}
              className={`rounded-lg border transition-colors ${
                currentProject === p.id
                  ? "bg-indigo-900/30 border-indigo-500/50"
                  : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600"
              }`}
            >
              {editingProject === p.id
                ? (
                  // Rename mode
                  <div className="p-3 flex gap-2">
                    <input
                      type="text"
                      value={editName}
                      onInput={(e) =>
                        setEditName((e.target as HTMLInputElement).value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename(p.id);
                        if (e.key === "Escape") setEditingProject(null);
                      }}
                      className="flex-1 px-3 py-1.5 rounded text-sm bg-zinc-800 border border-zinc-600 min-w-0"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleRename(p.id)}
                      disabled={!editName.trim()}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-sm disabled:opacity-40 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )
                : confirmDelete === p.id
                ? (
                  // Delete confirmation
                  <div className="p-4 text-center">
                    <p className="text-sm text-red-400 mb-1">
                      Delete &ldquo;{p.name}&rdquo;?
                    </p>
                    <p className="text-xs text-zinc-500 mb-3">
                      All project data will be permanently removed.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )
                : (
                  // Normal view
                  <div className="p-3 flex items-center gap-3">
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleSwitch(p.id)}
                    >
                      <div className="flex items-center gap-2">
                        <i
                          className={`fa-solid fa-cube text-xs ${
                            currentProject === p.id
                              ? "text-indigo-400"
                              : "text-zinc-600"
                          }`}
                        />
                        <span className="font-medium text-sm truncate">
                          {p.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 ml-5">
                        {p.createdAt && (
                          <span className="text-[11px] text-zinc-500">
                            Created {formatDate(p.createdAt)}
                          </span>
                        )}
                        {p.updatedAt && p.updatedAt !== p.createdAt && (
                          <span className="text-[11px] text-zinc-500">
                            Updated {formatDate(p.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(p);
                        }}
                        className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 rounded transition-colors"
                        title="Rename"
                      >
                        <i className="fa-solid fa-pen text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(p);
                        }}
                        className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 rounded transition-colors"
                        title="Duplicate"
                      >
                        <i className="fa-solid fa-copy text-xs" />
                      </button>
                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(p.id);
                            setEditingProject(null);
                          }}
                          className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-zinc-700 rounded transition-colors"
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash-can text-xs" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
