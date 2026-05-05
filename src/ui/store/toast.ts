import type { StateCreator } from "zustand";
import type { AppState, ToastSlice } from "./types.ts";

const DEFAULT_DURATION: Record<string, number> = {
  error: 6000,
  success: 4000,
  info: 4000,
};

export const createToastSlice: StateCreator<
  AppState,
  [],
  [],
  ToastSlice
> = (set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = globalThis.crypto.randomUUID();
    const duration = toast.duration ?? DEFAULT_DURATION[toast.type] ?? 4000;
    set({ toasts: [...get().toasts, { ...toast, id }] });
    setTimeout(() => get().removeToast(id), duration);
  },
  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
});
