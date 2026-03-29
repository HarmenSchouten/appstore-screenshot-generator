/**
 * useDeleteLanguage Mutation
 *
 * Deletes a language from the config and switches to the first remaining language.
 */

import { useMutation } from "@tanstack/react-query";
import { deleteLanguage } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";

export function useDeleteLanguage() {
  return useMutation({
    mutationKey: [...queryKeys.config.current, "deleteLanguage"],
    mutationFn: (language: string) => deleteLanguage(language),
    onSuccess: (_data, language) => {
      useAppStore.setState((s) => {
        const newConfig = { ...s.config };
        newConfig.languages = newConfig.languages?.filter(
          (l) => l.language !== language,
        ) ?? [];
        const nextLang = newConfig.languages[0]?.language ?? "";
        return {
          config: newConfig,
          selectedLang: s.selectedLang === language ? nextLang : s.selectedLang,
        };
      });
    },
  });
}
