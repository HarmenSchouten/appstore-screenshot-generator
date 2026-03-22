/**
 * UI Component types - Phone Frame, Mascot, Typography
 */

import type { DeviceMode, DevicePresetId } from "./device.ts";

// ============================================================
// Phone Frame
// ============================================================

export interface PhoneFrameOptions {
  /** Phone size as percentage of container width (50-95 for single, 30-50 for dual) */
  scale?: number;
  /** Bottom offset as percentage (0-25) */
  bottomOffset?: number;
  /** Rotation angle for dual mode phones (0-15 degrees) */
  dualRotation?: number;
  /** Gap between phones in dual mode (0-30px) */
  dualGap?: number;
  /** Inherit platform default or use an explicit device preset */
  deviceMode?: DeviceMode;
  /** Device preset to use when deviceMode = override */
  devicePresetId?: DevicePresetId;
}

// ============================================================
// Mascot
// ============================================================

export interface MascotOptions {
  /** Position of the mascot */
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** Path to mascot image (relative to assets) */
  imagePath?: string;
  /** Size of mascot as percentage of container width (5-30) */
  size?: number;
  /** Offset from edges in pixels (10-100) */
  offset?: number;
  /** Border radius as percentage (0-50) - 50 = circular, 20 = rounded corners */
  borderRadius?: number;
}

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
