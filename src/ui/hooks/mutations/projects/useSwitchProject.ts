/**
 * useSwitchProject Mutation
 *
 * Switches to a different project: flushes pending config saves,
 * activates the project on the server, then hydrates the store
 * with the new config and invalidates the assets query cache.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateProject } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";
import { flushPersist } from "@ui/utils/config-persistence.ts";

export function useSwitchProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...queryKeys.projects.all, "switch"],
    mutationFn: async (projectId: string) => {
      await flushPersist();
      const data = await activateProject(projectId);
      return { projectId, data };
    },
    onSuccess: ({ projectId, data }) => {
      useAppStore.setState({
        currentProject: projectId,
        config: data.config,
        selectedLang: data.config.languages?.[0]?.language || "en",
        selectedItem: null,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
      useAppStore.getState().refreshLastGenerated();
    },
  });
}
