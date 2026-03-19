/**
 * Isomorphic Renderer Components
 *
 * These React components can be rendered:
 * - Client-side: For live preview in the editor
 * - Server-side: Using renderToString for HTML export
 *
 * This ensures WYSIWYG consistency between preview and generated output.
 */

export { Screenshot, ScreenshotContent } from "./Screenshot.tsx";
export { FeatureGraphic, FeatureGraphicContent } from "./FeatureGraphic.tsx";
export { Glow, Glows } from "./Glow.tsx";
export { Shape, Shapes } from "./Shape.tsx";
export { PhoneFrame, Phones } from "./PhoneFrame.tsx";
export { Mascot } from "./Mascot.tsx";
export { BaseStyles, getBaseStylesCSS } from "./BaseStyles.tsx";
export { GLOW_COLORS } from "./constants.ts";
export { assetUrl } from "./utils.ts";

// Server-side rendering (for Deno generate.ts)
export { renderFeatureGraphic, renderScreenshot } from "./server.ts";

// Re-export types
export type {
  AppConfig,
  FeatureGraphic as FeatureGraphicData,
  FeatureGraphicRenderOptions,
  GlowEffect,
  MascotOptions,
  PhoneFrameOptions,
  RenderOptions,
  Screenshot as ScreenshotData,
  Shape as ShapeConfig,
  ShapeType,
  ThemeConfig,
  TypographyOptions,
} from "./types.ts";
