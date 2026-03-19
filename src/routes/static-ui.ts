/**
 * Static UI Routes
 *
 * Serves the static UI bundle with server-injected data.
 * This will replace the inline getMainUI once the new UI is complete.
 */

import { type Context, Hono } from "hono";
import {
  DEFAULT_PALETTES,
  GLOW_COLORS,
  GRADIENT_TEMPLATES,
} from "../lib/index.ts";
import type { ProjectConfig, ProjectInfo } from "../types/index.ts";

export function createStaticUIRoutes(
  getConfig: () => Promise<ProjectConfig>,
  listProjects: () => Promise<ProjectInfo[]>,
  getCurrentProjectId: () => string,
  setCurrentProject: (id: string, config: ProjectConfig) => void,
  loadProject: (id: string) => Promise<ProjectConfig>,
) {
  const routes = new Hono();

  // Read HTML template - no caching for development
  const getTemplate = async (): Promise<string> => {
    try {
      return await Deno.readTextFile("./dist/index.html");
    } catch {
      throw new Error("dist/index.html not found. Run: deno task build:ui");
    }
  };

  // Build app data for injection
  const buildAppData = async (): Promise<string> => {
    const config = await getConfig();
    const projects = await listProjects();
    const projectId = getCurrentProjectId();

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

    return JSON.stringify({
      config,
      projects,
      projectId,
      glowColors: GLOW_COLORS,
      gradientTemplates: gradientTemplatesObj,
      palettes: palettesObj,
    });
  };

  // Render the UI with injected data
  const renderUI = async (): Promise<string> => {
    const template = await getTemplate();
    const appData = await buildAppData();
    // Replace placeholder with actual data
    return template.replace(
      /window\.__APP_DATA__\s*=\s*\{\/\*\s*INJECT_APP_DATA\s*\*\/\};?/,
      `window.__APP_DATA__ = ${appData};`,
    );
  };

  // Serve the JS bundle
  routes.get("/app.js", async (c) => {
    try {
      const js = await Deno.readTextFile("./dist/app.js");
      return c.body(js, 200, {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-cache",
      });
    } catch {
      return c.text("Build not found. Run: deno task build:ui", 404);
    }
  });

  // Main UI route
  routes.get("/", async (c) => {
    try {
      const html = await renderUI();
      return c.html(html);
    } catch (e) {
      return c.text(`Error: ${(e as Error).message}`, 500);
    }
  });

  // Client-side routing support - handles all path variations
  const handleClientRoute = async (c: Context): Promise<Response> => {
    const project = c.req.param("project");

    // Skip reserved paths
    if (
      project &&
      ["api", "preview", "assets", "output", "app.js"].includes(project)
    ) {
      return c.text("Not found", 404);
    }

    // Switch project if needed
    if (project) {
      const projects = await listProjects();
      const found = projects.find((p) => p.id === project);
      if (found) {
        const config = await loadProject(project);
        setCurrentProject(project, config);
      }
    }

    try {
      const html = await renderUI();
      return c.html(html);
    } catch (e) {
      return c.text(`Error: ${(e as Error).message}`, 500);
    }
  };

  routes.get("/:project", handleClientRoute);
  routes.get("/:project/:lang", handleClientRoute);
  routes.get("/:project/:lang/:platform", handleClientRoute);
  routes.get("/:project/:lang/:platform/:screenshot", handleClientRoute);

  return routes;
}
