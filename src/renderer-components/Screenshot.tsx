/**
 * Screenshot Component
 * 
 * Main isomorphic component for rendering app store screenshots.
 * Works identically in browser preview and server-side HTML generation.
 */

import React from 'react';
import type { RenderOptions } from './types.ts';
import { BaseStyles } from './BaseStyles.tsx';
import { Glow } from './Glow.tsx';
import { Shapes } from './Shape.tsx';
import { Phones } from './PhoneFrame.tsx';
import { Mascot } from './Mascot.tsx';

interface ScreenshotProps {
  options: RenderOptions;
}

/**
 * Screenshot Content (without HTML wrapper)
 * 
 * Use this for client-side preview where you already have a document.
 */
export function ScreenshotContent({ options }: ScreenshotProps): React.ReactElement {
  const { screenshot, app, dimensions, assetUrlPrefix = '/assets/' } = options;
  
  return (
    <div className="screenshot">
      {/* Glow Effects */}
      {screenshot.glows.map((glow, index) => (
        <Glow key={index} glow={glow} containerWidth={dimensions.width} />
      ))}
      
      {/* Decorative Shapes */}
      <Shapes shapes={screenshot.shapes} />
      
      {/* Headline */}
      <div className="headline-area" style={{ top: `${screenshot.headlineOffset ?? 0}%` }}>
        <h1>{screenshot.headline}</h1>
        <p>{screenshot.subtitle}</p>
      </div>
      
      {/* Phone Mockups */}
      <Phones screenshot={screenshot} assetUrlPrefix={assetUrlPrefix} containerWidth={dimensions.width} />
      
      {/* Mascot */}
      <Mascot mascot={screenshot.mascot} app={app} assetUrlPrefix={assetUrlPrefix} />
    </div>
  );
}

/**
 * Full Screenshot Document
 * 
 * Use this for server-side rendering to generate complete HTML documents.
 * Includes <html>, <head>, <body> and all necessary styles.
 */
export function Screenshot({ options }: ScreenshotProps): React.ReactElement {
  const { screenshot, theme, app, dimensions } = options;
  
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content={`width=${dimensions.width}, height=${dimensions.height}`} />
        <title>{`${app.name} - ${screenshot.id}`}</title>
        <BaseStyles 
          theme={theme} 
          typography={screenshot.typography} 
          dimensions={dimensions}
        />
      </head>
      <body>
        <ScreenshotContent options={options} />
      </body>
    </html>
  );
}

// Server-side rendering is handled by ./server.ts
