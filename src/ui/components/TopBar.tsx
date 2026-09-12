/**
 * TopBar Component
 *
 * Horizontal navigation bar with project selection, language/platform controls,
 * and action buttons (theme, media, generate).
 *
 * All interactive elements use h-8 (32px) for consistent vertical rhythm.
 */

import { memo, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@ui/store/index.ts";
import { getFlagForCode, LanguagePicker } from "./LanguagePicker.tsx";
import {
  useAddLanguage,
  useAssets,
  useCopyPlatformConfig,
  useCreateProject,
  useDeleteLanguage,
  useLastGeneratedQuery,
  useOverlay,
  useSwitchProject,
} from "@hooks";
import { ConfirmBar, useConfirm } from "@ui/components/primitives/index.ts";

interface TopBarProps {
  onGenerate: () => void;
}

function TopBarInner({ onGenerate }: TopBarProps) {
  // Language codes, shallow-compared. Selecting the whole config here made
  // the bar re-render on every layer edit (#64).
  const languages = useAppStore(
    useShallow((s) => s.config.languages?.map((l) => l.language) ?? []),
  );
  const projects = useAppStore((s) => s.projects);
  const currentProject = useAppStore((s) => s.currentProject);
  const selectedLang = useAppStore((s) => s.selectedLang);
  const selectedPlatform = useAppStore((s) => s.selectedPlatform);
  const assets = useAssets();
  const generating = useAppStore((s) => s.generating);
  const { data: lastGenerated } = useLastGeneratedQuery();

  const setSelectedLang = useAppStore((s) => s.setSelectedLang);
  const setSelectedPlatform = useAppStore((s) => s.setSelectedPlatform);
  const openModal = useAppStore((s) => s.openModal);
  const viewLastGenerated = useAppStore((s) => s.viewLastGenerated);

  const switchProject = useSwitchProject();
  const createProject = useCreateProject();
  const addLanguage = useAddLanguage();
  const deleteLanguage = useDeleteLanguage();
  const copyPlatform = useCopyPlatformConfig();

  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [quickCreateName, setQuickCreateName] = useState("");
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const confirmDeleteLang = useConfirm<string>();
  const confirmCopyPlatform = useConfirm();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOverlay(projectDropdownOpen, () => setProjectDropdownOpen(false));

  const currentProjectInfo = projects.find((p) => p.id === currentProject);
  const assetCount = assets.images.length;

  // Close dropdown on outside click
  useEffect(() => {
    if (!projectDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProjectDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [projectDropdownOpen]);

  // Shared height class for all interactive elements
  const btnH = "h-8";

  return (
    <header className="h-12 bg-zinc-900 border-b border-zinc-800 flex items-center px-3 gap-1.5 shrink-0">
      {/* Project selector — matches sidebar width (w-64 = 256px) */}
      <div className="relative w-64 shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setProjectDropdownOpen((v) => !v)}
          className={`${btnH} w-full flex items-center gap-2 px-2.5 rounded hover:bg-zinc-800 transition-colors`}
        >
          <i className="fa-solid fa-cube text-indigo-400 text-xs shrink-0" />
          <span className="text-sm font-semibold truncate flex-1 text-left">
            {currentProjectInfo?.name || "Project"}
          </span>
          <i
            className={`fa-solid fa-chevron-down text-zinc-500 text-[10px] transition-transform ${
              projectDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {projectDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-40 overflow-hidden">
            {/* Project list */}
            <div className="py-1 max-h-64 overflow-y-auto">
              {projects.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => {
                    switchProject.mutate(p.id);
                    setProjectDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-zinc-700 flex items-center gap-2 transition-colors ${
                    p.id === currentProject ? "text-white" : "text-zinc-400"
                  }`}
                >
                  <i
                    className={`fa-solid fa-cube text-xs ${
                      p.id === currentProject
                        ? "text-indigo-400"
                        : "text-zinc-600"
                    }`}
                  />
                  <span className="flex-1 truncate">{p.name}</span>
                  {p.id === currentProject && (
                    <i className="fa-solid fa-check text-indigo-400 text-xs" />
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-zinc-700" />

            {/* Quick create */}
            <div className="p-2">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={quickCreateName}
                  onInput={(e) =>
                    setQuickCreateName(
                      (e.target as HTMLInputElement).value,
                    )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && quickCreateName.trim()) {
                      createProject.mutate(quickCreateName.trim());
                      setQuickCreateName("");
                      setProjectDropdownOpen(false);
                    }
                  }}
                  placeholder="New project name..."
                  className="input flex-1 min-w-0 rounded border-zinc-600 bg-zinc-900 px-2.5 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (quickCreateName.trim()) {
                      createProject.mutate(quickCreateName.trim());
                      setQuickCreateName("");
                      setProjectDropdownOpen(false);
                    }
                  }}
                  disabled={!quickCreateName.trim()}
                  className="px-2.5 py-1.5 rounded text-xs bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fa-solid fa-plus" />
                </button>
              </div>
            </div>

            <div className="border-t border-zinc-700" />

            {/* Manage projects link */}
            <button
              type="button"
              onClick={() => {
                setProjectDropdownOpen(false);
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

      <div className="w-px h-5 bg-zinc-700 mx-1" />

      {/* Language tabs */}
      <div className="flex gap-1 overflow-x-auto">
        {languages.map((lang) => (
          <div key={lang} className="shrink-0 group/lang">
            {confirmDeleteLang.armed === lang
              ? (
                <ConfirmBar
                  className={`${btnH} rounded`}
                  message={`Delete ${lang}?`}
                  onConfirm={() => {
                    deleteLanguage.mutate(lang);
                    confirmDeleteLang.disarm();
                  }}
                  onCancel={confirmDeleteLang.disarm}
                />
              )
              : (
                <div
                  className={`${btnH} flex items-center rounded text-xs uppercase font-medium transition-colors ${
                    selectedLang === lang
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedLang(lang)}
                    className={`h-full flex items-center gap-1.5 pl-2.5 rounded ${
                      languages.length > 1 ? "pr-1" : "pr-2.5"
                    }`}
                  >
                    <span className="text-sm leading-none">
                      {getFlagForCode(lang)}
                    </span>
                    {lang}
                  </button>
                  {
                    /* A sibling of the tab button, not a child: interactive
                      content inside <button> is invalid HTML and the remove
                      action was unreachable by keyboard */
                  }
                  {languages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => confirmDeleteLang.arm(lang)}
                      className={`mr-1.5 rounded px-1 transition-colors hover:bg-red-600 hover:text-white ${
                        selectedLang === lang
                          ? "text-indigo-300"
                          : "text-zinc-600"
                      }`}
                      title={`Remove ${lang}`}
                      aria-label={`Remove ${lang}`}
                    >
                      <i className="fa-solid fa-xmark text-[10px]" />
                    </button>
                  )}
                </div>
              )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setLangPickerOpen(true)}
          className={`${btnH} w-8 flex items-center justify-center text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors shrink-0`}
          title="Add Language"
        >
          <i className="fa-solid fa-plus" />
        </button>
      </div>

      {langPickerOpen && (
        <LanguagePicker
          existingLanguages={languages}
          currentLanguage={selectedLang}
          onAdd={(code, copyFrom) => {
            addLanguage.mutate({ language: code, copyFrom });
            setLangPickerOpen(false);
          }}
          onClose={() => setLangPickerOpen(false)}
        />
      )}

      <div className="w-px h-5 bg-zinc-700 mx-1" />

      {/* Platform segmented control */}
      <div className="flex items-center gap-1.5">
        <div
          className={`${btnH} relative flex items-center bg-zinc-800 rounded-lg p-0.5`}
        >
          {/* Sliding indicator */}
          <div
            className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-md bg-indigo-600 shadow-sm transition-transform duration-200 ease-out"
            style={{
              transform: selectedPlatform === "ios"
                ? "translateX(calc(100% + 4px))"
                : "translateX(0)",
            }}
          />
          {(["android", "ios"] as const).map((platform) => (
            <button
              type="button"
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`relative z-10 h-full w-20 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors duration-200 ${
                selectedPlatform === platform
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <i
                className={`fa-brands fa-${
                  platform === "ios" ? "apple" : "android"
                }`}
              />
              {platform === "ios" ? "iOS" : "Android"}
            </button>
          ))}
        </div>
        {confirmCopyPlatform.armed
          ? (
            <ConfirmBar
              className={`${btnH} rounded`}
              tone="warning"
              message={`Copy to ${
                selectedPlatform === "android" ? "iOS" : "Android"
              }?`}
              confirmLabel="Copy"
              onConfirm={() => {
                copyPlatform.mutate({
                  sourcePlatform: selectedPlatform,
                  targetPlatform: selectedPlatform === "android"
                    ? "ios"
                    : "android",
                });
                confirmCopyPlatform.disarm();
              }}
              onCancel={confirmCopyPlatform.disarm}
            />
          )
          : (
            <button
              type="button"
              onClick={() => confirmCopyPlatform.arm()}
              className={`${btnH} w-8 flex items-center justify-center text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors`}
              title={`Copy ${selectedPlatform} screenshots to ${
                selectedPlatform === "android" ? "iOS" : "Android"
              }`}
            >
              <i className="fa-solid fa-arrow-right-arrow-left" />
            </button>
          )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action buttons */}
      <button
        type="button"
        onClick={() => openModal("theme")}
        className={`${btnH} w-8 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-400 hover:text-purple-400 transition-colors`}
        title="Theme & Colors"
      >
        <i className="fa-solid fa-palette" />
      </button>

      <button
        type="button"
        onClick={() => openModal("media")}
        className={`${btnH} px-2.5 rounded text-sm hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 flex items-center gap-1.5 transition-colors`}
        title="Media Library"
      >
        <i className="fa-solid fa-images" />
        <span className="text-xs">{assetCount}</span>
      </button>

      <button
        type="button"
        onClick={() => openModal("shortcuts")}
        className={`${btnH} w-8 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400 transition-colors`}
        title="Keyboard Shortcuts (?)"
      >
        <i className="fa-solid fa-keyboard text-xs" />
      </button>

      <div className="w-px h-5 bg-zinc-700 mx-0.5" />

      {/* Generate actions */}
      {lastGenerated && (
        <button
          type="button"
          onClick={() => viewLastGenerated(lastGenerated)}
          className={`${btnH} px-3 rounded text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1.5 transition-colors`}
          title="View Last Results"
        >
          <i className="fa-solid fa-eye text-xs" />
          <span className="text-xs">{lastGenerated.results.length}</span>
        </button>
      )}

      <button
        type="button"
        onClick={onGenerate}
        disabled={generating}
        className={`${btnH} px-3 rounded text-sm font-medium flex items-center gap-2 transition-colors ${
          generating
            ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/25"
        }`}
      >
        {generating
          ? (
            <>
              <i className="fa-solid fa-spinner fa-spin text-xs" />
              <span>Generating...</span>
            </>
          )
          : (
            <>
              <i className="fa-solid fa-wand-magic-sparkles text-xs" />
              <span>Generate</span>
            </>
          )}
      </button>
    </header>
  );
}

/**
 * Memoised so an edit in the canvas cannot re-render the whole bar; its
 * only prop, `onGenerate`, is a stable react-query `mutate`.
 */
export const TopBar = memo(TopBarInner);
