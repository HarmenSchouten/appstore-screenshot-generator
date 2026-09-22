/**
 * MediaManager Modal Component
 *
 * Modal for managing image assets. The modal owns which tile is renaming or
 * asking to be deleted — the confirm timer lives here so only one tile can
 * be armed at a time.
 */

import { useState } from "react";
import {
  useAssets,
  useDeleteAsset,
  useRenameAsset,
  useUploadAssets,
} from "@hooks";
import { useAppStore } from "@ui/store/index.ts";
import {
  Modal,
  ModalBody,
  ModalFooter,
  useConfirm,
} from "@ui/components/primitives/index.ts";
import { MediaTile, type MediaTileMode } from "./MediaTile.tsx";
import { UploadButton } from "./UploadButton.tsx";

interface MediaManagerModalProps {
  onClose: () => void;
}

/** Filename without its extension — what a rename starts from. */
function baseName(path: string): string {
  const filename = path.split("/").pop() || "";
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.substring(0, lastDot) : filename;
}

export function MediaManagerModal({ onClose }: MediaManagerModalProps) {
  // One tile at a time is renaming or asking to be deleted
  const [renaming, setRenaming] = useState<string | null>(null);
  const confirmDelete = useConfirm<string>();

  const { upload, uploading } = useUploadAssets();
  const renameAsset = useRenameAsset();
  const deleteAsset = useDeleteAsset();

  const currentAssets = useAssets().images;

  const modeOf = (path: string): MediaTileMode =>
    confirmDelete.armed === path
      ? "confirm-delete"
      : renaming === path
      ? "rename"
      : "view";

  const setMode = (path: string, mode: MediaTileMode) => {
    setRenaming(mode === "rename" ? path : null);
    if (mode === "confirm-delete") confirmDelete.arm(path);
    else confirmDelete.disarm();
  };

  const handleRename = (oldPath: string, newName: string) => {
    // Cleared before the mutation: the rename is optimistic, so the tile is
    // already showing its new name by the time the request lands
    setRenaming(null);
    renameAsset.mutate({ oldPath, newName });
  };

  const handleDelete = (path: string) => {
    confirmDelete.disarm();
    deleteAsset.mutate(path, {
      onSuccess: () => {
        useAppStore.getState().addToast({
          type: "success",
          message: "File deleted",
        });
      },
    });
  };

  return (
    <Modal
      title={
        <>
          Media Manager
          <span className="ml-2 text-sm font-normal text-zinc-500">
            {currentAssets.length}{" "}
            {currentAssets.length === 1 ? "image" : "images"}
          </span>
        </>
      }
      icon="fa-solid fa-images"
      size="lg"
      onClose={onClose}
    >
      <ModalBody className="pt-1">
        {currentAssets.length === 0
          ? (
            <div className="text-center py-12 text-zinc-500">
              <i className="fa-solid fa-folder-open text-4xl mb-3" />
              <div>No images yet</div>
              <div className="text-sm mt-1">
                Upload some files to get started
              </div>
            </div>
          )
          : (
            <div className="grid grid-cols-3 gap-3">
              {currentAssets.map((path) => (
                <MediaTile
                  key={path}
                  path={path}
                  initialName={baseName(path)}
                  mode={modeOf(path)}
                  onModeChange={(mode) => setMode(path, mode)}
                  onRename={(newName) => handleRename(path, newName)}
                  onDelete={() => handleDelete(path)}
                />
              ))}
            </div>
          )}
      </ModalBody>

      <ModalFooter>
        <UploadButton onFiles={upload} uploading={uploading} />
      </ModalFooter>
    </Modal>
  );
}
