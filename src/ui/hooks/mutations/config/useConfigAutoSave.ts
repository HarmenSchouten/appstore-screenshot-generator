/**
 * useConfigAutoSave Hook
 *
 * Reactive auto-persistence for config changes.
 * Subscribes to Zustand `config` state, debounces writes,
 * and persists via a React Query mutation.
 *
 * Mount once in a top-level component (App). The flush bridge
 * in `config-persistence.ts` lets non-React code (generation,
 * project-switch) force pending saves through.
 */

import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { saveConfig } from "@ui/utils/api.ts";
import { useAppStore } from "@ui/store/index.ts";
import { queryKeys } from "@ui/utils/query.ts";
import { registerFlush } from "@ui/utils/config-persistence.ts";
import type { Config } from "@ui/types.ts";

const SAVE_DEBOUNCE_MS = 50;

export function useConfigAutoSave() {
  const { mutateAsync } = useMutation({
    mutationKey: [...queryKeys.config.current, "save"],
    mutationFn: saveConfig,
  });

  const pendingRef = useRef<Config | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mutateRef = useRef(mutateAsync);
  mutateRef.current = mutateAsync;

  useEffect(() => {
    registerFlush(async () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (pendingRef.current) {
        const config = pendingRef.current;
        pendingRef.current = null;
        try {
          await mutateRef.current(config);
          useAppStore.setState({ _configDirty: false });
        } catch (err) {
          pendingRef.current = config;
          useAppStore.setState({ _configDirty: true });
          throw err;
        }
      }
    });

    const unsub = useAppStore.subscribe((state, prev) => {
      if (state.config !== prev.config && state._configDirty) {
        pendingRef.current = state.config;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          if (pendingRef.current) {
            const config = pendingRef.current;
            pendingRef.current = null;
            void mutateRef.current(config)
              .then(() => useAppStore.setState({ _configDirty: false }))
              .catch((err) => {
                pendingRef.current = config;
                useAppStore.setState({ _configDirty: true });
                console.error(err);
              });
          }
        }, SAVE_DEBOUNCE_MS);
      }
    });

    return () => {
      unsub();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      registerFlush(() => Promise.resolve());
    };
  }, []);
}
