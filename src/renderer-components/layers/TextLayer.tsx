import type { TextLayerProps } from "@app-types";
import { LAYER_DEFAULTS, withDefaults } from "@lib";
import { PositionedLayer } from "./PositionedLayer.tsx";

export const TextLayer = (layer: TextLayerProps) => {
  const t = withDefaults(LAYER_DEFAULTS.text, layer);

  return (
    <PositionedLayer
      layer={t}
      style={{
        width: `${100 - t.horizontalPadding * 2}%`,
        fontSize: `${t.fontSize}px`,
        fontWeight: t.fontWeight,
        lineHeight: t.lineHeight,
        letterSpacing: `${t.letterSpacing}px`,
        color: t.textColor,
        textAlign: t.textAlign,
        textTransform: t.textTransform,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {t.text}
    </PositionedLayer>
  );
};
