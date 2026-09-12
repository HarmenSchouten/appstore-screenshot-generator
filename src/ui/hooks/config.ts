/**
 * Config lifecycle — initial load, auto-save, and the one server-side
 * config edit that is not a language or project operation.
 */

import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Platform } from "@app-types";
import { copyPlatform, fetchInit } from "@ui/utils/api.ts";
import { queryKeys } from "@ui/utils/query.ts";
import {
  flushPersist,
  startConfigAutoSave,
} from "@ui/utils/config-persistence.ts";
import { useAppStore } from "@ui/store/index.ts";

/**
 * Fetches initial application data (config, projects, current project)
 * and hydrates the store.
 *
 * Hydration happens inside the query function, before the query resolves:
 * the first render that sees `data` already sees a filled store, so there
 * is no empty-state frame — and nothing writes to the store during render,
 * which the previous ref-guarded version did (#65).
 */
export function useInitData() {
  return useQuery({
    queryKey: queryKeys.init,
    queryFn: async () => {
      const data = await fetchInit();
      useAppStore.getState().hydrate(data);
      return data;
    },
    // Loaded once; after that the store is the source of truth and a
    // refetch would clobber unsaved edits
    staleTime: Infinity,
  });
}

/**
 * Persist config edits while mounted. Mount once, in App; the saver itself
 * is module state in `config-persistence.ts`, so `flushPersist()` works
 * whether or not this is mounted.
 */
export function useConfigAutoSave() {
  useEffect(() => startConfigAutoSave(), []);
}

/**
 * Copies one platform's screenshot config to another within the selected
 * language.
 */
export function useCopyPlatformConfig() {
  return useMutation({
    mutationFn: async ({
      sourcePlatform,
      targetPlatform,
    }: {
      sourcePlatform: Platform;
      targetPlatform: Platform;
    }) => {
      // Server-side edit of the source platform: land pending local edits
      // first, or the copy is taken from a stale config (see useAddLanguage)
      await flushPersist();
      const { selectedLang } = useAppStore.getState();
      return copyPlatform(selectedLang, sourcePlatform, targetPlatform);
    },
    onSuccess: (updatedLang, { targetPlatform }) => {
      useAppStore.setState((s) => {
        const newConfig = { ...s.config };
        const langIndex = newConfig.languages?.findIndex(
          (l) => l.language === s.selectedLang,
        ) ?? -1;
        if (langIndex >= 0 && newConfig.languages) {
          newConfig.languages = [...newConfig.languages];
          newConfig.languages[langIndex] = updatedLang;
        }
        return {
          config: newConfig,
          selectedPlatform: targetPlatform,
          selectedScreenshotId: null,
        };
      });
    },
  });
}
