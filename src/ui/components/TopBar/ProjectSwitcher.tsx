/**
 * ProjectSwitcher — the current project's name, opening a dropdown with the
 * project list, a quick-create field, and the link to the projects modal.
 */

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@ui/store/index.ts";
import { useCreateProject, useOverlay, useSwitchProject } from "@hooks";
import { cn } from "@ui/utils/cn.ts";

export function ProjectSwitcher() {
  const projects = useAppStore((s) => s.projects);
  const currentProject = useAppStore((s) => s.currentProject);
  const openModal = useAppStore((s) => s.openModal);
  const switchProject = useSwitchProject();
  const createProject = useCreateProject();

  const [open, setOpen] = useState(false);
  const [quickCreateName, setQuickCreateName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOverlay(open, () => setOpen(false));

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const currentName = projects.find((p) => p.id === currentProject)?.name;
  const canCreate = quickCreateName.trim().length > 0;

  const submitQuickCreate = () => {
    if (!canCreate) return;
    createProject.mutate(quickCreateName.trim());
    setQuickCreateName("");
    setOpen(false);
  };

  return (
    // Matches the sidebar width (w-64 = 256px)
    <div className="relative w-64 shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-8 w-full flex items-center gap-2 px-2.5 rounded hover:bg-zinc-800 transition-colors"
      >
        <i className="fa-solid fa-cube text-indigo-400 text-xs shrink-0" />
        <span className="text-sm font-semibold truncate flex-1 text-left">
          {currentName || "Project"}
        </span>
        <i
          className={cn(
            "fa-solid fa-chevron-down text-zinc-500 text-[10px] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-40 overflow-hidden">
          <div className="py-1 max-h-64 overflow-y-auto">
            {projects.map((p) => {
              const isCurrent = p.id === currentProject;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => {
                    switchProject.mutate(p.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left hover:bg-zinc-700 flex items-center gap-2 transition-colors",
                    isCurrent ? "text-white" : "text-zinc-400",
                  )}
                >
                  <i
                    className={cn(
                      "fa-solid fa-cube text-xs",
                      isCurrent ? "text-indigo-400" : "text-zinc-600",
                    )}
                  />
                  <span className="flex-1 truncate">{p.name}</span>
                  {isCurrent && (
                    <i className="fa-solid fa-check text-indigo-400 text-xs" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t border-zinc-700" />

          <div className="p-2 flex gap-1.5">
            <input
              type="text"
              value={quickCreateName}
              onInput={(e) =>
                setQuickCreateName((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitQuickCreate();
              }}
              placeholder="New project name..."
              className="input flex-1 min-w-0 rounded border-zinc-600 bg-zinc-900 px-2.5 py-1.5 text-xs"
            />
            <button
              type="button"
              onClick={submitQuickCreate}
              disabled={!canCreate}
              className="px-2.5 py-1.5 rounded text-xs bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fa-solid fa-plus" />
            </button>
          </div>

          <div className="border-t border-zinc-700" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openModal("projects");
            }}
            className="w-full px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 flex items-center gap-2 transition-colors"
          >
            <i className="fa-solid fa-gear text-[10px]" />
            Manage Projects...
          </button>
        </div>
      )}
    </div>
  );
}
