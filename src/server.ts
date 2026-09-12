/**
 * App Store Screenshots server: the API, plus the built UI when `dist/` exists.
 */

import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";
import { exists } from "@std/fs";
import { initializeProjects, listProjects } from "./projects.ts";
import { closeBrowser, killBrowser, renderHtmlToPng } from "./png-export.ts";
import {
  createAssetMiddleware,
  createAssetRoutes,
  createConfigRoutes,
  createGenerateRoutes,
  createOutputRoutes,
  createProjectRoutes,
  createServerContext,
  notFound,
  onError,
} from "@routes";

const port = Number(Deno.env.get("PORT") || 3000);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error(`PORT must be a port number, got "${Deno.env.get("PORT")}"`);
}

// With a Vite build present (deno task start) this process serves the UI too.
// Without one (deno task dev) Vite serves it on :5173 and proxies /api,
// /assets and /output here.
const useStaticUI = await exists("./dist/index.html", { isFile: true });

const ctx = createServerContext(await initializeProjects());
const app = new Hono();

// Every failure — a thrown HttpError or an unexpected exception — leaves as
// `{ error }` JSON, and so does every unmatched path
app.onError(onError);
app.notFound(notFound);
// Request log in dev only; behind a static build every UI asset would log too
if (!useStaticUI) app.use(logger());

app.get("/api/init", async (c) =>
  c.json({
    config: await ctx.getConfig(),
    projects: await listProjects(),
    projectId: ctx.getCurrentProjectId(),
  }));

app.use("/assets/*", createAssetMiddleware(ctx));
app.route("/api/projects", createProjectRoutes(ctx));
app.route("/api/config", createConfigRoutes(ctx));
app.route("/api/assets", createAssetRoutes(ctx));
app.route("/api/generate", createGenerateRoutes(ctx, renderHtmlToPng));
app.route("/output", createOutputRoutes(ctx));

// Unmatched API paths must not fall through to the SPA shell below
app.all("/api/*", (c) => c.notFound());

if (useStaticUI) {
  // SPA fallback: deep links (/:project/:lang/:platform/:screenshot) load the shell
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

// Chrome is a child of this process; without these a Ctrl-C leaves it running
Deno.addSignalListener("SIGINT", async () => {
  await Promise.race([
    closeBrowser(),
    new Promise((resolve) => setTimeout(resolve, 2000)),
  ]);
  Deno.exit(0);
});
globalThis.addEventListener("unload", killBrowser);

const banner = useStaticUI ? "App Store Screenshots" : "API server";
Deno.serve({
  port,
  onListen: () => console.log(`${banner} ready on http://localhost:${port}`),
}, app.fetch);
