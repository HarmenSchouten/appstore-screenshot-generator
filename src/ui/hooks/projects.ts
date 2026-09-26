/**
 * Projects — create, switch, rename, duplicate, delete.
 */

import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createProject,
  deleteProject,
  duplicateProject,
  openProject,
  renameProject,
} from "@ui/utils/api.ts";
import { selectRoute, useAppStore } from "@ui/store/index.ts";
import {
  parseSegments,
  type ProjectRequest,
  requestSegments,
} from "@ui/utils/route-selection.ts";
import { switchGuard } from "@ui/utils/switch-guard.ts";
import { discardPersist, flushPersist } from "@ui/utils/config-persistence.ts";

/**
 * Whether the editor still has this project open. A server-side edit that
 * answers after a switch belongs to the project it was sent to; merging it
 * into the next project's config would save it there.
 */
export function isProjectOpen(projectId: string): boolean {
  return useAppStore.getState().currentProject === projectId;
}

interface SwitchProjectRequest extends ProjectRequest {
  /** Replace the current history entry — the path it holds is already gone. */
  replace?: boolean;
}

/**
 * Switches to a different project: loads it from the server, hydrates the
 * store with its config, then navigates to what the request asked for. A
 * switch that fails puts the path back on the loaded project; the toast
 * comes from the shared `MutationCache` handler.
 *
 * The project being left is not flushed: an edit still waiting belongs to
 * that project, and its saver still saves it there. The project being opened
 * is: an edit to it still waiting from an earlier visit has to reach the
 * server before its config is read back, or the editor would show the config
 * without it and the next save would write over it (#136).
 *
 * `switchGuard` decides what a settled switch may still do when others have
 * been started since: only one of them writes the URL.
 */
export function useSwitchProject() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useMutation({
    mutationFn: async ({ projectId }: SwitchProjectRequest) => {
      await flushPersist(projectId);
      const data = await openProject(projectId);
      return { projectId, data };
    },
    onMutate: () => ({ token: switchGuard.start() }),

    onSuccess: ({ projectId, data }, request, { token }) => {
      if (!switchGuard.apply(token)) return;
      const owningUrl = switchGuard.mayNavigate(token);

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

      if (owningUrl) {
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
      }
    },

    onError: (_error, _request, context) => {
      if (!context || !switchGuard.mayNavigate(context.token)) return;
      // This switch never loaded, so the path it asked for names a project
      // that is not loaded; put it on whatever is loaded now — an
      // older switch may have landed while this one was in flight.
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
    mutationFn: async (projectId: string) => {
      await deleteProject(projectId);
      // An edit still waiting would only be saved into a project that is
      // gone. Dropped after the delete: if it failed, the edit is still wanted
      discardPersist(projectId);
    },
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
    mutationFn: async (
      { projectId, name }: { projectId: string; name: string },
    ) => {
      // The server copies the config on disk, which an edit still waiting
      // hasn't reached yet
      await flushPersist(projectId);
      return duplicateProject(projectId, name);
    },
    onSuccess: async (project) => {
      useAppStore.setState((s) => ({ projects: [...s.projects, project] }));
      await switchProject.mutateAsync({ projectId: project.id });
    },
  });
}

/**
 * Renames a project. The server rewrites the name in the config on disk, so
 * an edit still waiting is saved first; after that, the store's copy of the
 * open project's config has to carry the new name, or its next save would
 * write the old one back (#141).
 */
export function useRenameProject() {
  return useMutation({
    mutationFn: async (
      { projectId, name }: { projectId: string; name: string },
    ) => {
      await flushPersist(projectId);
      return renameProject(projectId, name);
    },
    onSuccess: (updated) => useAppStore.getState().projectRenamed(updated),
  });
}
