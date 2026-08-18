/**
 * LayerDetail — detail/edit view for a single layer.
 *
 * Shows the layer name, type badge, and the type-specific editor.
 */

import type { Layer } from "@app-types";
import { LAYER_META, layerDisplayName } from "./layer-meta.ts";
import { BackgroundEditor } from "./BackgroundEditor.tsx";
import { TextEditor } from "./TextEditor.tsx";
import { PhoneFrameEditor } from "./PhoneFrameEditor.tsx";
import { ImageEditor } from "./ImageEditor.tsx";
import { GlowEditor } from "./GlowEditor.tsx";
import { ShapeEditor } from "./ShapeEditor/ShapeEditor.tsx";

// ── Type-specific editor ────────────────────────────────────

/**
 * Narrowing on `layer.type` gives each editor its exact layer type; the
 * shared onUpdate accepts Partial<Layer>, which each editor's narrower
 * Partial<XLayerProps> is assignable to.
 */
function LayerEditor(
  { layer, onUpdate }: {
    layer: Layer;
    onUpdate: (updates: Partial<Layer>) => void;
  },
): React.ReactElement {
  switch (layer.type) {
    case "background":
      return <BackgroundEditor layer={layer} onUpdate={onUpdate} />;
    case "text":
      return <TextEditor layer={layer} onUpdate={onUpdate} />;
    case "phone-frame":
      return <PhoneFrameEditor layer={layer} onUpdate={onUpdate} />;
    case "image":
      return <ImageEditor layer={layer} onUpdate={onUpdate} />;
    case "glow":
      return <GlowEditor layer={layer} onUpdate={onUpdate} />;
    case "shape":
      return <ShapeEditor layer={layer} onUpdate={onUpdate} />;
  }
}

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
        <LayerEditor layer={layer} onUpdate={onUpdate} />
      </div>
    </div>
  );
}
