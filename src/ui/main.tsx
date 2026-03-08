/**
 * UI Entry Point
 * 
 * Initializes the Preact application with data injected by the server.
 */

import { render } from 'preact';
import { App } from './components/App.tsx';

// Augment window type for global utilities
declare global {
  interface Window {
    __APP_DATA__: unknown;
    GRADIENT_TEMPLATES: Record<string, string>;
    DEFAULT_PALETTES: Record<string, { primary: string; secondary: string; accent: string }>;
    applyPaletteToGradient: (template: string, palette: { primary: string; secondary: string; accent: string }) => string;
  }
}

// Store global utilities for palette system
const appData = (self as unknown as Window).__APP_DATA__ as { gradientTemplates: Record<string, string>; palettes: Record<string, { primary: string; secondary: string; accent: string }> };
(self as unknown as Window).GRADIENT_TEMPLATES = appData.gradientTemplates || {};
(self as unknown as Window).DEFAULT_PALETTES = appData.palettes || {};
(self as unknown as Window).applyPaletteToGradient = (template: string, palette: { primary: string; secondary: string; accent: string }) => {
  return template
    .replace(/\{primary\}/g, palette.primary)
    .replace(/\{secondary\}/g, palette.secondary)
    .replace(/\{accent\}/g, palette.accent);
};

// Mount application
render(<App />, document.getElementById('app')!);
