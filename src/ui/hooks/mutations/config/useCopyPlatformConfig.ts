/**
 * useCopyPlatformConfig Mutation
 *
 * Copies one platform's screenshot config to another within the selected language.
 */

import { useMutation } from "@tanstack/react-query";
import { copyPlatform } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";

export function useCopyPlatformConfig() {
  return useMutation({
    mutationKey: [...queryKeys.config.current, "copyPlatform"],
    mutationFn: ({
      sourcePlatform,
      targetPlatform,
    }: {
      sourcePlatform: "android" | "ios";
      targetPlatform: "android" | "ios";
    }) => {
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
          selectedItem: null,
        };
      });
    },
  });
}
