/**
 * Phone Frame Component
 * 
 * Renders an iOS-style phone mockup with screenshot.
 * Uses inline styles scaled proportionally to the phone size.
 */

import React from 'react';
import type { Screenshot } from './types.ts';
import { assetUrl } from './utils.ts';

interface PhoneFrameProps {
  imageUrl: string;
  widthPercent: number;
  rotation?: number;
  extraStyles?: React.CSSProperties;
  /** Approximate pixel width for scaling calculations (default: 400) */
  pixelWidth?: number;
}

/**
 * Single Phone Frame with inline scaled styles
 */
export function PhoneFrame({ imageUrl, widthPercent, rotation = 0, extraStyles = {}, pixelWidth = 400 }: PhoneFrameProps): React.ReactElement {
  // Scale factor based on reference size of 400px
  const scale = pixelWidth / 400;
  
  // Scaled values - optimized for sleek modern iPhone look
  // Reference: 400px phone width
  const frameRadius = Math.round(24 * scale);   // 6% of width - subtle outer corner
  const framePadding = Math.round(5 * scale);   // 1.25% of width - thin bezel
  const screenRadius = Math.round(18 * scale);  // 4.5% of width - screen corners
  const buttonWidth = Math.max(2, Math.round(3 * scale));  // visible but subtle buttons
  
  const containerStyle: React.CSSProperties = {
    width: `${widthPercent}%`,
    ...(rotation !== 0 && { transform: `rotate(${rotation}deg)` }),
    ...extraStyles,
  };
  
  const frameStyle: React.CSSProperties = {
    position: 'relative',
    background: 'linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 100%)',
    borderRadius: `${frameRadius}px`,
    padding: `${framePadding}px`,
    boxShadow: `0 ${20 * scale}px ${40 * scale}px rgba(0, 0, 0, 0.4), 0 0 0 ${Math.max(1, Math.round(scale))}px rgba(80, 80, 85, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)`,
  };
  
  const screenStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: '9 / 19.5',
    background: '#000',
    borderRadius: `${screenRadius}px`,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  // Side button styles - subtle and proportional
  const powerButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: `-${buttonWidth}px`,
    top: '22%',
    width: `${buttonWidth}px`,
    height: '5%',
    background: 'linear-gradient(90deg, #3a3a3e 0%, #2a2a2e 100%)',
    borderRadius: `0 ${Math.max(1, buttonWidth / 2)}px ${Math.max(1, buttonWidth / 2)}px 0`,
  };
  
  const volumeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    left: `-${buttonWidth}px`,
    top: '16%',
    width: `${buttonWidth}px`,
    height: '2%',
    background: 'linear-gradient(270deg, #3a3a3e 0%, #2a2a2e 100%)',
    borderRadius: `${Math.max(1, buttonWidth / 2)}px 0 0 ${Math.max(1, buttonWidth / 2)}px`,
  };
  
  const volumeButton2Style: React.CSSProperties = {
    ...volumeButtonStyle,
    top: '22%',
    height: '4%',
  };
  
  const volumeButton3Style: React.CSSProperties = {
    ...volumeButtonStyle,
    top: '29%',
    height: '4%',
  };
  
  return (
    <div style={containerStyle}>
      <div style={frameStyle}>
        {/* Side buttons */}
        <div style={powerButtonStyle} />
        <div style={volumeButtonStyle} />
        <div style={volumeButton2Style} />
        <div style={volumeButton3Style} />
        
        <div style={screenStyle}>
          {imageUrl ? (
            <img src={imageUrl} alt="Screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }} />
          )}
        </div>
      </div>
    </div>
  );
}

interface PhonesProps {
  screenshot: Screenshot;
  assetUrlPrefix?: string;
  /** Container width in pixels for scaling calculations */
  containerWidth?: number;
}

/**
 * Phone Area (Single or Dual Phones)
 */
export function Phones({ screenshot, assetUrlPrefix = '/assets/', containerWidth = 1290 }: PhonesProps): React.ReactElement {
  const isDual = Array.isArray(screenshot.imagePath);
  const images = isDual ? screenshot.imagePath as string[] : [screenshot.imagePath as string];
  
  const phoneScale = screenshot.phoneFrame?.scale ?? (isDual ? 42 : 70);
  const bottomOffset = screenshot.phoneFrame?.bottomOffset ?? 6;
  const dualRotation = screenshot.phoneFrame?.dualRotation ?? 6;
  const dualGap = screenshot.phoneFrame?.dualGap ?? 2;
  
  // Calculate actual phone width in pixels
  const phonePixelWidth = Math.round(containerWidth * (phoneScale / 100));
  
  if (isDual) {
    return (
      <div className="phone-area" style={{ bottom: `${bottomOffset}%` }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-end', 
          gap: `${dualGap}%`, 
          width: '100%', 
          padding: '0 3%' 
        }}>
          {images.map((img, i) => (
            <PhoneFrame
              key={i}
              imageUrl={assetUrl(img, assetUrlPrefix)}
              widthPercent={phoneScale}
              pixelWidth={phonePixelWidth}
              rotation={i === 0 ? -dualRotation : dualRotation}
              extraStyles={{
                zIndex: i === 0 ? 1 : 2,
                ...(i === 0 ? { marginRight: '-2%' } : { marginLeft: '-2%' }),
              }}
            />
          ))}
        </div>
      </div>
    );
  }
  
  const horizontalPadding = (100 - phoneScale) / 2;
  
  return (
    <div className="phone-area" style={{ 
      bottom: `${bottomOffset}%`,
      paddingLeft: `${horizontalPadding}%`,
      paddingRight: `${horizontalPadding}%`,
    }}>
      <PhoneFrame
        imageUrl={assetUrl(images[0], assetUrlPrefix)}
        widthPercent={100}
        pixelWidth={phonePixelWidth}
      />
    </div>
  );
}
