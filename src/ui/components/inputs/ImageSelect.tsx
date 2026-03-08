/**
 * ImageSelect Component
 * 
 * Dropdown selector with upload button for selecting/uploading images.
 */

import { useState, useRef } from 'preact/hooks';

interface ImageSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  category?: string;
  onAssetsRefresh?: () => Promise<void>;
  label?: string;
  placeholder?: string;
}

export function ImageSelect({
  value,
  onChange,
  options,
  category,
  onAssetsRefresh,
  label,
  placeholder = 'Select image...',
}: ImageSelectProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category || 'screenshots');

    try {
      const res = await fetch('/api/assets/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        // Refresh assets list and select the new file
        if (onAssetsRefresh) await onAssetsRefresh();
        onChange(data.path);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      {label && <label class="text-xs text-zinc-500 block mb-1">{label}</label>}
      <div class="flex gap-2">
        <select
          value={value || ''}
          onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
          class="flex-1 px-3 py-2 rounded text-sm"
        >
          <option value="">{placeholder}</option>
          {options.map((p) => (
            <option key={p} value={p}>
              {p.split('/').pop()}
            </option>
          ))}
        </select>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          class="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          class="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm disabled:opacity-50"
          title="Upload new image"
        >
          <i class="fa-solid fa-upload" />
        </button>
      </div>
    </div>
  );
}
