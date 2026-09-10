/**
 * Output Routes
 *
 * Serves generated files from the current project's output directory.
 */

import { Hono } from "hono";
import { getProjectOutputDir } from "@/projects.ts";
import { resolveInside } from "@/path-safety.ts";
import { ValidationError } from "@/errors.ts";
import type { ServerContext } from "./context.ts";
import { fileResponse } from "./http.ts";

export function createOutputRoutes(ctx: ServerContext) {
  const routes = new Hono();

  routes.get("/:path{.+}", (c) => {
    const filePath = resolveInside(
      getProjectOutputDir(ctx.getCurrentProjectId()),
      c.req.param("path"),
    );
    if (!filePath) throw new ValidationError("Invalid output path");
    return fileResponse(filePath);
  });

  return routes;
}
