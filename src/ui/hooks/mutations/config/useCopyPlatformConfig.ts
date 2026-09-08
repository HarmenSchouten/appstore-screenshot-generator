/**
 * useCopyPlatformConfig Mutation
 *
 * Copies one platform's screenshot config to another within the selected language.
 */

import { useMutation } from "@tanstack/react-query";
import { copyPlatform } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { flushPersist } from "@ui/utils/config-persistence.ts";

export function useCopyPlatformConfig() {
  return useMutation({
    mutationFn: async ({
      sourcePlatform,
      targetPlatform,
    }: {
      sourcePlatform: "android" | "ios";
      targetPlatform: "android" | "ios";
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
