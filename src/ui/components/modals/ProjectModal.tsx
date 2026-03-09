/**
 * ProjectModal Component
 * 
 * Modal for managing projects (create, switch, rename, delete).
 */

import { useState } from 'react';
import type { ProjectInfo } from '../../types';

interface ProjectModalProps {
  projects: ProjectInfo[];
  currentProject: string | null;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
  onSwitch: (projectId: string) => void;
  onDelete: (projectId: string) => Promise<void>;
  onRename: (projectId: string, newName: string) => Promise<void>;
}

export function ProjectModal({
  projects,
  currentProject,
  onClose,
  onCreate,
  onSwitch,
  onDelete,
  onRename,
}: ProjectModalProps) {
  const [newName, setNewName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await onCreate(newName.trim());
    setNewName('');
  };

  const handleDelete = async (projectId: string) => {
    await onDelete(projectId);
    setConfirmDelete(null);
  };

  const handleRename = async (projectId: string) => {
    if (editName.trim()) {
      await onRename(projectId, editName.trim());
      setEditingProject(null);
      setEditName('');
    }
  };

  const startEditing = (project: ProjectInfo) => {
    setEditingProject(project.id);
    setEditName(project.name);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-zinc-900 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Projects</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-xl">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Create new */}
        <div className="mb-4 p-3 bg-zinc-800/50 rounded">
          <div className="text-sm text-zinc-400 mb-2">Create New Project</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onInput={(e) => setNewName((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Project name"
              className="flex-1 px-3 py-2 rounded text-sm bg-zinc-800 border border-zinc-700"
            />
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>

        {/* Project list */}
        <div className="space-y-2">
          {projects.map((p) => (
            <div
              key={p.id}
              className={`p-3 rounded border ${
                currentProject === p.id
                  ? 'bg-indigo-900/50 border-indigo-500'
                  : 'bg-zinc-800/50 border-transparent hover:bg-zinc-800'
              }`}
            >
              {editingProject === p.id ? (
                // Rename mode
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editName}
                    onInput={(e) => setEditName((e.target as HTMLInputElement).value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(p.id);
                      if (e.key === 'Escape') setEditingProject(null);
                    }}
                    className="flex-1 px-2 py-1 rounded text-sm bg-zinc-800 border border-zinc-700"
                    autoFocus
                  />
                  <button
                    onClick={() => handleRename(p.id)}
                    className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-sm"
                  >
                    <i className="fa-solid fa-check" />
                  </button>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="px-2 py-1 bg-zinc-600 hover:bg-zinc-500 rounded text-sm"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
              ) : confirmDelete === p.id ? (
                // Delete confirmation
                <div className="text-center">
                  <p className="text-sm text-red-400 mb-2">Delete "{p.name}"?</p>
                  <p className="text-xs text-zinc-500 mb-3">
                    This will permanently delete all project data.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-3 py-1 bg-zinc-600 hover:bg-zinc-500 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Normal view
                <div className="flex items-center justify-between">
                  <div
                    className="cursor-pointer flex-1"
                    onClick={() => {
                      onSwitch(p.id);
                      onClose();
                    }}
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-zinc-500">{p.id}</div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(p);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded"
                      title="Rename"
                    >
                      <i className="fa-solid fa-pen text-xs" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(p.id);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded"
                      title="Delete"
                    >
                      <i className="fa-solid fa-trash text-xs" />
                    </button>
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
