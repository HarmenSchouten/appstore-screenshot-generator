/**
 * useInitData
 *
 * Fetches initial application data (config, projects, current project)
 * via React Query and hydrates the Zustand store.
 *
 * Hydration happens inside the query function, before the query resolves:
 * the first render that sees `data` already sees a filled store, so there
 * is no empty-state frame — and nothing writes to the store during render,
 * which the previous ref-guarded version did (#65).
 */

import { useQuery } from "@tanstack/react-query";
import { fetchInit } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";

export function useInitData() {
  return useQuery({
    queryKey: queryKeys.init,
    queryFn: async () => {
      const data = await fetchInit();
      useAppStore.getState().hydrate(data);
      return data;
    },
    // Loaded once; after that the store is the source of truth and a
    // refetch would clobber unsaved edits
    staleTime: Infinity,
  });
}
