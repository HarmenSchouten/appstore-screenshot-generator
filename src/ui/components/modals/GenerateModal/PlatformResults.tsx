/**
 * PlatformResults — one platform's successful files for a language, as
 * thumbnails or as a list. The fixed-size placements, when there are any,
 * sit full-width above the screenshot grid.
 */

import type { Dimensions, Platform } from "@app-types";
import type { GenerateResult } from "@ui/types.ts";
import { DEFAULT_DIMENSIONS, getScreenshotDimensions } from "@lib";
import { PLATFORM_META } from "@ui/utils/platform-meta.ts";
import { cn } from "@ui/utils/cn.ts";
import { type PlatformGroup, resultName } from "./results.ts";

interface PlatformResultsProps {
  platform: Platform;
  group: PlatformGroup;
  showPreviews: boolean;
  /**
   * URL of a result file in the run's project, with a query string that
   * changes per run so thumbnails re-download.
   */
  resultUrl: (relativePath: string) => string;
}

export function PlatformResults(
  { platform, group, showPreviews, resultUrl }: PlatformResultsProps,
) {
  if (group.placements.length === 0 && group.screenshots.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 last:mb-0">
      <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center gap-1.5 font-medium">
        <i className={cn(PLATFORM_META[platform].icon, "text-xs")} />
        {PLATFORM_META[platform].label}
      </div>

      {showPreviews
        ? (
          <>
            {group.placements.length > 0 && (
              <div className="mb-2 space-y-2">
                {group.placements.map((r) => (
                  <ResultCard
                    key={r.relativePath}
                    result={r}
                    size={getScreenshotDimensions(
                      r,
                      DEFAULT_DIMENSIONS[platform],
                    )}
                    resultUrl={resultUrl}
                  />
                ))}
              </div>
            )}
            {group.screenshots.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {group.screenshots.map((r) => (
                  <ResultCard
                    key={r.relativePath}
                    result={r}
                    size={DEFAULT_DIMENSIONS[platform]}
                    resultUrl={resultUrl}
                    compact
                  />
                ))}
              </div>
            )}
          </>
        )
        : (
          <div className="space-y-0.5">
            {group.placements.map((r) => (
              <ResultRow key={r.relativePath} result={r} />
            ))}
            {group.screenshots.map((r) => (
              <ResultRow key={r.relativePath} result={r} />
            ))}
          </div>
        )}
    </div>
  );
}

function ResultCard({ result, size, resultUrl, compact = false }: {
  result: GenerateResult;
  /** Sets the thumbnail's aspect ratio before the image loads. */
  size: Readonly<Dimensions>;
  resultUrl: (relativePath: string) => string;
  compact?: boolean;
}) {
  const name = resultName(result);
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden">
      <img
        src={resultUrl(result.relativePath)}
        alt={name}
        className="w-full object-contain bg-zinc-800"
        style={{ aspectRatio: `${size.width} / ${size.height}` }}
        loading="lazy"
      />
      <div
        className={cn(
          "text-zinc-500 truncate border-t border-zinc-700/50",
          compact ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-xs",
        )}
        title={result.relativePath}
      >
        {name}
      </div>
    </div>
  );
}

function ResultRow({ result }: { result: GenerateResult }) {
  return (
    <div className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded hover:bg-zinc-800/50">
      <i className="fa-solid fa-check text-[10px] text-zinc-500" />
      <span className="text-zinc-300">{resultName(result)}</span>
      <span className="text-zinc-600 truncate ml-auto text-[11px]">
        {result.relativePath}
      </span>
    </div>
  );
}
