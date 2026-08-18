/**
 * useAddLanguage Mutation
 *
 * Adds a new language to the config, optionally copying from an existing one.
 */

import { useMutation } from "@tanstack/react-query";
import { addLanguage } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";

export function useAddLanguage() {
  return useMutation({
    mutationFn: (
      { language, copyFrom }: { language: string; copyFrom: string | null },
    ) => addLanguage(language, copyFrom),
    onSuccess: (newLang, { language }) => {
      useAppStore.setState((s) => {
        const newConfig = { ...s.config };
        if (!newConfig.languages) newConfig.languages = [];
        newConfig.languages = [...newConfig.languages, newLang];
        return { config: newConfig, selectedLang: language };
      });
    },
  });
}
