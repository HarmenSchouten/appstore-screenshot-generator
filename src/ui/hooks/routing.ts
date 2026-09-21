/**
 * Routing — the URL is the source of truth for project, language, platform
 * and the selected screenshot.
 *
 * Nothing writes those into the store. Each render resolves the path against
 * the loaded config (`@ui/utils/route-selection.ts` owns the rules), and the
 * only writes back to the URL are corrections: one that spells out what a
 * path resolved to, and the one `useSwitchProject` makes once a project the
 * URL asked for is loaded.
 */

import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { selectScreenshots, useAppStore } from "@ui/store/index.ts";
import {
  buildPath,
  createActivateLatch,
  nextSelection,
  parseSegments,
  type ResolvedRoute,
  resolveSelection,
  resolveTarget,
  type Selection,
  type SelectionPatch,
} from "@ui/utils/route-selection.ts";
import { useSwitchProject } from "./projects.ts";

/**
 * Resolve the current path. Every store read is narrow or shallow-compared:
 * subscribing to `config` would re-render every consumer of the selection on
 * each keystroke (#64).
 */
function useRoute(): ResolvedRoute {
  const { pathname } = useLocation();
  const loadedProject = useAppStore((s) => s.currentProject);
  const projectIds = useAppStore(
    useShallow((s) => s.projects.map((p) => p.id)),
  );
  const languages = useAppStore(
    useShallow((s) => s.config.languages?.map((l) => l.language) ?? []),
  );

  const target = useMemo(
    () =>
      resolveTarget(parseSegments(pathname), {
        loadedProject,
        projectIds,
        languages,
      }),
    [pathname, loadedProject, projectIds, languages],
  );

  // The id is validated against the screenshots of the language and platform
  // the path resolved to, so this subscription has to follow that resolution.
  const screenshotIds = useAppStore(
    useShallow((s) =>
      selectScreenshots(s, target.lang, target.platform).map((x) => x.id)
    ),
  );

  return useMemo(
    () => resolveSelection(target, screenshotIds),
    [target, screenshotIds],
  );
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
  const selection = useSelection();
  const navigate = useNavigate();

  return useCallback((patch: SelectionPatch) => {
    const scoped = patch.lang !== undefined || patch.platform !== undefined;
    navigate(buildPath(nextSelection(selection, patch)), { replace: !scoped });
  }, [selection, navigate]);
}

const activateLatch = createActivateLatch();

/**
 * Keep the URL and the loaded project in step — App mounts this once.
 *
 * Neither effect is a sync: the first rewrites a path that does not spell
 * out what it resolved to (`/` on first load, a language that was just
 * deleted, a screenshot id that no longer exists), the second asks the server
 * to activate the project the URL names.
 */
export function useRouteReconciler() {
  const { pathname } = useLocation();
  const { canonicalPath, switchTo } = useRoute();
  const navigate = useNavigate();
  const { mutate: switchProject } = useSwitchProject();

  useEffect(() => {
    if (pathname !== canonicalPath) navigate(canonicalPath, { replace: true });
  }, [pathname, canonicalPath, navigate]);

  // One attempt per URL, hence the path as the only dependency: an activate
  // answers the URL, so a store change must never start one. React Router
  // commits a navigation in a transition and the store does not, so the
  // render right after `useSwitchProject` hydrates sees the new project's
  // config under the path it is leaving — which reads as a request to go
  // straight back, and two projects then activate each other forever.
  useEffect(() => {
    if (!switchTo || !activateLatch.claim(switchTo.projectId)) return;
    switchProject(switchTo, { onSettled: () => activateLatch.settle() });
  }, [pathname]);
}
