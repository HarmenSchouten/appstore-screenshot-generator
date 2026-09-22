/**
 * UploadButton — the hidden file input and the button that opens it.
 *
 * Owns the input's value reset, so picking the same file twice in a row
 * still fires `change`.
 */

import { useRef } from "react";
import { cn } from "@ui/utils/cn.ts";

interface UploadButtonProps {
  onFiles: (files: File[]) => void | Promise<void>;
  uploading: boolean;
}

export function UploadButton({ onFiles, uploading }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    await onFiles(files);
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
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
    </>
  );
}
