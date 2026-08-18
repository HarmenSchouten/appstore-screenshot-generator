/**
 * Consolidated Type Definitions for App Store Screenshots
 *
 * This module is the single source of truth for all type definitions.
 * Import from '@app-types' throughout the application.
 *
 * Types are organized into logical modules:
 * - base.ts       - Platform, Dimensions
 * - effects.ts    - ShapeType
 * - typography.ts - TypographyOptions
 * - device.ts     - DevicePreset, DevicePresetId, PlatformDefaults
 * - screenshot.ts - Screenshot, ScreenshotRole
 * - theme.ts      - ThemeConfig, ColorPalette, AppBranding
 * - config.ts     - PlatformConfig, LanguageConfig, ProjectConfig
 * - renderer.ts   - RenderOptions
 * - layers.ts     - Layer and the per-type *LayerProps
 */

// Base types
export * from "./base.ts";

// Visual effects
export * from "./effects.ts";

// UI components
export * from "./typography.ts";

// Device presets
export * from "./device.ts";

// Screenshots and feature graphics
export * from "./screenshot.ts";

// Theme and branding
export * from "./theme.ts";

// Configuration
export * from "./config.ts";

// Renderer options
export * from "./renderer.ts";

// Layer types
export * from "./layers.ts";
