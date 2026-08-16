import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

/**
 * Path aliases are declared once, in deno.json `imports`; this turns the
 * local (`./src/...`) entries into Vite aliases so the UI build resolves them
 * exactly like Deno does. jsr:/npm: entries are Deno-only and skipped.
 *
 * Import-map semantics are kept: a key ending in "/" is a directory prefix,
 * any other key is an exact match (typically a barrel `index.ts`).
 */
function aliasesFromDenoJson() {
  const denoJson = JSON.parse(
    readFileSync(new URL("./deno.json", import.meta.url), "utf-8"),
  ) as { imports: Record<string, string> };
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
  return Object.entries(denoJson.imports)
    .filter(([, target]) => target.startsWith("./"))
    .map(([key, target]) => ({
      find: key.endsWith("/")
        ? new RegExp(`^${escape(key)}`)
        : new RegExp(`^${escape(key)}$`),
      replacement: fileURLToPath(new URL(target, import.meta.url)),
    }));
}

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",

  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: `${rootDir}index.html`,
    },
  },

  resolve: {
    alias: aliasesFromDenoJson(),
  },

  server: {
    port: 5173,
    // Proxy API requests to Deno server during development
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/assets": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/output": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
