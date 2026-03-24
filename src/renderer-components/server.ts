/**
 * Server-Side Rendering for Deno
 *
 * This module provides HTML generation using React's renderToStaticMarkup.
 * It's designed to work with Deno's import system.
 */

/// <reference types="npm:@types/react@^18.3.1" />

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Screenshot as ScreenshotComponent } from "./Screenshot.tsx";
import type { RenderOptions } from "./types.ts";

// Ensure React is available globally for JSX
// @ts-ignore - needed for Deno JSX support
globalThis.React = React;

/**
 * Render a screenshot to a complete HTML document string
 */
export function renderScreenshot(options: RenderOptions): string {
  const element = React.createElement(ScreenshotComponent, { options });
  return "<!DOCTYPE html>\n" + renderToStaticMarkup(element);
}

// Re-export types for convenience
export type { RenderOptions } from "./types.ts";
