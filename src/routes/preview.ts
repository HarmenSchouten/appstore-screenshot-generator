/**
 * Preview Routes
 * 
 * Handles preview rendering for screenshots and feature graphics.
 * These endpoints return full HTML documents for iframe embedding.
 */

import { Hono } from 'hono';
import type { ProjectConfig } from '../types/index.ts';
import { renderScreenshot, renderFeatureGraphic } from '../renderer.ts';

export function createPreviewRoutes(
  getConfig: () => Promise<ProjectConfig>
) {
  const routes = new Hono();

  /**
   * Render screenshot preview - returns full HTML document
   */
  routes.get('/screenshot/:lang/:platform/:id', async (c) => {
    const { lang, platform, id } = c.req.param();
    const config = await getConfig();
    
    const langConfig = config.languages.find(l => l.language === lang);
    if (!langConfig) return c.text('Language not found', 404);
    
    const platformConfig = langConfig.platforms[platform as 'android' | 'ios'];
    if (!platformConfig) return c.text('Platform not found', 404);
    
    const screenshot = platformConfig.screenshots.find(s => s.id === id);
    if (!screenshot) return c.text('Screenshot not found', 404);
    
    const html = renderScreenshot({
      screenshot,
      theme: config.theme,
      app: config.app,
      dimensions: platformConfig.dimensions,
      assetUrlPrefix: '/assets/',
    });
    
    c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    return c.html(html);
  });

  /**
   * Render feature graphic preview - returns full HTML document
   */
  routes.get('/feature-graphic/:lang', async (c) => {
    const { lang } = c.req.param();
    const config = await getConfig();
    
    const langConfig = config.languages.find(l => l.language === lang);
    if (!langConfig) return c.text('Language not found', 404);
    
    const featureGraphic = langConfig.platforms.android?.featureGraphic;
    if (!featureGraphic) return c.text('Feature graphic not found', 404);
    
    const html = renderFeatureGraphic({
      featureGraphic,
      theme: config.theme,
      app: config.app,
      assetUrlPrefix: '/assets/',
    });
    
    c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    return c.html(html);
  });

  return routes;
}
