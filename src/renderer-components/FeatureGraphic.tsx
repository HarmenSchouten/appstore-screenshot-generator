/**
 * Feature Graphic Component
 * 
 * Isomorphic component for rendering Google Play feature graphics (1024x500).
 */

import React from 'react';
import type { FeatureGraphicRenderOptions, GlowEffect } from './types.ts';
import { GLOW_COLORS } from './constants.ts';
import { Shapes } from './Shape.tsx';
import { Mascot } from './Mascot.tsx';
import { PhoneFrame } from './PhoneFrame.tsx';
import { assetUrl } from './utils.ts';

interface FeatureGraphicProps {
  options: FeatureGraphicRenderOptions;
}

/**
 * Feature Graphic Glow (uses different blur settings)
 */
function FeatureGlow({ glow }: { glow: GlowEffect }): React.ReactElement {
  const color = glow.color.startsWith('#') 
    ? glow.color 
    : (GLOW_COLORS[glow.color] || GLOW_COLORS.purple);

  // Keep glow sizing proportional to the 1024px feature-graphic width.
  const sizePercent = (glow.size / 1024) * 100;
  
  const style: React.CSSProperties = {
    position: 'absolute',
    borderRadius: '50%',
    width: `${sizePercent}%`,
    height: `${sizePercent}%`,
    background: color,
    filter: 'blur(60px)',
    opacity: 0.5,
    ...(glow.top && { top: glow.top }),
    ...(glow.right && { right: glow.right }),
    ...(glow.bottom && { bottom: glow.bottom }),
    ...(glow.left && { left: glow.left }),
  };
  
  return <div className="glow" style={style} />;
}

/**
 * Feature Graphic Content (without HTML wrapper)
 */
export function FeatureGraphicContent({ options }: FeatureGraphicProps): React.ReactElement {
  const { featureGraphic, app, assetUrlPrefix = '/assets/', defaultDevicePresetId } = options;
  
  const phoneRotation = featureGraphic.phoneRotation ?? 5;
  const phoneScale = featureGraphic.phoneScale ?? 100;
  const phoneX = featureGraphic.phoneX ?? 0;
  const phoneY = featureGraphic.phoneY ?? 0;
  const showIcon = featureGraphic.showIcon !== false;
  const showAppName = featureGraphic.showAppName !== false;
  
  // Icon box
  const iconBoxScale = featureGraphic.iconBoxScale ?? 100;
  const iconBoxRadius = featureGraphic.iconBoxRadius ?? 16;
  const iconBoxColor = featureGraphic.iconBoxColor || 'rgba(255,255,255,0.15)';
  const iconBoxSize = Math.round(64 * iconBoxScale / 100);
  
  // Icon image
  const iconScale = featureGraphic.iconScale ?? 100;
  const iconRadius = featureGraphic.iconRadius ?? 0;
  const iconOffsetX = featureGraphic.iconOffsetX ?? 0;
  const iconOffsetY = featureGraphic.iconOffsetY ?? 0;
  const iconImgSize = Math.round(48 * iconBoxScale / 100 * iconScale / 100);
  
  return (
    <div className="feature-graphic">
      {/* Glow Effects */}
      {featureGraphic.glows.map((glow, index) => (
        <FeatureGlow key={index} glow={glow} />
      ))}
      
      {/* Decorative Shapes */}
      <Shapes shapes={featureGraphic.shapes} />
      
      {/* Content */}
      <div className="content">
        {(showIcon || showAppName) && (
          <div className="logo">
            {showIcon && app.iconPath && (
              <div 
                className="logo-icon"
                style={{
                  width: iconBoxSize,
                  height: iconBoxSize,
                  background: iconBoxColor,
                  borderRadius: iconBoxRadius,
                }}
              >
                <img 
                  src={assetUrl(app.iconPath, assetUrlPrefix)}
                  alt={`${app.name} icon`}
                  style={{
                    width: iconImgSize,
                    height: iconImgSize,
                    objectFit: 'contain',
                    borderRadius: iconRadius,
                    transform: `translate(${iconOffsetX}px, ${iconOffsetY}px)`,
                  }}
                />
              </div>
            )}
            {showAppName && (
              <span className="app-name">{app.name}</span>
            )}
          </div>
        )}
        
        <h1>{featureGraphic.headline}</h1>
        <p>{featureGraphic.subtitle}</p>
      </div>
      
      {/* Phone Preview */}
      <div 
        className="phone-container"
        style={{
          transform: `translateY(-50%) translate(${phoneX}%, ${phoneY}%)`,
        }}
      >
        <PhoneFrame
          imageUrl={assetUrl(featureGraphic.imagePath, assetUrlPrefix)}
          presetId={defaultDevicePresetId}
          widthPercent={100}
          pixelWidth={200}
          extraStyles={{
            transform: `rotate(${phoneRotation}deg) scale(${phoneScale / 100})`,
            transformOrigin: 'center center',
          }}
        />
      </div>
      
      {/* Mascot */}
      <Mascot mascot={featureGraphic.mascot} app={app} assetUrlPrefix={assetUrlPrefix} />
    </div>
  );
}

/**
 * Feature Graphic Styles
 */
function FeatureGraphicStyles({ theme }: { theme: FeatureGraphicRenderOptions['theme'] }): React.ReactElement {
  const fontUrl = theme.googleFontsUrl 
    ? `@import url('${theme.googleFontsUrl}');` 
    : '';
  
  const css = `
    ${fontUrl}
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 1024px; height: 500px; overflow: hidden; }
    body { font-family: ${theme.fontFamily}; }
    
    .feature-graphic {
      width: 100%;
      height: 100%;
      background: ${theme.background.gradient};
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      padding: 0 80px;
    }
    
    .glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.5;
    }
    
    .content {
      flex: 1;
      z-index: 10;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    .logo-icon img {
      object-fit: contain;
    }
    
    .app-name {
      font-size: 24px;
      font-weight: 700;
      color: white;
    }
    
    .content h1 {
      font-size: 48px;
      font-weight: 800;
      color: white;
      line-height: 1.1;
      margin-bottom: 16px;
      text-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    
    .content p {
      font-size: 20px;
      font-weight: 500;
      color: rgba(255,255,255,0.9);
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    
    .phone-container {
      position: absolute;
      right: 40px;
      top: 50%;
      z-index: 5;
      width: 200px;
    }
    
    .mascot {
      position: absolute;
      z-index: 20;
    }
    
    .mascot img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  `;
  
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

/**
 * Full Feature Graphic Document
 */
export function FeatureGraphic({ options }: FeatureGraphicProps): React.ReactElement {
  const { theme, app } = options;
  
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=1024, height=500" />
        <title>{`${app.name} - Feature Graphic`}</title>
        <FeatureGraphicStyles theme={theme} />
      </head>
      <body>
        <FeatureGraphicContent options={options} />
      </body>
    </html>
  );
}

// Server-side rendering is handled by ./server.ts
