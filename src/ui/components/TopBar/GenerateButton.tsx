/**
 * The export actions: start a run, and reopen the previous run's results.
 * `GenerateButton` mounts its own `useGenerateAll` — the run's abort
 * controller is module state, so the modal's Cancel reaches it (#70).
 */

import { useAppStore } from "@ui/store/index.ts";
import { useGenerateAll, useLastGeneratedQuery } from "@hooks";

export function GenerateButton() {
  const generating = useAppStore((s) => s.generating);
  const generateAll = useGenerateAll();

  return (
    <button
      type="button"
      onClick={() => generateAll.mutate()}
      disabled={generating}
      className={`h-8 px-3 rounded text-sm font-medium flex items-center gap-2 transition-colors ${
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
  );
}

/** Shown once a run has produced a manifest; reopens it in the modal. */
export function LastResultsButton() {
  const { data: lastGenerated } = useLastGeneratedQuery();
  const viewLastGenerated = useAppStore((s) => s.viewLastGenerated);

  if (!lastGenerated) return null;

  return (
    <button
      type="button"
      onClick={() => viewLastGenerated(lastGenerated)}
      className="h-8 px-3 rounded text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1.5 transition-colors"
      title="View Last Results"
    >
      <i className="fa-solid fa-eye text-xs" />
      <span className="text-xs">{lastGenerated.results.length}</span>
    </button>
  );
}
