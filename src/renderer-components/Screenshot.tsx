/**
 * Screenshot Component
 *
 * Main isomorphic component for rendering app store screenshots.
 * Works identically in browser preview and server-side HTML generation.
 */

import type { ReactElement } from "react";
import type { Layer, RenderOptions, ThemeConfig } from "@app-types";
import { assertNever } from "@lib";
import { getBaseStylesCSS } from "./BaseStyles.tsx";
import {
  BackgroundLayer,
  GlowLayer,
  ImageLayer,
  PhoneFrameLayer,
  ShapeLayer,
  TextLayer,
} from "./layers/index.tsx";

interface ScreenshotProps {
  options: RenderOptions;
}

interface ScreenshotContentProps extends ScreenshotProps {
  /**
   * Whether layers may animate. On in the preview; the export document turns
   * it off so a PNG never depends on when Chrome captured it.
   */
  animate?: boolean;
}

/**
 * Screenshot Content (without HTML wrapper)
 *
 * Use this for client-side preview where you already have a document.
 */
export function ScreenshotContent(
  { options, animate = true }: ScreenshotContentProps,
): ReactElement {
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
          defaultDevicePresetId={options.defaultDevicePresetId}
          animate={animate}
        />
      ))}
    </div>
  );
}

const ScreenshotLayer = (
  {
    layer,
    theme,
    assetUrlPrefix,
    containerWidth,
    defaultDevicePresetId,
    animate,
  }: {
    layer: Layer;
    theme: ThemeConfig;
    assetUrlPrefix: string;
    containerWidth: number;
    defaultDevicePresetId: RenderOptions["defaultDevicePresetId"];
    animate: boolean;
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
          defaultDevicePresetId={defaultDevicePresetId}
          animate={animate}
        />
      );
    case "image":
      return <ImageLayer {...layer} assetUrlPrefix={assetUrlPrefix} />;
    case "glow":
      return <GlowLayer {...layer} />;
    case "shape":
      return <ShapeLayer {...layer} />;
    default:
      return assertNever(layer);
  }
};

/**
 * Full Screenshot Document
 *
 * Use this for server-side rendering to generate complete HTML documents.
 * Includes <html>, <head>, <body> and all necessary styles.
 */
export function Screenshot({ options }: ScreenshotProps): ReactElement {
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
        <style dangerouslySetInnerHTML={{ __html: getBaseStylesCSS(theme) }} />
      </head>
      <body>
        <ScreenshotContent options={options} animate={false} />
      </body>
    </html>
  );
}
