/**
 * MediaManager Modal Component
 *
 * Modal for managing image assets.
 */

import { useRef, useState } from "react";
import {
  useAssets,
  useDeleteAsset,
  useRenameAsset,
  useUploadAsset,
} from "@hooks";
import { useAppStore } from "@ui/store/index.ts";
import {
  ConfirmBar,
  Modal,
  ModalBody,
  ModalFooter,
  useConfirm,
} from "@ui/components/primitives/index.ts";
import { cn } from "@ui/utils/cn.ts";

interface MediaManagerModalProps {
  onClose: () => void;
}

export function MediaManagerModal(
  { onClose }: MediaManagerModalProps,
) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const confirmDelete = useConfirm<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadAsset = useUploadAsset();
  const renameAsset = useRenameAsset();
  const deleteAsset = useDeleteAsset();

  const uploading = uploadAsset.isPending;
  const currentAssets = useAssets().images;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "images");

      try {
        await uploadAsset.mutateAsync(formData);
        useAppStore.getState().addToast({
          type: "success",
          message: `Uploaded ${file.name}`,
        });
      } catch {
        // error toast comes from the global mutation cache; keep uploading
      }
    }
    e.target.value = "";
  };

  const handleRename = (oldPath: string) => {
    if (!newName.trim()) return;

    setEditingItem(null);
    setNewName("");

    renameAsset.mutate({ oldPath, newName: newName.trim() });
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

  const startEditing = (path: string) => {
    setEditingItem(path);
    const filename = path.split("/").pop() || "";
    const lastDot = filename.lastIndexOf(".");
    const nameWithoutExt = lastDot > 0
      ? filename.substring(0, lastDot)
      : filename;
    setNewName(nameWithoutExt);
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
              {currentAssets.map((path) => {
                const filename = path.split("/").pop() || "";
                const isEditing = editingItem === path;
                const isConfirming = confirmDelete.armed === path;

                return (
                  <div
                    key={path}
                    className="bg-zinc-800 rounded overflow-hidden group"
                  >
                    <div className="aspect-square bg-zinc-700 relative">
                      <img
                        src={"/assets/" + path.replace("assets/", "")}
                        alt={filename}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                      {/* Overlay actions */}
                      <div
                        className={cn(
                          "absolute inset-0 bg-black/60 transition-opacity flex items-center justify-center gap-2",
                          isConfirming
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100",
                        )}
                      >
                        {isConfirming
                          ? (
                            <ConfirmBar
                              className="mx-2 py-1.5"
                              message="Delete?"
                              onConfirm={() => handleDelete(path)}
                              onCancel={confirmDelete.disarm}
                            />
                          )
                          : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEditing(path)}
                                className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded"
                                title="Rename"
                              >
                                <i className="fa-solid fa-pen" />
                              </button>
                              <button
                                type="button"
                                onClick={() => confirmDelete.arm(path)}
                                className="p-2 bg-red-900/80 hover:bg-red-800 rounded"
                                title="Delete"
                              >
                                <i className="fa-solid fa-trash" />
                              </button>
                            </>
                          )}
                      </div>
                    </div>

                    {isEditing
                      ? (
                        <div className="p-2">
                          <input
                            type="text"
                            value={newName}
                            onInput={(e) =>
                              setNewName(
                                (e.target as HTMLInputElement).value,
                              )}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRename(path);
                              if (e.key === "Escape") {
                                // Cancels the edit only; the modal stays
                                e.stopPropagation();
                                setEditingItem(null);
                                setNewName("");
                              }
                            }}
                            className="input px-2 py-1 text-xs"
                            autoFocus
                          />
                          <div className="flex gap-1 mt-1">
                            <button
                              type="button"
                              onClick={() => handleRename(path)}
                              className="flex-1 px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 rounded"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(null);
                                setNewName("");
                              }}
                              className="flex-1 px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
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
              })}
            </div>
          )}
      </ModalBody>

      <ModalFooter>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "w-full py-2 rounded text-sm flex items-center justify-center gap-2",
            uploading
              ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500",
          )}
        >
          {uploading
            ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" />
                Uploading...
              </>
            )
            : (
              <>
                <i className="fa-solid fa-upload" />
                Upload Files
              </>
            )}
        </button>
      </ModalFooter>
    </Modal>
  );
}
