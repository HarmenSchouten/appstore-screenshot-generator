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
  renameProject,
  duplicateProject,
  getProjectAssetsDir,
  getProjectOutputDir,
  getProjectDir,
  type ProjectConfig,
  type ProjectInfo,
  type ColorPalette,
  GRADIENT_TEMPLATES,
  DEFAULT_PALETTES,
  applyPaletteToGradient,
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
 * Rename a project
 */
app.patch('/api/projects/:id', async (c) => {
  const { id } = c.req.param();
  const { name } = await c.req.json();
  const project = await renameProject(id, name);
  
  // If renamed current project, reload config
  if (id === currentProjectId) {
    currentConfig = null;
  }
  
  return c.json(project);
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

/**
 * Rename asset
 */
app.patch('/api/assets/rename', async (c) => {
  const { oldPath, newName } = await c.req.json();
  
  if (!oldPath || !newName) {
    return c.json({ error: 'oldPath and newName required' }, 400);
  }
  
  const assetsDir = getProjectAssetsDir(currentProjectId);
  // oldPath is like "assets/screenshots/file.png"
  const relativePath = oldPath.replace(/^assets\//, '');
  const oldFilePath = join(assetsDir, relativePath);
  
  // Keep same directory, just change filename
  const dir = relativePath.substring(0, relativePath.lastIndexOf('/'));
  const ext = relativePath.substring(relativePath.lastIndexOf('.'));
  const newFileName = newName.includes('.') ? newName : newName + ext;
  const newFilePath = join(assetsDir, dir, newFileName);
  const newAssetPath = `assets/${dir}/${newFileName}`;
  
  try {
    await Deno.rename(oldFilePath, newFilePath);
    return c.json({ success: true, newPath: newAssetPath });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Rename failed' }, 500);
  }
});

/**
 * Delete asset
 */
app.delete('/api/assets', async (c) => {
  const { path: assetPath } = await c.req.json();
  
  if (!assetPath) {
    return c.json({ error: 'path required' }, 400);
  }
  
  const assetsDir = getProjectAssetsDir(currentProjectId);
  // assetPath is like "assets/screenshots/file.png"
  const relativePath = assetPath.replace(/^assets\//, '');
  const filePath = join(assetsDir, relativePath);
  
  try {
    await Deno.remove(filePath);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Delete failed' }, 500);
  }
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

/**
 * Get previously generated images
 */
app.get('/api/generated', async (c) => {
  const outputDir = getProjectOutputDir(currentProjectId);
  const results: { relativePath: string; status: string }[] = [];
  
  async function scanDir(dir: string, prefix: string = '') {
    try {
      for await (const entry of Deno.readDir(dir)) {
        const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory) {
          await scanDir(join(dir, entry.name), relativePath);
        } else if (entry.isFile && (entry.name.endsWith('.png') || entry.name.endsWith('.jpg'))) {
          results.push({ relativePath, status: 'success' });
        }
      }
    } catch {
      // Directory doesn't exist or can't be read
    }
  }
  
  await scanDir(outputDir);
  return c.json({ results, outputDir });
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
    
    /* Scrollbar styling - subtle and thin */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
    * { scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.1) transparent; }
    
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
    
    // Color palette system
    window.GRADIENT_TEMPLATES = ${JSON.stringify(GRADIENT_TEMPLATES)};
    window.DEFAULT_PALETTES = ${JSON.stringify(DEFAULT_PALETTES)};
    window.applyPaletteToGradient = (template, palette) => {
      return template
        .replace(/\\{primary\\}/g, palette.primary)
        .replace(/\\{secondary\\}/g, palette.secondary)
        .replace(/\\{accent\\}/g, palette.accent);
    };
    
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
      const [showMediaManager, setShowMediaManager] = useState(false);
      const [showThemeEditor, setShowThemeEditor] = useState(false);
      const [generateProgress, setGenerateProgress] = useState({ current: 0, total: 0, item: '', results: null, outputDir: '' });
      const [previewVersion, setPreviewVersion] = useState(0); // Increment to force preview refresh
      const [confirmDeleteScreenshot, setConfirmDeleteScreenshot] = useState(null); // screenshot id to confirm delete
      const [lastGenerated, setLastGenerated] = useState(null); // Previously generated images
      
      // Fetch previously generated images
      const fetchLastGenerated = async () => {
        try {
          const res = await fetch('/api/generated');
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            setLastGenerated(data);
          } else {
            setLastGenerated(null);
          }
        } catch {
          setLastGenerated(null);
        }
      };
      
      // Load last generated on mount
      useEffect(() => {
        fetchLastGenerated();
      }, [currentProject]);
      
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
      
      // Delete project
      const deleteProjectHandler = async (projectId) => {
        const res = await fetch(\`/api/projects/\${projectId}\`, { method: 'DELETE' });
        if (res.ok) {
          // Remove from list
          setProjects(projects.filter(p => p.id !== projectId));
          // If deleted the current project, switch to default
          if (currentProject === projectId) {
            await switchProject('default');
          }
        }
      };
      
      // Rename project
      const renameProjectHandler = async (projectId, newName) => {
        const res = await fetch(\`/api/projects/\${projectId}\`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName }),
        });
        if (res.ok) {
          const updated = await res.json();
          setProjects(projects.map(p => p.id === projectId ? updated : p));
          // If renamed current project, reload config
          if (currentProject === projectId) {
            const configRes = await fetch('/api/config');
            setConfig(await configRes.json());
          }
        }
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
        fetchLastGenerated(); // Refresh last generated list
      };
      
      // View previously generated images
      const viewLastGenerated = () => {
        if (lastGenerated) {
          setGenerateProgress({
            current: lastGenerated.results.length,
            total: lastGenerated.results.length,
            item: '',
            results: lastGenerated.results,
            outputDir: lastGenerated.outputDir
          });
          setShowGenerateModal(true);
        }
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
                  class=\${"p-3 rounded border " + 
                    (selectedItem?.id === s.id 
                      ? "bg-indigo-900/50 border-indigo-500" 
                      : "bg-zinc-800/50 border-transparent hover:bg-zinc-800")}
                >
                  \${confirmDeleteScreenshot === s.id ? html\`
                    <!-- Delete confirmation -->
                    <div class="text-center">
                      <p class="text-sm text-red-400 mb-2">Delete this screenshot?</p>
                      <div class="flex gap-2 justify-center">
                        <button 
                          onClick=\${() => { deleteScreenshot(s.id); setConfirmDeleteScreenshot(null); }}
                          class="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
                        >Delete</button>
                        <button 
                          onClick=\${() => setConfirmDeleteScreenshot(null)}
                          class="px-3 py-1 bg-zinc-600 hover:bg-zinc-500 rounded text-sm"
                        >Cancel</button>
                      </div>
                    </div>
                  \` : html\`
                    <!-- Normal view -->
                    <div 
                      onClick=\${() => setSelectedItem({ type: 'screenshot', id: s.id })}
                      class="flex justify-between items-start gap-2 cursor-pointer"
                    >
                      <div class="min-w-0 flex-1">
                        <div class="text-xs text-zinc-500 mb-1">#\${i + 1}</div>
                        <div class="font-medium text-sm truncate">\${s.headline}</div>
                        <div class="text-xs text-zinc-400 truncate">\${s.subtitle}</div>
                      </div>
                      <button 
                        onClick=\${(e) => { e.stopPropagation(); setConfirmDeleteScreenshot(s.id); }}
                        class="text-zinc-500 hover:text-red-400 text-lg flex-shrink-0"
                      ><i class="fa-solid fa-xmark"></i></button>
                    </div>
                  \`}
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
            
            <!-- Theme & Colors -->
            <div class="p-3 border-t border-zinc-800">
              <button 
                onClick=\${() => setShowThemeEditor(true)}
                class="w-full p-3 rounded bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-left group"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <i class="fa-solid fa-palette text-purple-400"></i>
                    <div>
                      <div class="text-sm font-medium">Theme & Colors</div>
                      <div class="text-xs text-zinc-500">Palette, gradients, fonts</div>
                    </div>
                  </div>
                  <i class="fa-solid fa-chevron-right text-zinc-600 group-hover:text-zinc-400 text-xs"></i>
                </div>
              </button>
            </div>
            
            <!-- Media Library -->
            <div class="p-3 border-t border-zinc-800">
              <button 
                onClick=\${() => setShowMediaManager(true)}
                class="w-full p-3 rounded bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-left group"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <i class="fa-solid fa-images text-indigo-400"></i>
                    <div>
                      <div class="text-sm font-medium">Media Library</div>
                      <div class="text-xs text-zinc-500">\${assets.screenshots.length + assets.mascots.length + assets.icons.length} files</div>
                    </div>
                  </div>
                  <i class="fa-solid fa-chevron-right text-zinc-600 group-hover:text-zinc-400 text-xs"></i>
                </div>
              </button>
            </div>
            
            <!-- Generate button -->
            <div class="p-3 border-t border-zinc-800 space-y-2">
              <button 
                onClick=\${generateAll}
                disabled=\${generating}
                class="w-full py-2 btn-primary rounded font-medium disabled:opacity-50"
              >
                \${generating ? html\`<i class="fa-solid fa-spinner fa-spin mr-1"></i> Generating...\` : html\`<i class="fa-solid fa-wand-magic-sparkles mr-1"></i> Generate All\`}
              </button>
              \${lastGenerated && html\`
                <button 
                  onClick=\${viewLastGenerated}
                  class="w-full py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm font-medium flex items-center justify-center gap-2"
                >
                  <i class="fa-solid fa-images"></i>
                  View Last Results (\${lastGenerated.results.length})
                </button>
              \`}
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
              onDelete=\${deleteProjectHandler}
              onRename=\${renameProjectHandler}
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
          
          <!-- Media Manager Modal -->
          \${showMediaManager && html\`
            <\${MediaManager}
              assets=\${assets}
              onClose=\${() => setShowMediaManager(false)}
              onRefresh=\${refreshAssets}
            />
          \`}
          
          <!-- Theme Editor Modal -->
          \${showThemeEditor && html\`
            <\${ThemeEditor}
              config=\${config}
              onClose=\${() => setShowThemeEditor(false)}
              onSave=\${(newConfig) => {
                saveConfig(newConfig);
                setShowThemeEditor(false);
              }}
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
    // Color Input Component
    // ========================================
    function ColorInput({ label, value, onChange, placeholder = 'rgba(255,255,255,0.15)' }) {
      return html\`
        <div>
          <label class="text-xs text-zinc-500 block mb-1">\${label}</label>
          <div class="flex gap-2">
            <div
              class="w-9 h-9 rounded border border-zinc-700 flex-shrink-0"
              style="background: \${value || placeholder}"
            />
            <input
              type="text"
              value=\${value || ''}
              onInput=\${(e) => onChange(e.target.value)}
              class="flex-1 px-3 py-2 rounded text-sm font-mono"
              placeholder=\${placeholder}
            />
          </div>
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
                palette=\${config.palette}
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
              \${fg.showIcon !== false ? html\`
                <\${ImageSelect}
                  label="App Icon"
                  value=\${config.app?.iconPath || ''}
                  onChange=\${(v) => onUpdateConfig({ ...config, app: { ...config.app, iconPath: v } })}
                  options=\${assets.icons}
                  category="icons"
                  onAssetsRefresh=\${onAssetsRefresh}
                />
                <div class="text-xs text-zinc-400 mt-3 mb-1">Icon Box</div>
                <div class="grid grid-cols-2 gap-3">
                  <\${Slider}
                    label="Size"
                    value=\${fg.iconBoxScale ?? 100}
                    onChange=\${(v) => onUpdate({ iconBoxScale: v })}
                    min=\${50}
                    max=\${200}
                    step=\${5}
                    unit="%"
                  />
                  <\${Slider}
                    label="Radius"
                    value=\${fg.iconBoxRadius ?? 16}
                    onChange=\${(v) => onUpdate({ iconBoxRadius: v })}
                    min=\${0}
                    max=\${50}
                    step=\${1}
                    unit="px"
                  />
                </div>
                <\${ColorInput}
                  label="Background"
                  value=\${fg.iconBoxColor || 'rgba(255,255,255,0.15)'}
                  onChange=\${(v) => onUpdate({ iconBoxColor: v })}
                  placeholder="rgba(255,255,255,0.15)"
                />
                <div class="text-xs text-zinc-400 mt-3 mb-1">Icon Image</div>
                <div class="grid grid-cols-2 gap-3">
                  <\${Slider}
                    label="Scale"
                    value=\${fg.iconScale ?? 100}
                    onChange=\${(v) => onUpdate({ iconScale: v })}
                    min=\${50}
                    max=\${150}
                    step=\${5}
                    unit="%"
                  />
                  <\${Slider}
                    label="Radius"
                    value=\${fg.iconRadius ?? 0}
                    onChange=\${(v) => onUpdate({ iconRadius: v })}
                    min=\${0}
                    max=\${50}
                    step=\${1}
                    unit="px"
                  />
                  <\${Slider}
                    label="Offset X"
                    value=\${fg.iconOffsetX ?? 0}
                    onChange=\${(v) => onUpdate({ iconOffsetX: v })}
                    min=\${-20}
                    max=\${20}
                    step=\${1}
                    unit="px"
                  />
                  <\${Slider}
                    label="Offset Y"
                    value=\${fg.iconOffsetY ?? 0}
                    onChange=\${(v) => onUpdate({ iconOffsetY: v })}
                    min=\${-20}
                    max=\${20}
                    step=\${1}
                    unit="px"
                  />
                </div>
              \` : ''}
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
                palette=\${config.palette}
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
    function GlowEditorInline({ glows, onChange, palette }) {
      const defaultPalette = { primary: '#a855f7', secondary: '#6366f1', accent: '#ec4899' };
      const p = palette || defaultPalette;
      
      const addGlow = () => {
        // Use palette primary color as default
        onChange([...glows, { color: p.primary, size: 400, top: '20%', left: '20%' }]);
      };
      
      const updateGlow = (index, updates) => {
        const newGlows = [...glows];
        newGlows[index] = { ...newGlows[index], ...updates };
        onChange(newGlows);
      };
      
      const removeGlow = (index) => {
        onChange(glows.filter((_, i) => i !== index));
      };
      
      // Get current color value (for color picker)
      const getColorValue = (color) => {
        if (color.startsWith('#')) return color;
        return GLOW_COLORS[color] || '#a855f7';
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
                  <div class="flex gap-1">
                    <input
                      type="color"
                      value=\${getColorValue(glow.color)}
                      onInput=\${(e) => updateGlow(i, { color: e.target.value })}
                      class="w-10 h-8 rounded cursor-pointer flex-shrink-0"
                    />
                    <select
                      value=\${glow.color.startsWith('#') ? '_custom' : glow.color}
                      onChange=\${(e) => {
                        if (e.target.value !== '_custom') {
                          updateGlow(i, { color: e.target.value });
                        }
                      }}
                      class="flex-1 px-1 py-1 rounded text-xs"
                    >
                      <option value="_custom" disabled>Custom</option>
                      <optgroup label="Palette">
                        <option value=\${p.primary}>Primary</option>
                        <option value=\${p.secondary}>Secondary</option>
                        <option value=\${p.accent}>Accent</option>
                      </optgroup>
                      <optgroup label="Presets">
                        \${Object.keys(GLOW_COLORS).map(c => html\`
                          <option value=\${c}>\${c}</option>
                        \`)}
                      </optgroup>
                    </select>
                  </div>
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
                    { value: 'top-left', rotation: '-45', label: 'Top Left' },
                    { value: 'top-right', rotation: '45', label: 'Top Right' },
                    { value: 'bottom-left', rotation: '-135', label: 'Bottom Left' },
                    { value: 'bottom-right', rotation: '135', label: 'Bottom Right' },
                  ].map(pos => html\`
                    <button
                      onClick=\${() => updateMascot({ position: pos.value })}
                      class=\${"px-2 py-1.5 rounded text-xs flex items-center gap-1.5 " + 
                        ((mascot.position || 'bottom-right') === pos.value ? "bg-indigo-600" : "bg-zinc-800 hover:bg-zinc-700")}
                    >
                      <i class="fa-solid fa-arrow-up" style=\${"transform: rotate(" + pos.rotation + "deg)"}></i> \${pos.label}
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
    // Theme Editor Modal
    // ========================================
    function ThemeEditor({ config, onClose, onSave }) {
      const defaultPalette = { primary: '#a855f7', secondary: '#6366f1', accent: '#ec4899' };
      const currentPalette = config.palette || defaultPalette;
      const currentGradient = config.theme?.background?.gradient || '';
      
      // Detect which gradient template matches the current gradient
      const detectSelectedGradient = () => {
        for (const t of window.GRADIENT_TEMPLATES) {
          const css = window.applyPaletteToGradient(t.template, currentPalette);
          if (css === currentGradient) {
            return t.id;
          }
        }
        return 'custom'; // No match found, it's a custom gradient
      };
      
      const [palette, setPalette] = useState(currentPalette);
      const [selectedGradient, setSelectedGradient] = useState(detectSelectedGradient);
      const [customGradient, setCustomGradient] = useState(currentGradient);
      const [fontFamily, setFontFamily] = useState(config.theme?.fontFamily || 'Inter, sans-serif');
      const [googleFontsUrl, setGoogleFontsUrl] = useState(config.theme?.googleFontsUrl || '');
      
      // Generate gradients from palette
      const gradients = window.GRADIENT_TEMPLATES.map(t => ({
        id: t.id,
        name: t.name,
        css: window.applyPaletteToGradient(t.template, palette),
      }));
      
      const updatePalette = (updates) => {
        setPalette(p => ({ ...p, ...updates }));
      };
      
      const handleSave = () => {
        const gradient = selectedGradient === 'custom' 
          ? customGradient 
          : gradients.find(g => g.id === selectedGradient)?.css || customGradient;
        
        onSave({
          ...config,
          palette,
          theme: {
            ...config.theme,
            background: { gradient },
            fontFamily,
            googleFontsUrl: googleFontsUrl || undefined,
          },
        });
      };
      
      const applyPreset = (presetPalette) => {
        setPalette(presetPalette);
      };
      
      return html\`
        <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick=\${(e) => e.target === e.currentTarget && onClose()}>
          <div class="bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 class="font-bold text-lg"><i class="fa-solid fa-palette mr-2"></i>Theme & Colors</h2>
              <button onClick=\${onClose} class="text-zinc-500 hover:text-white text-xl"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 space-y-6">
              <!-- Color Palette Section -->
              <div>
                <h3 class="text-sm font-medium mb-3">Color Palette</h3>
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label class="text-xs text-zinc-500 block mb-1">Primary</label>
                    <div class="flex gap-2">
                      <input
                        type="color"
                        value=\${palette.primary}
                        onInput=\${(e) => updatePalette({ primary: e.target.value })}
                        class="w-12 h-9 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value=\${palette.primary}
                        onInput=\${(e) => updatePalette({ primary: e.target.value })}
                        class="flex-1 px-2 py-1 rounded text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="text-xs text-zinc-500 block mb-1">Secondary</label>
                    <div class="flex gap-2">
                      <input
                        type="color"
                        value=\${palette.secondary}
                        onInput=\${(e) => updatePalette({ secondary: e.target.value })}
                        class="w-12 h-9 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value=\${palette.secondary}
                        onInput=\${(e) => updatePalette({ secondary: e.target.value })}
                        class="flex-1 px-2 py-1 rounded text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="text-xs text-zinc-500 block mb-1">Accent</label>
                    <div class="flex gap-2">
                      <input
                        type="color"
                        value=\${palette.accent}
                        onInput=\${(e) => updatePalette({ accent: e.target.value })}
                        class="w-12 h-9 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value=\${palette.accent}
                        onInput=\${(e) => updatePalette({ accent: e.target.value })}
                        class="flex-1 px-2 py-1 rounded text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
                
                <!-- Preset Palettes -->
                <div class="mt-4">
                  <label class="text-xs text-zinc-500 block mb-2">Preset Palettes</label>
                  <div class="flex flex-wrap gap-2">
                    \${window.DEFAULT_PALETTES.map(preset => html\`
                      <button
                        onClick=\${() => applyPreset(preset.palette)}
                        class="flex items-center gap-2 px-3 py-1.5 rounded text-xs bg-zinc-800 hover:bg-zinc-700"
                        title=\${preset.name}
                      >
                        <div class="flex">
                          <div class="w-3 h-3 rounded-l" style="background: \${preset.palette.primary}"></div>
                          <div class="w-3 h-3" style="background: \${preset.palette.secondary}"></div>
                          <div class="w-3 h-3 rounded-r" style="background: \${preset.palette.accent}"></div>
                        </div>
                        \${preset.name}
                      </button>
                    \`)}
                  </div>
                </div>
              </div>
              
              <!-- Background Gradient Section -->
              <div>
                <h3 class="text-sm font-medium mb-3">Background Gradient</h3>
                <div class="grid grid-cols-4 gap-2 mb-3">
                  \${gradients.map(g => html\`
                    <button
                      onClick=\${() => setSelectedGradient(g.id)}
                      class=\${"p-1 rounded border-2 " + (selectedGradient === g.id ? "border-indigo-500" : "border-transparent hover:border-zinc-600")}
                    >
                      <div
                        class="h-12 rounded"
                        style="background: \${g.css}"
                      />
                      <div class="text-xs text-zinc-400 mt-1 truncate">\${g.name}</div>
                    </button>
                  \`)}
                  <button
                    onClick=\${() => setSelectedGradient('custom')}
                    class=\${"p-1 rounded border-2 " + (selectedGradient === 'custom' ? "border-indigo-500" : "border-transparent hover:border-zinc-600")}
                  >
                    <div class="h-12 rounded bg-zinc-800 flex items-center justify-center">
                      <i class="fa-solid fa-code text-zinc-500"></i>
                    </div>
                    <div class="text-xs text-zinc-400 mt-1">Custom</div>
                  </button>
                </div>
                
                \${selectedGradient === 'custom' && html\`
                  <div>
                    <label class="text-xs text-zinc-500 block mb-1">Custom CSS Gradient</label>
                    <input
                      type="text"
                      value=\${customGradient}
                      onInput=\${(e) => setCustomGradient(e.target.value)}
                      class="w-full px-3 py-2 rounded text-sm font-mono"
                      placeholder="linear-gradient(135deg, #a855f7 0%, #0a0a0a 100%)"
                    />
                    <div class="mt-2 h-16 rounded" style="background: \${customGradient}"></div>
                  </div>
                \`}
                
                <!-- Preview current selection -->
                <div class="mt-3">
                  <label class="text-xs text-zinc-500 block mb-1">Preview</label>
                  <div
                    class="h-20 rounded"
                    style="background: \${selectedGradient === 'custom' ? customGradient : (gradients.find(g => g.id === selectedGradient)?.css || '')}"
                  ></div>
                </div>
              </div>
              
              <!-- Typography Section -->
              <div>
                <h3 class="text-sm font-medium mb-3">Typography</h3>
                <div class="space-y-3">
                  <div>
                    <label class="text-xs text-zinc-500 block mb-1">Font Family</label>
                    <input
                      type="text"
                      value=\${fontFamily}
                      onInput=\${(e) => setFontFamily(e.target.value)}
                      class="w-full px-3 py-2 rounded text-sm"
                      placeholder="Inter, sans-serif"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-zinc-500 block mb-1">Google Fonts URL (optional)</label>
                    <input
                      type="text"
                      value=\${googleFontsUrl}
                      onInput=\${(e) => setGoogleFontsUrl(e.target.value)}
                      class="w-full px-3 py-2 rounded text-sm font-mono"
                      placeholder="@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="flex gap-3 p-4 border-t border-zinc-800">
              <button
                onClick=\${onClose}
                class="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick=\${handleSave}
                class="flex-1 px-4 py-2 btn-primary rounded text-sm"
              >
                <i class="fa-solid fa-check mr-1"></i> Apply Theme
              </button>
            </div>
          </div>
        </div>
      \`;
    }
    
    // ========================================
    // Media Manager Modal
    // ========================================
    function MediaManager({ assets, onClose, onRefresh }) {
      const [activeTab, setActiveTab] = useState('screenshots');
      const [editingItem, setEditingItem] = useState(null);
      const [newName, setNewName] = useState('');
      const fileInputRef = useRef(null);
      const [uploading, setUploading] = useState(false);
      
      const allAssets = {
        screenshots: assets.screenshots || [],
        mascots: assets.mascots || [],
        icons: assets.icons || [],
      };
      
      const currentAssets = allAssets[activeTab] || [];
      
      const handleUpload = async (e) => {
        const files = e.target.files;
        if (!files?.length) return;
        
        setUploading(true);
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('category', activeTab);
          
          try {
            await fetch('/api/assets/upload', {
              method: 'POST',
              body: formData,
            });
          } catch (err) {
            console.error('Upload failed:', err);
          }
        }
        await onRefresh();
        setUploading(false);
        e.target.value = '';
      };
      
      const handleRename = async (oldPath) => {
        if (!newName.trim()) return;
        
        try {
          const res = await fetch('/api/assets/rename', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPath, newName: newName.trim() }),
          });
          if (res.ok) {
            await onRefresh();
            setEditingItem(null);
            setNewName('');
          }
        } catch (err) {
          console.error('Rename failed:', err);
        }
      };
      
      const handleDelete = async (path) => {
        if (!confirm('Delete this file? This cannot be undone.')) return;
        
        try {
          const res = await fetch('/api/assets', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path }),
          });
          if (res.ok) {
            await onRefresh();
          }
        } catch (err) {
          console.error('Delete failed:', err);
        }
      };
      
      const startEditing = (path) => {
        setEditingItem(path);
        const filename = path.split('/').pop();
        const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
        setNewName(nameWithoutExt);
      };
      
      const tabs = [
        { id: 'screenshots', label: 'Screenshots', icon: 'fa-mobile-screen' },
        { id: 'mascots', label: 'Mascots', icon: 'fa-user-astronaut' },
        { id: 'icons', label: 'Icons', icon: 'fa-icons' },
      ];
      
      return html\`
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick=\${onClose}>
          <div class="bg-zinc-900 rounded-lg w-[600px] max-h-[80vh] overflow-hidden flex flex-col" onClick=\${(e) => e.stopPropagation()}>
            <!-- Header -->
            <div class="p-4 border-b border-zinc-800">
              <div class="flex justify-between items-center">
                <h2 class="font-bold text-lg"><i class="fa-solid fa-images mr-2"></i>Media Manager</h2>
                <button onClick=\${onClose} class="text-zinc-500 hover:text-white text-xl"><i class="fa-solid fa-xmark"></i></button>
              </div>
            </div>
            
            <!-- Tabs -->
            <div class="flex border-b border-zinc-800">
              \${tabs.map(tab => html\`
                <button
                  key=\${tab.id}
                  onClick=\${() => setActiveTab(tab.id)}
                  class=\${"flex-1 px-4 py-3 text-sm flex items-center justify-center gap-2 border-b-2 transition-colors " + 
                    (activeTab === tab.id 
                      ? "border-indigo-500 text-white bg-zinc-800/50" 
                      : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/30")}
                >
                  <i class=\${"fa-solid " + tab.icon}></i>
                  \${tab.label}
                  <span class="text-xs px-1.5 py-0.5 rounded bg-zinc-700">\${allAssets[tab.id].length}</span>
                </button>
              \`)}
            </div>
            
            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-4">
              \${currentAssets.length === 0 ? html\`
                <div class="text-center py-12 text-zinc-500">
                  <i class="fa-solid fa-folder-open text-4xl mb-3"></i>
                  <div>No \${activeTab} yet</div>
                  <div class="text-sm mt-1">Upload some files to get started</div>
                </div>
              \` : html\`
                <div class="grid grid-cols-3 gap-3">
                  \${currentAssets.map(path => {
                    const filename = path.split('/').pop();
                    const isEditing = editingItem === path;
                    
                    return html\`
                      <div key=\${path} class="bg-zinc-800 rounded overflow-hidden group">
                        <div class="aspect-square bg-zinc-700 relative">
                          <img 
                            src=\${"/assets/" + path.replace('assets/', '')}
                            class="w-full h-full object-contain"
                            loading="lazy"
                          />
                          <!-- Overlay actions -->
                          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick=\${() => startEditing(path)}
                              class="p-2 bg-zinc-700 hover:bg-zinc-600 rounded"
                              title="Rename"
                            >
                              <i class="fa-solid fa-pen"></i>
                            </button>
                            <button
                              onClick=\${() => handleDelete(path)}
                              class="p-2 bg-red-900/80 hover:bg-red-800 rounded"
                              title="Delete"
                            >
                              <i class="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        
                        \${isEditing ? html\`
                          <div class="p-2">
                            <input
                              type="text"
                              value=\${newName}
                              onInput=\${(e) => setNewName(e.target.value)}
                              onKeyDown=\${(e) => {
                                if (e.key === 'Enter') handleRename(path);
                                if (e.key === 'Escape') { setEditingItem(null); setNewName(''); }
                              }}
                              class="w-full px-2 py-1 text-xs rounded"
                              autoFocus
                            />
                            <div class="flex gap-1 mt-1">
                              <button
                                onClick=\${() => handleRename(path)}
                                class="flex-1 px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick=\${() => { setEditingItem(null); setNewName(''); }}
                                class="flex-1 px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        \` : html\`
                          <div class="p-2 text-xs text-zinc-400 truncate" title=\${filename}>
                            \${filename}
                          </div>
                        \`}
                      </div>
                    \`;
                  })}
                </div>
              \`}
            </div>
            
            <!-- Footer with upload -->
            <div class="p-4 border-t border-zinc-800">
              <input
                ref=\${fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange=\${handleUpload}
                class="hidden"
              />
              <button
                onClick=\${() => fileInputRef.current?.click()}
                disabled=\${uploading}
                class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                \${uploading 
                  ? html\`<i class="fa-solid fa-spinner fa-spin"></i> Uploading...\`
                  : html\`<i class="fa-solid fa-upload"></i> Upload \${activeTab === 'screenshots' ? 'Screenshots' : activeTab === 'mascots' ? 'Mascots' : 'Icons'}\`
                }
              </button>
            </div>
          </div>
        </div>
      \`;
    }
    
    // ========================================
    // Project Modal
    // ========================================
    function ProjectModal({ projects, currentProject, onClose, onCreate, onSwitch, onDelete, onRename }) {
      const [newName, setNewName] = useState('');
      const [confirmDelete, setConfirmDelete] = useState(null); // projectId to confirm delete
      const [editingProject, setEditingProject] = useState(null); // projectId being renamed
      const [editName, setEditName] = useState('');
      
      const handleDelete = (projectId) => {
        onDelete(projectId);
        setConfirmDelete(null);
      };
      
      const handleRename = (projectId) => {
        if (editName.trim()) {
          onRename(projectId, editName.trim());
          setEditingProject(null);
          setEditName('');
        }
      };
      
      const startEditing = (project) => {
        setEditingProject(project.id);
        setEditName(project.name);
      };
      
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
                  class=\${"p-3 rounded border " + 
                    (currentProject === p.id 
                      ? "bg-indigo-900/50 border-indigo-500" 
                      : "bg-zinc-800/50 border-transparent hover:bg-zinc-800")}
                >
                  \${editingProject === p.id ? html\`
                    <!-- Rename mode -->
                    <div class="flex gap-2">
                      <input
                        type="text"
                        value=\${editName}
                        onInput=\${(e) => setEditName(e.target.value)}
                        onKeyDown=\${(e) => { if (e.key === 'Enter') handleRename(p.id); if (e.key === 'Escape') setEditingProject(null); }}
                        class="flex-1 px-2 py-1 rounded text-sm"
                        autoFocus
                      />
                      <button onClick=\${() => handleRename(p.id)} class="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-sm">
                        <i class="fa-solid fa-check"></i>
                      </button>
                      <button onClick=\${() => setEditingProject(null)} class="px-2 py-1 bg-zinc-600 hover:bg-zinc-500 rounded text-sm">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  \` : confirmDelete === p.id ? html\`
                    <!-- Delete confirmation -->
                    <div class="text-center">
                      <p class="text-sm text-red-400 mb-2">Delete "\${p.name}"?</p>
                      <p class="text-xs text-zinc-500 mb-3">This will permanently delete all project data.</p>
                      <div class="flex gap-2 justify-center">
                        <button onClick=\${() => handleDelete(p.id)} class="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm">
                          Yes, Delete
                        </button>
                        <button onClick=\${() => setConfirmDelete(null)} class="px-3 py-1 bg-zinc-600 hover:bg-zinc-500 rounded text-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  \` : html\`
                    <!-- Normal view -->
                    <div class="flex items-center justify-between">
                      <div class="cursor-pointer flex-1" onClick=\${() => { onSwitch(p.id); onClose(); }}>
                        <div class="font-medium">\${p.name}</div>
                        <div class="text-xs text-zinc-500">\${p.id}</div>
                      </div>
                      <div class="flex gap-1 ml-2">
                        <button 
                          onClick=\${(e) => { e.stopPropagation(); startEditing(p); }}
                          class="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded"
                          title="Rename"
                        >
                          <i class="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button 
                          onClick=\${(e) => { e.stopPropagation(); setConfirmDelete(p.id); }}
                          class="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded"
                          title="Delete"
                        >
                          <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    </div>
                  \`}
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
