/**
 * Assets — the project's uploaded images.
 *
 * React Query owns the list: mutations invalidate (or, for rename, patch)
 * the cache, and every reader mounts `useAssets`. Nothing mirrors it into
 * the store (#68).
 */

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAsset,
  fetchAssets,
  renameAsset,
  uploadAsset,
} from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";
import type { Assets } from "@ui/types.ts";

const EMPTY_ASSETS: Assets = { images: [] };

/** The asset list; empty until the first fetch lands. */
export function useAssets(): Assets {
  const { data } = useQuery({
    queryKey: queryKeys.assets.all,
    queryFn: fetchAssets,
  });
  return data ?? EMPTY_ASSETS;
}

export function useUploadAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
    },
  });
}

/**
 * Upload several files, one request each.
 *
 * Deliberately not a second `useMutation` wrapping the batch: the global
 * MutationCache `onError` would fire once for the whole batch, so a failed
 * file would lose its own toast and stop the rest. Here each file reports
 * for itself and the loop keeps going.
 */
export function useUploadAssets() {
  const uploadAsset = useUploadAsset();

  const upload = useCallback(async (files: File[]) => {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "images");

      try {
        await uploadAsset.mutateAsync(formData);
        useAppStore.getState().addToast({
          type: "success",
          message: `Uploaded ${file.name}`,
        });
      } catch {
        // error toast comes from the global mutation cache; keep uploading
      }
    }
  }, [uploadAsset.mutateAsync]);

  return { upload, uploading: uploadAsset.isPending };
}

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

      queryClient.setQueryData<Assets>(
        queryKeys.assets.all,
        (old) =>
          old
            ? {
              ...old,
              images: old.images.map((p) => (p === oldPath ? newPath : p)),
            }
            : old,
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.assets.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
    },
  });
}
