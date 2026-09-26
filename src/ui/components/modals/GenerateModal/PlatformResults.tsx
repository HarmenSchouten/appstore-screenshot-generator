/**
 * PlatformResults — one platform's successful files for a language, as
 * thumbnails or as a list. The feature graphic, when there is one, sits
 * full-width above the screenshot grid.
 */

import type { Dimensions, Platform } from "@app-types";
import type { GenerateResult } from "@ui/types.ts";
import { DEFAULT_DIMENSIONS, FEATURE_GRAPHIC_SIZE } from "@lib";
import { PLATFORM_META } from "@ui/utils/platform-meta.ts";
import { cn } from "@ui/utils/cn.ts";
import { outputUrl } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { type PlatformGroup, resultName } from "./results.ts";

interface PlatformResultsProps {
  platform: Platform;
  group: PlatformGroup;
  showPreviews: boolean;
  /** Query string that changes per run, so thumbnails re-download. */
  cacheBuster: number;
}

export function PlatformResults(
  { platform, group, showPreviews, cacheBuster }: PlatformResultsProps,
) {
  if (!group.feature && group.screenshots.length === 0) return null;

  return (
    <div className="mb-3 last:mb-0">
      <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center gap-1.5 font-medium">
        <i className={cn(PLATFORM_META[platform].icon, "text-xs")} />
        {PLATFORM_META[platform].label}
      </div>

      {showPreviews
        ? (
          <>
            {group.feature && (
              <div className="mb-2">
                <ResultCard
                  result={group.feature}
                  size={FEATURE_GRAPHIC_SIZE}
                  cacheBuster={cacheBuster}
                />
              </div>
            )}
            {group.screenshots.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {group.screenshots.map((r) => (
                  <ResultCard
                    key={r.relativePath}
                    result={r}
                    size={DEFAULT_DIMENSIONS[platform]}
                    cacheBuster={cacheBuster}
                    compact
                  />
                ))}
              </div>
            )}
          </>
        )
        : (
          <div className="space-y-0.5">
            {group.feature && <ResultRow result={group.feature} />}
            {group.screenshots.map((r) => (
              <ResultRow key={r.relativePath} result={r} />
            ))}
          </div>
        )}
    </div>
  );
}

function ResultCard({ result, size, cacheBuster, compact = false }: {
  result: GenerateResult;
  /** Sets the thumbnail's aspect ratio before the image loads. */
  size: Readonly<Dimensions>;
  cacheBuster: number;
  compact?: boolean;
}) {
  const name = resultName(result);
  const projectId = useAppStore((s) => s.currentProject);
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden">
      <img
        src={`${outputUrl(projectId, result.relativePath)}?t=${cacheBuster}`}
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
