/**
 * React Query Utilities
 *
 * Shared QueryClient instance and query key factories.
 */

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

export const queryKeys = {
  projects: {
    all: ["projects"] as const,
    detail: (id: string) => ["projects", id] as const,
  },
  config: {
    current: ["config"] as const,
  },
  assets: {
    all: ["assets"] as const,
  },
  generation: {
    last: ["generation", "last"] as const,
  },
} as const;
