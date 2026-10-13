/**
 * Screenshot actions bound to the current selection.
 *
 * The store actions take the language and platform they work in and hand back
 * the id of anything they create; this is where that meets the URL, so a
 * component only has to say what it wants done. Removals need no navigation:
 * an id that no longer exists stops resolving, and the route corrects itself.
 */

import { useMemo } from "react";
import { useAppStore } from "@ui/store/index.ts";
import type { Screenshot } from "@ui/types.ts";
import type { PlacementRole } from "@app-types";
import { useNavigateSelection, useSelection } from "./routing.ts";

export function useScreenshotActions() {
  const selection = useSelection();
  const navigateSelection = useNavigateSelection();

  return useMemo(() => {
    const select = (screenshotId: string | null) =>
      navigateSelection({ screenshotId });

    return {
      select,

      add: () => {
        const id = useAppStore.getState().addScreenshot(selection);
        if (id) select(id);
      },

      addPlacement: (role: PlacementRole) => {
        const id = useAppStore.getState().addPlacement(selection, role);
        if (id) select(id);
      },

      remove: (id: string) =>
        useAppStore.getState().removeScreenshot(selection, id),

      removePlacement: (role: PlacementRole) =>
        useAppStore.getState().removePlacement(selection, role),

      reorder: (orderedIds: string[]) =>
        useAppStore.getState().reorderScreenshots(selection, orderedIds),

      update: (id: string, updates: Partial<Screenshot>) =>
        useAppStore.getState().updateScreenshot(selection, id, updates),
    };
  }, [selection, navigateSelection]);
}
