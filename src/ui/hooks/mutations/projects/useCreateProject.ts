/**
 * useCreateProject Mutation
 *
 * Creates a new project and switches to it.
 */

import { useMutation } from "@tanstack/react-query";
import { createProject } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";
import { useSwitchProject } from "./useSwitchProject.ts";

export function useCreateProject() {
  const switchProject = useSwitchProject();

  return useMutation({
    mutationKey: [...queryKeys.projects.all, "create"],
    mutationFn: (name: string) => createProject(name),
    onSuccess: async (project) => {
      useAppStore.setState((s) => ({ projects: [...s.projects, project] }));
      await switchProject.mutateAsync(project.id);
    },
  });
}
