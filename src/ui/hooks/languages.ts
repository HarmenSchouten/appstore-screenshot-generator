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
import { useNavigateSelection } from "./routing.ts";
import { isProjectOpen } from "./projects.ts";

/** Adds a language, optionally copying from an existing one, and selects it. */
export function useAddLanguage() {
  const navigateSelection = useNavigateSelection();

  return useMutation({
    mutationFn: async (
      { language, copyFrom }: { language: string; copyFrom: string | null },
    ) => {
      const projectId = useAppStore.getState().currentProject;
      await flushPersist(projectId);
      return {
        projectId,
        newLang: await addLanguage(projectId, language, copyFrom),
      };
    },
    onSuccess: ({ projectId, newLang }, { language }) => {
      if (!isProjectOpen(projectId)) return;
      // Into the config before the URL: the route drops a language it cannot
      // find in the config it is resolved against.
      useAppStore.setState((s) => {
        const newConfig = { ...s.config };
        newConfig.languages = [...(newConfig.languages ?? []), newLang];
        return { config: newConfig };
      });
      navigateSelection({ lang: language });
    },
  });
}

/**
 * Deletes a language. Nothing navigates: the route falls back to the first
 * remaining language on its own once this one is out of the config.
 */
export function useDeleteLanguage() {
  return useMutation({
    mutationFn: async (language: string) => {
      const projectId = useAppStore.getState().currentProject;
      await flushPersist(projectId);
      await deleteLanguage(projectId, language);
      return projectId;
    },
    onSuccess: (projectId, language) => {
      if (!isProjectOpen(projectId)) return;
      useAppStore.setState((s) => ({
        config: {
          ...s.config,
          languages: s.config.languages?.filter(
            (l) => l.language !== language,
          ) ?? [],
        },
      }));
    },
  });
}
