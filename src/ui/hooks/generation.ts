/**
 * Generation — the export run and its results.
 */

import { useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchGenerated,
  generateStream,
  openOutputFolder,
} from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";
import { flushPersist } from "@ui/utils/config-persistence.ts";

/**
 * Kicks off screenshot generation via the SSE stream, feeds progress events
 * into the store, and exposes `cancel()`: aborting the fetch closes the
 * stream, which the server turns into cancellation after the screenshot in
 * flight.
 *
 * One instance per app: the abort controller lives in this hook, so a run
 * started through another instance's `mutate` cannot be cancelled by this
 * one. App owns it and hands `mutate` to the top bar and the hotkeys (#68).
 */
export function useGenerateAll() {
  const queryClient = useQueryClient();
  const abortRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    // onError below reports with context; the global toast would duplicate it
    meta: { suppressErrorToast: true },
    mutationFn: async () => {
      await flushPersist();

      const controller = new AbortController();
      abortRef.current = controller;
      try {
        await generateStream((event) => {
          if (event.type === "start") {
            useAppStore.setState((s) => ({
              generateProgress: { ...s.generateProgress, total: event.total },
            }));
          } else if (event.type === "progress") {
            useAppStore.setState((s) => ({
              generateProgress: {
                ...s.generateProgress,
                current: event.current,
                item: event.item,
              },
            }));
          } else {
            useAppStore.setState((s) => ({
              generateProgress: {
                ...s.generateProgress,
                results: event.results,
                outputDir: event.outputDir,
                current: s.generateProgress.total,
              },
            }));
          }
        }, controller.signal);
      } finally {
        abortRef.current = null;
      }
    },
    onMutate: () => {
      useAppStore.setState({
        activeModal: "generate",
        generating: true,
        generateProgress: {
          current: 0,
          total: 0,
          item: "Starting...",
          results: null,
          outputDir: "",
          error: null,
        },
      });
    },
    onSuccess: () => {
      const results = useAppStore.getState().generateProgress.results;
      const count = results?.filter((r) => r.status === "success").length ?? 0;
      if (count > 0) {
        useAppStore.getState().addToast({
          type: "success",
          message: `Generated ${count} screenshot${
            count !== 1 ? "s" : ""
          } successfully`,
        });
      }
    },
    onError: (error) => {
      if (error.name === "AbortError") {
        // The user cancelled; nothing to report beyond closing the modal
        useAppStore.getState().closeModal();
        useAppStore.getState().addToast({
          type: "info",
          message: "Generation cancelled",
        });
        return;
      }
      // Keep the modal open so the reason is visible where the user is looking
      useAppStore.setState((s) => ({
        generateProgress: { ...s.generateProgress, error: error.message },
      }));
      useAppStore.getState().addToast({
        type: "error",
        message: "Generation failed: " + error.message,
      });
    },
    onSettled: () => {
      useAppStore.setState({ generating: false });
      // A cancelled run still wrote a manifest for what it finished
      queryClient.invalidateQueries({ queryKey: queryKeys.generation.last });
    },
  });

  const cancel = useCallback(() => abortRef.current?.abort(), []);

  return { ...mutation, cancel };
}

/** Opens the output folder in the system file explorer. */
export function useOpenOutputFolder() {
  return useMutation({
    mutationFn: openOutputFolder,
  });
}

/**
 * The previous run's results, from the output manifest. React Query is the
 * source of truth here — consumers read `data` directly rather than having
 * it mirrored into the store during render (#65). `useGenerateAll`
 * invalidates the key when a run settles.
 */
export function useLastGeneratedQuery() {
  return useQuery({
    queryKey: queryKeys.generation.last,
    queryFn: fetchGenerated,
  });
}
