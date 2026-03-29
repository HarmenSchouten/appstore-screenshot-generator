/**
 * useLastGeneratedQuery
 *
 * Fetches the last generated results via React Query and syncs to Zustand.
 * Replaces the store-level `refreshLastGenerated()` async action.
 */

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGenerated } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";
import type { GenerateResult } from "@ui/types.ts";

export function useLastGeneratedQuery() {
  const query = useQuery({
    queryKey: queryKeys.generation.last,
    queryFn: fetchGenerated,
  });

  useEffect(() => {
    if (query.data !== undefined) {
      useAppStore.setState({
        lastGenerated: query.data as {
          results: GenerateResult[];
          outputDir: string;
        } | null,
      });
    }
  }, [query.data]);

  return query;
}
