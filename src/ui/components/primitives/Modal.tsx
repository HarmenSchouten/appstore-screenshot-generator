/**
 * Modal — the one dialog chrome: backdrop, panel, header with title and
 * close button, and the overlay registration that gives it Escape (#69).
 *
 * Compose the inside from `ModalBody` (the scrolling area) and
 * `ModalFooter`; a modal with its own layout, like the generate progress
 * view, can lay out its children directly.
 */

import { type ReactNode, useEffect, useId, useRef } from "react";
import { useOverlay } from "@hooks";
import { cn } from "@ui/utils/cn.ts";

const SIZE = {
  sm: "w-[420px]",
  md: "w-[480px]",
  lg: "w-[600px]",
  xl: "w-[700px]",
} as const;

interface ModalProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Font Awesome class, rendered before the title. */
  icon?: string;
  onClose: () => void;
  size?: keyof typeof SIZE;
  /**
   * A click on the backdrop closes the modal. Off for the one modal a stray
   * click must not dismiss: a running export.
   */
  closeOnBackdrop?: boolean;
  /** Rendered in the header's corner instead of the close button. */
  headerAction?: ReactNode;
  children: ReactNode;
}

export function Modal({
  title,
  subtitle,
  icon,
  onClose,
  size = "md",
  closeOnBackdrop = true,
  headerAction,
  children,
}: ModalProps) {
  useOverlay(true, onClose);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const pressedOnBackdrop = useRef(false);

  // Move focus into the dialog unless a child already claimed it (an
  // autofocused search field), and hand it back to the opener on close.
  useEffect(() => {
    const opener = document.activeElement;
    const panel = panelRef.current;
    if (panel && !panel.contains(document.activeElement)) panel.focus();
    return () => {
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      // A click counts as "on the backdrop" only if it also started there;
      // a drag that starts on a text field and ends outside the panel is not
      // a request to close.
      onMouseDown={(e) => {
        pressedOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (
          closeOnBackdrop && pressedOnBackdrop.current &&
          e.target === e.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "flex max-h-[85vh] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg bg-zinc-900 outline-none",
          SIZE[size],
        )}
      >
        <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-3">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-bold">
              {icon && <i className={cn(icon, "mr-2")} />}
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
            )}
          </div>
          {headerAction ?? (
            <button
              type="button"
              onClick={onClose}
              className="btn-icon text-xl"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

/** The scrolling content area. */
export function ModalBody(
  { className, children }: { className?: string; children: ReactNode },
) {
  return (
    <div className={cn("min-h-0 flex-1 overflow-y-auto px-5 pb-5", className)}>
      {children}
    </div>
  );
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 border-t border-zinc-800 px-5 py-4">
      {children}
    </div>
  );
}
