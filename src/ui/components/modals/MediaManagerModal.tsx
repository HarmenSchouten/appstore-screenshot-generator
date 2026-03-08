/**
 * MediaManager Modal Component
 * 
 * Modal for managing media assets (screenshots, mascots, icons).
 */

import { useState, useRef } from 'preact/hooks';
import type { Assets } from '../../types.ts';

interface MediaManagerModalProps {
  assets: Assets;
  onClose: () => void;
  onRefresh: () => Promise<void>;
}

export function MediaManagerModal({ assets, onClose, onRefresh }: MediaManagerModalProps) {
  const [activeTab, setActiveTab] = useState<'screenshots' | 'mascots' | 'icons'>('screenshots');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const allAssets = {
    screenshots: assets.screenshots || [],
    mascots: assets.mascots || [],
    icons: assets.icons || [],
  };

  const currentAssets = allAssets[activeTab] || [];

  const handleUpload = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (!files?.length) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', activeTab);

      try {
        await fetch('/api/assets/upload', {
          method: 'POST',
          body: formData,
        });
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
    await onRefresh();
    setUploading(false);
    target.value = '';
  };

  const handleRename = async (oldPath: string) => {
    if (!newName.trim()) return;

    try {
      const res = await fetch('/api/assets/rename', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath, newName: newName.trim() }),
      });
      if (res.ok) {
        await onRefresh();
        setEditingItem(null);
        setNewName('');
      }
    } catch (err) {
      console.error('Rename failed:', err);
    }
  };

  const handleDelete = async (path: string) => {
    if (!confirm('Delete this file? This cannot be undone.')) return;

    try {
      const res = await fetch('/api/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
      if (res.ok) {
        await onRefresh();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const startEditing = (path: string) => {
    setEditingItem(path);
    const filename = path.split('/').pop() || '';
    const lastDot = filename.lastIndexOf('.');
    const nameWithoutExt = lastDot > 0 ? filename.substring(0, lastDot) : filename;
    setNewName(nameWithoutExt);
  };

  const tabs = [
    { id: 'screenshots' as const, label: 'Screenshots', icon: 'fa-mobile-screen' },
    { id: 'mascots' as const, label: 'Mascots', icon: 'fa-user-astronaut' },
    { id: 'icons' as const, label: 'Icons', icon: 'fa-icons' },
  ];

  return (
    <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div
        class="bg-zinc-900 rounded-lg w-[600px] max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div class="p-4 border-b border-zinc-800">
          <div class="flex justify-between items-center">
            <h2 class="font-bold text-lg">
              <i class="fa-solid fa-images mr-2" />
              Media Manager
            </h2>
            <button onClick={onClose} class="text-zinc-500 hover:text-white text-xl">
              <i class="fa-solid fa-xmark" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div class="flex border-b border-zinc-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              class={`flex-1 px-4 py-3 text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-white bg-zinc-800/50'
                  : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/30'
              }`}
            >
              <i class={`fa-solid ${tab.icon}`} />
              {tab.label}
              <span class="text-xs px-1.5 py-0.5 rounded bg-zinc-700">
                {allAssets[tab.id].length}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div class="flex-1 overflow-y-auto p-4">
          {currentAssets.length === 0 ? (
            <div class="text-center py-12 text-zinc-500">
              <i class="fa-solid fa-folder-open text-4xl mb-3" />
              <div>No {activeTab} yet</div>
              <div class="text-sm mt-1">Upload some files to get started</div>
            </div>
          ) : (
            <div class="grid grid-cols-3 gap-3">
              {currentAssets.map((path) => {
                const filename = path.split('/').pop() || '';
                const isEditing = editingItem === path;

                return (
                  <div key={path} class="bg-zinc-800 rounded overflow-hidden group">
                    <div class="aspect-square bg-zinc-700 relative">
                      <img
                        src={'/assets/' + path.replace('assets/', '')}
                        class="w-full h-full object-contain"
                        loading="lazy"
                      />
                      {/* Overlay actions */}
                      <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => startEditing(path)}
                          class="p-2 bg-zinc-700 hover:bg-zinc-600 rounded"
                          title="Rename"
                        >
                          <i class="fa-solid fa-pen" />
                        </button>
                        <button
                          onClick={() => handleDelete(path)}
                          class="p-2 bg-red-900/80 hover:bg-red-800 rounded"
                          title="Delete"
                        >
                          <i class="fa-solid fa-trash" />
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div class="p-2">
                        <input
                          type="text"
                          value={newName}
                          onInput={(e) => setNewName((e.target as HTMLInputElement).value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(path);
                            if (e.key === 'Escape') {
                              setEditingItem(null);
                              setNewName('');
                            }
                          }}
                          class="w-full px-2 py-1 text-xs rounded bg-zinc-700 border border-zinc-600"
                          autoFocus
                        />
                        <div class="flex gap-1 mt-1">
                          <button
                            onClick={() => handleRename(path)}
                            class="flex-1 px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(null);
                              setNewName('');
                            }}
                            class="flex-1 px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div class="p-2 text-xs text-zinc-400 truncate" title={filename}>
                        {filename}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with upload */}
        <div class="p-4 border-t border-zinc-800">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            class="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            class={`w-full py-2 rounded text-sm flex items-center justify-center gap-2 ${
              uploading
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {uploading ? (
              <>
                <i class="fa-solid fa-spinner fa-spin" />
                Uploading...
              </>
            ) : (
              <>
                <i class="fa-solid fa-upload" />
                Upload Files
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
