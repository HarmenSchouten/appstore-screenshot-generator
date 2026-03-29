/**
 * useRenameAsset Mutation
 *
 * Renames an asset and invalidates the assets query cache.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameAsset } from "@ui/utils/api.ts";
import { queryKeys } from "@ui/utils/query.ts";

export function useRenameAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ oldPath, newName }: { oldPath: string; newName: string }) =>
      renameAsset(oldPath, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
    },
  });
}
