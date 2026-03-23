/**
 * Screenshot Component
 *
 * Main isomorphic component for rendering app store screenshots.
 * Works identically in browser preview and server-side HTML generation.
 */

import React from "react";
import type { RenderOptions } from "./types.ts";
import { getBaseStylesCSS } from "./BaseStyles.tsx";
import {
  BackgroundLayer,
  GlowLayer,
  ImageLayer,
  PhoneFrameLayer,
  ShapeLayer,
  TextLayer,
} from "@renderer/layers/index.tsx";
import { Layer } from "../types.ts";
import type { ThemeConfig } from "../types/theme.ts";

interface ScreenshotProps {
  options: RenderOptions;
}

/**
 * Screenshot Content (without HTML wrapper)
 *
 * Use this for client-side preview where you already have a document.
 */
export function ScreenshotContent(
  { options }: ScreenshotProps,
): React.ReactElement {
  const {
    screenshot,
    assetUrlPrefix = "/assets/",
  } = options;

  return (
    <div className="screenshot">
      {screenshot.layers.map((l) => (
        <ScreenshotLayer
          key={l.id}
          layer={l}
          theme={options.theme}
          assetUrlPrefix={assetUrlPrefix}
          containerWidth={options.dimensions.width}
        />
      ))}
    </div>
  );
}

const ScreenshotLayer = (
  { layer, theme, assetUrlPrefix, containerWidth }: {
    layer: Layer;
    theme: ThemeConfig;
    assetUrlPrefix: string;
    containerWidth: number;
  },
) => {
  switch (layer.type) {
    case "background":
      return <BackgroundLayer {...layer} theme={theme} />;
    case "text":
      return <TextLayer {...layer} />;
    case "phone-frame":
      return (
        <PhoneFrameLayer
          {...layer}
          assetUrlPrefix={assetUrlPrefix}
          containerWidth={containerWidth}
        />
      );
    case "image":
      return <ImageLayer {...layer} assetUrlPrefix={assetUrlPrefix} />;
    case "glow":
      return (
        <GlowLayer
          {...layer}
          containerWidth={containerWidth}
        />
      );
    case "shape":
      return <ShapeLayer {...layer} />;
    default:
      return null;
  }
};

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
        <meta
          name="viewport"
          content={`width=${dimensions.width}, height=${dimensions.height}`}
        />
        <meta name="screenshot-role" content={screenshot.role} />
        <title>{`${app.name} - ${screenshot.id}`}</title>
        <style dangerouslySetInnerHTML={{ __html: getBaseStylesCSS(theme) }} />
      </head>
      <body>
        <ScreenshotContent options={options} />
      </body>
    </html>
  );
}

// Server-side rendering is handled by ./server.ts
