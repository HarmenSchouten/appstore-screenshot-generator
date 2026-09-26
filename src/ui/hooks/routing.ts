/**
 * Routing — the URL is the source of truth for project, language, platform
 * and the selected screenshot.
 *
 * Nothing writes those into the store. Each render resolves the path against
 * the loaded config (`@ui/utils/route-selection.ts` owns the rules), and the
 * only writes back to the URL are corrections: one that spells out what a
 * path resolved to, and the one `useSwitchProject` makes once a project the
 * URL asked for has loaded — or failed to.
 */

import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { selectRoute, useAppStore } from "@ui/store/index.ts";
import {
  buildPath,
  nextSelection,
  parseSegments,
  type Selection,
  type SelectionPatch,
  tailOf,
} from "@ui/utils/route-selection.ts";
import { switchGuard } from "@ui/utils/switch-guard.ts";
import { useSwitchProject } from "./projects.ts";

/**
 * Resolve the current path against the loaded config.
 *
 * The subscription yields flat values so that shallow comparison holds an
 * identity for them: consumers re-render when the route changes, not on
 * every keystroke into the config it is resolved against (#64).
 */
function useRoute(): {
  selection: Selection;
  canonicalPath: string;
  /** Project the path asks for that is not the loaded one, if any. */
  switchTo: string | null;
} {
  const { pathname } = useLocation();
  const segments = useMemo(() => parseSegments(pathname), [pathname]);

  const { project, lang, platform, canonicalPath, screenshotId, switchTo } =
    useAppStore(
      useShallow((s) => {
        const route = selectRoute(s, segments);
        return {
          ...route.selection,
          canonicalPath: route.canonicalPath,
          switchTo: route.switchTo?.projectId ?? null,
        };
      }),
    );

  const selection = useMemo(
    () => ({ project, lang, platform, screenshotId }),
    [project, lang, platform, screenshotId],
  );

  return { selection, canonicalPath, switchTo };
}

/** The project, language, platform and screenshot the URL names. */
export function useSelection(): Selection {
  return useRoute().selection;
}

/**
 * Navigate by patching the current selection.
 *
 * A language or platform change pushes, so Back returns to the tab it came
 * from; selecting and deselecting a screenshot replaces, so Back does not
 * walk through every click.
 */
export function useNavigateSelection() {
  const { selection, switchTo } = useRoute();
  const navigate = useNavigate();

  return useCallback((patch: SelectionPatch) => {
    // A switch in flight owns the path: it is about to write the project it
    // is loading, over anything patched onto the one being left.
    if (switchTo) return;
    const scoped = patch.lang !== undefined || patch.platform !== undefined;
    navigate(buildPath(nextSelection(selection, patch)), { replace: !scoped });
  }, [selection, switchTo, navigate]);
}

/**
 * Keep the URL and the loaded project in step — App mounts this once.
 *
 * Neither effect is a sync: the first rewrites a path that does not spell
 * out what it resolved to (`/` on first load, a language that was just
 * deleted, a screenshot id that no longer exists), the second loads the
 * project the URL names.
 */
export function useRouteReconciler() {
  const { pathname } = useLocation();
  const { canonicalPath, switchTo } = useRoute();
  const navigate = useNavigate();
  const { mutate: switchProject } = useSwitchProject();

  useEffect(() => {
    if (pathname !== canonicalPath) navigate(canonicalPath, { replace: true });
  }, [pathname, canonicalPath, navigate]);

  // Keyed on the path alone: a switch answers the URL, and a reconciler that
  // also reacted to the store would leave two projects loading each other
  // forever — hydrating lands before the navigation that follows it.
  useEffect(() => {
    if (!switchTo || !switchGuard.claim(switchTo)) return;
    switchProject({
      projectId: switchTo,
      tail: tailOf(parseSegments(pathname)),
    });
  }, [pathname]);
}
