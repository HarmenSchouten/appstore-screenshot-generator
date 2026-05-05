import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameAsset } from "@ui/utils/api.ts";
import { queryKeys } from "@ui/utils/query.ts";
import { useAppStore } from "@ui/store/index.ts";
import type { Assets } from "@ui/types.ts";

export function useRenameAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ oldPath, newName }: { oldPath: string; newName: string }) =>
      renameAsset(oldPath, newName),
    onMutate: async ({ oldPath, newName }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.assets.all });

      const previous = queryClient.getQueryData<Assets>(queryKeys.assets.all);

      const ext = oldPath.substring(oldPath.lastIndexOf("."));
      const dir = oldPath.substring(0, oldPath.lastIndexOf("/"));
      const newFileName = newName.includes(".") ? newName : newName + ext;
      const newPath = `${dir}/${newFileName}`;

      const update = (assets: Assets): Assets => ({
        ...assets,
        images: assets.images.map((p) => (p === oldPath ? newPath : p)),
      });

      queryClient.setQueryData<Assets>(
        queryKeys.assets.all,
        (old) => old ? update(old) : old,
      );
      useAppStore.getState().setAssets(
        update(useAppStore.getState().assets),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.assets.all, context.previous);
        useAppStore.getState().setAssets(context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
    },
  });
}
