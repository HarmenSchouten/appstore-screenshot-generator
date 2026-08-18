/**
 * App Store Screenshots - Web UI Server
 *
 * Web UI server and generation API.
 */

import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { extname, join } from "@std/path";
import { contentType } from "@std/media-types";
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
} from "@routes";

const app = new Hono();

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

  return c.json({
    config,
    projects,
    projectId: currentProjectId,
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
    const type = contentType(extname(fullPath)) ?? "application/octet-stream";
    return new Response(file, { headers: { "Content-Type": type } });
  } catch {
    return c.notFound();
  }
});

// Unmatched API paths must not fall through to the SPA shell below
app.all("/api/*", (c) => c.notFound());

// ============================================================
// Main UI
// ============================================================
// With a Vite build present (deno task start), serve it from dist/ with an
// SPA fallback so deep links (/:project/:lang/:platform/:screenshot) load the
// app shell. Without one (deno task dev), Vite serves the UI on :5173 and
// proxies /api, /assets and /output here.
const useStaticUI = await hasStaticUIBuild();

async function hasStaticUIBuild(): Promise<boolean> {
  try {
    await Deno.stat("./dist/index.html");
    return true;
  } catch {
    return false;
  }
}

if (useStaticUI) {
  console.log("📦 Serving UI from dist/");
  app.use("/*", serveStatic({ root: "./dist" }));
  app.get("*", serveStatic({ path: "./dist/index.html" }));
} else {
  app.get("/", (c) =>
    c.text(
      [
        "API server running.",
        "",
        "Development: the editor is served by Vite at http://localhost:5173 (deno task dev).",
        "Single process: build the UI and serve it from here with `deno task start`.",
      ].join("\n"),
    ));
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
