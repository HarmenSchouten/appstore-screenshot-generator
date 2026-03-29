/**
 * useDeleteProject Mutation
 *
 * Deletes a project and switches to the next available project.
 */

import { useMutation } from "@tanstack/react-query";
import { deleteProject } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";
import { useSwitchProject } from "./useSwitchProject.ts";

export function useDeleteProject() {
  const switchProject = useSwitchProject();

  return useMutation({
    mutationKey: [...queryKeys.projects.all, "delete"],
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
