/**
 * AddLayerMenu — dropdown picker for adding a new layer type.
 */

import type { Layer } from "@types";
import { ADDABLE_LAYERS, LAYER_META } from "./layer-meta.ts";

export function AddLayerMenu({
  onAdd,
  onClose,
}: {
  onAdd: (type: Layer["type"]) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute bottom-full left-1 right-1 mb-3 z-20">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl shadow-black/40 overflow-hidden">
        <div className="p-1.5 grid grid-cols-2 gap-1">
          {ADDABLE_LAYERS.map(({ type, icon, label }) => (
            <button
              type="button"
              key={type}
              onClick={() => {
                onAdd(type);
                onClose();
              }}
              className="flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors text-left"
            >
              <i
                className={`${icon} ${
                  LAYER_META[type].color
                } text-xs w-4 text-center`}
              />
              {label}
            </button>
          ))}
        </div>
      </div>
      {/* Chevron pointing down to the button */}
      <div className="flex justify-center -mt-[1px]">
        <svg width="14" height="8" viewBox="0 0 14 8" className="text-zinc-700">
          <path
            d="M0 0 L7 8 L14 0"
            fill="rgb(39 39 42)"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}
