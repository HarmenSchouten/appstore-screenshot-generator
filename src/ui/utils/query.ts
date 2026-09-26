/**
 * React Query Utilities
 *
 * Shared QueryClient instance and query key factories.
 */

import { MutationCache, QueryClient } from "@tanstack/react-query";
import { useAppStore } from "@ui/store/index.ts";

export const queryClient = new QueryClient({
  // Any failed mutation surfaces the server's message as a toast, unless
  // the mutation opts out via meta.suppressErrorToast (custom handling).
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.suppressErrorToast) return;
      useAppStore.getState().addToast({
        type: "error",
        message: error.message,
      });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

export const queryKeys = {
  init: ["init"] as const,
  // Keyed by project: two projects' lists never share a cache entry, so a
  // switch needs no invalidation and a mutation can't patch the wrong one
  assets: {
    list: (projectId: string) => ["assets", projectId] as const,
  },
  generation: {
    all: ["generation", "last"] as const,
    last: (projectId: string) => ["generation", "last", projectId] as const,
  },
} as const;
