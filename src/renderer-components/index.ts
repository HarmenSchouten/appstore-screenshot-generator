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
export { PhoneFrame } from "./layers/PhoneFrameLayer.tsx";
export { BaseStyles, getBaseStylesCSS } from "./BaseStyles.tsx";
export { assetUrl } from "./utils.ts";

// Server-side rendering (for Deno generate.ts)
export { renderScreenshot } from "./server.ts";

// Re-export types
export type {
  AppConfig,
  RenderOptions,
  Screenshot as ScreenshotData,
  ThemeConfig,
  TypographyOptions,
} from "./types.ts";
