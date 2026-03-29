/**
 * useLastGeneratedQuery
 *
 * Fetches the last generated results via React Query and syncs to Zustand.
 * Replaces the store-level `refreshLastGenerated()` async action.
 */

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGenerated } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";

export function useLastGeneratedQuery() {
  const hydratedRef = useRef<unknown>(undefined);

  const query = useQuery({
    queryKey: queryKeys.generation.last,
    queryFn: fetchGenerated,
  });

  if (query.data !== undefined && hydratedRef.current !== query.data) {
    hydratedRef.current = query.data;
    useAppStore.setState({ lastGenerated: query.data });
  }

  return query;
}
