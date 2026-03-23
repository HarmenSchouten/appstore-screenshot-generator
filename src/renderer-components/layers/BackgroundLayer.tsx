import type { BackgroundLayerProps } from "../../types/layers.ts";
import type { ThemeConfig } from "../../types/theme.ts";

export type GradientType = "solid" | "linear" | "radial";

/** Build a CSS background string from structured gradient data. */
export function buildGradientCSS(
  gradientType: GradientType,
  colors: string[],
  direction: number,
): string {
  if (colors.length === 0) return "transparent";
  if (gradientType === "solid" || colors.length === 1) return colors[0];
  if (gradientType === "radial") {
    return `radial-gradient(circle, ${colors.join(", ")})`;
  }
  return `linear-gradient(${direction}deg, ${colors.join(", ")})`;
}

interface BackgroundLayerRendererProps extends BackgroundLayerProps {
  theme: ThemeConfig;
}

/** Resolve the CSS background value for a background layer. */
export function resolveBackground(
  layer: BackgroundLayerProps,
  theme: ThemeConfig,
): string {
  // Raw CSS gradient takes priority (set in CSS edit mode)
  if (layer.gradient) return layer.gradient;
  // Structured visual data
  if (layer.colors && layer.colors.length > 0) {
    return buildGradientCSS(
      layer.gradientType ?? "linear",
      layer.colors,
      layer.direction ?? 180,
    );
  }
  return theme.background.gradient;
}

/** BackgroundLayer renderer. */
export function BackgroundLayer({
  opacity,
  theme,
  ...rest
}: BackgroundLayerRendererProps) {
  const background = resolveBackground(rest as BackgroundLayerProps, theme);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background,
        opacity,
      }}
    />
  );
}
