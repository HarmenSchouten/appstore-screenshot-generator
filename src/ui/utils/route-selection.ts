/**
 * Route ⇄ selection.
 *
 * The URL owns the project, language, platform and selected screenshot; this
 * module is the one place its segments are validated. Pure functions, no
 * React and no store, so the precedence rules on `resolveTarget` are testable
 * on their own and every caller agrees on them.
 */

import type { Platform } from "@app-types";
import { isPlatform } from "@lib";

/** What a URL naming no platform — or one that is not a platform — means. */
const DEFAULT_PLATFORM: Platform = "android";

/** Everything after the project: the part scoped to one project's config. */
export interface RouteTail {
  lang: string | null;
  platform: string | null;
  screenshotId: string | null;
}

export interface RouteSegments extends RouteTail {
  project: string | null;
}

const NO_TAIL: RouteTail = { lang: null, platform: null, screenshotId: null };

/** A validated selection: every field names something that exists. */
export interface Selection {
  project: string;
  lang: string;
  platform: Platform;
  screenshotId: string | null;
}

export type SelectionPatch = Partial<Omit<Selection, "project">>;

/**
 * A project to activate — asked for by a URL, or picked in the UI. The server
 * keeps one project active, so naming another in the URL is a request.
 */
export interface ProjectRequest {
  projectId: string;
  /**
   * The tail the URL carried, unvalidated: only the requested project's own
   * config can say whether it still resolves.
   */
  tail?: RouteTail;
}

/** What `resolveTarget` needs to know about the loaded config. */
export interface TargetContext {
  /** The project the loaded config belongs to. */
  loadedProject: string;
  projectIds: readonly string[];
  languages: readonly string[];
}

/** A resolved route minus the screenshot, which needs its own lookup. */
export interface Target {
  project: string;
  lang: string;
  platform: Platform;
  /** Straight from the URL; may name a screenshot that no longer exists. */
  requestedScreenshotId: string | null;
  switchTo: ProjectRequest | null;
}

export interface ResolvedRoute {
  /** What the panels render — always valid against the loaded config. */
  selection: Selection;
  /** Where the URL belongs; equal to the current path when it is already right. */
  canonicalPath: string;
  switchTo: ProjectRequest | null;
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    // A hand-typed path can hold a stray "%" — take it as literal text
    return segment;
  }
}

export function parseSegments(pathname: string): RouteSegments {
  const [project, lang, platform, screenshotId] = pathname
    .split("/")
    .filter((segment) => segment !== "")
    .map(decodeSegment);
  return {
    project: project ?? null,
    lang: lang ?? null,
    platform: platform ?? null,
    screenshotId: screenshotId ?? null,
  };
}

/** `/project/lang/platform/screenshotId`, stopping at the first empty slot. */
export function buildPath(segments: RouteSegments): string {
  const path: string[] = [];
  for (
    const segment of [
      segments.project,
      segments.lang,
      segments.platform,
      segments.screenshotId,
    ]
  ) {
    if (!segment) break;
    path.push(encodeURIComponent(segment));
  }
  return "/" + path.join("/");
}

/** The segments a project request stands for. */
export function requestSegments(request: ProjectRequest): RouteSegments {
  return { project: request.projectId, ...(request.tail ?? NO_TAIL) };
}

/**
 * Resolve the navigational segments against the loaded config.
 *
 * Precedence, in order:
 * - An unknown project, or none, means the loaded one. A known project that
 *   is not the loaded one is a `switchTo` request and takes the tail with it
 *   untouched — those segments belong to that project's config, not this one.
 *   The panels keep rendering the loaded project until it is activated, so
 *   the tail is also resolved here, for as long as that takes.
 * - Slot 2 is a language when it names one, otherwise a platform when it
 *   names one — so `/project/ios` reads as the platform it obviously is, and
 *   the rest of the path shifts along with it. A language wins the tie: the
 *   slot's meaning is a language code.
 * - Whatever is left unmatched falls back to the first language and
 *   `android`; a stale screenshot id is dropped by `resolveSelection`.
 */
export function resolveTarget(
  segments: RouteSegments,
  { loadedProject, projectIds, languages }: TargetContext,
): Target {
  const requested = segments.project;
  const switchTo = requested !== null && requested !== loadedProject &&
      projectIds.includes(requested)
    ? {
      projectId: requested,
      tail: {
        lang: segments.lang,
        platform: segments.platform,
        screenshotId: segments.screenshotId,
      },
    }
    : null;

  const promoted = segments.lang !== null &&
    !languages.includes(segments.lang) && isPlatform(segments.lang);
  const lang = promoted ? null : segments.lang;
  const platform = promoted ? segments.lang : segments.platform;
  const screenshotId = promoted ? segments.platform : segments.screenshotId;

  return {
    project: loadedProject,
    lang: lang !== null && languages.includes(lang) ? lang : languages[0] ?? "",
    platform: isPlatform(platform) ? platform : DEFAULT_PLATFORM,
    requestedScreenshotId: screenshotId,
    switchTo,
  };
}

/**
 * Finish a target against the screenshots of its own language and platform:
 * an id naming none of them is stale and selects nothing.
 */
export function resolveSelection(
  target: Target,
  screenshotIds: readonly string[],
): ResolvedRoute {
  const { requestedScreenshotId: requested, switchTo } = target;
  const selection: Selection = {
    project: target.project,
    lang: target.lang,
    platform: target.platform,
    screenshotId: requested !== null && screenshotIds.includes(requested)
      ? requested
      : null,
  };
  return {
    selection,
    // A pending switch leaves the URL as it stands: its tail is for the
    // project being activated, and canonicalising it here against the loaded
    // config would throw away what the link asked for.
    canonicalPath: switchTo
      ? buildPath(requestSegments(switchTo))
      : buildPath(selection),
    switchTo,
  };
}

/**
 * Apply a change to the current selection. A screenshot id is scoped to one
 * language and platform, so changing either drops it unless the patch names a
 * replacement.
 */
export function nextSelection(
  current: Selection,
  patch: SelectionPatch,
): Selection {
  const next = { ...current, ...patch };
  const scopeChanged = next.lang !== current.lang ||
    next.platform !== current.platform;
  return scopeChanged && patch.screenshotId === undefined
    ? { ...next, screenshotId: null }
    : next;
}

/**
 * One activate request in flight per project. React StrictMode runs a mount
 * effect twice; the second run must not send a second `activate`.
 */
export function createActivateLatch() {
  let pending: string | null = null;
  return {
    /** False when that project is already being activated. */
    claim(projectId: string): boolean {
      if (pending === projectId) return false;
      pending = projectId;
      return true;
    },
    settle(): void {
      pending = null;
    },
  };
}
