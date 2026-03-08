/**
 * UI Module
 * 
 * Re-exports UI-related constants and utilities.
 * The getMainUI function is currently inline in server.ts due to its size.
 * Future refactoring may extract it here as the UI shell.
 */

export { GLOW_COLORS } from '../renderer.ts';
export { GRADIENT_TEMPLATES, DEFAULT_PALETTES } from '../lib/index.ts';
export type { ProjectConfig, ProjectInfo } from '../types/index.ts';
