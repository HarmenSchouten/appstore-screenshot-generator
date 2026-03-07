/**
 * App Store Screenshots - Web UI Server
 * 
 * Unified preview and generation using iframe-based rendering.
 * The preview shows exactly what will be generated.
 */

import { Hono } from 'jsr:@hono/hono';
import { serveStatic } from 'jsr:@hono/hono/deno';
import { join, relative, basename } from '@std/path';
import { exists, ensureDir } from '@std/fs';
import { 
  renderScreenshot, 
  renderFeatureGraphic, 
  GLOW_COLORS,
  type Screenshot,
  type FeatureGraphic,
  type GlowEffect,
} from './renderer.ts';
import {
  initializeProjects,
  listProjects,
  createProject,
  loadProject,
  saveProject,
  deleteProject,
  duplicateProject,
  getProjectAssetsDir,
  getProjectOutputDir,
  getProjectDir,
  type ProjectConfig,
  type ProjectInfo,
} from './projects.ts';

const app = new Hono();

// Current active project
let currentProjectId: string = 'default';
let currentConfig: ProjectConfig | null = null;

// Initialize projects on startup
await initializeProjects().then(id => {
  currentProjectId = id;
});

/**
 * Get current config, loading if necessary
 */
async function getConfig(): Promise<ProjectConfig> {
  if (!currentConfig) {
    currentConfig = await loadProject(currentProjectId);
  }
  return currentConfig;
}

/**
 * Reload config from disk
 */
async function reloadConfig(): Promise<ProjectConfig> {
  currentConfig = await loadProject(currentProjectId);
  return currentConfig;
}

// Static assets for current project
app.use('/assets/*', async (c, next) => {
  const requestPath = c.req.path.replace('/assets/', '');
  const assetsDir = getProjectAssetsDir(currentProjectId);
  const filePath = join(assetsDir, requestPath);
  
  try {
    const file = await Deno.readFile(filePath);
    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    const mimeTypes: Record<string, string> = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
    };
    return c.body(file, 200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  } catch {
    return c.text('Not found', 404);
  }
});

// ============================================================
// Preview Rendering API - Single source of truth
// ============================================================

/**
 * Render screenshot preview - returns full HTML document
 */
app.get('/preview/screenshot/:lang/:platform/:id', async (c) => {
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
  
  return c.html(html);
});

/**
 * Render feature graphic preview - returns full HTML document
 */
app.get('/preview/feature-graphic/:lang', async (c) => {
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
  
  return c.html(html);
});

// ============================================================
// API Routes
// ============================================================

/**
 * Get available glow colors
 */
app.get('/api/glow-colors', (c) => {
  return c.json(GLOW_COLORS);
});

/**
 * List all projects
 */
app.get('/api/projects', async (c) => {
  const projects = await listProjects();
  return c.json({ projects, currentProjectId });
});

/**
 * Get current project
 */
app.get('/api/projects/current', async (c) => {
  const config = await getConfig();
  return c.json({ projectId: currentProjectId, config });
});

/**
 * Create new project
 */
app.post('/api/projects', async (c) => {
  const { name } = await c.req.json();
  const project = await createProject(name);
  return c.json(project);
});

/**
 * Switch to a project
 */
app.put('/api/projects/:id/activate', async (c) => {
  const { id } = c.req.param();
  currentProjectId = id;
  currentConfig = null;
  const config = await getConfig();
  return c.json({ projectId: id, config });
});

/**
 * Delete a project
 */
app.delete('/api/projects/:id', async (c) => {
  const { id } = c.req.param();
  await deleteProject(id);
  
  // If deleted current project, switch to default
  if (id === currentProjectId) {
    currentProjectId = 'default';
    currentConfig = null;
  }
  
  return c.json({ success: true });
});

/**
 * Duplicate a project
 */
app.post('/api/projects/:id/duplicate', async (c) => {
  const { id } = c.req.param();
  const { name } = await c.req.json();
  const project = await duplicateProject(id, name);
  return c.json(project);
});

/**
 * Get config
 */
app.get('/api/config', async (c) => {
  const config = await getConfig();
  return c.json(config);
});

/**
 * Update full config
 */
app.put('/api/config', async (c) => {
  const config = await c.req.json() as ProjectConfig;
  await saveProject(currentProjectId, config);
  currentConfig = config;
  return c.json({ success: true });
});

/**
 * Update screenshot
 */
app.put('/api/config/screenshot/:lang/:platform/:id', async (c) => {
  const { lang, platform, id } = c.req.param();
  const updates = await c.req.json();
  const config = await getConfig();
  
  const langIndex = config.languages.findIndex(l => l.language === lang);
  if (langIndex === -1) return c.json({ error: 'Language not found' }, 404);
  
  const platformConfig = config.languages[langIndex].platforms[platform as 'android' | 'ios'];
  if (!platformConfig) return c.json({ error: 'Platform not found' }, 404);
  
  const screenshotIndex = platformConfig.screenshots.findIndex(s => s.id === id);
  if (screenshotIndex === -1) return c.json({ error: 'Screenshot not found' }, 404);
  
  platformConfig.screenshots[screenshotIndex] = {
    ...platformConfig.screenshots[screenshotIndex],
    ...updates,
  };
  
  await saveProject(currentProjectId, config);
  currentConfig = config;
  return c.json(platformConfig.screenshots[screenshotIndex]);
});

/**
 * Add new screenshot
 */
app.post('/api/config/screenshot/:lang/:platform', async (c) => {
  const { lang, platform } = c.req.param();
  const screenshot = await c.req.json() as Screenshot;
  const config = await getConfig();
  
  const langIndex = config.languages.findIndex(l => l.language === lang);
  if (langIndex === -1) return c.json({ error: 'Language not found' }, 404);
  
  let platformConfig = config.languages[langIndex].platforms[platform as 'android' | 'ios'];
  if (!platformConfig) {
    // Create platform config
    (config.languages[langIndex].platforms as any)[platform] = {
      dimensions: platform === 'ios' 
        ? { width: 1242, height: 2688 }
        : { width: 1242, height: 2688 },
      screenshots: [],
    };
    platformConfig = config.languages[langIndex].platforms[platform as 'android' | 'ios'];
  }
  
  platformConfig.screenshots.push(screenshot);
  await saveProject(currentProjectId, config);
  currentConfig = config;
  return c.json(screenshot);
});

/**
 * Delete screenshot
 */
app.delete('/api/config/screenshot/:lang/:platform/:id', async (c) => {
  const { lang, platform, id } = c.req.param();
  const config = await getConfig();
  
  const langIndex = config.languages.findIndex(l => l.language === lang);
  if (langIndex === -1) return c.json({ error: 'Language not found' }, 404);
  
  const platformConfig = config.languages[langIndex].platforms[platform as 'android' | 'ios'];
  if (!platformConfig) return c.json({ error: 'Platform not found' }, 404);
  
  platformConfig.screenshots = platformConfig.screenshots.filter(s => s.id !== id);
  await saveProject(currentProjectId, config);
  currentConfig = config;
  return c.json({ success: true });
});

/**
 * Update feature graphic
 */
app.put('/api/config/feature-graphic/:lang', async (c) => {
  const { lang } = c.req.param();
  const updates = await c.req.json();
  const config = await getConfig();
  
  const langIndex = config.languages.findIndex(l => l.language === lang);
  if (langIndex === -1) return c.json({ error: 'Language not found' }, 404);
  
  const androidConfig = config.languages[langIndex].platforms.android;
  if (!androidConfig) return c.json({ error: 'Android platform not found' }, 404);
  
  androidConfig.featureGraphic = {
    ...(androidConfig.featureGraphic || {}),
    ...updates,
  };
  
  await saveProject(currentProjectId, config);
  currentConfig = config;
  return c.json(androidConfig.featureGraphic);
});

/**
 * Add new language
 */
app.post('/api/config/language', async (c) => {
  const { language, copyFrom } = await c.req.json();
  const config = await getConfig();
  
  // Check if language already exists
  if (config.languages.find(l => l.language === language)) {
    return c.json({ error: 'Language already exists' }, 400);
  }
  
  let newLangConfig;
  if (copyFrom) {
    const source = config.languages.find(l => l.language === copyFrom);
    if (source) {
      newLangConfig = JSON.parse(JSON.stringify(source));
      newLangConfig.language = language;
    }
  }
  
  if (!newLangConfig) {
    newLangConfig = {
      language,
      platforms: {
        android: {
          dimensions: { width: 1242, height: 2688 },
          screenshots: [],
          featureGraphic: null,
        },
        ios: {
          dimensions: { width: 1242, height: 2688 },
          screenshots: [],
        },
      },
    };
  }
  
  config.languages.push(newLangConfig);
  await saveProject(currentProjectId, config);
  currentConfig = config;
  return c.json(newLangConfig);
});

/**
 * Delete language
 */
app.delete('/api/config/language/:lang', async (c) => {
  const { lang } = c.req.param();
  const config = await getConfig();
  
  if (config.languages.length <= 1) {
    return c.json({ error: 'Cannot delete the only language' }, 400);
  }
  
  config.languages = config.languages.filter(l => l.language !== lang);
  await saveProject(currentProjectId, config);
  currentConfig = config;
  return c.json({ success: true });
});

/**
 * Copy platform screenshots
 */
app.post('/api/config/copy-platform', async (c) => {
  const { language, sourcePlatform, targetPlatform } = await c.req.json() as { 
    language: string; 
    sourcePlatform: 'android' | 'ios'; 
    targetPlatform: 'android' | 'ios'; 
  };
  const config = await getConfig();
  
  const langConfig = config.languages.find(l => l.language === language);
  if (!langConfig) {
    return c.json({ error: 'Language not found' }, 404);
  }
  
  const source = langConfig.platforms[sourcePlatform];
  if (!source) {
    return c.json({ error: 'Source platform not found' }, 404);
  }
  
  // Deep clone source screenshots with new IDs
  const copiedScreenshots = source.screenshots.map((s) => ({
    ...JSON.parse(JSON.stringify(s)),
    id: crypto.randomUUID(),
  }));
  
  // Initialize target platform if needed
  if (!langConfig.platforms[targetPlatform]) {
    langConfig.platforms[targetPlatform] = {
      dimensions: targetPlatform === 'ios' 
        ? { width: 1242, height: 2688 }
        : { width: 1080, height: 1920 },
      screenshots: [],
    };
  }
  
  // Replace target screenshots
  langConfig.platforms[targetPlatform].screenshots = copiedScreenshots;
  
  await saveProject(currentProjectId, config);
  currentConfig = config;
  return c.json(langConfig);
});

