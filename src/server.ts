/**
 * App Store Screenshots - Web UI Server
 * 
 * Unified preview and generation using iframe-based rendering.
 * The preview shows exactly what will be generated.
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { join } from '@std/path';
import { GLOW_COLORS } from './renderer-components/constants.ts';
import { GRADIENT_TEMPLATES, DEFAULT_PALETTES } from './lib/index.ts';
import {
  initializeProjects,
  listProjects,
  loadProject,
  getProjectOutputDir,
} from './projects.ts';
import type { ProjectConfig } from '@types';

// Import route modules
import {
  createPreviewRoutes,
  createProjectRoutes,
  createConfigRoutes,
  createAssetRoutes,
  createAssetMiddleware,
  createGenerateRoutes,
  createStaticUIRoutes,
} from '@routes';

const app = new Hono();

// Enable CORS for Vite dev server
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

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
 * Reload config from disk (currently unused, kept for future use)
 */
async function _reloadConfig(): Promise<ProjectConfig> {
  currentConfig = await loadProject(currentProjectId);
  return currentConfig;
}

// ============================================================
// State accessors for route modules
// ============================================================
const getProjectState = () => ({
  currentProjectId,
  currentConfig,
});

const setProjectState = (updates: Partial<{ currentProjectId: string; currentConfig: ProjectConfig | null }>) => {
  if (updates.currentProjectId !== undefined) currentProjectId = updates.currentProjectId;
  if (updates.currentConfig !== undefined) currentConfig = updates.currentConfig;
};

const getCurrentProjectId = () => currentProjectId;

// ============================================================
// Init API for Vite frontend
// ============================================================
app.get('/api/init', async (c) => {
  const config = await getConfig();
  const projects = await listProjects();
  
  // Convert templates and palettes to simple objects
  const gradientTemplatesObj: Record<string, string> = {};
  for (const t of GRADIENT_TEMPLATES) {
    gradientTemplatesObj[t.id] = t.template;
  }

  const palettesObj: Record<string, { primary: string; secondary: string; accent: string }> = {};
  for (const p of DEFAULT_PALETTES) {
    palettesObj[p.name] = p.palette;
  }

  return c.json({
    config,
    projects,
    projectId: currentProjectId,
    glowColors: GLOW_COLORS,
    gradientTemplates: gradientTemplatesObj,
    palettes: palettesObj,
  });
});

// ============================================================
// Mount Route Modules
// ============================================================

// Asset middleware (serves static files from project assets directory)
app.use('/assets/*', createAssetMiddleware(getCurrentProjectId));

// Preview routes (screenshot and feature graphic HTML rendering)
app.route('/preview', createPreviewRoutes(getConfig));

// Project routes (list, create, switch, delete, rename)
app.route('/api/projects', createProjectRoutes(getProjectState, setProjectState, getConfig));

// Config routes (CRUD for screenshots, feature graphics, languages)
app.route('/api/config', createConfigRoutes(
  getCurrentProjectId,
  getConfig,
  (config) => { currentConfig = config; }
));

// Asset routes (list, upload, rename, delete)
app.route('/api/assets', createAssetRoutes(getCurrentProjectId));

// Generation routes (export screenshots to PNG)
app.route('/api/generate', createGenerateRoutes(
  getCurrentProjectId,
  getConfig
));

// Glow colors API (for UI color picker)
app.get('/api/glow-colors', (c) => {
  return c.json(GLOW_COLORS);
});

// Serve generated output files
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

// Get previously generated images
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
// Main UI (Static build from dist/ if available)
// ============================================================
const useStaticUI = await hasStaticUIBuild();

async function hasStaticUIBuild(): Promise<boolean> {
  try {
    await Deno.stat('./dist/index.html');
    await Deno.stat('./dist/assets');
    return true;
  } catch {
    return false;
  }
}

if (useStaticUI) {
  console.log('📦 Serving UI from dist/');
  const staticUI = createStaticUIRoutes(
    getConfig,
    listProjects,
    () => currentProjectId,
    (id, config) => {
      currentProjectId = id;
      currentConfig = config;
    },
    loadProject
  );
  app.route('/', staticUI);
} else {
  // In dev mode, Vite serves the UI on port 5173
  // This fallback just tells users how to access it
  app.get('/', (c) => {
    return c.html(getDevModeHTML());
  });
}

/**
 * Dev mode fallback page
 * Shown when accessing :3000 directly without a static build
 */
function getDevModeHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>App Store Screenshots - API Server</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { background: #0f0f0f; }</style>
</head>
<body class="min-h-screen flex items-center justify-center text-white">
  <div class="text-center p-8 max-w-lg">
    <i class="fa-solid fa-server text-6xl text-indigo-500 mb-6"></i>
    <h1 class="text-2xl font-bold mb-4">API Server Running</h1>
    <p class="text-zinc-400 mb-6">
      This is the API server. The UI is served separately.
    </p>
    <div class="space-y-4">
      <div class="bg-zinc-800 rounded p-4">
        <p class="text-zinc-500 text-sm mb-2">Development mode:</p>
        <code class="text-indigo-400">http://localhost:5173</code>
      </div>
      <div class="bg-zinc-800 rounded p-4">
        <p class="text-zinc-500 text-sm mb-2">Production build:</p>
        <code class="text-sm text-zinc-400">npm run build</code>
        <p class="text-zinc-500 text-xs mt-2">Then restart this server</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// Start server
const port = 3000;
if (useStaticUI) {
  console.log(`\n🎨 App Store Screenshots`);
  console.log(`   http://localhost:${port}\n`);
} else {
  console.log(`\n🔌 API server ready on port ${port}\n`);
}

Deno.serve({ port }, app.fetch);
