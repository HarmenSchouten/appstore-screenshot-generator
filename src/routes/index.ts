/**
 * Routes Module Index
 *
 * Exports all route factories for composing the server.
 */

export { createPreviewRoutes } from "./preview.ts";
export { createProjectRoutes, type ProjectState } from "./projects.ts";
export { createConfigRoutes } from "./config.ts";
export { createAssetMiddleware, createAssetRoutes } from "./assets.ts";
export { createGenerateRoutes } from "./generate.ts";
export { createStaticUIRoutes } from "./static-ui.ts";
