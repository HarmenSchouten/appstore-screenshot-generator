/**
 * Screenshot Component
 *
 * Main isomorphic component for rendering app store screenshots.
 * Works identically in browser preview and server-side HTML generation.
 */

import React from "react";
import type { RenderOptions } from "./types.ts";
import { BaseStyles } from "./BaseStyles.tsx";
import {
  BackgroundLayer,
  PhoneFrameLayer,
  TextBlockLayer,
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
  } = options;

  return (
    <div className="screenshot">
      {screenshot.layers.map((l) => (
        <ScreenshotLayer
          key={l.id}
          layer={l}
          theme={options.theme}
        />
      ))}
      {/* Glow Effects */}
      {
        /* {screenshot.glows.map((glow, index) => (
        <Glow key={index} glow={glow} containerWidth={dimensions.width} />
      ))} */
      }

      {/* Decorative Shapes */}
      {/* <Shapes shapes={screenshot.shapes} /> */}

      {/* Headline */}
      {
        /* <div
        className="headline-area"
        style={{ top: `${screenshot.headlineOffset ?? 0}%` }}
      >
        <h1>{screenshot.headline}</h1>
        <p>{screenshot.subtitle}</p>
      </div> */
      }

      {/* Phone Mockups */}
      {
        /* <Phones
        screenshot={screenshot}
        platform={platform}
        defaultDevicePresetId={defaultDevicePresetId}
        assetUrlPrefix={assetUrlPrefix}
        containerWidth={dimensions.width}
      /> */
      }

      {/* Mascot */}
      {
        /* <Mascot
        mascot={screenshot.mascot}
        app={app}
        assetUrlPrefix={assetUrlPrefix}
      /> */
      }
    </div>
  );
}

const ScreenshotLayer = (
  { layer, theme }: { layer: Layer; theme: ThemeConfig },
) => {
  switch (layer.type) {
    case "background":
      return <BackgroundLayer {...layer} theme={theme} />;
    case "text":
      return <TextLayer {...layer} />;
    case "text-block":
      return <TextBlockLayer {...layer} />;
    case "phone-frame":
      return <PhoneFrameLayer {...layer} />;
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
