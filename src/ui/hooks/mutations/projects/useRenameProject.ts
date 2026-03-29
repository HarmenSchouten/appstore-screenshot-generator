/**
 * useRenameProject Mutation
 *
 * Renames an existing project.
 */

import { useMutation } from "@tanstack/react-query";
import { renameProject } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";

export function useRenameProject() {
  return useMutation({
    mutationKey: [...queryKeys.projects.all, "rename"],
    mutationFn: ({ projectId, name }: { projectId: string; name: string }) =>
      renameProject(projectId, name),
    onSuccess: (updated, { projectId }) => {
      useAppStore.setState((s) => ({
        projects: s.projects.map((p) => (p.id === projectId ? updated : p)),
      }));
    },
  });
}
