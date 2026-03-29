/**
 * useGenerateAll Mutation
 *
 * Kicks off screenshot generation via SSE stream.
 * Progressively updates Zustand with streaming progress events,
 * then invalidates the last-generated query on completion.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateStream } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";
import { flushPersist } from "@ui/utils/config-persistence.ts";

export function useGenerateAll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await flushPersist();

      await generateStream((data) => {
        if (data.type === "start") {
          useAppStore.setState((s) => ({
            generateProgress: { ...s.generateProgress, total: data.total! },
          }));
        } else if (data.type === "progress") {
          useAppStore.setState((s) => ({
            generateProgress: {
              ...s.generateProgress,
              current: data.current!,
              item: data.item!,
            },
          }));
        } else if (data.type === "complete") {
          useAppStore.setState((s) => ({
            generateProgress: {
              ...s.generateProgress,
              results: data.results!,
              outputDir: data.outputDir!,
              current: s.generateProgress.total,
            },
          }));
        }
      });
    },
    onMutate: () => {
      useAppStore.setState({
        showGenerateModal: true,
        generating: true,
        generateProgress: {
          current: 0,
          total: 0,
          item: "Starting...",
          results: null,
          outputDir: "",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.generation.last });
    },
    onSettled: () => {
      useAppStore.setState({ generating: false });
    },
    onError: (error) => {
      alert("Generation failed: " + error.message);
      useAppStore.setState({ showGenerateModal: false });
    },
  });
}
