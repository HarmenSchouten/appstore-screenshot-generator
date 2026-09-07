/**
 * Asset Routes
 *
 * Handles asset management: listing, uploading, renaming, deleting, and serving.
 * Every client-supplied path is confined to the current project's assets
 * directory via `resolveInside`.
 */

import { Hono, type MiddlewareHandler } from "hono";
import { dirname, extname, join, relative } from "@std/path";
import { ensureDir, exists } from "@std/fs";
import { getProjectAssetsDir } from "@/projects.ts";
import { resolveInside } from "@/path-safety.ts";
import {
  ConflictError,
  NotFoundError,
  UnsupportedMediaTypeError,
  ValidationError,
} from "@/errors.ts";
import {
  fileResponse,
  readJsonBody,
  requireObject,
  requireString,
} from "./http.ts";

const UPLOAD_CATEGORY = "images";

/**
 * Client asset paths look like "assets/images/file.png"; the part after the
 * prefix must resolve inside the assets directory.
 */
function resolveAssetPath(assetsDir: string, assetPath: string): string {
  const resolved = resolveInside(
    assetsDir,
    assetPath.replace(/^assets\//, ""),
  );
  if (!resolved) throw new ValidationError(`Invalid asset path "${assetPath}"`);
  return resolved;
}

/**
 * A bare file name placed directly in `dir`: no directory part on either
 * separator convention, and none of the inputs `resolveInside` rejects.
 */
function resolveFileIn(dir: string, fileName: string, what: string): string {
  const resolved = /[\\/]/.test(fileName) ? null : resolveInside(dir, fileName);
  if (!resolved) throw new ValidationError(`${what} must be a plain file name`);
  return resolved;
}

/** "assets/…" path for a file inside the assets dir, always forward-slashed. */
function toAssetPath(assetsDir: string, filePath: string): string {
  return `assets/${relative(assetsDir, filePath).replaceAll("\\", "/")}`;
}

export function createAssetRoutes(
  getCurrentProjectId: () => string,
) {
  const routes = new Hono();

  /**
   * List assets in project
   */
  routes.get("/", async (c) => {
    const assetsDir = getProjectAssetsDir(getCurrentProjectId());
    const images: string[] = [];

    async function scanDir(dir: string, prefix = "") {
      try {
        for await (const entry of Deno.readDir(dir)) {
          const path = prefix ? `${prefix}/${entry.name}` : entry.name;
          if (entry.isDirectory) {
            await scanDir(join(dir, entry.name), path);
          } else if (/\.(png|jpg|jpeg|gif|webp)$/i.test(entry.name)) {
            images.push(`assets/${path}`);
          }
        }
      } catch (error) {
        // Directory doesn't exist yet
        if (!(error instanceof Deno.errors.NotFound)) throw error;
      }
    }

    await scanDir(assetsDir);

    return c.json({ images });
  });

  /**
   * Upload asset
   */
  routes.post("/upload", async (c) => {
    const type = c.req.header("content-type") ?? "";
    if (!/^multipart\/form-data\b/i.test(type.trim())) {
      throw new UnsupportedMediaTypeError(
        "Content-Type must be multipart/form-data",
      );
    }
    let formData: FormData;
    try {
      formData = await c.req.formData();
    } catch {
      throw new ValidationError("Malformed multipart body");
    }
    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new ValidationError("No file provided");
    }

    const targetDir = join(
      getProjectAssetsDir(getCurrentProjectId()),
      UPLOAD_CATEGORY,
    );
    const filePath = resolveFileIn(targetDir, file.name, "File name");
    await ensureDir(targetDir);
    await Deno.writeFile(filePath, new Uint8Array(await file.arrayBuffer()));

    return c.json({ path: `assets/${UPLOAD_CATEGORY}/${file.name}` });
  });

  /**
   * Rename asset
   */
  routes.patch("/rename", async (c) => {
    const body = requireObject(await readJsonBody(c));
    const oldPath = requireString(body, "oldPath");
    const newName = requireString(body, "newName");

    const assetsDir = getProjectAssetsDir(getCurrentProjectId());
    const oldFilePath = resolveAssetPath(assetsDir, oldPath);
    // Keep the directory, change the name; carry the extension over when the
    // new name has none
    const newFileName = newName.includes(".")
      ? newName
      : newName + extname(oldFilePath);
    const newFilePath = resolveFileIn(
      dirname(oldFilePath),
      newFileName,
      '"newName"',
    );

    if (!(await exists(oldFilePath, { isFile: true }))) {
      throw new NotFoundError(`Asset "${oldPath}" not found`);
    }
    const newPath = toAssetPath(assetsDir, newFilePath);
    if (newFilePath === oldFilePath) {
      return c.json({ success: true, newPath });
    }
    // A case-only rename has to pass: on a case-insensitive filesystem the
    // target "exists" but is this same file
    const caseOnly = newFilePath.toLowerCase() === oldFilePath.toLowerCase();
    if (!caseOnly && await exists(newFilePath)) {
      throw new ConflictError(
        `An asset named "${newFileName}" already exists`,
      );
    }

    await Deno.rename(oldFilePath, newFilePath);
    return c.json({ success: true, newPath });
  });

  /**
   * Delete asset
   */
  routes.delete("/", async (c) => {
    const assetPath = requireString(
      requireObject(await readJsonBody(c)),
      "path",
    );
    const filePath = resolveAssetPath(
      getProjectAssetsDir(getCurrentProjectId()),
      assetPath,
    );

    try {
      await Deno.remove(filePath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new NotFoundError(`Asset "${assetPath}" not found`);
      }
      throw error;
    }
    return c.json({ success: true });
  });

  return routes;
}

/**
 * Static asset serving for the current project. Mounted on `/assets/*`.
 */
export function createAssetMiddleware(
  getCurrentProjectId: () => string,
): MiddlewareHandler {
  return (c) => {
    const requestPath = c.req.path.replace(/^\/assets\//, "");
    const filePath = resolveInside(
      getProjectAssetsDir(getCurrentProjectId()),
      requestPath,
    );
    if (!filePath) throw new ValidationError("Invalid asset path");
    return fileResponse(filePath);
  };
}
