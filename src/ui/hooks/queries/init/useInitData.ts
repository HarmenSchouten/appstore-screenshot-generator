/**
 * useInitData
 *
 * Fetches initial application data (config, projects, palettes, etc.)
 * via React Query and hydrates the Zustand store on success.
 * Replaces the imperative fetch("/api/init") in main.tsx.
 *
 * Hydration happens synchronously during render (via ref guard) to
 * avoid a flash of empty state that useEffect would cause.
 */

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchInit } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";
import type { AppData } from "@ui/types.ts";

export function useInitData() {
  const hydratedRef = useRef<AppData | null>(null);

  const query = useQuery({
    queryKey: queryKeys.init,
    queryFn: fetchInit,
    staleTime: Infinity,
  });

  // Hydrate synchronously during render to prevent a frame with empty store
  if (query.data && hydratedRef.current !== query.data) {
    hydratedRef.current = query.data;
    useAppStore.setState({
      config: query.data.config,
      projects: query.data.projects,
      currentProject: query.data.projectId,
      initialProjectId: query.data.projectId,
    });
  }

  return query;
}
