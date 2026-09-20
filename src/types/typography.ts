/**
 * UI Component types - Typography
 */

// ============================================================
// Typography
// ============================================================

/** Typography settings for text values */
export interface TypographyOptions {
  /** font size in pixels */
  fontSize?: number;
  /** Headline font weight (400-900) */
  fontWeight?: number;
  /** Line height */
  lineHeight?: number;
  /** Letter spacing in pixels */
  letterSpacing?: number;
  /** Text color (hex) - defaults to white */
  textColor?: string;
  /** Text alignment */
  textAlign?: "left" | "center" | "right";
  /** Text transform */
  textTransform?: "none" | "uppercase" | "capitalize";
  /**
   * Inset from each side of the canvas as a percentage of its width: the
   * text box is `100 − 2 × inset` percent wide and wraps inside it. Not CSS
   * padding; the key stays because it is persisted in project configs.
   */
  horizontalPadding?: number;
}