/**
 * List assets in project
 */
app.get('/api/assets', async (c) => {
  const assetsDir = getProjectAssetsDir(currentProjectId);
  const screenshots: string[] = [];
  const icons: string[] = [];
  const mascots: string[] = [];
  
  async function scanDir(dir: string, prefix = '') {
    try {
      for await (const entry of Deno.readDir(dir)) {
        const path = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory) {
          await scanDir(join(dir, entry.name), path);
        } else if (entry.name.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
          if (path.toLowerCase().includes('screenshot') || path.startsWith('screenshots/')) {
            screenshots.push(`assets/${path}`);
          } else if (path.toLowerCase().includes('icon')) {
            icons.push(`assets/${path}`);
          } else if (path.toLowerCase().includes('mascot')) {
            mascots.push(`assets/${path}`);
          } else {
            // Put in screenshots by default for selection
            screenshots.push(`assets/${path}`);
          }
        }
      }
    } catch {
      // Directory doesn't exist
    }
  }
  
  await scanDir(assetsDir);
  
  return c.json({ screenshots, icons, mascots });
});

/**
 * Upload asset
 */
app.post('/api/assets/upload', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;
  const category = formData.get('category') as string || 'screenshots';
  
  if (!file) {
    return c.json({ error: 'No file provided' }, 400);
  }
  
  const assetsDir = getProjectAssetsDir(currentProjectId);
  const targetDir = join(assetsDir, category);
  await ensureDir(targetDir);
  
  const filePath = join(targetDir, file.name);
  const buffer = await file.arrayBuffer();
  await Deno.writeFile(filePath, new Uint8Array(buffer));
  
  return c.json({ path: `assets/${category}/${file.name}` });
});

// ============================================================
// Generation API
// ============================================================

/**
 * Generate all screenshots for export
 */
