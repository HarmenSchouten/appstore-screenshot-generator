/**
 * FailedResults — the files a run could not produce, each with its reason.
 */

import type { GenerateResult } from "@ui/types.ts";

export function FailedResults({ failed }: { failed: GenerateResult[] }) {
  if (failed.length === 0) return null;

  return (
    <div className="mb-3">
      <div className="text-[11px] uppercase tracking-wider text-red-400 mb-1.5 font-medium">
        Failed
      </div>
      <div className="space-y-1">
        {failed.map((r) => (
          <div
            key={r.relativePath}
            className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs"
          >
            <div className="flex items-center gap-2 text-zinc-300">
              <i className="fa-solid fa-triangle-exclamation text-[10px] text-red-400" />
              <span>
                {r.language}/{r.platform}: {r.screenshotName}
              </span>
            </div>
            <div className="mt-0.5 pl-[18px] text-red-300/80 break-words">
              {r.error}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
