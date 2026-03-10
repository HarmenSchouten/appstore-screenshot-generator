/**
 * Preview Component
 * 
 * Instant, flicker-free preview using inline React rendering.
 * Uses the same isomorphic components as HTML export for WYSIWYG consistency.
 */

import { useState, useLayoutEffect, useRef, useMemo } from 'react';
import { ScreenshotContent } from '../../renderer-components/Screenshot';
import { FeatureGraphicContent } from '../../renderer-components/FeatureGraphic';
import { getBaseStylesCSS } from '../../renderer-components/BaseStyles';
import type { Screenshot, FeatureGraphic, ThemeConfig, AppConfig } from '../../renderer-components/types';

interface PreviewProps {
  type: 'screenshot' | 'feature-graphic';
  screenshot?: Screenshot;
  featureGraphic?: FeatureGraphic;
  theme: ThemeConfig;
  app: AppConfig;
  dimensions: { width: number; height: number };
}

export function Preview({ type, screenshot, featureGraphic, theme, app, dimensions }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [contentOpacity, setContentOpacity] = useState(1);

  const frameResizeTransition = 'width 120ms cubic-bezier(0.2, 0, 0, 1), height 120ms cubic-bezier(0.2, 0, 0, 1)';
  const contentSettleTransition = 'transform 100ms cubic-bezier(0.2, 0, 0, 1), opacity 80ms linear';

  // Tiny settle effect when switching between screenshot and feature graphic.
  useLayoutEffect(() => {
    setContentOpacity(0.96);
    const timeout = setTimeout(() => setContentOpacity(1), 16);
    return () => clearTimeout(timeout);
  }, [type]);

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

  // Generate CSS for the preview
  const baseCSS = useMemo(
    () => getBaseStylesCSS(theme, { scopeSelector: '.screenshot-preview' }),
    [theme]
  );
  
  // Typography CSS for screenshot
  const typographyCSS = useMemo(() => {
    if (type !== 'screenshot' || !screenshot?.typography) return '';
    
    const typo = screenshot.typography;
    const w = dimensions.width;
    const headlineFontSize = w * ((typo.headlineFontSize ?? 5.2) / 100);
    const subtitleFontSize = w * ((typo.subtitleFontSize ?? 2.4) / 100);
    const headlineFontWeight = typo.headlineFontWeight ?? 800;
    const subtitleFontWeight = typo.subtitleFontWeight ?? 500;
    const headlineLineHeight = typo.headlineLineHeight ?? 1.15;
    const textColor = typo.textColor ?? 'white';
    const textAlign = typo.textAlign ?? 'center';
    const horizontalPadding = typo.horizontalPadding ?? 6;
    
    return `
      .screenshot-preview .headline-area {
        text-align: ${textAlign};
        color: ${textColor};
        padding-left: ${horizontalPadding}%;
        padding-right: ${horizontalPadding}%;
      }
      
      .screenshot-preview .headline-area h1 {
        font-size: ${headlineFontSize}px;
        font-weight: ${headlineFontWeight};
        line-height: ${headlineLineHeight};
      }
      
      .screenshot-preview .headline-area p {
        font-size: ${subtitleFontSize}px;
        font-weight: ${subtitleFontWeight};
      }
    `;
  }, [type, screenshot?.typography, dimensions]);

  // Feature graphic specific CSS
  const featureGraphicCSS = useMemo(() => {
    if (type !== 'feature-graphic') return '';
    
    const fontUrl = theme.googleFontsUrl 
      ? `@import url('${theme.googleFontsUrl}');` 
      : '';
    
    return `
      ${fontUrl}
      
      .fg-preview .feature-graphic {
        width: 100%;
        height: 100%;
        background: ${theme.background.gradient};
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: 0 80px;
      }
      
      .fg-preview .glow {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        opacity: 0.5;
      }
      
      .fg-preview .content {
        flex: 1;
        z-index: 10;
      }
      
      .fg-preview .logo {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
      }
      
      .fg-preview .logo-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      
      .fg-preview .logo-icon img {
        object-fit: contain;
      }
      
      .fg-preview .app-name {
        font-size: 24px;
        font-weight: 700;
        color: white;
      }
      
      .fg-preview .content h1 {
        font-size: 48px;
        font-weight: 800;
        color: white;
        line-height: 1.1;
        margin-bottom: 16px;
        text-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }
      
      .fg-preview .content p {
        font-size: 20px;
        font-weight: 500;
        color: rgba(255,255,255,0.9);
        text-shadow: 0 2px 10px rgba(0,0,0,0.2);
      }
      
      .fg-preview .phone-container {
        position: absolute;
        right: 40px;
        top: 50%;
        z-index: 5;
        width: 200px;
      }
      
      .fg-preview .mascot {
        position: absolute;
        z-index: 20;
      }
      
      .fg-preview .mascot img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    `;
  }, [type, theme]);

  const width = type === 'feature-graphic' ? 1024 : dimensions.width;
  const height = type === 'feature-graphic' ? 500 : dimensions.height;

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

  const hasContent = type === 'screenshot' ? !!screenshot : !!featureGraphic;

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
          width: width * scale + 'px',
          height: height * scale + 'px',
          transition: frameResizeTransition,
        }}
      >
        {/* Isolated preview container */}
        <div
          className={type === 'screenshot' ? 'screenshot-preview' : 'fg-preview'}
          style={{
            width: width + 'px',
            height: height + 'px',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: contentOpacity,
            transition: contentSettleTransition,
            // Reset inherited styles
            fontFamily: theme.fontFamily,
          }}
        >
          {/* Inject styles */}
          <style dangerouslySetInnerHTML={{ __html: baseCSS + typographyCSS + featureGraphicCSS }} />
          
          {/* Render content */}
          {type === 'screenshot' && screenshot && (
            <ScreenshotContent
              options={{
                screenshot,
                theme,
                app,
                dimensions,
                assetUrlPrefix: '/assets/',
              }}
            />
          )}
          
          {type === 'feature-graphic' && featureGraphic && (
            <FeatureGraphicContent
              options={{
                featureGraphic,
                theme,
                app,
                assetUrlPrefix: '/assets/',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
