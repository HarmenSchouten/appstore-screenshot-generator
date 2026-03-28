/**
 * useSwitchProject Mutation
 *
 * Switches to a different project: flushes pending config saves,
 * activates the project on the server, then hydrates the store
 * with the new config, assets, and last-generated data.
 */

import { useMutation } from "@tanstack/react-query";
import { activateProject, fetchAssets } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";

export function useSwitchProject() {
  return useMutation({
    mutationKey: [...queryKeys.projects.all, "switch"],
    mutationFn: async (projectId: string) => {
      await useAppStore.getState().flush();
      const data = await activateProject(projectId);
      const assets = await fetchAssets();
      return { projectId, data, assets };
    },
    onSuccess: async ({ projectId, data, assets }) => {
      useAppStore.setState({
        currentProject: projectId,
        config: data.config,
        selectedLang: data.config.languages?.[0]?.language || "en",
        selectedItem: null,
        assets,
      });
      await useAppStore.getState().refreshLastGenerated();
    },
  });
}
