/**
 * App Store Screenshots - Web UI Server
 * 
 * Unified preview and generation using iframe-based rendering.
 * The preview shows exactly what will be generated.
 */

import { Hono } from 'hono';
import { join } from '@std/path';
import { GLOW_COLORS } from './renderer.ts';
import {
  initializeProjects,
  listProjects,
  loadProject,
  getProjectOutputDir,
} from './projects.ts';
import type { ProjectConfig, ProjectInfo } from '@types';

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
// Main UI (Static TSX version if USE_STATIC_UI=1 or dist exists)
// ============================================================
const useStaticUI = Deno.env.get('USE_STATIC_UI') === '1' || await hasStaticUIBuild();

async function hasStaticUIBuild(): Promise<boolean> {
  try {
    await Deno.stat('./dist/app.js');
    await Deno.stat('./dist/index.html');
    return true;
  } catch {
    return false;
  }
}

if (useStaticUI) {
  console.log('📦 Using static UI build from dist/');
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
  console.log('📝 Using inline UI (legacy)');
  // Legacy inline UI routes
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
}

/**
 * Generate the main UI HTML (Fallback)
 * 
 * This is only used when dist/index.html doesn't exist.
 * Run 'deno task build:ui' to build the static UI.
 */
function getMainUI(_config: ProjectConfig, _projects: ProjectInfo[], _activeProject: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>App Store Screenshots - Setup Required</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { background: #0f0f0f; }</style>
</head>
<body class="min-h-screen flex items-center justify-center text-white">
  <div class="text-center p-8 max-w-md">
    <i class="fa-solid fa-hammer text-6xl text-amber-500 mb-6"></i>
    <h1 class="text-2xl font-bold mb-4">UI Build Required</h1>
    <p class="text-zinc-400 mb-6">
      The static UI bundle is not yet built. Run the following command to build it:
    </p>
    <code class="block bg-zinc-800 rounded px-4 py-3 font-mono text-sm text-indigo-400 mb-6">
      deno task build:ui
    </code>
    <p class="text-zinc-500 text-sm">
      Then refresh this page to see the full editor UI.
    </p>
  </div>
</body>
</html>`;
}

// Start server
const port = 3000;
console.log(`\nu{1F3A8} App Store Screenshots Server`);
console.log(`   http://localhost:${port}\n`);

Deno.serve({ port }, app.fetch);
