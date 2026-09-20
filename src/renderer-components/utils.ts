/**
 * Renderer Utilities
 *
 * Shared utility functions for isomorphic rendering.
 */

/**
 * Create asset URL based on context (preview vs export)
 */
export function assetUrl(path: string | undefined, prefix: string): string {
  if (!path) return "";
  // Remove leading 'assets/' if present since prefix handles it
  const cleanPath = path.replace(/^assets\//, "");
  return `${prefix}${cleanPath}`;
}

/**
 * Deterministic value in [0, 1) for an integer seed: one mulberry32 step.
 * Pure integer arithmetic, so the browser preview and the export engine
 * agree bit for bit — `Math.sin`, which this replaced, is
 * implementation-defined and may differ between JavaScript engines.
 */
export function seededRandom(seed: number): number {
  let t = ((seed | 0) + 0x6D2B79F5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
