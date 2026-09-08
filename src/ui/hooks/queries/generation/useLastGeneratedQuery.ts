/**
 * useLastGeneratedQuery
 *
 * The previous run's results, from the output manifest. React Query is the
 * source of truth here — consumers read `data` directly rather than having
 * it mirrored into the store during render (#65). `useGenerateAll`
 * invalidates the key when a run settles.
 */

import { useQuery } from "@tanstack/react-query";
import { fetchGenerated } from "@ui/utils/api.ts";
import { queryKeys } from "@ui/utils/query.ts";

export function useLastGeneratedQuery() {
  return useQuery({
    queryKey: queryKeys.generation.last,
    queryFn: fetchGenerated,
  });
}
