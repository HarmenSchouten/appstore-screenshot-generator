/**
 * Renderer types - options for rendering screenshots and feature graphics
 */

import type { Dimensions, Platform } from "./base.ts";
import type { Screenshot } from "./screenshot.ts";
import type { AppBranding, ThemeConfig } from "./theme.ts";
import type { DevicePresetId } from "./device.ts";

// ============================================================
// Renderer Options
// ============================================================

export interface RenderOptions {
  screenshot: Screenshot;
  theme: ThemeConfig;
  app: AppBranding;
  platform: Platform;
  defaultDevicePresetId: DevicePresetId;
  dimensions: Dimensions;
  /** For preview: '/assets/', for export: 'file:///...' */
  assetUrlPrefix?: string;
}
