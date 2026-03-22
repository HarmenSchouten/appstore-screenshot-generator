import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",

  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@ui": resolve(__dirname, "src/ui"),
      "@types": resolve(__dirname, "src/types"),
      "@renderer": resolve(__dirname, "src/renderer-components"),
      "@device-presets": resolve(__dirname, "src/device-presets"),
    },
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
