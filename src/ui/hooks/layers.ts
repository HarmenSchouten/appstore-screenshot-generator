/**
 * Layer editing helpers.
 */

import { useCallback } from "react";
import type { Layer } from "@app-types";

/** Keys of any member of a union, not only the ones every member shares. */
type KeysOf<L> = L extends unknown ? keyof L : never;
/** The type `key` has on whichever union members carry it. */
type ValueOf<L, K extends PropertyKey> = L extends unknown
  ? K extends keyof L ? L[K] : never
  : never;

/**
 * `set("posX", 50)` → `onUpdate({ posX: 50 })`, typed to one layer kind.
 * For a union such as `ShapeLayerProps` any family's key is accepted; the
 * editor panels are already dispatched by family, so the key is in scope.
 */
export type LayerSetter<L> = <K extends KeysOf<L>>(
  key: K,
  value: ValueOf<L, K>,
) => void;

/**
 * The per-field setter every layer editor builds from its `onUpdate` —
 * once here instead of the same `useCallback` in five editors (#69).
 */
export function useLayerSetter<L extends Layer>(
  onUpdate: (updates: Partial<L>) => void,
): LayerSetter<L> {
  return useCallback(
    <K extends KeysOf<L>>(key: K, value: ValueOf<L, K>) => {
      // A computed key on a generic K types as an index signature, not as
      // the one-field patch it is
      onUpdate({ [key]: value } as Partial<L>);
    },
    [onUpdate],
  );
}
