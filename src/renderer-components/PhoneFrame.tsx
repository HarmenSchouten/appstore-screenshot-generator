/**
 * Phone Frame Component
 * 
 * Renders a device-preset driven phone mockup with screenshot.
 * Uses reference-width geometry so preview and export stay in sync.
 */

import React from 'react';
import {
  DEVICE_PRESET_REFERENCE_WIDTH,
  getDevicePreset,
  resolveScreenshotDevicePresetId,
} from '../device-presets/index.ts';
import type { DevicePresetId, Platform, Screenshot } from './types.ts';
import { assetUrl } from './utils.ts';

interface PhoneFrameProps {
  imageUrl: string;
  presetId: DevicePresetId;
  widthPercent: number;
  rotation?: number;
  extraStyles?: React.CSSProperties;
  /** Approximate pixel width for scaling calculations (default: reference width) */
  pixelWidth?: number;
}

/**
 * Single Phone Frame with inline scaled styles
 */
export function PhoneFrame({
  imageUrl,
  presetId,
  widthPercent,
  rotation = 0,
  extraStyles = {},
  pixelWidth = DEVICE_PRESET_REFERENCE_WIDTH,
}: PhoneFrameProps): React.ReactElement {
  const preset = getDevicePreset(presetId);
  const scale = pixelWidth / DEVICE_PRESET_REFERENCE_WIDTH;
  const frameBorderWidth = Math.max(1, (preset.material.borderWidth ?? 1) * scale);
  const faceInset = (preset.material.faceInset ?? 0) * scale;
  const faceBorderWidth = preset.material.faceBorderColor
    ? Math.max(1, (preset.material.faceBorderWidth ?? 1) * scale)
    : 0;
  const innerInset = Math.max(1, frameBorderWidth);
  const innerBorderWidth = Math.max(1, Math.round(scale));

  const containerStyle: React.CSSProperties = {
    width: `${widthPercent}%`,
    ...(rotation !== 0 && { transform: `rotate(${rotation}deg)` }),
    ...extraStyles,
  };

  const frameStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: `${DEVICE_PRESET_REFERENCE_WIDTH} / ${preset.bodyHeight}`,
    background: preset.material.frameFill,
    borderRadius: `${preset.outerRadius * scale}px`,
    boxShadow: preset.material.shadow,
    border: preset.material.borderColor ? `${frameBorderWidth}px solid ${preset.material.borderColor}` : undefined,
  };

  const frameFaceStyle: React.CSSProperties | null = preset.material.faceFill
    ? {
        position: 'absolute',
        inset: `${faceInset}px`,
        borderRadius: `${Math.max((preset.outerRadius * scale) - faceInset, 0)}px`,
        background: preset.material.faceFill,
        border: preset.material.faceBorderColor ? `${faceBorderWidth}px solid ${preset.material.faceBorderColor}` : undefined,
        boxShadow: preset.material.faceShadow,
        pointerEvents: 'none',
      }
    : null;

  const frameInnerStyle: React.CSSProperties | null = preset.material.innerFill || preset.material.innerBorderColor
    ? {
        position: 'absolute',
        inset: `${innerInset}px`,
        borderRadius: `${Math.max((preset.outerRadius * scale) - innerInset, 0)}px`,
        background: preset.material.innerFill,
        border: preset.material.innerBorderColor ? `${innerBorderWidth}px solid ${preset.material.innerBorderColor}` : undefined,
        pointerEvents: 'none',
      }
    : null;

  const topHighlightStyle: React.CSSProperties | null = preset.material.topHighlight
    ? {
        position: 'absolute',
        inset: `${innerInset}px`,
        borderRadius: `${Math.max((preset.outerRadius * scale) - innerInset, 0)}px`,
        background: preset.material.topHighlight,
        pointerEvents: 'none',
      }
    : null;

  const screenStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${preset.screen.top * scale}px`,
    right: `${preset.screen.right * scale}px`,
    bottom: `${preset.screen.bottom * scale}px`,
    left: `${preset.screen.left * scale}px`,
    background: '#000',
    borderRadius: `${preset.screen.radius * scale}px`,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: preset.material.screenShadow,
  };

  const screenImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  const buttonFill = preset.material.buttonFill ?? 'linear-gradient(90deg, #4a4b52 0%, #22242a 100%)';

  const renderButton = (index: number, button: NonNullable<typeof preset.buttons>[number]): React.ReactElement => {
    const isLeft = button.side === 'left';
    const offset = button.offset * scale;
    const r = button.radius * scale;
    const br = isLeft ? `${r}px 0 0 ${r}px` : `0 ${r}px ${r}px 0`;
    // Directional highlight layered over the solid button fill so the button is never transparent
    const highlight = `linear-gradient(${isLeft ? '90deg' : '270deg'}, transparent 0%, rgba(255,255,255,0.10) 100%)`;
    const bg = button.background ?? `${highlight}, ${buttonFill}`;

    return (
      <div
        key={index}
        style={{
          position: 'absolute',
          top: `${button.top * scale}px`,
          [isLeft ? 'left' : 'right']: `${-offset}px`,
          width: `${button.width * scale}px`,
          height: `${button.height * scale}px`,
          background: bg,
          border: '0.5px solid rgba(0,0,0,0.35)',
          boxShadow: [
            // Light catch on the outer face of the button
            isLeft ? 'inset -1px 0 0 rgba(255,255,255,0.15)' : 'inset 1px 0 0 rgba(255,255,255,0.15)',
            // Drop shadow away from frame
            isLeft ? '-1px 0 2px rgba(0,0,0,0.25)' : '1px 0 2px rgba(0,0,0,0.25)',
          ].join(', '),
          borderRadius: br,
        }}
      />
    );
  };

  const cutout = preset.cutout;

  const cutoutStyle: React.CSSProperties | null = cutout
    ? cutout.type === 'dynamic-island'
      ? {
          position: 'absolute',
          top: `${cutout.top * scale}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${(cutout.width ?? 0) * scale}px`,
          height: `${(cutout.height ?? 0) * scale}px`,
          borderRadius: `${(cutout.radius ?? 0) * scale}px`,
          background: cutout.background ?? '#050505',
          border: cutout.borderColor
            ? `${Math.max(1, (cutout.borderWidth ?? 1) * scale)}px solid ${cutout.borderColor}`
            : undefined,
          boxShadow: cutout.shadow ?? 'inset 0 1px 0 rgba(255,255,255,0.06)',
          zIndex: 2,
        }
      : cutout.type === 'hole-punch'
        ? {
            position: 'absolute',
            top: `${cutout.top * scale}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${(cutout.diameter ?? 0) * scale}px`,
            height: `${(cutout.diameter ?? 0) * scale}px`,
            borderRadius: '999px',
            background: cutout.background ?? '#000',
            border: cutout.borderColor
              ? `${Math.max(1, (cutout.borderWidth ?? 1) * scale)}px solid ${cutout.borderColor}`
              : undefined,
            boxShadow: cutout.shadow ?? '0 0 0 1px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.04)',
            zIndex: 2,
          }
        : null
    : null;
  
  return (
    <div style={containerStyle}>
      <div style={frameStyle}>
        {preset.buttons?.map((button: NonNullable<typeof preset.buttons>[number], index: number) => renderButton(index, button))}
        {frameFaceStyle && <div style={frameFaceStyle} />}
        {frameInnerStyle && <div style={frameInnerStyle} />}
        {topHighlightStyle && <div style={topHighlightStyle} />}

        <div style={screenStyle}>
          {cutoutStyle && <div style={cutoutStyle} />}
          {imageUrl ? (
            <img src={imageUrl} alt="Screenshot" style={screenImageStyle} />
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
  platform: Platform;
  defaultDevicePresetId: DevicePresetId;
  assetUrlPrefix?: string;
  /** Container width in pixels for scaling calculations */
  containerWidth?: number;
}

/**
 * Phone Area (Single or Dual Phones)
 */
export function Phones({
  screenshot,
  platform,
  defaultDevicePresetId,
  assetUrlPrefix = '/assets/',
  containerWidth = 1290,
}: PhonesProps): React.ReactElement {
  const isDual = Array.isArray(screenshot.imagePath);
  const images = isDual ? screenshot.imagePath as string[] : [screenshot.imagePath as string];

  const phoneScale = screenshot.phoneFrame?.scale ?? (isDual ? 42 : 70);
  const bottomOffset = screenshot.phoneFrame?.bottomOffset ?? 6;
  const dualRotation = screenshot.phoneFrame?.dualRotation ?? 6;
  const dualGap = screenshot.phoneFrame?.dualGap ?? 2;
  const presetId = resolveScreenshotDevicePresetId(platform, defaultDevicePresetId, screenshot.phoneFrame);

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
              presetId={presetId}
              widthPercent={phoneScale}
              pixelWidth={phonePixelWidth}
              rotation={i === 0 ? -dualRotation : dualRotation}
              extraStyles={{
                flexShrink: 0,
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
        presetId={presetId}
        widthPercent={100}
        pixelWidth={phonePixelWidth}
      />
    </div>
  );
}
