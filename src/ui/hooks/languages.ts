/**
 * Languages — server-side edits of the config's language list. The server
 * edits its own copy of the config, so each one flushes pending local edits
 * first; a debounced edit still in flight would otherwise be built on and
 * then overwritten.
 */

import { useMutation } from "@tanstack/react-query";
import { addLanguage, deleteLanguage } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { flushPersist } from "@ui/utils/config-persistence.ts";

/** Adds a language, optionally copying from an existing one. */
export function useAddLanguage() {
  return useMutation({
    mutationFn: async (
      { language, copyFrom }: { language: string; copyFrom: string | null },
    ) => {
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

/** Deletes a language and switches to the first remaining one. */
export function useDeleteLanguage() {
  return useMutation({
    mutationFn: async (language: string) => {
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
