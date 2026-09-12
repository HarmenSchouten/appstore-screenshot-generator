/**
 * Projects — create, switch, rename, duplicate, delete.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  activateProject,
  createProject,
  deleteProject,
  duplicateProject,
  renameProject,
} from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";
import { flushPersist } from "@ui/utils/config-persistence.ts";

/**
 * Switches to a different project: flushes pending config saves, activates
 * the project on the server, then hydrates the store with the new config
 * and invalidates the per-project queries.
 */
export function useSwitchProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      await flushPersist();
      const data = await activateProject(projectId);
      return { projectId, data };
    },
    onSuccess: ({ projectId, data }) => {
      useAppStore.getState().hydrate({ projectId, config: data.config });
      // Selection is scoped to a project; start the new one on its first language
      useAppStore.setState({
        selectedLang: data.config.languages?.[0]?.language || "en",
        selectedScreenshotId: null,
      });
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
      await switchProject.mutateAsync(project.id);
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
        await switchProject.mutateAsync(remaining[0].id);
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
      await switchProject.mutateAsync(project.id);
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
