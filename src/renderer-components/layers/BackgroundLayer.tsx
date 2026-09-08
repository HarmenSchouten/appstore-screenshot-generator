import type { BackgroundLayerProps, ThemeConfig } from "@app-types";
import { buildGradientCSS, DEFAULT_GRADIENT_DIRECTION } from "@lib";

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
      layer.direction ?? DEFAULT_GRADIENT_DIRECTION,
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
