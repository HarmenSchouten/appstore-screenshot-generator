/**
 * useDeleteAsset Mutation
 *
 * Deletes an asset and invalidates the assets query cache.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAsset } from "@ui/utils/api.ts";
import { queryKeys } from "@ui/utils/query.ts";

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
    },
  });
}
