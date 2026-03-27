import type { ImageLayerProps } from "@types";
import { assetUrl } from "../utils.ts";

export interface ImageLayerRenderProps extends ImageLayerProps {
  assetUrlPrefix?: string;
}

export const ImageLayer = ({
  imagePath,
  size,
  posX,
  posY,
  rotation,
  opacity,
  borderRadius = 0,
  objectFit = "contain",
  assetUrlPrefix = "/assets/",
}: ImageLayerRenderProps) => {
  const src = assetUrl(imagePath, assetUrlPrefix);
  if (!src) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: `${posX}%`,
        top: `${posY}%`,
        width: `${size}%`,
        transform: `translate(-50%, -50%)${
          rotation ? ` rotate(${rotation}deg)` : ""
        }`,
        opacity,
      }}
    >
      <img
        src={src}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          borderRadius: borderRadius > 0 ? `${borderRadius}px` : undefined,
          objectFit,
        }}
      />
    </div>
  );
};
