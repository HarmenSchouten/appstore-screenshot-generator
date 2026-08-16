/**
 * App Store Screenshots - Web UI Server
 *
 * Web UI server and generation API.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { join } from "@std/path";
import { DEFAULT_PALETTES, GRADIENT_TEMPLATES } from "@lib";
import {
  getProjectOutputDir,
  initializeProjects,
  listProjects,
  loadProject,
} from "./projects.ts";
import type { ProjectConfig } from "@app-types";

// Import route modules
import {
  createAssetMiddleware,
  createAssetRoutes,
  createConfigRoutes,
  createGenerateRoutes,
  createProjectRoutes,
  createStaticUIRoutes,
} from "@routes";

const app = new Hono();

// Enable CORS for Vite dev server
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

// Current active project
let currentProjectId: string = "default";
let currentConfig: ProjectConfig | null = null;

// Initialize projects on startup
await initializeProjects().then((id) => {
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

const setProjectState = (
  updates: Partial<
    { currentProjectId: string; currentConfig: ProjectConfig | null }
  >,
) => {
  if (updates.currentProjectId !== undefined) {
    currentProjectId = updates.currentProjectId;
  }
  if (updates.currentConfig !== undefined) {
    currentConfig = updates.currentConfig;
  }
};

const getCurrentProjectId = () => currentProjectId;

// ============================================================
// Init API for Vite frontend
// ============================================================
app.get("/api/init", async (c) => {
  const config = await getConfig();
  const projects = await listProjects();

  // Convert templates and palettes to simple objects
  const gradientTemplatesObj: Record<string, string> = {};
  for (const t of GRADIENT_TEMPLATES) {
    gradientTemplatesObj[t.id] = t.template;
  }

  const palettesObj: Record<
    string,
    { primary: string; secondary: string; accent: string }
  > = {};
  for (const p of DEFAULT_PALETTES) {
    palettesObj[p.name] = p.palette;
  }

  return c.json({
    config,
    projects,
    projectId: currentProjectId,
    gradientTemplates: gradientTemplatesObj,
    palettes: palettesObj,
  });
});

// ============================================================
// Mount Route Modules
// ============================================================

// Asset middleware (serves static files from project assets directory)
app.use("/assets/*", createAssetMiddleware(getCurrentProjectId));

// Project routes (list, create, switch, delete, rename)
app.route(
  "/api/projects",
  createProjectRoutes(getProjectState, setProjectState, getConfig),
);

// Config routes (CRUD for screenshots, feature graphics, languages)
app.route(
  "/api/config",
  createConfigRoutes(
    getCurrentProjectId,
    getConfig,
    (config) => {
      currentConfig = config;
    },
  ),
);

// Asset routes (list, upload, rename, delete)
app.route("/api/assets", createAssetRoutes(getCurrentProjectId));

// Generation routes (export screenshots to PNG)
app.route(
  "/api/generate",
  createGenerateRoutes(
    getCurrentProjectId,
    getConfig,
  ),
);

// Serve generated output files
app.get("/output/:path{.+}", async (c) => {
  const filePath = c.req.param("path");
  const fullPath = join(getProjectOutputDir(currentProjectId), filePath);

  try {
    const file = await Deno.readFile(fullPath);
    const ext = fullPath.split(".").pop()?.toLowerCase();
    const contentType = ext === "png"
      ? "image/png"
      : ext === "jpg" || ext === "jpeg"
      ? "image/jpeg"
      : "application/octet-stream";
    return new Response(file, { headers: { "Content-Type": contentType } });
  } catch {
    return c.notFound();
  }
});

// ============================================================
// Main UI (Static build from dist/ if available)
// ============================================================
const useStaticUI = await hasStaticUIBuild();

async function hasStaticUIBuild(): Promise<boolean> {
  try {
    await Deno.stat("./dist/index.html");
    await Deno.stat("./dist/assets");
    return true;
  } catch {
    return false;
  }
}

if (useStaticUI) {
  console.log("📦 Serving UI from dist/");
  const staticUI = createStaticUIRoutes(
    getConfig,
    listProjects,
    () => currentProjectId,
    (id, config) => {
      currentProjectId = id;
      currentConfig = config;
    },
    loadProject,
  );
  app.route("/", staticUI);
} else {
  // In dev mode, Vite serves the UI on port 5173
  // This fallback just tells users how to access it
  app.get("/", (c) => {
    return c.html(getDevModeHTML());
  });
}

/**
 * Dev mode fallback page
 * Shown when accessing :3000 directly without a static build
 */
function getDevModeHTML(): string {
  // Self-contained on purpose: no CDN stylesheets/scripts, so this page (and
  // the editor it points at) works offline.
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>App Store Screenshots - API Server</title>
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
           background: #0f0f0f; color: #fff; font-family: system-ui, sans-serif; }
    main { text-align: center; padding: 2rem; max-width: 32rem; }
    h1 { font-size: 1.5rem; margin: 0 0 1rem; }
    p { color: #a1a1aa; margin: 0 0 1.5rem; }
    .card { background: #27272a; border-radius: 0.375rem; padding: 1rem; margin-top: 1rem; }
    .card p { color: #71717a; font-size: 0.875rem; margin: 0 0 0.5rem; }
    code, a { color: #818cf8; }
    small { display: block; color: #71717a; font-size: 0.75rem; margin-top: 0.5rem; }
  </style>
</head>
<body>
  <main>
    <h1>API Server Running</h1>
    <p>This is the API server. The UI is served separately.</p>
    <div class="card">
      <p>Development mode:</p>
      <code><a href="http://localhost:5173">http://localhost:5173</a></code>
    </div>
    <div class="card">
      <p>Production build:</p>
      <code>deno task build</code>
      <small>Then restart this server</small>
    </div>
  </main>
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
