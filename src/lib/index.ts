/**
 * Shared Constants and Utilities
 *
 * This module contains shared constants, templates, and utility functions
 * used throughout the application.
 */

import type { Dimensions, Platform, ScreenshotRole } from "@app-types";
import { SCREENSHOT_ROLE_SPECS } from "./screenshot-roles.ts";

// ============================================================
// Platforms & roles
// ============================================================

/** Every store platform this tool targets; the runtime twin of `Platform`. */
export const PLATFORMS: readonly Platform[] = ["android", "ios"];

export function isPlatform(value: unknown): value is Platform {
  return typeof value === "string" &&
    (PLATFORMS as readonly string[]).includes(value);
}

export * from "./screenshot-roles.ts";

/** Runtime twin of `ScreenshotRole` — the keys of the role table. */
export const SCREENSHOT_ROLES: readonly ScreenshotRole[] = Object.keys(
  SCREENSHOT_ROLE_SPECS,
) as ScreenshotRole[];

export function isScreenshotRole(value: unknown): value is ScreenshotRole {
  return typeof value === "string" &&
    (SCREENSHOT_ROLES as readonly string[]).includes(value);
}

// ============================================================
// Store dimensions
// ============================================================

/**
 * Default canvas size for a new platform config.
 *
 * iOS: 6.5" (1242×2688) — still accepted by App Store Connect, though 6.9"
 * (1290×2796) leads since 2024; the store-compliance work will formalise
 * this. Android: Play wants 16:9 / 9:16 phone screenshots, 320–3840 px.
 * Spread before storing (`{ ...DEFAULT_DIMENSIONS.ios }`) — configs are
 * mutated in place.
 */
export const DEFAULT_DIMENSIONS: Readonly<Record<Platform, Dimensions>> = {
  ios: { width: 1242, height: 2688 },
  android: { width: 1080, height: 1920 },
};

// ============================================================
// Gradients
// ============================================================

export * from "./gradient.ts";

// ============================================================
// Ids
// ============================================================

let nextLayerId = 1;

/**
 * Id for a new layer. `crypto.randomUUID` exists only in secure contexts
 * (https or localhost); a counter keeps the editor usable over plain http
 * on a LAN address, where ids only need to be unique within the session.
 */
export function generateLayerId(): string {
  return globalThis.crypto.randomUUID?.() ?? `layer-${nextLayerId++}`;
}

// ============================================================
// Layers
// ============================================================

export * from "./layers.ts";

// ============================================================
// Exhaustiveness
// ============================================================

/**
 * Marks the end of a switch over a union. Type-checks only when every case
 * is handled; a new member is a compile error at each site, not a silent
 * fallthrough.
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}
