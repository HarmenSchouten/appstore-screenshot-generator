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

/** The open project's asset list; empty until the first fetch lands. */
export function useAssets(): Assets {
  const projectId = useAppStore((s) => s.currentProject);
  const { data } = useQuery({
    queryKey: queryKeys.assets.list(projectId),
    queryFn: () => fetchAssets(projectId),
  });
  return data ?? EMPTY_ASSETS;
}

export function useUploadAsset() {
  const queryClient = useQueryClient();
  const projectId = useAppStore((s) => s.currentProject);

  return useMutation({
    mutationFn: (formData: FormData) => uploadAsset(projectId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.list(projectId),
      });
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
  const projectId = useAppStore((s) => s.currentProject);
  const queryKey = queryKeys.assets.list(projectId);

  return useMutation({
    mutationFn: ({ oldPath, newName }: { oldPath: string; newName: string }) =>
      renameAsset(projectId, oldPath, newName),
    onMutate: async ({ oldPath, newName }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Assets>(queryKey);

      const ext = oldPath.substring(oldPath.lastIndexOf("."));
      const dir = oldPath.substring(0, oldPath.lastIndexOf("/"));
      const newFileName = newName.includes(".") ? newName : newName + ext;
      const newPath = `${dir}/${newFileName}`;

      queryClient.setQueryData<Assets>(
        queryKey,
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
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  const projectId = useAppStore((s) => s.currentProject);

  return useMutation({
    mutationFn: (path: string) => deleteAsset(projectId, path),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.list(projectId),
      });
    },
  });
}
