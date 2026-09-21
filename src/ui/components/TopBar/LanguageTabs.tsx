/**
 * LanguageTabs — one tab per language with an inline remove confirm, plus
 * the button that opens the picker for adding one.
 */

import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@ui/store/index.ts";
import {
  useAddLanguage,
  useDeleteLanguage,
  useNavigateSelection,
  useSelection,
} from "@hooks";
import { ConfirmBar, useConfirm } from "@ui/components/primitives/index.ts";
import { cn } from "@ui/utils/cn.ts";
import { getFlagForCode, LanguagePicker } from "./LanguagePicker.tsx";

export function LanguageTabs() {
  // Language codes, shallow-compared. Selecting the whole config here made
  // the bar re-render on every layer edit (#64).
  const languages = useAppStore(
    useShallow((s) => s.config.languages?.map((l) => l.language) ?? []),
  );
  const selection = useSelection();
  const navigateSelection = useNavigateSelection();
  const addLanguage = useAddLanguage();
  const deleteLanguage = useDeleteLanguage();

  const [pickerOpen, setPickerOpen] = useState(false);
  const confirmDelete = useConfirm<string>();
  const removable = languages.length > 1;

  return (
    <>
      <div className="flex gap-1 overflow-x-auto">
        {languages.map((lang) => (
          <div key={lang} className="shrink-0">
            {confirmDelete.armed === lang
              ? (
                <ConfirmBar
                  className="h-8 rounded"
                  message={`Delete ${lang}?`}
                  onConfirm={() => {
                    deleteLanguage.mutate(lang);
                    confirmDelete.disarm();
                  }}
                  onCancel={confirmDelete.disarm}
                />
              )
              : (
                <div
                  className={cn(
                    "h-8 flex items-center rounded text-xs uppercase font-medium transition-colors",
                    selection.lang === lang
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => navigateSelection({ lang })}
                    className={cn(
                      "h-full flex items-center gap-1.5 pl-2.5 rounded",
                      removable ? "pr-1" : "pr-2.5",
                    )}
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
                  {removable && (
                    <button
                      type="button"
                      onClick={() => confirmDelete.arm(lang)}
                      className={cn(
                        "mr-1.5 rounded px-1 transition-colors hover:bg-red-600 hover:text-white",
                        selection.lang === lang
                          ? "text-indigo-300"
                          : "text-zinc-600",
                      )}
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
          onClick={() => setPickerOpen(true)}
          className="h-8 w-8 flex items-center justify-center text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors shrink-0"
          title="Add Language"
        >
          <i className="fa-solid fa-plus" />
        </button>
      </div>

      {pickerOpen && (
        <LanguagePicker
          existingLanguages={languages}
          currentLanguage={selection.lang}
          onAdd={(code, copyFrom) => {
            addLanguage.mutate({ language: code, copyFrom });
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  );
}
