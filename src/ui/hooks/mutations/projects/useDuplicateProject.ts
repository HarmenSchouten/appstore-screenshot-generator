/**
 * useDuplicateProject Mutation
 *
 * Duplicates a project and switches to the new copy.
 */

import { useMutation } from "@tanstack/react-query";
import { duplicateProject } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";
import { useSwitchProject } from "./useSwitchProject.ts";

export function useDuplicateProject() {
  const switchProject = useSwitchProject();

  return useMutation({
    mutationKey: [...queryKeys.projects.all, "duplicate"],
    mutationFn: ({ projectId, name }: { projectId: string; name: string }) =>
      duplicateProject(projectId, name),
    onSuccess: async (project) => {
      useAppStore.setState((s) => ({ projects: [...s.projects, project] }));
      await switchProject.mutateAsync(project.id);
    },
  });
}
