/**
 * useAddLanguage Mutation
 *
 * Adds a new language to the config, optionally copying from an existing one.
 */

import { useMutation } from "@tanstack/react-query";
import { addLanguage } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { flushPersist } from "@ui/utils/config-persistence.ts";

export function useAddLanguage() {
  return useMutation({
    mutationFn: async (
      { language, copyFrom }: { language: string; copyFrom: string | null },
    ) => {
      // The server edits its own copy of the config; a debounced local edit
      // still in flight would otherwise be built on and then overwritten
      await flushPersist();
      return addLanguage(language, copyFrom);
    },
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
