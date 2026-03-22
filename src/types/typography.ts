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
  /** Text color (hex) - defaults to white */
  textColor?: string;
  /** Text alignment */
  textAlign?: "left" | "center" | "right";
  /** Horizontal padding as percentage (2-15) */
  horizontalPadding?: number;
}
