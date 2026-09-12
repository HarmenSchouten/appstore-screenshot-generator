/**
 * Two-step confirmation, the one way to ask "really?" inline (#69):
 * `useConfirm` holds the armed state and disarms it after a moment of
 * inaction; `ConfirmBar` is the strip with the question and the two buttons.
 */

import { type ReactNode, useCallback, useEffect, useState } from "react";
import { cn } from "@ui/utils/cn.ts";

const AUTO_DISMISS_MS = 2500;

/**
 * Armed state for a confirm step. Keyed (`useConfirm<string>()`) so a list
 * can track which row is asking; unkeyed, `arm()` arms with `true`.
 * Disarms itself after `autoDismissMs` of inaction, 0 to keep it armed.
 */
export function useConfirm<K = true>(autoDismissMs = AUTO_DISMISS_MS) {
  const [armed, setArmed] = useState<K | null>(null);

  useEffect(() => {
    if (armed === null || autoDismissMs === 0) return;
    const timer = setTimeout(() => setArmed(null), autoDismissMs);
    return () => clearTimeout(timer);
  }, [armed, autoDismissMs]);

  const arm = useCallback((key: K = true as unknown as K) => setArmed(key), []);
  const disarm = useCallback(() => setArmed(null), []);

  return { armed, arm, disarm };
}

const TONE = {
  danger: { box: "border-red-500/30", confirm: "bg-red-600 hover:bg-red-500" },
  warning: {
    box: "border-amber-500/30",
    confirm: "bg-amber-600 hover:bg-amber-500",
  },
};

interface ConfirmBarProps {
  message: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  tone?: keyof typeof TONE;
  /** Placement: `absolute inset-0` over a card, `h-8` inline in the top bar. */
  className?: string;
}

export function ConfirmBar({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  tone = "danger",
  className,
}: ConfirmBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border bg-zinc-900/95 px-3 animate-fadeIn",
        TONE[tone].box,
        className,
      )}
      // Often laid over a clickable card; the question must not select it
      onClick={(e) => e.stopPropagation()}
    >
      <span className="min-w-0 text-xs text-zinc-300">{message}</span>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded bg-zinc-700 px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium text-white transition-colors",
            TONE[tone].confirm,
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
