/**
 * Routes Module Index
 *
 * Everything `server.ts` needs to compose the app.
 */

export { createServerContext, type ServerContext } from "./context.ts";
export { createProjectRoutes } from "./projects.ts";
export { createConfigRoutes } from "./config.ts";
export { createAssetFileRoutes, createAssetRoutes } from "./assets.ts";
export { createGenerateRoutes } from "./generate.ts";
export { createOutputRoutes } from "./output.ts";
export { notFound, onError } from "./http.ts";
