/**
 * ImageSelect Component
 *
 * Dropdown selector with upload button for selecting/uploading images.
 */

import { useRef } from "react";
import { useUploadAsset } from "@hooks";

interface ImageSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label?: string;
  placeholder?: string;
}

export function ImageSelect({
  value,
  onChange,
  options,
  label,
  placeholder = "Select image...",
}: ImageSelectProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadAsset();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "images");

    upload.mutate(formData, {
      onSuccess: (data) => {
        onChange(data.path);
      },
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {label && (
        <label className="text-xs text-zinc-500 block mb-1">{label}</label>
      )}
      <div className="flex gap-2">
        <select
          value={value || ""}
          onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
          className="flex-1 px-3 py-2 rounded text-sm"
        >
          <option value="">{placeholder}</option>
          {options.map((p) => (
            <option key={p} value={p}>
              {p.split("/").pop()}
            </option>
          ))}
        </select>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={upload.isPending}
          className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm disabled:opacity-50"
          title="Upload new image"
        >
          <i className="fa-solid fa-upload" />
        </button>
      </div>
    </div>
  );
}
