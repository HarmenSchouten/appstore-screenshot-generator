/**
 * Projects — create, switch, rename, duplicate, delete.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import {
  activateProject,
  createProject,
  deleteProject,
  duplicateProject,
  renameProject,
} from "@ui/utils/api.ts";
import { selectRoute, useAppStore } from "@ui/store/index.ts";
import {
  createSwitchGuard,
  parseSegments,
  type ProjectRequest,
  requestSegments,
} from "@ui/utils/route-selection.ts";
import { queryKeys } from "@ui/utils/query.ts";
import { flushPersist } from "@ui/utils/config-persistence.ts";

/**
 * Module state, like the overlay stack: it outlives the reconciler effect,
 * which React remounts in development, and it is shared by every call site —
 * each of which is its own mutation observer.
 */
export const switchGuard = createSwitchGuard();

export interface SwitchProjectRequest extends ProjectRequest {
  /** Replace the current history entry — the path it holds is already gone. */
  replace?: boolean;
}

/**
 * Switches to a different project: flushes pending config saves, activates
 * the project on the server, hydrates the store with the new config, then
 * navigates to what the request asked for and invalidates the per-project
 * queries. A switch that fails puts the path back on the loaded project; the
 * toast comes from the shared `MutationCache` handler.
 */
export function useSwitchProject() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useMutation({
    mutationFn: async ({ projectId }: SwitchProjectRequest) => {
      await flushPersist();
      const data = await activateProject(projectId);
      return { projectId, data };
    },
    onMutate: () => ({ token: switchGuard.start() }),

    onSuccess: ({ projectId, data }, request, { token }) => {
      if (!switchGuard.isLatest(token)) return;

      // A switch from the UI keeps the platform it was on; only the language
      // and the screenshot are scoped to a project. Read before hydrating,
      // while the store still holds the project being left.
      const tail = request.tail ?? {
        lang: null,
        platform: selectRoute(useAppStore.getState(), parseSegments(pathname))
          .selection.platform,
        screenshotId: null,
      };

      // Hydrate first: between the two, a render would resolve the new path
      // against the project that is being left.
      useAppStore.getState().hydrate({ projectId, config: data.config });

      const { canonicalPath } = selectRoute(
        useAppStore.getState(),
        requestSegments({ projectId, tail }),
      );
      if (pathname !== canonicalPath) {
        // A link into this project already owns its history entry, so the
        // correction replaces it; a switch from the UI pushes, and Back
        // returns to the project it came from.
        navigate(canonicalPath, {
          replace: request.replace === true ||
            parseSegments(pathname).project === projectId,
        });
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.generation.last });
    },

    onError: (_error, _request, context) => {
      if (context && !switchGuard.isLatest(context.token)) return;
      // The project the path asks for never loaded, so the path and the
      // panels disagree; put the path back on the one that is loaded.
      const state = useAppStore.getState();
      const { canonicalPath } = selectRoute(state, {
        ...parseSegments(pathname),
        project: state.currentProject,
      });
      if (pathname !== canonicalPath) {
        navigate(canonicalPath, { replace: true });
      }
    },

    // Option level, not per call: per-call callbacks reach an attached
    // observer only, and StrictMode detaches one between its two mount runs.
    onSettled: (_data, _error, { projectId }) => switchGuard.settle(projectId),
  });
}

/** Creates a new project and switches to it. */
export function useCreateProject() {
  const switchProject = useSwitchProject();

  return useMutation({
    mutationFn: (name: string) => createProject(name),
    onSuccess: async (project) => {
      useAppStore.setState((s) => ({ projects: [...s.projects, project] }));
      await switchProject.mutateAsync({ projectId: project.id });
    },
  });
}

/** Deletes a project; if it was the current one, switches to the next. */
export function useDeleteProject() {
  const switchProject = useSwitchProject();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: async (_data, projectId) => {
      const { currentProject, projects } = useAppStore.getState();
      const remaining = projects.filter((p) => p.id !== projectId);
      useAppStore.setState({ projects: remaining });
      if (currentProject === projectId && remaining.length > 0) {
        // The entry this replaces names a project that no longer exists, so
        // Back to it would only be corrected away again.
        await switchProject.mutateAsync({
          projectId: remaining[0].id,
          replace: true,
        });
      }
    },
  });
}

/** Duplicates a project and switches to the copy. */
export function useDuplicateProject() {
  const switchProject = useSwitchProject();

  return useMutation({
    mutationFn: ({ projectId, name }: { projectId: string; name: string }) =>
      duplicateProject(projectId, name),
    onSuccess: async (project) => {
      useAppStore.setState((s) => ({ projects: [...s.projects, project] }));
      await switchProject.mutateAsync({ projectId: project.id });
    },
  });
}

export function useRenameProject() {
  return useMutation({
    mutationFn: ({ projectId, name }: { projectId: string; name: string }) =>
      renameProject(projectId, name),
    onSuccess: (updated, { projectId }) => {
      useAppStore.setState((s) => ({
        projects: s.projects.map((p) => (p.id === projectId ? updated : p)),
      }));
    },
  });
}
