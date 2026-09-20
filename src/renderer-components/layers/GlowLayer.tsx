import type { GlowLayerProps } from "@app-types";
import { LAYER_DEFAULTS, withDefaults } from "@lib";
import { PositionedLayer } from "./PositionedLayer.tsx";

export const GlowLayer = (layer: GlowLayerProps) => {
  const { color, size, blur } = withDefaults(LAYER_DEFAULTS.glow, layer);

  return (
    <PositionedLayer
      layer={layer}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: color,
        filter: `blur(${blur}px)`,
      }}
    />
  );
};
