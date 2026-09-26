/**
 * Assets — the project's uploaded images.
 *
 * React Query owns the list: mutations invalidate (or, for rename, patch)
 * the cache, and every reader mounts `useAssets`. Nothing mirrors it into
 * the store (#68).
 *
 * Every mutation takes its project in its variables, read once when the
 * action starts. React Query hands a running mutation the options of the
 * latest render, so a project read at render time would follow a switch
 * made mid-request and send the rest of an upload batch, or a rename's
 * rollback, to the next project (#136).
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

  return useMutation({
    mutationFn: ({ projectId, formData }: {
      projectId: string;
      formData: FormData;
    }) => uploadAsset(projectId, formData),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.list(projectId),
      });
    },
  });
}

/**
 * Upload several files, one request each, all into the project that was
 * open when the batch started.
 *
 * Deliberately not a second `useMutation` wrapping the batch: the global
 * MutationCache `onError` would fire once for the whole batch, so a failed
 * file would lose its own toast and stop the rest. Here each file reports
 * for itself and the loop keeps going.
 */
export function useUploadAssets() {
  const uploadAsset = useUploadAsset();

  const upload = useCallback(async (files: File[]) => {
    const projectId = useAppStore.getState().currentProject;
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "images");

      try {
        await uploadAsset.mutateAsync({ projectId, formData });
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
    mutationFn: ({ projectId, oldPath, newName }: {
      projectId: string;
      oldPath: string;
      newName: string;
    }) => renameAsset(projectId, oldPath, newName),
    onMutate: async ({ projectId, oldPath, newName }) => {
      const queryKey = queryKeys.assets.list(projectId);
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
    onError: (_err, { projectId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.assets.list(projectId),
          context.previous,
        );
      }
    },
    onSettled: (_data, _err, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.list(projectId),
      });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, path }: { projectId: string; path: string }) =>
      deleteAsset(projectId, path),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.list(projectId),
      });
    },
  });
}
