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
  Modal,
  ModalBody,
  useConfirm,
} from "@ui/components/primitives/index.ts";
import { ProjectRow, type ProjectRowMode } from "./ProjectRow.tsx";

interface ProjectModalProps {
  projects: ProjectInfo[];
  currentProject: string | null;
}

export function ProjectModal({
  projects,
  currentProject,
}: ProjectModalProps) {
  // One row at a time is renaming or asking to be deleted
  const confirmDelete = useConfirm<string>();
  const [renaming, setRenaming] = useState<string | null>(null);

  const closeModal = useAppStore((s) => s.closeModal);

  const renameProject = useRenameProject();
  const switchProject = useSwitchProject();
  const deleteProject = useDeleteProject();
  const duplicateProject = useDuplicateProject();

  const modeOf = (projectId: string): ProjectRowMode =>
    confirmDelete.armed === projectId
      ? "confirm-delete"
      : renaming === projectId
      ? "rename"
      : "view";

  const setMode = (projectId: string, mode: ProjectRowMode) => {
    setRenaming(mode === "rename" ? projectId : null);
    if (mode === "confirm-delete") confirmDelete.arm(projectId);
    else confirmDelete.disarm();
  };

  return (
    <Modal
      title="Projects"
      subtitle="Rename, duplicate, or delete your projects"
      size="md"
      onClose={closeModal}
    >
      <ModalBody className="space-y-2">
        {projects.map((p) => (
          <ProjectRow
            key={p.id}
            project={p}
            isCurrent={currentProject === p.id}
            canDelete={projects.length > 1}
            mode={modeOf(p.id)}
            onModeChange={(mode) => setMode(p.id, mode)}
            onSwitch={() =>
              switchProject.mutate({ projectId: p.id }, {
                onSuccess: () => closeModal(),
              })}
            onRename={(name) =>
              renameProject.mutate({ projectId: p.id, name }, {
                onSuccess: () => setRenaming(null),
              })}
            onDuplicate={() =>
              duplicateProject.mutate(
                { projectId: p.id, name: `${p.name} (copy)` },
                { onSuccess: () => closeModal() },
              )}
            onDelete={() =>
              deleteProject.mutate(p.id, {
                onSuccess: () => confirmDelete.disarm(),
              })}
          />
        ))}
      </ModalBody>
    </Modal>
  );
}
