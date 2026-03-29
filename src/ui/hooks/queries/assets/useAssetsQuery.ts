/**
 * useAssetsQuery
 *
 * Fetches the asset list via React Query and syncs it to the Zustand store.
 * Replaces the old store-level `refreshAssets()` async action.
 */

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAssets } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";

export function useAssetsQuery() {
  const query = useQuery({
    queryKey: queryKeys.assets.all,
    queryFn: fetchAssets,
  });

  useEffect(() => {
    if (query.data) {
      useAppStore.getState().setAssets(query.data);
    }
  }, [query.data]);

  return query;
}
