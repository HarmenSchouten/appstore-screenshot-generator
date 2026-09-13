/**
 * GenerateModal — progress while a run is live; afterwards the failures
 * with their reasons and the files, grouped by language and platform.
 */

import { useMemo, useState } from "react";
import type { GenerateProgress } from "@ui/types.ts";
import { cancelGeneration, useOpenOutputFolder } from "@hooks";
import {
  Modal,
  ModalBody,
  ModalFooter,
} from "@ui/components/primitives/index.ts";
import { cn } from "@ui/utils/cn.ts";
import { FailedResults } from "./FailedResults.tsx";
import { LanguageSection } from "./LanguageSection.tsx";
import { groupResults } from "./results.ts";

interface GenerateModalProps {
  progress: GenerateProgress;
  generating: boolean;
  onClose: () => void;
}

export function GenerateModal(
  { progress, generating, onClose }: GenerateModalProps,
) {
  const { current, total, item, results, error } = progress;
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  const isDone = !generating && (results !== null || error !== null);

  const successCount = results?.filter((r) => r.status === "success").length ||
    0;
  const failed = useMemo(
    () => results?.filter((r) => r.status === "error") ?? [],
    [results],
  );
  const grouped = useMemo(() => groupResults(results ?? []), [results]);

  // One cache-buster per result set, not per render: `Date.now()` inline in
  // the src made every thumbnail re-download whenever the modal re-rendered
  // — collapsing a language, toggling grid/list (#64). A new run brings a
  // new `results` array, which is exactly when the files may have changed.
  const cacheBuster = useMemo(() => Date.now(), [results]);

  const openFolder = useOpenOutputFolder();
  const [collapsedLangs, setCollapsedLangs] = useState<Set<string>>(new Set());
  const [showPreviews, setShowPreviews] = useState(true);

  const toggleLang = (lang: string) => {
    setCollapsedLangs((prev) => {
      const next = new Set(prev);
      if (next.has(lang)) next.delete(lang);
      else next.add(lang);
      return next;
    });
  };

  const title = error
    ? "Generation Failed"
    : isDone
    ? "Generation Complete"
    : "Generating...";

  const subtitle = !isDone
    ? <span className="block truncate max-w-[500px]">{item}</span>
    : !error
    ? (
      <>
        {successCount} {successCount === 1 ? "file" : "files"} generated
        {failed.length > 0 && (
          <span className="text-red-400 ml-1.5">
            &middot; {failed.length} failed
          </span>
        )}
      </>
    )
    : undefined;

  return (
    <Modal
      title={title}
      subtitle={subtitle}
      icon={cn(
        "fa-solid fa-wand-magic-sparkles text-sm",
        error ? "text-red-400" : "text-indigo-400",
      )}
      size="xl"
      onClose={onClose}
      // A stray click must not hide a running export
      closeOnBackdrop={false}
      headerAction={!isDone && (
        <button
          type="button"
          onClick={cancelGeneration}
          className="text-xs px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
        >
          Cancel
        </button>
      )}
    >
      {/* Progress bar — visible in both states */}
      <div className="px-5 pb-4">
        <div className="bg-zinc-800 rounded-full h-1 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              error
                ? "bg-red-500"
                : isDone && failed.length > 0
                ? "bg-amber-500"
                : "bg-indigo-500",
            )}
            style={{ width: `${isDone && !error ? 100 : percent}%` }}
          />
        </div>
        {!isDone && (
          <div className="flex justify-end mt-1.5">
            <span className="text-[11px] text-zinc-600 tabular-nums">
              {current} / {total}
            </span>
          </div>
        )}
      </div>

      {/* Run-level failure: the export could not run at all */}
      {error && (
        <>
          <div className="mx-5 mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">
            <div className="font-medium text-red-300 mb-0.5">
              The export could not run
            </div>
            <div className="text-xs text-red-300/80 break-words">{error}</div>
          </div>
          <ModalFooter>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm transition-colors"
            >
              Close
            </button>
          </ModalFooter>
        </>
      )}

      {isDone && !error && (
        <>
          <div className="flex items-center justify-between px-5 pb-3">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
              Results
            </span>
            <button
              type="button"
              onClick={() => setShowPreviews(!showPreviews)}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors"
            >
              <i
                className={cn(
                  "fa-solid text-[10px]",
                  showPreviews ? "fa-th-large" : "fa-list",
                )}
              />
              {showPreviews ? "Grid" : "List"}
            </button>
          </div>

          <ModalBody className="pb-2">
            {/* Failures first, with the real reason */}
            <FailedResults failed={failed} />

            {[...grouped].map(([lang, group]) => (
              <LanguageSection
                key={lang}
                lang={lang}
                group={group}
                collapsed={collapsedLangs.has(lang)}
                onToggle={() => toggleLang(lang)}
                showPreviews={showPreviews}
                cacheBuster={cacheBuster}
              />
            ))}
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              onClick={() => openFolder.mutate()}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <i className="fa-solid fa-folder-open text-xs" /> Open in Explorer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm transition-colors"
            >
              Done
            </button>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}
