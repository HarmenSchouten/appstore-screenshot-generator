/**
 * Server-Side Rendering for Deno
 *
 * This module provides HTML generation using React's renderToStaticMarkup.
 * It's designed to work with Deno's import system.
 */

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Screenshot as ScreenshotComponent } from "./Screenshot.tsx";
import type { RenderOptions } from "@app-types";

/**
 * Render a screenshot to a complete HTML document string
 */
export function renderScreenshot(options: RenderOptions): string {
  const element = createElement(ScreenshotComponent, { options });
  return "<!DOCTYPE html>\n" + renderToStaticMarkup(element);
}

// Re-export types for convenience
export type { RenderOptions } from "@app-types";
