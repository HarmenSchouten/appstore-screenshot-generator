/**
 * Generation Routes
 *
 * Thin HTTP adapter over the generation pipeline: an SSE stream that relays
 * progress and turns a client disconnect into cancellation, the last run's
 * manifest, and opening the output folder.
 */

import { Hono } from "hono";
import { ensureDir } from "@std/fs";
import type { GenerationEvent } from "@app-types";
import { getProjectAssetsDir, getProjectOutputDir } from "@/projects.ts";
import {
  generateAll,
  type HtmlToPngConverter,
  readManifest,
} from "@/generation.ts";
import type { ServerContext } from "./context.ts";

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  "Connection": "keep-alive",
};

export function createGenerateRoutes(
  ctx: ServerContext,
  convert: HtmlToPngConverter,
) {
  const routes = new Hono();

  /**
   * Generate with streaming progress. Cancelling the fetch (or closing the
   * tab) aborts the run after the screenshot in flight.
   */
  routes.post("/stream", async () => {
    const config = await ctx.getConfig();
    const projectId = ctx.getCurrentProjectId();
    const outputDir = getProjectOutputDir(projectId);
    const assetsDir = getProjectAssetsDir(projectId);
    const abort = new AbortController();
    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: GenerationEvent) => {
          // Once the client is gone the controller is closed; the aborted
          // signal ends the loop after the current screenshot
          if (abort.signal.aborted) return;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
          );
        };
        try {
          await generateAll(config, {
            outputDir,
            assetsDir,
            convert,
            onEvent: send,
            signal: abort.signal,
          });
        } catch (error) {
          send({
            type: "error",
            message: error instanceof Error ? error.message : String(error),
          });
        }
        if (!abort.signal.aborted) controller.close();
      },
      cancel() {
        abort.abort();
      },
    });

    return new Response(stream, { headers: SSE_HEADERS });
  });

  routes.post("/open-folder", async (c) => {
    // The server knows the output dir. Taking a path from the client would
    // let any web page launch the file manager on an arbitrary location.
    const folderPath = getProjectOutputDir(ctx.getCurrentProjectId());
    await ensureDir(folderPath);

    // Windows: explorer, macOS: open, Linux: xdg-open
    const cmd = Deno.build.os === "windows"
      ? ["explorer", folderPath]
      : Deno.build.os === "darwin"
      ? ["open", folderPath]
      : ["xdg-open", folderPath];

    new Deno.Command(cmd[0], { args: cmd.slice(1) }).spawn();
    return c.json({ success: true });
  });

  /**
   * The last run's results, from the manifest the pipeline wrote
   */
  routes.get("/generated", async (c) => {
    const outputDir = getProjectOutputDir(ctx.getCurrentProjectId());
    const manifest = await readManifest(outputDir);
    return c.json({ results: manifest?.results ?? [], outputDir });
  });

  return routes;
}
