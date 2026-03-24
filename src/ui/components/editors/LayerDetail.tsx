/**
 * LayerDetail — detail/edit view for a single layer.
 *
 * Shows the layer name, type badge, and the type-specific editor.
 */

import type { Layer } from "@types";
import { LAYER_META, layerDisplayName } from "./layer-meta.ts";
import { BackgroundEditor } from "./BackgroundEditor.tsx";
import { TextEditor } from "./TextEditor.tsx";
import { PhoneFrameEditor } from "./PhoneFrameEditor.tsx";
import { ImageEditor } from "./ImageEditor.tsx";
import { GlowEditor } from "./GlowEditor.tsx";
import { ShapeEditor } from "./ShapeEditor/index.ts";

// ── Editor registry ─────────────────────────────────────────

const LAYER_EDITORS: Record<
  Layer["type"],
  React.ComponentType<{ layer: never; onUpdate: (u: Partial<Layer>) => void }>
> = {
  background: BackgroundEditor,
  text: TextEditor,
  "phone-frame": PhoneFrameEditor,
  image: ImageEditor,
  glow: GlowEditor,
  shape: ShapeEditor,
  // deno-lint-ignore no-explicit-any
} as any;

// ── Component ───────────────────────────────────────────────

interface LayerDetailProps {
  layer: Layer;
  allLayers: Layer[];
  onBack: () => void;
  onUpdate: (updates: Partial<Layer>) => void;
}

export function LayerDetail({
  layer,
  allLayers,
  onBack,
  onUpdate,
}: LayerDetailProps) {
  const meta = LAYER_META[layer.type];
  const Editor = LAYER_EDITORS[layer.type];

  return (
    <div className="flex flex-col h-full">
      {/* Header with back button */}
      <div className="px-4 pt-4 pb-3 border-b border-zinc-800/60">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors mb-2"
        >
          <i className="fa-solid fa-chevron-left text-[10px]" />
          All Layers
        </button>
        <div className="flex items-center gap-2.5">
          <i className={`${meta.icon} ${meta.color} text-base`} />
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-sm text-zinc-200 truncate">
              {layerDisplayName(layer, allLayers)}
            </h2>
            <p className="text-xs text-zinc-500">{meta.label}</p>
          </div>
        </div>
      </div>

      {/* Editor content area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {Editor
          ? <Editor layer={layer as never} onUpdate={onUpdate} />
          : (
            <div className="text-center py-12 text-zinc-600">
              <i className={`${meta.icon} text-3xl mb-3 block opacity-40`} />
              <p className="text-sm">
                {meta.label} editor coming soon
              </p>
              <p className="text-xs mt-1 text-zinc-700">
                Layer-specific controls will appear here
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
