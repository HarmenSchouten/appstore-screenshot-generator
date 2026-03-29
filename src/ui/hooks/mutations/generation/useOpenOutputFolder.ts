/**
 * useOpenOutputFolder Mutation
 *
 * Opens the output folder in the system file explorer.
 */

import { useMutation } from "@tanstack/react-query";
import { openOutputFolder } from "@ui/utils/api.ts";

export function useOpenOutputFolder() {
  return useMutation({
    mutationFn: openOutputFolder,
  });
}
