/**
 * LayerInfoPopover — the note on how layers compose, anchored under the
 * info button. Mounted only while open; a click anywhere else closes it.
 */

import { useOverlay } from "@hooks";

export function LayerInfoPopover({ onClose }: { onClose: () => void }) {
  useOverlay(true, onClose);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      {/* Positioned by the `relative` wrapper around the button */}
      <div className="absolute -right-1 top-full mt-2 w-72 z-50 bg-zinc-800 border border-zinc-700 rounded-lg p-4 shadow-xl">
        <div className="absolute -top-1.5 right-3 w-3 h-3 bg-zinc-800 border-l border-t border-zinc-700 rotate-45" />
        <p className="text-sm text-zinc-200 font-medium mb-2">
          Layer Composition
        </p>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Layers are rendered bottom-to-top. Drag to reorder, click to edit
          properties. Combine backgrounds, text, phone frames, images, glows,
          and shapes to compose your screenshot.
        </p>
      </div>
    </>
  );
}
