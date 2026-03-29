/**
 * Config Persistence Bridge
 *
 * Thin bridge so non-React code (e.g. generation slice, useSwitchProject)
 * can flush pending config saves without importing a React hook.
 *
 * The actual debounce + mutation logic lives in `useConfigAutoSave`,
 * which registers its flush implementation at mount time.
 */

let flushFn: () => Promise<void> = () => Promise.resolve();

/**
 * Called by `useConfigAutoSave` to wire up the real flush implementation.
 */
export function registerFlush(fn: () => Promise<void>): void {
  flushFn = fn;
}

/**
 * Flush any pending debounced config save immediately.
 * Safe to call from anywhere — resolves instantly if nothing is pending.
 */
export function flushPersist(): Promise<void> {
  return flushFn();
}
