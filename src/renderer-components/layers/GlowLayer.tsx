import type { GlowLayerProps } from "@app-types";

export const GlowLayer = ({
  color,
  size,
  blur = 80,
  posX,
  posY,
  rotation,
  opacity,
}: GlowLayerProps) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${posX}%`,
        top: `${posY}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: color,
        filter: `blur(${blur}px)`,
        opacity,
        transform: `translate(-50%, -50%)${
          rotation ? ` rotate(${rotation}deg)` : ""
        }`,
      }}
    />
  );
};
