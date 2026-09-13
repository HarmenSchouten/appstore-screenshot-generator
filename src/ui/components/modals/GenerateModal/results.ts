/**
 * Shaping a run's results for display: successes grouped by language and
 * platform, the Android feature graphic set apart from the screenshots.
 */

import type { Platform } from "@app-types";
import type { GenerateResult } from "@ui/types.ts";
import { PLATFORMS } from "@lib";

export interface PlatformGroup {
  feature: GenerateResult | null;
  screenshots: GenerateResult[];
}

export type LanguageGroup = Record<Platform, PlatformGroup>;

/** Languages in the order their first result appeared. */
export function groupResults(
  results: GenerateResult[],
): Map<string, LanguageGroup> {
  const grouped = new Map<string, LanguageGroup>();
  for (const r of results) {
    if (r.status !== "success") continue;
    let lang = grouped.get(r.language);
    if (!lang) {
      lang = {
        android: { feature: null, screenshots: [] },
        ios: { feature: null, screenshots: [] },
      };
      grouped.set(r.language, lang);
    }
    if (r.role === "feature-graphic" && r.platform === "android") {
      lang.android.feature = r;
    } else {
      lang[r.platform].screenshots.push(r);
    }
  }
  return grouped;
}

export function countItems(group: LanguageGroup): number {
  return PLATFORMS.reduce(
    (n, p) => n + group[p].screenshots.length + (group[p].feature ? 1 : 0),
    0,
  );
}

/** The screenshot's name; unnamed ones show the file name or their role. */
export function resultName(r: GenerateResult): string {
  if (r.screenshotName) return r.screenshotName;
  if (r.role === "feature-graphic") return "Feature Graphic";
  return r.relativePath.split("/").pop() || r.relativePath;
}
