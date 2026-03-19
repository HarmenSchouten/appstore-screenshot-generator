/**
 * Glow Effect Component
 *
 * Renders colorful blurred glow effects for backgrounds.
 */

import React from "react";
import type { GlowEffect } from "./types.ts";
import { GLOW_COLORS } from "./constants.ts";

interface GlowProps {
  glow: GlowEffect;
  containerWidth: number;
}

/**
 * Single Glow Effect
 */
export function Glow({ glow, containerWidth }: GlowProps): React.ReactElement {
  // Support both named colors and hex values
  const color = glow.color.startsWith("#")
    ? glow.color
    : (GLOW_COLORS[glow.color] || GLOW_COLORS.purple);

  // Size is relative to container width
  const sizePercent = (glow.size / containerWidth) * 100;

  const style: React.CSSProperties = {
    position: "absolute",
    borderRadius: "50%",
    width: `${sizePercent}%`,
    height: `${sizePercent}%`,
    background: color,
    filter: "blur(80px)",
    opacity: 0.5,
    ...(glow.top && { top: glow.top }),
    ...(glow.right && { right: glow.right }),
    ...(glow.bottom && { bottom: glow.bottom }),
    ...(glow.left && { left: glow.left }),
  };

  return <div style={style} />;
}

interface GlowsProps {
  glows: GlowEffect[];
  containerWidth: number;
}

/**
 * Multiple Glow Effects
 */
export function Glows(
  { glows, containerWidth }: GlowsProps,
): React.ReactElement {
  return (
    <>
      {glows.map((glow, index) => (
        <Glow key={index} glow={glow} containerWidth={containerWidth} />
      ))}
    </>
  );
}
