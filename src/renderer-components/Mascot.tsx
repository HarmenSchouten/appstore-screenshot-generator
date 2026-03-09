/**
 * Mascot Component
 * 
 * Renders a character mascot overlay on screenshots.
 */

import React from 'react';
import type { MascotOptions, AppConfig } from './types.ts';
import { assetUrl } from './utils.ts';

interface MascotProps {
  mascot: MascotOptions | null | undefined;
  app: AppConfig;
  assetUrlPrefix: string;
}

/**
 * Mascot Character
 */
export function Mascot({ mascot, app, assetUrlPrefix }: MascotProps): React.ReactElement | null {
  if (!mascot) return null;
  
  const size = mascot.size ?? 8; // percentage of container width
  const offset = mascot.offset ?? 20; // pixels from edge
  const borderRadius = mascot.borderRadius ?? 0;
  
  const imagePath = mascot.imagePath || app.defaultMascotPath;
  if (!imagePath) return null;
  
  const positionStyle: React.CSSProperties = {
    ...(mascot.position.includes('bottom') && { bottom: offset }),
    ...(mascot.position.includes('top') && { top: offset }),
    ...(mascot.position.includes('right') && { right: offset }),
    ...(mascot.position.includes('left') && { left: offset }),
  };
  
  const containerStyle: React.CSSProperties = {
    width: `${size}%`,
    aspectRatio: '1',
    overflow: 'hidden',
    ...positionStyle,
    ...(borderRadius > 0 && { borderRadius: `${borderRadius}%` }),
  };
  
  return (
    <div className="mascot" style={containerStyle}>
      <img 
        src={assetUrl(imagePath, assetUrlPrefix)} 
        alt="Mascot"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}
