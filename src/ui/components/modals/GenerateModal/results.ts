/**
 * Shaping a run's results for display: successes grouped by language and
 * platform, the fixed-size placements set apart from the screenshots.
 */

import type { Platform } from "@app-types";
import type { GenerateResult } from "@ui/types.ts";
import { getRoleLabel, PLATFORMS } from "@lib";

export interface PlatformGroup {
  placements: GenerateResult[];
  screenshots: GenerateResult[];
}

export type LanguageGroup = Record<Platform, PlatformGroup>;

function emptyGroup(): PlatformGroup {
  return { placements: [], screenshots: [] };
}

/** Languages in the order their first result appeared. */
export function groupResults(
  results: GenerateResult[],
): Map<string, LanguageGroup> {
  const grouped = new Map<string, LanguageGroup>();
  for (const r of results) {
    if (r.status !== "success") continue;
    let lang = grouped.get(r.language);
    if (!lang) {
      lang = { android: emptyGroup(), ios: emptyGroup() };
      grouped.set(r.language, lang);
    }
    if (r.role === "screenshot") {
      lang[r.platform].screenshots.push(r);
    } else {
      lang[r.platform].placements.push(r);
    }
  }
  return grouped;
}

export function countItems(group: LanguageGroup): number {
  return PLATFORMS.reduce(
    (n, p) => n + group[p].screenshots.length + group[p].placements.length,
    0,
  );
}

/** The screenshot's name; unnamed ones show the file name or their role. */
export function resultName(r: GenerateResult): string {
  if (r.screenshotName) return r.screenshotName;
  if (r.role !== "screenshot") return getRoleLabel(r.role);
  return r.relativePath.split("/").pop() || r.relativePath;
}
