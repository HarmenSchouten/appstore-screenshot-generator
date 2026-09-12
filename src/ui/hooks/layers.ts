/**
 * Layer editing helpers.
 */

import { useCallback } from "react";
import type { Layer } from "@app-types";

/** `set("posX", 50)` → `onUpdate({ posX: 50 })`, typed to one layer kind. */
export type LayerSetter<L> = <K extends keyof L>(key: K, value: L[K]) => void;

/**
 * The per-field setter every layer editor builds from its `onUpdate` —
 * once here instead of the same `useCallback` in five editors (#69).
 */
export function useLayerSetter<L extends Layer>(
  onUpdate: (updates: Partial<L>) => void,
): LayerSetter<L> {
  return useCallback(
    <K extends keyof L>(key: K, value: L[K]) => {
      // A computed key on a generic K only types as an index signature;
      // assigning through Partial<L> keeps the field typed
      const updates: Partial<L> = {};
      updates[key] = value;
      onUpdate(updates);
    },
    [onUpdate],
  );
}
