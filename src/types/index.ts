/**
 * Consolidated Type Definitions for App Store Screenshots
 * 
 * This module is the single source of truth for all type definitions.
 * Import from '@types' throughout the application.
 * 
 * Types are organized into logical modules:
 * - base.ts       - Platform, Language, Dimensions
 * - effects.ts    - GlowEffect, Shape
 * - components.ts - PhoneFrameOptions, MascotOptions, TypographyOptions
 * - device.ts     - DevicePreset, DevicePresetId, PlatformDefaults
 * - screenshot.ts - Screenshot, FeatureGraphic
 * - theme.ts      - ThemeConfig, ColorPalette, AppBranding
 * - config.ts     - PlatformConfig, LanguageConfig, ProjectConfig
 * - renderer.ts   - RenderOptions, FeatureGraphicRenderOptions
 * - generation.ts - GenerationResult, GenerationProgress, AssetLists
 */

// Base types
export * from './base.ts';

// Visual effects
export * from './effects.ts';

// UI components
export * from './components.ts';

// Device presets
export * from './device.ts';

// Screenshots and feature graphics
export * from './screenshot.ts';

// Theme and branding
export * from './theme.ts';

// Configuration
export * from './config.ts';

// Renderer options
export * from './renderer.ts';

// Generation and assets
export * from './generation.ts';
