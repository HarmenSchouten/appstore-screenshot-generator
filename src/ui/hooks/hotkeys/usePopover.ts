/**
 * usePopover
 *
 * Registers a transient popover — picker, dropdown, menu — with the store
 * while it is open, so the global hotkeys treat it like a modal: Escape
 * closes the popover instead of deselecting the screenshot behind it, and
 * the editor shortcuts stay off until it is gone (#65).
 *
 * Modals proper have their own store flags; this is for the small things
 * that are component-local state.
 */

import { useEffect } from "react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useAppStore } from "@ui/store/index.ts";

export function usePopover(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const { popoverOpened, popoverClosed } = useAppStore.getState();
    popoverOpened();
    return popoverClosed;
  }, [open]);

  // Stacks next to the global Escape chain on the same target; the manager
  // warns on every duplicate registration unless told the overlap is intended
  useHotkey("Escape", onClose, {
    enabled: open,
    preventDefault: false,
    conflictBehavior: "allow",
  });
}
