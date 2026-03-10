/**
 * UI Entry Point
 * 
 * Initializes the React application.
 * In Vite mode, we fetch initial data from the API.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import './styles.css';

// Type definitions for global utilities (AppData declared in App.tsx)
declare global {
  interface Window {
    GRADIENT_TEMPLATES: Record<string, string>;
    DEFAULT_PALETTES: Record<string, { primary: string; secondary: string; accent: string }>;
    applyPaletteToGradient: (template: string, palette: { primary: string; secondary: string; accent: string }) => string;
  }
}

// Initialize global palette utilities
window.GRADIENT_TEMPLATES = {};
window.DEFAULT_PALETTES = {};
window.applyPaletteToGradient = (template: string, palette: { primary: string; secondary: string; accent: string }) => {
  return template
    .replace(/\{primary\}/g, palette.primary)
    .replace(/\{secondary\}/g, palette.secondary)
    .replace(/\{accent\}/g, palette.accent);
};

// Fetch initial data and mount application
async function init() {
  try {
    // Fetch initial application data from server
    const response = await fetch('/api/init');
    if (!response.ok) {
      throw new Error(`Failed to load app data: ${response.status}`);
    }
    
    const appData = await response.json();
    
    // Store global utilities for palette system
    window.__APP_DATA__ = appData;
    window.GRADIENT_TEMPLATES = appData.gradientTemplates || {};
    window.DEFAULT_PALETTES = appData.palettes || {};
    
    // Mount application
    const root = createRoot(document.getElementById('root')!);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);
    document.getElementById('root')!.innerHTML = `
      <div class="flex items-center justify-center h-screen">
        <div class="text-center">
          <h1 class="text-xl font-bold text-red-500 mb-2">Failed to load application</h1>
          <p class="text-zinc-400">Make sure the API server is running on port 3000</p>
          <p class="text-zinc-500 text-sm mt-2">Run: deno task dev:server</p>
        </div>
      </div>
    `;
  }
}

init();
