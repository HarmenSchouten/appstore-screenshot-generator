/**
 * ProjectModal Component
 *
 * Modal for managing projects — rename, duplicate, and delete.
 * Quick-create lives in the TopBar dropdown; this modal is for deeper management.
 */

import { useState } from "react";
import type { ProjectInfo } from "@ui/types.ts";
import { useAppStore } from "@ui/store/index.ts";
import {
  useDeleteProject,
  useDuplicateProject,
  useRenameProject,
  useSwitchProject,
} from "@hooks";
import {
  ConfirmBar,
  Modal,
  ModalBody,
  useConfirm,
} from "@ui/components/primitives/index.ts";
import { cn } from "@ui/utils/cn.ts";

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
  const confirmDelete = useConfirm<string>();
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const closeModal = useAppStore((s) => s.closeModal);

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
      onSuccess: () => closeModal(),
    });
  };

  const handleDelete = (projectId: string) => {
    deleteProject.mutate(projectId, {
      onSuccess: () => confirmDelete.disarm(),
    });
  };

  const handleDuplicate = (project: ProjectInfo) => {
    duplicateProject.mutate(
      { projectId: project.id, name: `${project.name} (copy)` },
      { onSuccess: () => closeModal() },
    );
  };

  const startEditing = (project: ProjectInfo) => {
    setEditingProject(project.id);
    setEditName(project.name);
    confirmDelete.disarm();
  };

  return (
    <Modal
      title="Projects"
      subtitle="Rename, duplicate, or delete your projects"
      size="md"
      onClose={closeModal}
    >
      <ModalBody className="space-y-2">
        {projects.map((p) =>
          confirmDelete.armed === p.id
            ? (
              <ConfirmBar
                key={p.id}
                className="py-3"
                message={
                  <>
                    Delete &ldquo;{p.name}&rdquo;?{" "}
                    <span className="text-zinc-500">
                      All project data will be permanently removed.
                    </span>
                  </>
                }
                onConfirm={() => handleDelete(p.id)}
                onCancel={confirmDelete.disarm}
              />
            )
            : (
              <div
                key={p.id}
                className={cn(
                  "rounded-lg border transition-colors",
                  currentProject === p.id
                    ? "bg-indigo-900/30 border-indigo-500/50"
                    : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600",
                )}
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
                          if (e.key === "Escape") {
                            // Cancels the edit only; the modal stays
                            e.stopPropagation();
                            setEditingProject(null);
                          }
                        }}
                        className="input flex-1 py-1.5"
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
                  : (
                    // Normal view
                    <div className="p-3 flex items-center gap-3">
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleSwitch(p.id)}
                      >
                        <div className="flex items-center gap-2">
                          <i
                            className={cn(
                              "fa-solid fa-cube text-xs",
                              currentProject === p.id
                                ? "text-indigo-400"
                                : "text-zinc-600",
                            )}
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
                          onClick={() => startEditing(p)}
                          className="btn-icon"
                          title="Rename"
                        >
                          <i className="fa-solid fa-pen text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p)}
                          className="btn-icon"
                          title="Duplicate"
                        >
                          <i className="fa-solid fa-copy text-xs" />
                        </button>
                        {projects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              confirmDelete.arm(p.id);
                              setEditingProject(null);
                            }}
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
            )
        )}
      </ModalBody>
    </Modal>
  );
}
