import type { ImageLayerProps } from "@app-types";
import { LAYER_DEFAULTS, withDefaults } from "@lib";
import { assetUrl } from "@renderer/utils.ts";
import { PositionedLayer } from "./PositionedLayer.tsx";

export interface ImageLayerRenderProps extends ImageLayerProps {
  assetUrlPrefix?: string;
}

export const ImageLayer = (
  { assetUrlPrefix = "/assets/", ...layer }: ImageLayerRenderProps,
) => {
  const { imagePath, size, borderRadius } = withDefaults(
    LAYER_DEFAULTS.image,
    layer,
  );
  const src = assetUrl(imagePath, assetUrlPrefix);
  if (!src) return null;

  return (
    <PositionedLayer layer={layer} style={{ width: `${size}%` }}>
      <img
        src={src}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          borderRadius: borderRadius > 0 ? `${borderRadius}px` : undefined,
        }}
      />
    </PositionedLayer>
  );
};
