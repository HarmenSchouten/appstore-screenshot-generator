/**
 * Base Styles
 *
 * Provides essential CSS for screenshot rendering:
 * resets, font-family, and .screenshot container.
 */

import type { ThemeConfig } from "./types.ts";

interface BaseStyleOptions {
  /**
   * Scope all selectors to a specific root for embedded previews.
   * When set, document-level selectors (html/body) are omitted.
   */
  scopeSelector?: string;
}

/**
 * Generate base CSS styles for screenshot rendering
 */
export function getBaseStylesCSS(
  theme: ThemeConfig,
  options: BaseStyleOptions = {},
): string {
  const fontUrl = theme.googleFontsUrl
    ? `@import url('${theme.googleFontsUrl}');`
    : "";

  const { scopeSelector } = options;
  const isScoped = Boolean(scopeSelector);
  const selectorPrefix = scopeSelector ? `${scopeSelector} ` : "";
  const resetSelector = scopeSelector
    ? `${scopeSelector}, ${scopeSelector} *`
    : "*";
  const fontFamilySelector = scopeSelector ?? "body";
  const documentRules = isScoped ? "" : `
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    `;

  return `
    ${fontUrl}
    
    ${resetSelector} {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    ${documentRules}
    
    ${fontFamilySelector} {
      font-family: ${theme.fontFamily};
    }
    
    ${selectorPrefix}.screenshot {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }
  `;
}
