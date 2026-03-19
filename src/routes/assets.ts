/**
 * Asset Routes
 *
 * Handles asset management: listing, uploading, renaming, deleting, and serving.
 */

import { Hono } from "hono";
import { join } from "@std/path";
import { ensureDir } from "@std/fs";
import { getProjectAssetsDir } from "../projects.ts";

export function createAssetRoutes(
  getCurrentProjectId: () => string,
) {
  const routes = new Hono();

  /**
   * List assets in project
   */
  routes.get("/", async (c) => {
    const assetsDir = getProjectAssetsDir(getCurrentProjectId());
    const screenshots: string[] = [];
    const icons: string[] = [];
    const mascots: string[] = [];

    async function scanDir(dir: string, prefix = "") {
      try {
        for await (const entry of Deno.readDir(dir)) {
          const path = prefix ? `${prefix}/${entry.name}` : entry.name;
          if (entry.isDirectory) {
            await scanDir(join(dir, entry.name), path);
          } else if (entry.name.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
            if (
              path.toLowerCase().includes("screenshot") ||
              path.startsWith("screenshots/")
            ) {
              screenshots.push(`assets/${path}`);
            } else if (path.toLowerCase().includes("icon")) {
              icons.push(`assets/${path}`);
            } else if (path.toLowerCase().includes("mascot")) {
              mascots.push(`assets/${path}`);
            } else {
              // Put in screenshots by default for selection
              screenshots.push(`assets/${path}`);
            }
          }
        }
      } catch {
        // Directory doesn't exist
      }
    }

    await scanDir(assetsDir);

    return c.json({ screenshots, icons, mascots });
  });

  /**
   * Upload asset
   */
  routes.post("/upload", async (c) => {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string || "screenshots";

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    const assetsDir = getProjectAssetsDir(getCurrentProjectId());
    const targetDir = join(assetsDir, category);
    await ensureDir(targetDir);

    const filePath = join(targetDir, file.name);
    const buffer = await file.arrayBuffer();
    await Deno.writeFile(filePath, new Uint8Array(buffer));

    return c.json({ path: `assets/${category}/${file.name}` });
  });

  /**
   * Rename asset
   */
  routes.patch("/rename", async (c) => {
    const { oldPath, newName } = await c.req.json();

    if (!oldPath || !newName) {
      return c.json({ error: "oldPath and newName required" }, 400);
    }

    const assetsDir = getProjectAssetsDir(getCurrentProjectId());
    // oldPath is like "assets/screenshots/file.png"
    const relativePath = oldPath.replace(/^assets\//, "");
    const oldFilePath = join(assetsDir, relativePath);

    // Keep same directory, just change filename
    const dir = relativePath.substring(0, relativePath.lastIndexOf("/"));
    const ext = relativePath.substring(relativePath.lastIndexOf("."));
    const newFileName = newName.includes(".") ? newName : newName + ext;
    const newFilePath = join(assetsDir, dir, newFileName);
    const newAssetPath = `assets/${dir}/${newFileName}`;

    try {
      await Deno.rename(oldFilePath, newFilePath);
      return c.json({ success: true, newPath: newAssetPath });
    } catch (error) {
      return c.json({
        error: error instanceof Error ? error.message : "Rename failed",
      }, 500);
    }
  });

  /**
   * Delete asset
   */
  routes.delete("/", async (c) => {
    const { path: assetPath } = await c.req.json();

    if (!assetPath) {
      return c.json({ error: "path required" }, 400);
    }

    const assetsDir = getProjectAssetsDir(getCurrentProjectId());
    // assetPath is like "assets/screenshots/file.png"
    const relativePath = assetPath.replace(/^assets\//, "");
    const filePath = join(assetsDir, relativePath);

    try {
      await Deno.remove(filePath);
      return c.json({ success: true });
    } catch (error) {
      return c.json({
        error: error instanceof Error ? error.message : "Delete failed",
      }, 500);
    }
  });

  return routes;
}

/**
 * Create static asset serving middleware
 */
export function createAssetMiddleware(getCurrentProjectId: () => string) {
  return async (
    c: {
      req: { path: string };
      body: (
        data: Uint8Array,
        status: number,
        headers: Record<string, string>,
      ) => Response;
      text: (text: string, status: number) => Response;
    },
    _next: () => Promise<void>,
  ) => {
    const requestPath = c.req.path.replace("/assets/", "");
    const assetsDir = getProjectAssetsDir(getCurrentProjectId());
    const filePath = join(assetsDir, requestPath);

    try {
      const file = await Deno.readFile(filePath);
      const ext = filePath.split(".").pop()?.toLowerCase() || "";
      const mimeTypes: Record<string, string> = {
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "gif": "image/gif",
        "webp": "image/webp",
        "svg": "image/svg+xml",
      };
      return c.body(file, 200, {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
      });
    } catch {
      return c.text("Not found", 404);
    }
  };
}
