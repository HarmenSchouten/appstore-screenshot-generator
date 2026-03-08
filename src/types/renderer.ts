/**
 * Renderer types - options for rendering screenshots and feature graphics
 */

import type { Dimensions } from './base.ts';
import type { Screenshot, FeatureGraphic } from './screenshot.ts';
import type { ThemeConfig, AppBranding } from './theme.ts';

// ============================================================
// Renderer Options
// ============================================================

export interface RenderOptions {
  screenshot: Screenshot;
  theme: ThemeConfig;
  app: AppBranding;
  dimensions: Dimensions;
  /** For preview: '/assets/', for export: 'file:///...' */
  assetUrlPrefix?: string;
}

export interface FeatureGraphicRenderOptions {
  featureGraphic: FeatureGraphic;
  theme: ThemeConfig;
  app: AppBranding;
  assetUrlPrefix?: string;
}
