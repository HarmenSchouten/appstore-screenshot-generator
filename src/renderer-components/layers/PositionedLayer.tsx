import type { CSSProperties, ReactNode } from "react";
import type { PositionalLayerProps } from "@app-types";

interface PositionedLayerProps {
  layer: PositionalLayerProps & { opacity: number };
  /** Merged after the positioning rules, so a layer adds its size and paint. */
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * The wrapper every positioned layer shares: absolutely placed with its
 * centre on (posX, posY) percent of the canvas, rotated, faded (#71).
 */
export function PositionedLayer(
  { layer: { posX, posY, rotation, opacity }, style, children }:
    PositionedLayerProps,
) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${posX}%`,
        top: `${posY}%`,
        transform: `translate(-50%, -50%)${
          rotation ? ` rotate(${rotation}deg)` : ""
        }`,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
