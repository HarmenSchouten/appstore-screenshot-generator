/**
 * Preview Component
 *
 * Instant, flicker-free preview using inline React rendering.
 * Uses the same isomorphic components as HTML export for WYSIWYG consistency.
 */

import { memo, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from "react-zoom-pan-pinch";
import { selectNoOverlayOpen, useAppStore } from "@ui/store/index.ts";
import { useShortcut } from "@hooks";
import { ScreenshotContent } from "@renderer/Screenshot.tsx";
import { getBaseStylesCSS } from "@renderer/BaseStyles.tsx";
import { ZoomControls } from "./ZoomControls.tsx";
import { getScreenshotDimensions } from "@lib";
import type {
  AppBranding,
  DevicePresetId,
  Platform,
  Screenshot,
  ThemeConfig,
} from "@app-types";

function ZoomHotkeys() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const enabled = useAppStore(selectNoOverlayOpen);

  useShortcut("zoomIn", () => zoomIn(0.5), enabled);
  useShortcut("zoomOut", () => zoomOut(0.5), enabled);
  useShortcut("zoomReset", () => resetTransform(), enabled);

  return null;
}

interface PreviewProps {
  screenshot: Screenshot;
  theme: ThemeConfig;
  app: AppBranding;
  platform: Platform;
  defaultDevicePresetId: DevicePresetId;
  dimensions: { width: number; height: number };
}

function PreviewInner(
  { screenshot, theme, app, platform, defaultDevicePresetId, dimensions }:
    PreviewProps,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    width: 800,
    height: 600,
  });
  const [contentOpacity, setContentOpacity] = useState(1);

  const frameResizeTransition =
    "width 120ms cubic-bezier(0.2, 0, 0, 1), height 120ms cubic-bezier(0.2, 0, 0, 1)";

  // Tiny settle effect when switching between screenshot and feature graphic.
  // Keyed on the id, not the object: every edit produces a new screenshot,
  // so `[screenshot]` flashed the canvas on each slider tick (#64).
  useLayoutEffect(() => {
    setContentOpacity(0.96);
    const timeout = setTimeout(() => setContentOpacity(1), 16);
    return () => clearTimeout(timeout);
  }, [screenshot.id]);

  // Track container size for scale calculation.
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateContainerSize = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    };

    updateContainerSize();

    const observer = new ResizeObserver(updateContainerSize);
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Same dimensions export uses — phone-frame geometry scales from the
  // canvas width, so passing platform dimensions for a feature graphic
  // would render frames ~21% larger in preview than in the PNG (#60).
  const effectiveDimensions = getScreenshotDimensions(screenshot, dimensions);
  const { width, height } = effectiveDimensions;

  const scale = useMemo(() => {
    const availableWidth = containerSize.width - 40;
    const availableHeight = containerSize.height - 40;

    if (availableWidth <= 0 || availableHeight <= 0) {
      return 0.3;
    }

    const scaleX = availableWidth / width;
    const scaleY = availableHeight / height;
    return Math.max(0.1, Math.min(scaleX, scaleY));
  }, [containerSize, width, height]);

  // Scoped base CSS for the preview container (structural styles for
  // .screenshot — width, height, position, overflow, font resets).
  const scopeClass = screenshot.role === "screenshot"
    ? "screenshot-preview"
    : "fg-preview";
  const baseCSS = useMemo(
    () => getBaseStylesCSS(theme, { scopeSelector: `.${scopeClass}` }),
    [theme, scopeClass],
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: baseCSS }} />
      <TransformWrapper
        key={screenshot.id}
        initialScale={1}
        minScale={1}
        maxScale={5}
        centerOnInit
        limitToBounds
        doubleClick={{ mode: "reset" }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <ZoomHotkeys />
            <TransformComponent
              wrapperStyle={{ overflow: "visible" }}
            >
              <div
                className="relative bg-black rounded-lg overflow-hidden shadow-2xl"
                style={{
                  width: width * scale + "px",
                  height: height * scale + "px",
                  transition: frameResizeTransition,
                }}
              >
                {/* Isolated preview container — uses zoom for resolution-independent scaling */}
                <div
                  className={screenshot.role === "screenshot"
                    ? "screenshot-preview"
                    : "fg-preview"}
                  style={{
                    width: width + "px",
                    height: height + "px",
                    zoom: scale,
                    opacity: contentOpacity,
                    transition: "opacity 80ms linear",
                    // Reset inherited styles
                    fontFamily: theme.fontFamily,
                  }}
                >
                  {/* Render content */}
                  <ScreenshotContent
                    options={{
                      screenshot,
                      theme,
                      app,
                      platform,
                      defaultDevicePresetId,
                      dimensions: effectiveDimensions,
                      assetUrlPrefix: "/assets/",
                    }}
                  />
                </div>
              </div>
            </TransformComponent>

            <ZoomControls
              onZoomIn={() => zoomIn(0.5)}
              onZoomOut={() => zoomOut(0.5)}
              onReset={() => resetTransform()}
            />
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

/**
 * Memoised on its props; App passes stable `theme`, `app` and `dimensions`
 * references, so only a real screenshot change re-renders the canvas.
 */
export const Preview = memo(PreviewInner);
