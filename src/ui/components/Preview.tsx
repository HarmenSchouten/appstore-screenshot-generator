/**
 * Preview Component
 *
 * Instant, flicker-free preview using inline React rendering.
 * Uses the same isomorphic components as HTML export for WYSIWYG consistency.
 */

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ScreenshotContent } from "../../renderer-components/Screenshot.tsx";
import type {
  AppConfig,
  DevicePresetId,
  Platform,
  Screenshot,
  ThemeConfig,
} from "../../renderer-components/types.ts";

interface PreviewProps {
  screenshot?: Screenshot;
  theme: ThemeConfig;
  app: AppConfig;
  platform: Platform;
  defaultDevicePresetId: DevicePresetId;
  dimensions: { width: number; height: number };
}

export function Preview(
  { screenshot, theme, app, platform, defaultDevicePresetId, dimensions }:
    PreviewProps,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [contentOpacity, setContentOpacity] = useState(1);

  const frameResizeTransition =
    "width 120ms cubic-bezier(0.2, 0, 0, 1), height 120ms cubic-bezier(0.2, 0, 0, 1)";
  const contentSettleTransition =
    "transform 100ms cubic-bezier(0.2, 0, 0, 1), opacity 80ms linear";

  // Tiny settle effect when switching between screenshot and feature graphic.
  useLayoutEffect(() => {
    setContentOpacity(0.96);
    const timeout = setTimeout(() => setContentOpacity(1), 16);
    return () => clearTimeout(timeout);
  }, [screenshot]);

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

  const width = screenshot?.role === "feature-graphic"
    ? 1024
    : dimensions.width;
  const height = screenshot?.role === "feature-graphic"
    ? 500
    : dimensions.height;

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

  const hasContent = !!screenshot;

  if (!hasContent) {
    return (
      <div className="text-zinc-500">
        No preview available
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
    >
      <div
        className="relative bg-black rounded-lg overflow-hidden shadow-2xl"
        style={{
          width: width * scale + "px",
          height: height * scale + "px",
          transition: frameResizeTransition,
        }}
      >
        {/* Isolated preview container */}
        <div
          className={screenshot?.role === "screenshot"
            ? "screenshot-preview"
            : "fg-preview"}
          style={{
            width: width + "px",
            height: height + "px",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
            opacity: contentOpacity,
            transition: contentSettleTransition,
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
              dimensions,
              assetUrlPrefix: "/assets/",
            }}
          />
        </div>
      </div>
    </div>
  );
}
