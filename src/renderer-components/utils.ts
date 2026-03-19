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
 * Seeded random number generator for consistent shape rendering
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
