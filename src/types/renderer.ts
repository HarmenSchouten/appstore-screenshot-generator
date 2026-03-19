/**
 * Renderer types - options for rendering screenshots and feature graphics
 */

import type { Dimensions, Platform } from "./base.ts";
import type { FeatureGraphic, Screenshot } from "./screenshot.ts";
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

export interface FeatureGraphicRenderOptions {
  featureGraphic: FeatureGraphic;
  theme: ThemeConfig;
  app: AppBranding;
  platform: Platform;
  defaultDevicePresetId: DevicePresetId;
  assetUrlPrefix?: string;
}
