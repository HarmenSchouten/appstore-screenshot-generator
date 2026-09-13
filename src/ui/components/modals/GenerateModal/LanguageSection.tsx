/**
 * LanguageSection — a collapsible language heading over its platforms.
 */

import { PLATFORMS } from "@lib";
import { cn } from "@ui/utils/cn.ts";
import { PlatformResults } from "./PlatformResults.tsx";
import { countItems, type LanguageGroup } from "./results.ts";

interface LanguageSectionProps {
  lang: string;
  group: LanguageGroup;
  collapsed: boolean;
  onToggle: () => void;
  showPreviews: boolean;
  cacheBuster: number;
}

export function LanguageSection(
  { lang, group, collapsed, onToggle, showPreviews, cacheBuster }:
    LanguageSectionProps,
) {
  const count = countItems(group);

  return (
    <div className="mb-2 last:mb-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={!collapsed}
        className="flex items-center gap-2 w-full text-left text-sm text-zinc-300 hover:text-white py-1.5 group"
      >
        <i
          className={cn(
            "fa-solid fa-chevron-right text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-transform",
            !collapsed && "rotate-90",
          )}
        />
        <span className="uppercase font-medium tracking-wide text-xs">
          {lang}
        </span>
        <span className="text-[11px] text-zinc-600 font-normal">
          {count} {count === 1 ? "item" : "items"}
        </span>
      </button>

      {!collapsed && (
        <div className="pl-5 mt-1">
          {PLATFORMS.map((platform) => (
            <PlatformResults
              key={platform}
              platform={platform}
              group={group[platform]}
              showPreviews={showPreviews}
              cacheBuster={cacheBuster}
            />
          ))}
        </div>
      )}
    </div>
  );
}
