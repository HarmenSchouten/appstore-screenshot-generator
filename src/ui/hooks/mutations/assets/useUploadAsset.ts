/**
 * useUploadAsset Mutation
 *
 * Uploads an asset file and invalidates the assets query cache.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAsset } from "@ui/utils/api.ts";
import { queryKeys } from "@ui/utils/query.ts";

export function useUploadAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
    },
  });
}