app.post('/api/generate', async (c) => {
  const { languages, platforms } = await c.req.json();
  const config = await getConfig();
  const outputDir = getProjectOutputDir(currentProjectId);
  
  const results: { path: string; status: 'success' | 'error'; error?: string }[] = [];
  
  // Import convert module for HTML to PNG
  const { convertHtmlFileToPng } = await import('./convert.ts');
  
  for (const langConfig of config.languages) {
    if (languages && !languages.includes(langConfig.language)) continue;
    
    for (const [platformName, platformConfig] of Object.entries(langConfig.platforms)) {
      if (platforms && !platforms.includes(platformName)) continue;
      if (!platformConfig) continue;
      
      const langOutputDir = join(outputDir, langConfig.language, platformName);
      await ensureDir(langOutputDir);
      
      // Generate screenshots
      for (const screenshot of platformConfig.screenshots) {
        const htmlPath = join(langOutputDir, `${screenshot.id}.html`);
        const pngPath = join(langOutputDir, `${screenshot.id}.png`);
        
        try {
          // Generate HTML using renderer
          const html = renderScreenshot({
            screenshot,
            theme: config.theme,
            app: config.app,
            dimensions: platformConfig.dimensions,
            assetUrlPrefix: `file:///${getProjectAssetsDir(currentProjectId).replace(/\\/g, '/')}/`,
          });
          
          await Deno.writeTextFile(htmlPath, html);
          
          // Convert to PNG
          await convertHtmlFileToPng(htmlPath, pngPath, platformConfig.dimensions);
          
          results.push({ path: pngPath, status: 'success' });
        } catch (error) {
          results.push({ 
            path: pngPath, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }
      
      // Generate feature graphic if Android
      if (platformName === 'android' && platformConfig.featureGraphic) {
        const fg = platformConfig.featureGraphic;
        const htmlPath = join(langOutputDir, 'feature-graphic.html');
        const pngPath = join(langOutputDir, 'feature-graphic.png');
        
        try {
          const html = renderFeatureGraphic({
            featureGraphic: fg,
            theme: config.theme,
            app: config.app,
            assetUrlPrefix: `file:///${getProjectAssetsDir(currentProjectId).replace(/\\/g, '/')}/`,
          });
          
          await Deno.writeTextFile(htmlPath, html);
          await convertHtmlFileToPng(htmlPath, pngPath, { width: 1024, height: 500 });
          
          results.push({ path: pngPath, status: 'success' });
        } catch (error) {
          results.push({ 
            path: pngPath, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }
    }
  }
  
  return c.json({ results, outputDir });
});

/**
 * Generate with streaming progress
 */
app.post('/api/generate/stream', async (c) => {
  const config = await getConfig();
  const outputDir = getProjectOutputDir(currentProjectId);
  const assetsDir = getProjectAssetsDir(currentProjectId);
  
  // Calculate total items
  let totalItems = 0;
  for (const langConfig of config.languages) {
    for (const [platformName, platformConfig] of Object.entries(langConfig.platforms)) {
      if (!platformConfig) continue;
      totalItems += platformConfig.screenshots.length;
      if (platformName === 'android' && platformConfig.featureGraphic) {
        totalItems++;
      }
    }
  }
  
  // Stream response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      
      const { convertHtmlFileToPng } = await import('./convert.ts');
      let completed = 0;
      const results: { path: string; relativePath: string; status: 'success' | 'error'; error?: string }[] = [];
      
      send({ type: 'start', total: totalItems });
      
      for (const langConfig of config.languages) {
        for (const [platformName, platformConfig] of Object.entries(langConfig.platforms)) {
          if (!platformConfig) continue;
          
          const langOutputDir = join(outputDir, langConfig.language, platformName);
          await ensureDir(langOutputDir);
          
          for (const screenshot of platformConfig.screenshots) {
            const htmlPath = join(langOutputDir, `${screenshot.id}.html`);
            const pngPath = join(langOutputDir, `${screenshot.id}.png`);
            const relativePath = `${langConfig.language}/${platformName}/${screenshot.id}.png`;
            
            send({ type: 'progress', current: completed + 1, total: totalItems, item: `${langConfig.language}/${platformName}: ${screenshot.headline || screenshot.id}` });
            
            try {
              const html = renderScreenshot({
                screenshot,
                theme: config.theme,
                app: config.app,
                dimensions: platformConfig.dimensions,
                assetUrlPrefix: `file:///${assetsDir.replace(/\\/g, '/')}/`,
              });
              await Deno.writeTextFile(htmlPath, html);
              await convertHtmlFileToPng(htmlPath, pngPath, platformConfig.dimensions);
              results.push({ path: pngPath, relativePath, status: 'success' });
            } catch (error) {
              results.push({ path: pngPath, relativePath, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
            }
            completed++;
          }
          
          if (platformName === 'android' && platformConfig.featureGraphic) {
            const fg = platformConfig.featureGraphic;
            const htmlPath = join(langOutputDir, 'feature-graphic.html');
            const pngPath = join(langOutputDir, 'feature-graphic.png');
            const relativePath = `${langConfig.language}/${platformName}/feature-graphic.png`;
            
            send({ type: 'progress', current: completed + 1, total: totalItems, item: `${langConfig.language}/${platformName}: Feature Graphic` });
            
            try {
              const html = renderFeatureGraphic({
                featureGraphic: fg,
                theme: config.theme,
                app: config.app,
                assetUrlPrefix: `file:///${assetsDir.replace(/\\/g, '/')}/`,
              });
              await Deno.writeTextFile(htmlPath, html);
              await convertHtmlFileToPng(htmlPath, pngPath, { width: 1024, height: 500 });
              results.push({ path: pngPath, relativePath, status: 'success' });
            } catch (error) {
              results.push({ path: pngPath, relativePath, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
            }
            completed++;
          }
        }
      }
      
      send({ type: 'complete', results, outputDir });
      controller.close();
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
});

/**
 * Open folder in system file explorer
 */
app.post('/api/open-folder', async (c) => {
  const { path } = await c.req.json();
  const folderPath = path || getProjectOutputDir(currentProjectId);
  
  try {
    // Windows: explorer, macOS: open, Linux: xdg-open
    const cmd = Deno.build.os === 'windows' 
      ? ['explorer', folderPath]
      : Deno.build.os === 'darwin'
        ? ['open', folderPath]
        : ['xdg-open', folderPath];
    
    const command = new Deno.Command(cmd[0], { args: cmd.slice(1) });
    await command.spawn();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Failed to open folder' }, 500);
  }
});

/**
 * Serve generated output files
 */
app.get('/output/:path{.+}', async (c) => {
  const filePath = c.req.param('path');
  const fullPath = join(getProjectOutputDir(currentProjectId), filePath);
  
  try {
    const file = await Deno.readFile(fullPath);
    const ext = fullPath.split('.').pop()?.toLowerCase();
    const contentType = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'application/octet-stream';
    return new Response(file, { headers: { 'Content-Type': contentType } });
  } catch {
    return c.notFound();
  }
});

// ============================================================
// Main UI
// ============================================================

app.get('/', async (c) => {
  const config = await getConfig();
  const projects = await listProjects();
  
  return c.html(getMainUI(config, projects, currentProjectId));
});

// Handle client-side routing paths (project/lang/platform/screenshot)
app.get('/:project', async (c) => {
  const { project } = c.req.param();
  // Skip if this looks like an API or asset path
  if (project.startsWith('api') || project.startsWith('preview') || project.startsWith('assets') || project.startsWith('output')) {
    return c.notFound();
  }
  // Switch to the requested project if it exists
  const projects = await listProjects();
  if (projects.find(p => p.id === project)) {
    currentProjectId = project;
    currentConfig = await loadProject(project);
  }
  const config = await getConfig();
  return c.html(getMainUI(config, projects, currentProjectId));
});

app.get('/:project/:lang', async (c) => {
  const { project } = c.req.param();
  const projects = await listProjects();
  if (projects.find(p => p.id === project)) {
    currentProjectId = project;
    currentConfig = await loadProject(project);
  }
  const config = await getConfig();
  return c.html(getMainUI(config, projects, currentProjectId));
});

app.get('/:project/:lang/:platform', async (c) => {
  const { project } = c.req.param();
  const projects = await listProjects();
  if (projects.find(p => p.id === project)) {
    currentProjectId = project;
    currentConfig = await loadProject(project);
  }
  const config = await getConfig();
  return c.html(getMainUI(config, projects, currentProjectId));
});

app.get('/:project/:lang/:platform/:screenshot', async (c) => {
  const { project } = c.req.param();
  const projects = await listProjects();
  if (projects.find(p => p.id === project)) {
    currentProjectId = project;
    currentConfig = await loadProject(project);
  }
  const config = await getConfig();
  return c.html(getMainUI(config, projects, currentProjectId));
});

/**
 * Generate the main UI HTML
 */
function getMainUI(config: ProjectConfig, projects: ProjectInfo[], activeProject: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>App Store Screenshots</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://esm.sh/preact@10.19.2"></script>
  <script src="https://esm.sh/preact@10.19.2/hooks"></script>
  <script src="https://esm.sh/htm@3.1.1/preact"></script>
  <style>
    body { background: #0f0f0f; }
    .sidebar { width: 260px; min-width: 260px; }
    .editor-panel { flex: 1; min-width: 0; }
    .editor-sidebar { width: 420px; min-width: 420px; }
    .preview-container { background: #1a1a1a; }
    
    /* Scrollbar styling */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #1a1a1a; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #444; }
    
    /* Preview iframe */
    .preview-iframe {
      background: #000;
      border: none;
      transform-origin: top left;
    }
    
    /* Input styling */
    input, select, textarea {
      background: #252525 !important;
      border: 1px solid #333 !important;
      color: white !important;
    }
    input:focus, select:focus, textarea:focus {
      border-color: #6366f1 !important;
      outline: none !important;
    }
    input[type="color"] {
      padding: 0 !important;
      height: 36px !important;
      cursor: pointer;
    }
    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      background: transparent !important;
      border: none !important;
      cursor: pointer;
      height: 20px;
    }
    input[type="range"]::-webkit-slider-runnable-track {
      background: #3f3f46;
      height: 6px;
      border-radius: 3px;
    }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      margin-top: -5px;
      background: #6366f1;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      border: 2px solid #818cf8;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    input[type="range"]::-webkit-slider-thumb:hover {
      background: #818cf8;
    }
    input[type="range"]::-moz-range-track {
      background: #3f3f46;
      height: 6px;
      border-radius: 3px;
    }
    input[type="range"]::-moz-range-thumb {
      background: #6366f1;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      border: 2px solid #818cf8;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    input[type="range"]::-moz-range-thumb:hover {
      background: #818cf8;
    }
    input[type="range"]:focus {
      outline: none;
    }
    input[type="range"]:focus::-webkit-slider-thumb {
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
    }
    
    /* Collapsible section styling */
    .section-header {
      cursor: pointer;
      user-select: none;
      transition: background 0.15s;
    }
    .section-header:hover {
      background: rgba(255,255,255,0.03);
    }
    .section-content {
      overflow: hidden;
      transition: max-height 0.2s ease-out;
    }
    
    /* Button styling */
    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #7c7ff2 0%, #6366f1 100%);
    }
  </style>
</head>
<body class="text-white min-h-screen">
  <div id="app"></div>

  <script type="module">
    import { h, render } from 'https://esm.sh/preact@10.19.2';
    import { useState, useEffect, useCallback, useRef, useMemo } from 'https://esm.sh/preact@10.19.2/hooks';
    import { html } from 'https://esm.sh/htm@3.1.1/preact';
    
    // Initial data from server
    const initialConfig = ${JSON.stringify(config)};
    const initialProjects = ${JSON.stringify(projects)};
    const initialProjectId = ${JSON.stringify(activeProject)};
    
    // Glow colors
    const GLOW_COLORS = ${JSON.stringify(GLOW_COLORS)};
    
    // ========================================
    // URL Routing Helpers
    // ========================================
    function parseUrlParams() {
      const path = window.location.pathname;
      const parts = path.split('/').filter(Boolean);
      // Format: /project/lang/platform/screenshotId
      return {
        project: parts[0] || null,
        lang: parts[1] || null,
        platform: parts[2] || null,
        screenshotId: parts[3] || null,
      };
    }
    
    function buildUrl(project, lang, platform, screenshotId) {
      let url = '/' + project;
      if (lang) url += '/' + lang;
      if (platform) url += '/' + platform;
      if (screenshotId) url += '/' + screenshotId;
      return url;
    }
    
    // ========================================
    // Main App
    // ========================================
    function App() {
      // Parse URL for initial state
      const urlParams = parseUrlParams();
      const validProject = initialProjects.find(p => p.id === urlParams.project);
      const initialProject = validProject ? urlParams.project : initialProjectId;
      
      const [config, setConfig] = useState(initialConfig);
      const [projects, setProjects] = useState(initialProjects);
      const [currentProject, setCurrentProject] = useState(initialProject);
      
      // Determine initial selections from URL or defaults
      const getInitialLang = () => {
        if (urlParams.lang && config.languages.find(l => l.language === urlParams.lang)) {
          return urlParams.lang;
        }
        return config.languages[0]?.language || 'en';
      };
      const getInitialPlatform = () => {
        if (urlParams.platform && ['android', 'ios'].includes(urlParams.platform)) {
          return urlParams.platform;
        }
        return 'android';
      };
      const getInitialItem = () => {
        if (urlParams.screenshotId === 'feature-graphic') {
          return { type: 'feature-graphic' };
        }
        if (urlParams.screenshotId) {
          return { type: 'screenshot', id: urlParams.screenshotId };
        }
        return null;
      };
      
      const [selectedLang, setSelectedLang] = useState(getInitialLang());
      const [selectedPlatform, setSelectedPlatform] = useState(getInitialPlatform());
      const [selectedItem, setSelectedItem] = useState(getInitialItem());
      const [assets, setAssets] = useState({ screenshots: [], icons: [], mascots: [] });
      const [generating, setGenerating] = useState(false);
      const [showProjectModal, setShowProjectModal] = useState(false);
      const [showGenerateModal, setShowGenerateModal] = useState(false);
      const [generateProgress, setGenerateProgress] = useState({ current: 0, total: 0, item: '', results: null, outputDir: '' });
      const [previewVersion, setPreviewVersion] = useState(0); // Increment to force preview refresh
      
      // Update URL when selections change
      useEffect(() => {
        const screenshotId = selectedItem?.type === 'feature-graphic' 
          ? 'feature-graphic' 
          : selectedItem?.id || null;
        const newUrl = buildUrl(currentProject, selectedLang, selectedPlatform, screenshotId);
        if (window.location.pathname !== newUrl) {
          window.history.pushState({}, '', newUrl);
        }
      }, [currentProject, selectedLang, selectedPlatform, selectedItem]);
      
      // Handle browser back/forward
      useEffect(() => {
        const handlePopState = () => {
          const params = parseUrlParams();
          if (params.project && params.project !== currentProject) {
            switchProject(params.project);
          }
          if (params.lang) setSelectedLang(params.lang);
          if (params.platform) setSelectedPlatform(params.platform);
          if (params.screenshotId === 'feature-graphic') {
            setSelectedItem({ type: 'feature-graphic' });
          } else if (params.screenshotId) {
            setSelectedItem({ type: 'screenshot', id: params.screenshotId });
          } else {
            setSelectedItem(null);
          }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
      }, [currentProject]);
      
      // Load assets
      useEffect(() => {
        fetch('/api/assets').then(r => r.json()).then(setAssets);
      }, [currentProject]);
      
      // Get current platform config
      const getLangConfig = () => config.languages.find(l => l.language === selectedLang);
      const getPlatformConfig = () => getLangConfig()?.platforms[selectedPlatform];
      const getScreenshots = () => getPlatformConfig()?.screenshots || [];
      const getFeatureGraphic = () => getLangConfig()?.platforms?.android?.featureGraphic;
      
      // Save config to server and refresh preview
      const saveConfig = async (newConfig) => {
        setConfig(newConfig);
        setPreviewVersion(v => v + 1); // Trigger preview refresh
        await fetch('/api/config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newConfig),
        });
      };
      
      // Update screenshot
      const updateScreenshot = (id, updates) => {
        const newConfig = { ...config };
        const langConfig = newConfig.languages.find(l => l.language === selectedLang);
        const platformConfig = langConfig?.platforms[selectedPlatform];
        if (platformConfig) {
          const idx = platformConfig.screenshots.findIndex(s => s.id === id);
          if (idx !== -1) {
            platformConfig.screenshots[idx] = { ...platformConfig.screenshots[idx], ...updates };
            saveConfig(newConfig);
          }
        }
      };
      
      // Update feature graphic
      const updateFeatureGraphic = (updates) => {
        const newConfig = { ...config };
        const langConfig = newConfig.languages.find(l => l.language === selectedLang);
        if (langConfig?.platforms?.android) {
          langConfig.platforms.android.featureGraphic = {
            ...(langConfig.platforms.android.featureGraphic || {}),
            ...updates,
          };
          saveConfig(newConfig);
        }
      };
      
      // Add new screenshot
      const addScreenshot = () => {
        const id = 'screenshot-' + Date.now();
        const newScreenshot = {
          id,
          headline: 'New Screenshot',
          subtitle: 'Add a subtitle',
          imagePath: '',
          glows: [{ color: 'purple', size: 400, top: '10%', left: '20%' }],
          phoneFrame: { scale: 70, bottomOffset: 6 },
        };
        
        const newConfig = { ...config };
        const langConfig = newConfig.languages.find(l => l.language === selectedLang);
        if (langConfig?.platforms[selectedPlatform]) {
          langConfig.platforms[selectedPlatform].screenshots.push(newScreenshot);
          saveConfig(newConfig);
          setSelectedItem({ type: 'screenshot', id });
        }
      };
      
      // Delete screenshot
      const deleteScreenshot = (id) => {
        const newConfig = { ...config };
        const langConfig = newConfig.languages.find(l => l.language === selectedLang);
        if (langConfig?.platforms[selectedPlatform]) {
          langConfig.platforms[selectedPlatform].screenshots = 
            langConfig.platforms[selectedPlatform].screenshots.filter(s => s.id !== id);
          saveConfig(newConfig);
          if (selectedItem?.id === id) setSelectedItem(null);
        }
      };
      
      // Refresh assets
      const refreshAssets = async () => {
        const res = await fetch('/api/assets');
        setAssets(await res.json());
      };
      
      // Switch project
      const switchProject = async (projectId) => {
        const res = await fetch(\`/api/projects/\${projectId}/activate\`, { method: 'PUT' });
        const data = await res.json();
        setCurrentProject(projectId);
        setConfig(data.config);
        setSelectedLang(data.config.languages[0]?.language || 'en');
        setSelectedItem(null);
        // Reload assets
        const assetsRes = await fetch('/api/assets');
        setAssets(await assetsRes.json());
      };
      
      // Create new project
      const createNewProject = async (name) => {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
        const project = await res.json();
        setProjects([...projects, project]);
        await switchProject(project.id);
        setShowProjectModal(false);
      };
      
      // Add language
      const addLanguage = async (language, copyFrom) => {
        const res = await fetch('/api/config/language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language, copyFrom }),
        });
        if (res.ok) {
          const newLang = await res.json();
          const newConfig = { ...config };
          newConfig.languages.push(newLang);
          setConfig(newConfig);
          setSelectedLang(language);
        }
      };
      
      // Delete language
      const deleteLanguage = async (lang) => {
        if (config.languages.length <= 1) {
          alert('Cannot delete the only language');
          return;
        }
        await fetch(\`/api/config/language/\${lang}\`, { method: 'DELETE' });
        const newConfig = { ...config };
        newConfig.languages = newConfig.languages.filter(l => l.language !== lang);
        setConfig(newConfig);
        if (selectedLang === lang) {
          setSelectedLang(newConfig.languages[0]?.language || 'en');
        }
      };
      
      // Generate all with progress
      const generateAll = async () => {
        setShowGenerateModal(true);
        setGenerateProgress({ current: 0, total: 0, item: 'Starting...', results: null, outputDir: '' });
        setGenerating(true);
        
        try {
          const response = await fetch('/api/generate/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          });
          
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const text = decoder.decode(value);
            const lines = text.split('\\n').filter(l => l.startsWith('data: '));
            
            for (const line of lines) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'start') {
                  setGenerateProgress(prev => ({ ...prev, total: data.total }));
                } else if (data.type === 'progress') {
                  setGenerateProgress(prev => ({ ...prev, current: data.current, item: data.item }));
                } else if (data.type === 'complete') {
                  setGenerateProgress(prev => ({ ...prev, results: data.results, outputDir: data.outputDir, current: prev.total }));
                }
              } catch {}
            }
          }
        } catch (error) {
          alert('Generation failed: ' + error.message);
          setShowGenerateModal(false);
        }
        setGenerating(false);
      };
      
      // Open output folder
      const openOutputFolder = async () => {
        await fetch('/api/open-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
      };
      
      // Copy platform config
      const copyPlatformConfig = async (sourcePlatform, targetPlatform) => {
        const res = await fetch('/api/config/copy-platform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            language: selectedLang,
            sourcePlatform, 
            targetPlatform 
          }),
        });
        if (res.ok) {
          const updatedLang = await res.json();
          const newConfig = { ...config };
          const langIndex = newConfig.languages.findIndex(l => l.language === selectedLang);
          if (langIndex >= 0) {
            newConfig.languages[langIndex] = updatedLang;
          }
          setConfig(newConfig);
          setSelectedPlatform(targetPlatform);
          setSelectedItem(null);
        }
      };
      
      // Get selected screenshot
      const getSelectedScreenshot = () => {
        if (selectedItem?.type === 'screenshot') {
          return getScreenshots().find(s => s.id === selectedItem.id);
        }
        return null;
      };
      
      // Get preview URL
      const getPreviewUrl = () => {
        if (selectedItem?.type === 'screenshot' && selectedItem.id) {
          return \`/preview/screenshot/\${selectedLang}/\${selectedPlatform}/\${selectedItem.id}\`;
        }
        if (selectedItem?.type === 'feature-graphic') {
          return \`/preview/feature-graphic/\${selectedLang}\`;
        }
        return null;
      };
      
      return html\`
        <div class="flex h-screen">
          <!-- Sidebar -->
          <div class="sidebar bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <!-- Header -->
            <div class="p-4 border-b border-zinc-800">
              <div class="flex items-center justify-between mb-3">
                <h1 class="font-bold text-lg">Screenshots</h1>
                <button 
                  onClick=\${() => setShowProjectModal(true)}
                  class="text-xs px-2 py-1 bg-zinc-800 rounded hover:bg-zinc-700"
                >
                  <i class="fa-solid fa-folder mr-1"></i> Projects
                </button>
              </div>
              
              <!-- Project selector -->
              <select 
                value=\${currentProject}
                onChange=\${(e) => switchProject(e.target.value)}
                class="w-full px-3 py-2 rounded text-sm"
              >
                \${projects.map(p => html\`
                  <option value=\${p.id}>\${p.name}</option>
                \`)}
              </select>
            </div>
            
            <!-- Language/Platform tabs -->
            <div class="p-3 border-b border-zinc-800 space-y-2">
              <div class="flex gap-2">
                \${config.languages.map(l => html\`
                  <button
                    onClick=\${() => setSelectedLang(l.language)}
                    class=\${"px-3 py-1 text-xs rounded " + 
                      (selectedLang === l.language ? "bg-indigo-600" : "bg-zinc-800 hover:bg-zinc-700")}
                  >
                    \${l.language.toUpperCase()}
                  </button>
                \`)}
                <button
                  onClick=\${() => {
                    const lang = prompt('Enter language code (e.g., fr, de, es):');
                    if (lang) {
                      const copyFrom = confirm('Copy screenshots from current language?') ? selectedLang : null;
                      addLanguage(lang, copyFrom);
                    }
                  }}
                  class="px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded"
                ><i class="fa-solid fa-plus"></i></button>
              </div>
              
              <div class="flex gap-2">
                \${['android', 'ios'].map(p => html\`
                  <button
                    onClick=\${() => { setSelectedPlatform(p); setSelectedItem(null); }}
                    class=\${"flex-1 px-3 py-1 text-xs rounded " + 
                      (selectedPlatform === p ? "bg-indigo-600" : "bg-zinc-800 hover:bg-zinc-700")}
                  >
                    \${p === 'android' ? 'Android' : 'iOS'}
                  </button>
                \`)}
                <button
                  onClick=\${() => {
                    const sourcePlatform = selectedPlatform;
                    const targetPlatform = sourcePlatform === 'android' ? 'ios' : 'android';
                    if (confirm(\`Copy all \${sourcePlatform} screenshots to \${targetPlatform}? This will replace existing \${targetPlatform} screenshots.\`)) {
                      copyPlatformConfig(sourcePlatform, targetPlatform);
                    }
                  }}
                  class="px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded"
                  title=\${"Copy " + selectedPlatform + " screenshots to " + (selectedPlatform === 'android' ? 'iOS' : 'Android')}
                ><i class="fa-solid fa-clone"></i></button>
              </div>
            </div>
            
            <!-- Screenshot list -->
            <div class="flex-1 overflow-y-auto p-3 space-y-2">
              \${getScreenshots().map((s, i) => html\`
                <div 
                  onClick=\${() => setSelectedItem({ type: 'screenshot', id: s.id })}
                  class=\${"p-3 rounded cursor-pointer border " + 
                    (selectedItem?.id === s.id 
                      ? "bg-indigo-900/50 border-indigo-500" 
                      : "bg-zinc-800/50 border-transparent hover:bg-zinc-800")}
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="text-xs text-zinc-500 mb-1">#\${i + 1}</div>
                      <div class="font-medium text-sm truncate">\${s.headline}</div>
                      <div class="text-xs text-zinc-400 truncate">\${s.subtitle}</div>
                    </div>
                    <button 
                      onClick=\${(e) => { e.stopPropagation(); deleteScreenshot(s.id); }}
                      class="text-zinc-500 hover:text-red-400 text-lg"
                    ><i class="fa-solid fa-xmark"></i></button>
                  </div>
                </div>
              \`)}
              
              <button 
                onClick=\${addScreenshot}
                class="w-full p-3 rounded border border-dashed border-zinc-600 text-zinc-400 hover:border-indigo-500 hover:text-indigo-400 text-sm"
              >
                <i class="fa-solid fa-plus mr-1"></i> Add Screenshot
              </button>
              
              \${selectedPlatform === 'android' && html\`
                <div class="pt-3 mt-3 border-t border-zinc-700">
                  <div 
                    onClick=\${() => setSelectedItem({ type: 'feature-graphic' })}
                    class=\${"p-3 rounded cursor-pointer border " + 
                      (selectedItem?.type === 'feature-graphic'
                        ? "bg-indigo-900/50 border-indigo-500" 
                        : "bg-zinc-800/50 border-transparent hover:bg-zinc-800")}
                  >
                    <div class="text-xs text-amber-500 mb-1">Feature Graphic</div>
                    <div class="font-medium text-sm">\${getFeatureGraphic()?.headline || 'Configure...'}</div>
                  </div>
                </div>
              \`}
            </div>
            
            <!-- Generate button -->
            <div class="p-3 border-t border-zinc-800">
              <button 
                onClick=\${generateAll}
                disabled=\${generating}
                class="w-full py-2 btn-primary rounded font-medium disabled:opacity-50"
              >
                \${generating ? html\`<i class="fa-solid fa-spinner fa-spin mr-1"></i> Generating...\` : html\`<i class="fa-solid fa-wand-magic-sparkles mr-1"></i> Generate All\`}
              </button>
            </div>
          </div>
          
          <!-- Main content area -->
          <div class="editor-panel flex flex-col min-h-0">
            \${selectedItem ? html\`
              <!-- Preview and Editor -->
              <div class="flex-1 flex min-h-0">
                <!-- Preview -->
                <\${Preview} url=\${getPreviewUrl()} type=\${selectedItem.type} version=\${previewVersion} />
                
                <!-- Editor -->
                <\${Editor}
                  type=\${selectedItem.type}
                  screenshot=\${getSelectedScreenshot()}
                  featureGraphic=\${getFeatureGraphic()}
                  assets=\${assets}
                  config=\${config}
                  onUpdateScreenshot=\${updateScreenshot}
                  onUpdateFeatureGraphic=\${updateFeatureGraphic}
                  onUpdateConfig=\${saveConfig}
                  onAssetsRefresh=\${refreshAssets}
                />
              </div>
            \` : html\`
              <div class="flex-1 flex items-center justify-center text-zinc-500">
                Select a screenshot to edit
              </div>
            \`}
          </div>
          
          <!-- Project Modal -->
          \${showProjectModal && html\`
            <\${ProjectModal}
              projects=\${projects}
              currentProject=\${currentProject}
              onClose=\${() => setShowProjectModal(false)}
              onCreate=\${createNewProject}
              onSwitch=\${switchProject}
            />
          \`}
          
          <!-- Generate Modal -->
          \${showGenerateModal && html\`
            <\${GenerateModal}
              progress=\${generateProgress}
              generating=\${generating}
              onClose=\${() => setShowGenerateModal(false)}
              onOpenFolder=\${openOutputFolder}
            />
          \`}
        </div>
      \`;
    }
    
    // ========================================
    // Preview Component - Uses iframe
    // ========================================
    function Preview({ url, type, version }) {
      const containerRef = useRef(null);
      const iframeRef = useRef(null);
      const [scale, setScale] = useState(0.3);
      
      // Calculate scale to fit container - use ResizeObserver for responsive updates
      useEffect(() => {
        if (!containerRef.current || !url) return;
        
        const calculateScale = () => {
          const container = containerRef.current;
          if (!container) return;
          
          const containerWidth = container.clientWidth - 40;
          const containerHeight = container.clientHeight - 40;
          
          let contentWidth, contentHeight;
          if (type === 'feature-graphic') {
            contentWidth = 1024;
            contentHeight = 500;
          } else {
            contentWidth = 1242;
            contentHeight = 2688;
          }
          
          const scaleX = containerWidth / contentWidth;
          const scaleY = containerHeight / contentHeight;
          // Use whichever scale fits, no arbitrary cap
          const newScale = Math.min(scaleX, scaleY);
          setScale(Math.max(0.1, newScale)); // Ensure minimum visibility
        };
        
        calculateScale();
        
        // Recalculate on resize
        const observer = new ResizeObserver(calculateScale);
        observer.observe(containerRef.current);
        
        return () => observer.disconnect();
      }, [url, type]);
      
      // Refresh iframe when version changes (config was updated)
      useEffect(() => {
        if (iframeRef.current && url) {
          // Force reload by updating src with cache-busting timestamp
          iframeRef.current.src = url + '?v=' + version + '&t=' + Date.now();
        }
      }, [version, url]);
      
      if (!url) {
        return html\`
          <div class="flex-1 preview-container flex items-center justify-center text-zinc-500">
            No preview available
          </div>
        \`;
      }
      
      const width = type === 'feature-graphic' ? 1024 : 1242;
      const height = type === 'feature-graphic' ? 500 : 2688;
      
      return html\`
        <div ref=\${containerRef} class="flex-1 preview-container flex items-center justify-center overflow-hidden p-5">
          <div 
            class="relative bg-black rounded-lg overflow-hidden shadow-2xl"
            style=\${{
              width: width * scale + 'px',
              height: height * scale + 'px',
            }}
          >
            <iframe
              ref=\${iframeRef}
              src=\${url + '?v=' + version + '&t=' + Date.now()}
              class="preview-iframe"
              style=\${{
                width: width + 'px',
                height: height + 'px',
                transform: \`scale(\${scale})\`,
              }}
            />
          </div>
        </div>
      \`;
    }
    
    // ========================================
    // Collapsible Section Component
    // ========================================
    function CollapsibleSection({ title, defaultOpen = true, children }) {
      const [isOpen, setIsOpen] = useState(defaultOpen);
      
      return html\`
        <div class="border border-zinc-800 rounded-lg overflow-hidden">
          <div 
            class="section-header flex items-center justify-between px-3 py-2 bg-zinc-800/50"
            onClick=\${() => setIsOpen(!isOpen)}
          >
            <h3 class="text-sm font-medium text-zinc-300">\${title}</h3>
            <i class=\${"fa-solid fa-chevron-down text-zinc-400 text-xs transition-transform " + (isOpen ? "rotate-180" : "")}></i>
          </div>
          \${isOpen && html\`
            <div class="p-3 space-y-3 bg-zinc-900/50">
              \${children}
            </div>
          \`}
        </div>
      \`;
    }
    
    // ========================================
    // Image Select with Upload
    // ========================================
    function ImageSelect({ value, onChange, options, category, onAssetsRefresh, label, placeholder = "Select image..." }) {
      const fileInputRef = useRef(null);
      const [uploading, setUploading] = useState(false);
      
      const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category || 'screenshots');
        
        try {
          const res = await fetch('/api/assets/upload', {
            method: 'POST',
            body: formData,
          });
          if (res.ok) {
            const data = await res.json();
            // Refresh assets list and select the new file
            if (onAssetsRefresh) await onAssetsRefresh();
            onChange(data.path);
          }
        } catch (err) {
          console.error('Upload failed:', err);
        }
        setUploading(false);
        e.target.value = '';
      };
      
      return html\`
        <div>
          \${label && html\`<label class="text-xs text-zinc-500 block mb-1">\${label}</label>\`}
          <div class="flex gap-2">
            <select
              value=\${value || ''}
              onChange=\${(e) => onChange(e.target.value)}
              class="flex-1 px-3 py-2 rounded text-sm"
            >
              <option value="">\${placeholder}</option>
              \${options.map(p => html\`<option value=\${p}>\${p.split('/').pop()}</option>\`)}
            </select>
            <input
              ref=\${fileInputRef}
              type="file"
              accept="image/*"
              onChange=\${handleUpload}
              class="hidden"
            />
            <button
              onClick=\${() => fileInputRef.current?.click()}
              disabled=\${uploading}
              class="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm disabled:opacity-50"
              title="Upload new image"
            >
              <i class="fa-solid fa-upload"></i>
            </button>
          </div>
        </div>
      \`;
    }
    
    // ========================================
    // Slider Component
    // ========================================
    function Slider({ label, value, onChange, min, max, step = 1, unit = '', showValue = true }) {
      const displayValue = typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(step < 1 ? 2 : 0)) : value;
      
      return html\`
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-xs text-zinc-500">\${label}</label>
            \${showValue && html\`<span class="text-xs text-zinc-400">\${displayValue}\${unit}</span>\`}
          </div>
          <input
            type="range"
            min=\${min}
            max=\${max}
            step=\${step}
            value=\${value}
            onInput=\${(e) => onChange(Number(e.target.value))}
            class="w-full"
          />
        </div>
      \`;
    }
    
    // ========================================
    // Editor Component
    // ========================================
    function Editor({ type, screenshot, featureGraphic, assets, config, onUpdateScreenshot, onUpdateFeatureGraphic, onUpdateConfig, onAssetsRefresh }) {
      if (type === 'feature-graphic') {
        return html\`<\${FeatureGraphicEditor}
          featureGraphic=\${featureGraphic}
          assets=\${assets}
          config=\${config}
          onUpdate=\${onUpdateFeatureGraphic}
          onUpdateConfig=\${onUpdateConfig}
          onAssetsRefresh=\${onAssetsRefresh}
        />\`;
      }
      
      if (type === 'screenshot' && screenshot) {
        return html\`<\${ScreenshotEditor}
          screenshot=\${screenshot}
          assets=\${assets}
          config=\${config}
          onUpdate=\${(updates) => onUpdateScreenshot(screenshot.id, updates)}
          onUpdateConfig=\${onUpdateConfig}
          onAssetsRefresh=\${onAssetsRefresh}
        />\`;
      }
      
      return null;
    }
    
    // ========================================
    // Screenshot Editor
    // ========================================
    function ScreenshotEditor({ screenshot, assets, config, onUpdate, onUpdateConfig, onAssetsRefresh }) {
      const isDual = Array.isArray(screenshot.imagePath);
      const typo = screenshot.typography || {};
      
      const updateTypography = (updates) => {
        onUpdate({ typography: { ...typo, ...updates } });
      };
      
      return html\`
        <div class="editor-sidebar bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
          <div class="p-4 space-y-3">
            <h2 class="font-bold text-lg mb-4">Screenshot Editor</h2>
            
            <!-- Content Section -->
            <\${CollapsibleSection} title="Content" defaultOpen=\${true}>
              <div>
                <label class="text-xs text-zinc-500 block mb-1">Headline</label>
                <input
                  type="text"
                  value=\${screenshot.headline}
                  onInput=\${(e) => onUpdate({ headline: e.target.value })}
                  class="w-full px-3 py-2 rounded text-sm"
                  placeholder="Your headline here..."
                />
              </div>
              <div>
                <label class="text-xs text-zinc-500 block mb-1">Subtitle</label>
                <input
                  type="text"
                  value=\${screenshot.subtitle}
                  onInput=\${(e) => onUpdate({ subtitle: e.target.value })}
                  class="w-full px-3 py-2 rounded text-sm"
                  placeholder="A compelling subtitle..."
                />
              </div>
            </\${CollapsibleSection}>
            
            <!-- Typography Section -->
            <\${CollapsibleSection} title="Typography" defaultOpen=\${false}>
              <div class="grid grid-cols-2 gap-3">
                <\${Slider}
                  label="Headline Size"
                  value=\${typo.headlineFontSize ?? 5.2}
                  onChange=\${(v) => updateTypography({ headlineFontSize: v })}
                  min=\${3}
                  max=\${8}
                  step=\${0.1}
                  unit="%"
                />
                <\${Slider}
                  label="Subtitle Size"
                  value=\${typo.subtitleFontSize ?? 2.4}
                  onChange=\${(v) => updateTypography({ subtitleFontSize: v })}
                  min=\${1.5}
                  max=\${4}
                  step=\${0.1}
                  unit="%"
                />
                <div>
                  <label class="text-xs text-zinc-500 block mb-1">Headline Weight</label>
                  <select
                    value=\${typo.headlineFontWeight ?? 800}
                    onChange=\${(e) => updateTypography({ headlineFontWeight: Number(e.target.value) })}
                    class="w-full px-3 py-2 rounded text-sm"
                  >
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semibold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">Extra Bold (800)</option>
                    <option value="900">Black (900)</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs text-zinc-500 block mb-1">Subtitle Weight</label>
                  <select
                    value=\${typo.subtitleFontWeight ?? 500}
                    onChange=\${(e) => updateTypography({ subtitleFontWeight: Number(e.target.value) })}
                    class="w-full px-3 py-2 rounded text-sm"
                  >
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semibold (600)</option>
                    <option value="700">Bold (700)</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <\${Slider}
                  label="Line Height"
                  value=\${typo.headlineLineHeight ?? 1.15}
                  onChange=\${(v) => updateTypography({ headlineLineHeight: v })}
                  min=\${1}
                  max=\${1.5}
                  step=\${0.05}
                />
                <div>
                  <label class="text-xs text-zinc-500 block mb-1">Text Align</label>
                  <div class="flex gap-1">
                    \${['left', 'center', 'right'].map(align => html\`
                      <button
                        onClick=\${() => updateTypography({ textAlign: align })}
                        class=\${"flex-1 px-2 py-1.5 rounded text-xs " + 
                          ((typo.textAlign ?? 'center') === align ? "bg-indigo-600" : "bg-zinc-800 hover:bg-zinc-700")}
                      >
                        \${align.charAt(0).toUpperCase() + align.slice(1)}
                      </button>
                    \`)}
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-zinc-500 block mb-1">Text Color</label>
                  <div class="flex gap-2">
                    <input
                      type="color"
                      value=\${typo.textColor ?? '#ffffff'}
                      onInput=\${(e) => updateTypography({ textColor: e.target.value })}
                      class="w-12 h-9 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value=\${typo.textColor ?? '#ffffff'}
                      onInput=\${(e) => updateTypography({ textColor: e.target.value })}
                      class="flex-1 px-3 py-2 rounded text-sm font-mono"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                <\${Slider}
                  label="Padding"
                  value=\${typo.horizontalPadding ?? 6}
                  onChange=\${(v) => updateTypography({ horizontalPadding: v })}
                  min=\${2}
                  max=\${15}
                  step=\${1}
                  unit="%"
                />
              </div>
            </\${CollapsibleSection}>
            
            <!-- Layout Section -->
            <\${CollapsibleSection} title="Layout" defaultOpen=\${false}>
              <\${Slider}
                label="Title Offset from Top"
                value=\${screenshot.headlineOffset ?? 0}
                onChange=\${(v) => onUpdate({ headlineOffset: v })}
                min=\${0}
                max=\${30}
                step=\${1}
                unit="%"
              />
            </\${CollapsibleSection}>
            
            <!-- Images Section -->
            <\${CollapsibleSection} title="Phone Screenshot" defaultOpen=\${true}>
              <div class="flex justify-end mb-2">
                <button
                  onClick=\${() => {
                    if (isDual) {
                      onUpdate({ imagePath: screenshot.imagePath[0] || '' });
                    } else {
                      onUpdate({ imagePath: [screenshot.imagePath || '', ''] });
                    }
                  }}
                  class="text-xs px-3 py-1.5 bg-zinc-800 rounded hover:bg-zinc-700"
                >
                  \${isDual ? '← Single Phone' : 'Dual Phones →'}
                </button>
              </div>
              
              \${isDual ? html\`
                <div class="space-y-3">
                  <\${ImageSelect}
                    label="Left Phone"
                    value=\${screenshot.imagePath[0] || ''}
                    onChange=\${(v) => onUpdate({ imagePath: [v, screenshot.imagePath[1] || ''] })}
                    options=\${assets.screenshots}
                    category="screenshots"
                    onAssetsRefresh=\${onAssetsRefresh}
                  />
                  <\${ImageSelect}
                    label="Right Phone"
                    value=\${screenshot.imagePath[1] || ''}
                    onChange=\${(v) => onUpdate({ imagePath: [screenshot.imagePath[0] || '', v] })}
                    options=\${assets.screenshots}
                    category="screenshots"
                    onAssetsRefresh=\${onAssetsRefresh}
                  />
                </div>
              \` : html\`
                <\${ImageSelect}
                  value=\${screenshot.imagePath || ''}
                  onChange=\${(v) => onUpdate({ imagePath: v })}
                  options=\${assets.screenshots}
                  category="screenshots"
                  onAssetsRefresh=\${onAssetsRefresh}
                />
              \`}
            </\${CollapsibleSection}>
            
            <!-- Phone Frame Section -->
            <\${CollapsibleSection} title="Phone Frame" defaultOpen=\${false}>
              <div class="grid grid-cols-2 gap-3">
                <\${Slider}
                  label="Scale"
                  value=\${screenshot.phoneFrame?.scale ?? (isDual ? 42 : 70)}
                  onChange=\${(v) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, scale: v } })}
                  min=\${isDual ? 30 : 50}
                  max=\${100}
                  step=\${1}
                  unit="%"
                />
                <\${Slider}
                  label="Bottom Offset"
                  value=\${screenshot.phoneFrame?.bottomOffset ?? 6}
                  onChange=\${(v) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, bottomOffset: v } })}
                  min=\${0}
                  max=\${100}
                  step=\${1}
                  unit="%"
                />
                \${isDual && html\`
                  <\${Slider}
                    label="Rotation"
                    value=\${screenshot.phoneFrame?.dualRotation ?? 6}
                    onChange=\${(v) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, dualRotation: v } })}
                    min=\${0}
                    max=\${15}
                    step=\${1}
                    unit="°"
                  />
                  <\${Slider}
                    label="Gap"
                    value=\${screenshot.phoneFrame?.dualGap ?? 2}
                    onChange=\${(v) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, dualGap: v } })}
                    min=\${0}
                    max=\${10}
                    step=\${0.5}
                    unit="%"
                  />
                \`}
              </div>
            </\${CollapsibleSection}>
            
            <!-- Glows Section -->
            <\${CollapsibleSection} title="Background Glows" defaultOpen=\${false}>
              <\${GlowEditorInline}
                glows=\${screenshot.glows}
                onChange=\${(glows) => onUpdate({ glows })}
              />
            </\${CollapsibleSection}>
            
            <!-- Mascot Section -->
            <\${CollapsibleSection} title="Mascot" defaultOpen=\${false}>
              <\${MascotEditorInline}
                mascot=\${screenshot.mascot}
                assets=\${assets}
                config=\${config}
                onChange=\${(mascot) => onUpdate({ mascot })}
                onAssetsRefresh=\${onAssetsRefresh}
              />
            </\${CollapsibleSection}>
          </div>
        </div>
      \`;
    }
    
    // ========================================
    // Feature Graphic Editor
    // ========================================
    function FeatureGraphicEditor({ featureGraphic, assets, config, onUpdate, onUpdateConfig, onAssetsRefresh }) {
      const fg = featureGraphic || {};
      
      return html\`
        <div class="editor-sidebar bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
          <div class="p-4 space-y-3">
            <h2 class="font-bold text-lg mb-4">Feature Graphic</h2>
            
            <!-- Content Section -->
            <\${CollapsibleSection} title="Content" defaultOpen=\${true}>
              <div>
                <label class="text-xs text-zinc-500 block mb-1">Headline</label>
                <input
                  type="text"
                  value=\${fg.headline || ''}
                  onInput=\${(e) => onUpdate({ headline: e.target.value })}
                  class="w-full px-3 py-2 rounded text-sm"
                  placeholder="Your headline here..."
                />
              </div>
              <div>
                <label class="text-xs text-zinc-500 block mb-1">Subtitle</label>
                <input
                  type="text"
                  value=\${fg.subtitle || ''}
                  onInput=\${(e) => onUpdate({ subtitle: e.target.value })}
                  class="w-full px-3 py-2 rounded text-sm"
                  placeholder="A compelling subtitle..."
                />
              </div>
              <div class="flex gap-4 pt-2">
                <label class="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked=\${fg.showIcon !== false}
                    onChange=\${(e) => onUpdate({ showIcon: e.target.checked })}
                    class="rounded"
                  />
                  Show App Icon
                </label>
                <label class="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked=\${fg.showAppName !== false}
                    onChange=\${(e) => onUpdate({ showAppName: e.target.checked })}
                    class="rounded"
                  />
                  Show App Name
                </label>
              </div>
            </\${CollapsibleSection}>
            
            <!-- Phone Screenshot Section -->
            <\${CollapsibleSection} title="Phone Screenshot" defaultOpen=\${true}>
              <\${ImageSelect}
                label="Image"
                value=\${fg.imagePath || ''}
                onChange=\${(v) => onUpdate({ imagePath: v })}
                options=\${assets.screenshots}
                category="screenshots"
                onAssetsRefresh=\${onAssetsRefresh}
              />
              <div class="grid grid-cols-2 gap-3">
                <\${Slider}
                  label="Rotation"
                  value=\${fg.phoneRotation ?? 5}
                  onChange=\${(v) => onUpdate({ phoneRotation: v })}
                  min=\${-15}
                  max=\${15}
                  step=\${1}
                  unit="°"
                />
                <\${Slider}
                  label="Scale"
                  value=\${fg.phoneScale ?? 100}
                  onChange=\${(v) => onUpdate({ phoneScale: v })}
                  min=\${50}
                  max=\${150}
                  step=\${5}
                  unit="%"
                />
              </div>
            </\${CollapsibleSection}>
            
            <!-- Glows Section -->
            <\${CollapsibleSection} title="Background Glows" defaultOpen=\${false}>
              <\${GlowEditorInline}
                glows=\${fg.glows || []}
                onChange=\${(glows) => onUpdate({ glows })}
              />
            </\${CollapsibleSection}>
            
            <!-- Mascot Section -->
            <\${CollapsibleSection} title="Mascot" defaultOpen=\${false}>
              <\${MascotEditorInline}
                mascot=\${fg.mascot}
                assets=\${assets}
                config=\${config}
                onChange=\${(mascot) => onUpdate({ mascot })}
                onAssetsRefresh=\${onAssetsRefresh}
              />
            </\${CollapsibleSection}>
          </div>
        </div>
      \`;
    }
    
    // ========================================
    // ========================================
    // Glow Editor (Inline version for CollapsibleSection)
    // ========================================
    function GlowEditorInline({ glows, onChange }) {
      const addGlow = () => {
        onChange([...glows, { color: 'purple', size: 400, top: '20%', left: '20%' }]);
      };
      
      const updateGlow = (index, updates) => {
        const newGlows = [...glows];
        newGlows[index] = { ...newGlows[index], ...updates };
        onChange(newGlows);
      };
      
      const removeGlow = (index) => {
        onChange(glows.filter((_, i) => i !== index));
      };
      
      return html\`
        <div class="space-y-3">
          \${glows.map((glow, i) => html\`
            <div key=\${i} class="p-3 bg-zinc-800/50 rounded space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-xs text-zinc-400">Glow \${i + 1}</span>
                <button onClick=\${() => removeGlow(i)} class="text-zinc-500 hover:text-red-400"><i class="fa-solid fa-xmark"></i></button>
              </div>
              
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-xs text-zinc-500 block mb-1">Color</label>
                  <select
                    value=\${glow.color}
                    onChange=\${(e) => updateGlow(i, { color: e.target.value })}
                    class="w-full px-2 py-1 rounded text-sm"
                  >
                    \${Object.keys(GLOW_COLORS).map(c => html\`
                      <option value=\${c}>\${c}</option>
                    \`)}
                  </select>
                </div>
                <div>
                  <label class="text-xs text-zinc-500 block mb-1">Size</label>
                  <input
                    type="number"
                    value=\${glow.size}
                    onInput=\${(e) => updateGlow(i, { size: Number(e.target.value) })}
                    class="w-full px-2 py-1 rounded text-sm"
                  />
                </div>
              </div>
              
              <div class="grid grid-cols-4 gap-2">
                \${['top', 'right', 'bottom', 'left'].map(pos => html\`
                  <div>
                    <label class="text-xs text-zinc-500 block mb-1">\${pos}</label>
                    <input
                      type="text"
                      value=\${glow[pos] || ''}
                      onInput=\${(e) => updateGlow(i, { [pos]: e.target.value || undefined })}
                      placeholder="-"
                      class="w-full px-2 py-1 rounded text-xs"
                    />
                  </div>
                \`)}
              </div>
            </div>
          \`)}
          
          <button 
            onClick=\${addGlow} 
            class="w-full py-2 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600"
          >
            <i class="fa-solid fa-plus mr-1"></i> Add Glow Effect
          </button>
        </div>
      \`;
    }
    
    // ========================================
    // Mascot Editor (Inline version for CollapsibleSection)
    // ========================================
    function MascotEditorInline({ mascot, assets, config, onChange, onAssetsRefresh }) {
      const enabled = mascot !== null && mascot !== undefined;
      
      const toggleMascot = () => {
        if (enabled) {
          onChange(null);
        } else {
          onChange({
            position: 'bottom-right',
            imagePath: config.app.defaultMascotPath || '',
            size: 15,
            offset: 20,
            borderRadius: 0,
          });
        }
      };
      
      const updateMascot = (updates) => {
        onChange({ ...mascot, ...updates });
      };
      
      return html\`
        <div class="space-y-3">
          <div class="flex justify-end">
            <button 
              onClick=\${toggleMascot}
              class=\${"text-xs px-3 py-1.5 rounded " + (enabled ? "bg-indigo-600" : "bg-zinc-800 hover:bg-zinc-700")}
            >
              \${enabled ? 'Enabled' : 'Add Mascot'}
            </button>
          </div>
          
          \${enabled && html\`
            <div class="space-y-3">
              <\${ImageSelect}
                label="Image"
                value=\${mascot.imagePath || config.app.defaultMascotPath || ''}
                onChange=\${(v) => updateMascot({ imagePath: v })}
                options=\${[...assets.mascots, ...assets.screenshots]}
                category="mascots"
                onAssetsRefresh=\${onAssetsRefresh}
                placeholder="Default"
              />
              
              <div>
                <label class="text-xs text-zinc-500 block mb-1">Position</label>
                <div class="grid grid-cols-2 gap-2">
                  \${[
                    { value: 'top-left', label: '↖ Top Left' },
                    { value: 'top-right', label: '↗ Top Right' },
                    { value: 'bottom-left', label: '↙ Bottom Left' },
                    { value: 'bottom-right', label: '↘ Bottom Right' },
                  ].map(pos => html\`
                    <button
                      onClick=\${() => updateMascot({ position: pos.value })}
                      class=\${"px-2 py-1.5 rounded text-xs " + 
                        ((mascot.position || 'bottom-right') === pos.value ? "bg-indigo-600" : "bg-zinc-800 hover:bg-zinc-700")}
                    >
                      \${pos.label}
                    </button>
                  \`)}
                </div>
              </div>
              
              <div class="grid grid-cols-3 gap-3">
                <\${Slider}
                  label="Size"
                  value=\${mascot.size ?? 15}
                  onChange=\${(v) => updateMascot({ size: v })}
                  min=\${5}
                  max=\${30}
                  step=\${1}
                  unit="%"
                />
                <\${Slider}
                  label="Offset"
                  value=\${mascot.offset ?? 20}
                  onChange=\${(v) => updateMascot({ offset: v })}
                  min=\${0}
                  max=\${100}
                  step=\${5}
                  unit="px"
                />
                <\${Slider}
                  label="Radius"
                  value=\${mascot.borderRadius ?? 0}
                  onChange=\${(v) => updateMascot({ borderRadius: v })}
                  min=\${0}
                  max=\${50}
                  step=\${5}
                  unit="%"
                />
              </div>
            </div>
          \`}
        </div>
      \`;
    }
    
    // Glow Editor
    // ========================================
    function GlowEditor({ glows, onChange }) {
      const addGlow = () => {
        onChange([...glows, { color: 'purple', size: 400, top: '20%', left: '20%' }]);
      };
      
      const updateGlow = (index, updates) => {
        const newGlows = [...glows];
        newGlows[index] = { ...newGlows[index], ...updates };
        onChange(newGlows);
      };
      
      const removeGlow = (index) => {
        onChange(glows.filter((_, i) => i !== index));
      };
      
      return html\`
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-medium text-zinc-400">Glows</h3>
            <button onClick=\${addGlow} class="text-xs px-2 py-1 bg-zinc-800 rounded hover:bg-zinc-700">
              <i class="fa-solid fa-plus mr-1"></i> Add
            </button>
          </div>
          
          \${glows.map((glow, i) => html\`
            <div key=\${i} class="p-3 bg-zinc-800/50 rounded space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-xs text-zinc-400">Glow \${i + 1}</span>
                <button onClick=\${() => removeGlow(i)} class="text-zinc-500 hover:text-red-400"><i class="fa-solid fa-xmark"></i></button>
              </div>
              
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-xs text-zinc-500 block mb-1">Color</label>
                  <select
                    value=\${glow.color}
                    onChange=\${(e) => updateGlow(i, { color: e.target.value })}
                    class="w-full px-2 py-1 rounded text-sm"
                  >
                    \${Object.keys(GLOW_COLORS).map(c => html\`
                      <option value=\${c}>\${c}</option>
                    \`)}
                  </select>
                </div>
                <div>
                  <label class="text-xs text-zinc-500 block mb-1">Size</label>
                  <input
                    type="number"
                    value=\${glow.size}
                    onInput=\${(e) => updateGlow(i, { size: Number(e.target.value) })}
                    class="w-full px-2 py-1 rounded text-sm"
                  />
                </div>
              </div>
              
              <div class="grid grid-cols-4 gap-2">
                \${['top', 'right', 'bottom', 'left'].map(pos => html\`
                  <div>
                    <label class="text-xs text-zinc-500 block mb-1">\${pos}</label>
                    <input
                      type="text"
                      value=\${glow[pos] || ''}
                      onInput=\${(e) => updateGlow(i, { [pos]: e.target.value || undefined })}
                      placeholder="-"
                      class="w-full px-2 py-1 rounded text-xs"
                    />
                  </div>
                \`)}
              </div>
            </div>
          \`)}
        </div>
      \`;
    }
    
    // ========================================
    // Mascot Editor
    // ========================================
    function MascotEditor({ mascot, assets, config, onChange }) {
      const enabled = mascot !== null && mascot !== undefined;
      
      const toggleMascot = () => {
        if (enabled) {
          onChange(null);
        } else {
          onChange({
            position: 'bottom-right',
            imagePath: config.app.defaultMascotPath || '',
            size: 15,
            offset: 3,
          });
        }
      };
      
      const updateMascot = (updates) => {
        onChange({ ...mascot, ...updates });
      };
      
      return html\`
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-medium text-zinc-400">Mascot</h3>
            <button 
              onClick=\${toggleMascot}
              class=\${"text-xs px-2 py-1 rounded " + (enabled ? "bg-indigo-600" : "bg-zinc-800 hover:bg-zinc-700")}
            >
              \${enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          
          \${enabled && html\`
            <div class="space-y-3">
              <div>
                <label class="text-xs text-zinc-500 block mb-1">Image</label>
                <select
                  value=\${mascot.imagePath || config.app.defaultMascotPath || ''}
                  onChange=\${(e) => updateMascot({ imagePath: e.target.value })}
                  class="w-full px-3 py-2 rounded text-sm"
                >
                  <option value="">Default</option>
                  \${assets.mascots.map(p => html\`<option value=\${p}>\${p.split('/').pop()}</option>\`)}
                  \${assets.screenshots.map(p => html\`<option value=\${p}>\${p.split('/').pop()}</option>\`)}
                </select>
              </div>
              
              <div>
                <label class="text-xs text-zinc-500 block mb-1">Position</label>
                <select
                  value=\${mascot.position || 'bottom-right'}
                  onChange=\${(e) => updateMascot({ position: e.target.value })}
                  class="w-full px-3 py-2 rounded text-sm"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>
              
              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="text-xs text-zinc-500 block mb-1">Size (%)</label>
                  <input
                    type="number"
                    value=\${mascot.size ?? 15}
                    onInput=\${(e) => updateMascot({ size: Number(e.target.value) })}
                    class="w-full px-3 py-2 rounded text-sm"
                  />
                </div>
                <div>
                  <label class="text-xs text-zinc-500 block mb-1">Offset (px)</label>
                  <input
                    type="number"
                    value=\${mascot.offset ?? 3}
                    onInput=\${(e) => updateMascot({ offset: Number(e.target.value) })}
                    class="w-full px-3 py-2 rounded text-sm"
                  />
                </div>
                <div>
                  <label class="text-xs text-zinc-500 block mb-1">Radius (%)</label>
                  <input
                    type="number"
                    value=\${mascot.borderRadius ?? 0}
                    onInput=\${(e) => updateMascot({ borderRadius: Number(e.target.value) })}
                    class="w-full px-3 py-2 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          \`}
        </div>
      \`;
    }
    
    // ========================================
    // Generate Modal with Progress
    // ========================================
    function GenerateModal({ progress, generating, onClose, onOpenFolder }) {
      const successCount = progress.results?.filter(r => r.status === 'success').length || 0;
      const errorCount = progress.results?.filter(r => r.status === 'error').length || 0;
      const isComplete = progress.results !== null;
      const percentComplete = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;
      
      // Group results by platform and type
      const groupedResults = useMemo(() => {
        if (!progress.results) return { android: { feature: null, screenshots: [] }, ios: { feature: null, screenshots: [] } };
        
        const grouped = {
          android: { feature: null, screenshots: [] },
          ios: { feature: null, screenshots: [] }
        };
        
        progress.results.filter(r => r.status === 'success').forEach(r => {
          const parts = r.relativePath.split('/');
          const platform = parts[1]; // lang/platform/filename
          const filename = parts[parts.length - 1];
          
          if (platform === 'android' || platform === 'ios') {
            if (filename.includes('feature-graphic')) {
              grouped[platform].feature = r;
            } else {
              grouped[platform].screenshots.push(r);
            }
          }
        });
        
        return grouped;
      }, [progress.results]);
      
      const renderPlatformSection = (platform, label) => {
        const data = groupedResults[platform];
        if (!data.feature && data.screenshots.length === 0) return null;
        
        return html\`
          <div class="mb-4">
            <div class="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
              <i class=\${"fa-brands " + (platform === 'android' ? 'fa-android' : 'fa-apple')}></i>
              \${label}
            </div>
            
            \${data.feature && html\`
              <div class="mb-3">
                <div class="bg-zinc-800 rounded overflow-hidden">
                  <img 
                    src=\${"/output/" + data.feature.relativePath + "?t=" + Date.now()}
                    class="w-full aspect-[1024/500] object-contain bg-zinc-700"
                    loading="lazy"
                  />
                  <div class="p-2 text-xs text-zinc-400 truncate" title=\${data.feature.relativePath}>Feature Graphic</div>
                </div>
              </div>
            \`}
            
            \${data.screenshots.length > 0 && html\`
              <div class="grid grid-cols-4 gap-2">
                \${data.screenshots.map(r => html\`
                  <div key=\${r.relativePath} class="bg-zinc-800 rounded overflow-hidden">
                    <img 
                      src=\${"/output/" + r.relativePath + "?t=" + Date.now()}
                      class="w-full aspect-[1242/2688] object-contain bg-zinc-700"
                      loading="lazy"
                    />
                    <div class="p-1.5 text-xs text-zinc-400 truncate" title=\${r.relativePath}>\${r.relativePath.split('/').pop()}</div>
                  </div>
                \`)}
              </div>
            \`}
          </div>
        \`;
      };
      
      return html\`
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div class="bg-zinc-900 rounded-lg p-6 w-[700px] max-h-[85vh] overflow-hidden flex flex-col" onClick=\${(e) => e.stopPropagation()}>
            <div class="flex justify-between items-center mb-4">
              <h2 class="font-bold text-lg">\${isComplete ? 'Generation Complete' : 'Generating Screenshots...'}</h2>
              \${isComplete && html\`
                <button onClick=\${onClose} class="text-zinc-500 hover:text-white text-xl"><i class="fa-solid fa-xmark"></i></button>
              \`}
            </div>
            
            \${!isComplete ? html\`
              <!-- Progress View -->
              <div class="space-y-4">
                <div class="bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div 
                    class="bg-indigo-500 h-full transition-all duration-300"
                    style=\${"width: " + percentComplete + "%"}
                  ></div>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-zinc-400 truncate max-w-[400px]">\${progress.item}</span>
                  <span class="text-zinc-500">\${progress.current} / \${progress.total}</span>
                </div>
              </div>
            \` : html\`
              <!-- Results View -->
              <div class="flex-1 overflow-hidden flex flex-col min-h-0">
                <!-- Summary -->
                <div class="flex gap-4 mb-4">
                  <div class="flex-1 bg-green-900/30 border border-green-800 rounded p-3 text-center">
                    <div class="text-2xl font-bold text-green-400">\${successCount}</div>
                    <div class="text-xs text-green-500">Successful</div>
                  </div>
                  \${errorCount > 0 && html\`
                    <div class="flex-1 bg-red-900/30 border border-red-800 rounded p-3 text-center">
                      <div class="text-2xl font-bold text-red-400">\${errorCount}</div>
                      <div class="text-xs text-red-500">Failed</div>
                    </div>
                  \`}
                </div>
                
                <!-- Image Previews by Platform -->
                <div class="flex-1 overflow-y-auto min-h-0 pr-2">
                  \${renderPlatformSection('android', 'Android')}
                  \${renderPlatformSection('ios', 'iOS')}
                </div>
                
                <!-- Actions -->
                <div class="flex gap-3 mt-4 pt-4 border-t border-zinc-800">
                  <button
                    onClick=\${onOpenFolder}
                    class="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm flex items-center justify-center gap-2"
                  >
                    <i class="fa-solid fa-folder-open"></i> Open in Explorer
                  </button>
                  <button
                    onClick=\${onClose}
                    class="flex-1 px-4 py-2 btn-primary rounded text-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            \`}
          </div>
        </div>
      \`;
    }
    
    // ========================================
    // Project Modal
    // ========================================
    function ProjectModal({ projects, currentProject, onClose, onCreate, onSwitch }) {
      const [newName, setNewName] = useState('');
      
      return html\`
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick=\${onClose}>
          <div class="bg-zinc-900 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto" onClick=\${(e) => e.stopPropagation()}>
            <div class="flex justify-between items-center mb-4">
              <h2 class="font-bold text-lg">Projects</h2>
              <button onClick=\${onClose} class="text-zinc-500 hover:text-white text-xl"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <!-- Create new -->
            <div class="mb-4 p-3 bg-zinc-800/50 rounded">
              <div class="text-sm text-zinc-400 mb-2">Create New Project</div>
              <div class="flex gap-2">
                <input
                  type="text"
                  value=\${newName}
                  onInput=\${(e) => setNewName(e.target.value)}
                  placeholder="Project name"
                  class="flex-1 px-3 py-2 rounded text-sm"
                />
                <button
                  onClick=\${() => { if (newName) onCreate(newName); }}
                  class="px-4 py-2 btn-primary rounded text-sm"
                >
                  Create
                </button>
              </div>
            </div>
            
            <!-- Project list -->
            <div class="space-y-2">
              \${projects.map(p => html\`
                <div 
                  key=\${p.id}
                  onClick=\${() => { onSwitch(p.id); onClose(); }}
                  class=\${"p-3 rounded cursor-pointer border " + 
                    (currentProject === p.id 
                      ? "bg-indigo-900/50 border-indigo-500" 
                      : "bg-zinc-800/50 border-transparent hover:bg-zinc-800")}
                >
                  <div class="font-medium">\${p.name}</div>
                  <div class="text-xs text-zinc-500">\${p.id}</div>
                </div>
              \`)}
            </div>
          </div>
        </div>
      \`;
    }
    
    // Mount app
    render(html\`<\${App} />\`, document.getElementById('app'));
  </script>
</body>
</html>`;
}

// Start server
const port = 3000;
console.log(`\n🎨 App Store Screenshots Server`);
console.log(`   http://localhost:${port}\n`);

Deno.serve({ port }, app.fetch);
