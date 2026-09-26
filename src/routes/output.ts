/**
 * Output Routes
 *
 * Serves generated files from a project's output directory. Mounted on
 * `/output/:projectId`.
 */

import { Hono } from "hono";
import { getProjectOutputDir } from "@/projects.ts";
import { resolveInside } from "@/path-safety.ts";
import { ValidationError } from "@/errors.ts";
import { fileResponse, projectIdOf } from "./http.ts";

export function createOutputRoutes() {
  const routes = new Hono();

  routes.get("/:path{.+}", (c) => {
    const filePath = resolveInside(
      getProjectOutputDir(projectIdOf(c)),
      c.req.param("path"),
    );
    if (!filePath) throw new ValidationError("Invalid output path");
    return fileResponse(filePath);
  });

  return routes;
}
