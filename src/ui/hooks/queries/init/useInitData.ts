/**
 * useInitData
 *
 * Fetches initial application data (config, projects, palettes, etc.)
 * via React Query and hydrates the Zustand store on success.
 * Replaces the imperative fetch("/api/init") in main.tsx.
 */

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchInit } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";

export function useInitData() {
  const query = useQuery({
    queryKey: queryKeys.init,
    queryFn: fetchInit,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data) {
      useAppStore.setState({
        config: query.data.config,
        projects: query.data.projects,
        currentProject: query.data.projectId,
        initialProjectId: query.data.projectId,
      });
    }
  }, [query.data]);

  return query;
}
