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
import { selectScreenshots, useAppStore } from "@ui/store/index.ts";
import {
  parseSegments,
  type ProjectRequest,
  requestSegments,
  resolveSelection,
  resolveTarget,
} from "@ui/utils/route-selection.ts";
import { queryKeys } from "@ui/utils/query.ts";
import { flushPersist } from "@ui/utils/config-persistence.ts";

/**
 * Switches to a different project: flushes pending config saves, activates
 * the project on the server, hydrates the store with the new config, then
 * navigates to what the request asked for and invalidates the per-project
 * queries.
 */
export function useSwitchProject() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useMutation({
    mutationFn: async ({ projectId }: ProjectRequest) => {
      await flushPersist();
      const data = await activateProject(projectId);
      return { projectId, data };
    },
    onSuccess: ({ projectId, data }, request) => {
      // Hydrate first: between the two, a render would resolve the new path
      // against the project that is being left.
      useAppStore.getState().hydrate({ projectId, config: data.config });

      const state = useAppStore.getState();
      const target = resolveTarget(requestSegments(request), {
        loadedProject: projectId,
        projectIds: state.projects.map((p) => p.id),
        languages: state.config.languages?.map((l) => l.language) ?? [],
      });
      const { canonicalPath } = resolveSelection(
        target,
        selectScreenshots(state, target.lang, target.platform).map((s) => s.id),
      );
      if (pathname !== canonicalPath) {
        // A link into this project already owns its history entry, so the
        // correction replaces it; a switch from the UI pushes, and Back
        // returns to the project it came from.
        navigate(canonicalPath, {
          replace: parseSegments(pathname).project === projectId,
        });
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.generation.last });
    },
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
        await switchProject.mutateAsync({ projectId: remaining[0].id });
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
