/**
 * useDeleteLanguage Mutation
 *
 * Deletes a language from the config and switches to the first remaining language.
 */

import { useMutation } from "@tanstack/react-query";
import { deleteLanguage } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { flushPersist } from "@ui/utils/config-persistence.ts";

export function useDeleteLanguage() {
  return useMutation({
    mutationFn: async (language: string) => {
      // Server-side edit: land pending local edits first (see useAddLanguage)
      await flushPersist();
      return deleteLanguage(language);
    },
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
