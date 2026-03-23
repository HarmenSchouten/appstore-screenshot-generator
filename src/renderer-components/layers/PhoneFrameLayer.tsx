/**
 * PhoneFrameLayer — renders a device-preset driven phone mockup
 * positioned absolutely inside the screenshot container.
 *
 * Contains the single source of truth for phone frame rendering.
 * Also exports a standalone PhoneFrame for non-layer contexts (e.g. FeatureGraphic).
 */

import React from "react";
import {
  DEVICE_PRESET_REFERENCE_WIDTH,
  getDevicePreset,
} from "../../device-presets/index.ts";
import type { DevicePresetId } from "../../types/device.ts";
import type { PhoneFrameLayerProps } from "../../types.ts";
import { assetUrl } from "../utils.ts";

interface PhoneFrameLayerRenderProps extends PhoneFrameLayerProps {
  /** Prefix for resolving asset paths (e.g. "/assets/" in preview) */
  assetUrlPrefix?: string;
  /** Screenshot container width in pixels — used to scale geometry correctly */
  containerWidth?: number;
}

export const PhoneFrameLayer = ({
  model,
  imagePath,
  scale = 70,
  posX,
  posY,
  rotation,
  opacity,
  assetUrlPrefix = "/assets/",
  containerWidth = 1290,
}: PhoneFrameLayerRenderProps) => {
  const imageUrl = assetUrl(imagePath, assetUrlPrefix);
  const pixelWidth = Math.round(containerWidth * (scale / 100));

  return (
    <div
      style={{
        position: "absolute",
        left: `${posX}%`,
        top: `${posY}%`,
        transform: `translate(-50%, -50%)${
          rotation ? ` rotate(${rotation}deg)` : ""
        }`,
        width: `${scale}%`,
        opacity,
      }}
    >
      <PhoneFrameCore
        presetId={model}
        imageUrl={imageUrl}
        pixelWidth={pixelWidth}
      />
    </div>
  );
};

// ── Standalone PhoneFrame (for FeatureGraphic etc.) ─────────

interface PhoneFrameProps {
  imageUrl: string;
  presetId: DevicePresetId;
  widthPercent: number;
  rotation?: number;
  extraStyles?: React.CSSProperties;
  pixelWidth?: number;
}

export function PhoneFrame({
  imageUrl,
  presetId,
  widthPercent,
  rotation = 0,
  extraStyles = {},
  pixelWidth = DEVICE_PRESET_REFERENCE_WIDTH,
}: PhoneFrameProps): React.ReactElement {
  const containerStyle: React.CSSProperties = {
    width: `${widthPercent}%`,
    ...(rotation !== 0 && { transform: `rotate(${rotation}deg)` }),
    ...extraStyles,
  };

  return (
    <div style={containerStyle}>
      <PhoneFrameCore
        presetId={presetId}
        imageUrl={imageUrl}
        pixelWidth={pixelWidth}
      />
    </div>
  );
}

// ── Core frame rendering ────────────────────────────────────

interface PhoneFrameCoreProps {
  presetId: DevicePresetId;
  imageUrl: string;
  pixelWidth: number;
}

function PhoneFrameCore({
  presetId,
  imageUrl,
  pixelWidth,
}: PhoneFrameCoreProps): React.ReactElement {
  const preset = getDevicePreset(presetId);
  const s = pixelWidth / DEVICE_PRESET_REFERENCE_WIDTH;
  const frameBorderWidth = Math.max(
    1,
    (preset.material.borderWidth ?? 1) * s,
  );
  const faceInset = (preset.material.faceInset ?? 0) * s;
  const faceBorderWidth = preset.material.faceBorderColor
    ? Math.max(1, (preset.material.faceBorderWidth ?? 1) * s)
    : 0;
  const innerInset = Math.max(1, frameBorderWidth);
  const innerBorderWidth = Math.max(1, Math.round(s));

  // ── Frame styles ──────────────────────────────────────────

  const frameStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    aspectRatio: `${DEVICE_PRESET_REFERENCE_WIDTH} / ${preset.bodyHeight}`,
    background: preset.material.frameFill,
    borderRadius: `${preset.outerRadius * s}px`,
    boxShadow: preset.material.shadow,
    border: preset.material.borderColor
      ? `${frameBorderWidth}px solid ${preset.material.borderColor}`
      : undefined,
  };

  const frameFaceStyle: React.CSSProperties | null = preset.material.faceFill
    ? {
      position: "absolute",
      inset: `${faceInset}px`,
      borderRadius: `${Math.max((preset.outerRadius * s) - faceInset, 0)}px`,
      background: preset.material.faceFill,
      border: preset.material.faceBorderColor
        ? `${faceBorderWidth}px solid ${preset.material.faceBorderColor}`
        : undefined,
      boxShadow: preset.material.faceShadow,
      pointerEvents: "none",
    }
    : null;

  const frameInnerStyle: React.CSSProperties | null =
    preset.material.innerFill || preset.material.innerBorderColor
      ? {
        position: "absolute",
        inset: `${innerInset}px`,
        borderRadius: `${
          Math.max((preset.outerRadius * s) - innerInset, 0)
        }px`,
        background: preset.material.innerFill,
        border: preset.material.innerBorderColor
          ? `${innerBorderWidth}px solid ${preset.material.innerBorderColor}`
          : undefined,
        pointerEvents: "none",
      }
      : null;

  const topHighlightStyle: React.CSSProperties | null =
    preset.material.topHighlight
      ? {
        position: "absolute",
        inset: `${innerInset}px`,
        borderRadius: `${
          Math.max((preset.outerRadius * s) - innerInset, 0)
        }px`,
        background: preset.material.topHighlight,
        pointerEvents: "none",
      }
      : null;

  // ── Screen ────────────────────────────────────────────────

  const screenStyle: React.CSSProperties = {
    position: "absolute",
    top: `${preset.screen.top * s}px`,
    right: `${preset.screen.right * s}px`,
    bottom: `${preset.screen.bottom * s}px`,
    left: `${preset.screen.left * s}px`,
    background: "#000",
    borderRadius: `${preset.screen.radius * s}px`,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: preset.material.screenShadow,
  };

  const screenImageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  // ── Buttons ───────────────────────────────────────────────

  const buttonFill = preset.material.buttonFill ??
    "linear-gradient(90deg, #4a4b52 0%, #22242a 100%)";

  const renderButton = (
    index: number,
    button: NonNullable<typeof preset.buttons>[number],
  ): React.ReactElement => {
    const isLeft = button.side === "left";
    const offset = button.offset * s;
    const r = button.radius * s;
    const br = isLeft ? `${r}px 0 0 ${r}px` : `0 ${r}px ${r}px 0`;

    // Metallic surface: bright catch on the outer face, fading toward the frame
    const outerCatch = `linear-gradient(${
      isLeft ? "90deg" : "270deg"
    }, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 40%, transparent 100%)`;
    const topEdge =
      "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 20%)";
    const bg = button.background ?? `${outerCatch}, ${topEdge}, ${buttonFill}`;

    // Scale-aware shadow values — no hard border, just soft depth
    const sp = Math.max(0.5, 0.5 * s);
    const bp = Math.max(1, s);

    return (
      <div
        key={index}
        style={{
          position: "absolute",
          top: `${button.top * s}px`,
          [isLeft ? "left" : "right"]: `${-offset}px`,
          width: `${button.width * s}px`,
          height: `${button.height * s}px`,
          background: bg,
          boxShadow: [
            // Drop shadow on outer face
            isLeft
              ? `-${sp}px 0 ${bp}px rgba(0,0,0,0.28)`
              : `${sp}px 0 ${bp}px rgba(0,0,0,0.28)`,
            // Subtle vertical edge definition
            `0 ${sp}px ${sp}px rgba(0,0,0,0.10)`,
            // Inset light catch along outer edge
            isLeft
              ? `inset -${sp}px 0 0 rgba(255,255,255,0.10)`
              : `inset ${sp}px 0 0 rgba(255,255,255,0.10)`,
            // Inset dark seam on inner edge (where button meets the frame)
            isLeft
              ? `inset ${sp}px 0 0 rgba(0,0,0,0.18)`
              : `inset -${sp}px 0 0 rgba(0,0,0,0.18)`,
          ].join(", "),
          borderRadius: br,
        }}
      />
    );
  };

  // ── Cutout ────────────────────────────────────────────────

  const cutout = preset.cutout;

  const cutoutStyle: React.CSSProperties | null = cutout
    ? cutout.type === "dynamic-island"
      ? {
        position: "absolute",
        top: `${cutout.top * s}px`,
        left: "50%",
        transform: "translateX(-50%)",
        width: `${(cutout.width ?? 0) * s}px`,
        height: `${(cutout.height ?? 0) * s}px`,
        borderRadius: `${(cutout.radius ?? 0) * s}px`,
        background: cutout.background ?? "#050505",
        border: cutout.borderColor
          ? `${
            Math.max(1, (cutout.borderWidth ?? 1) * s)
          }px solid ${cutout.borderColor}`
          : undefined,
        boxShadow: cutout.shadow ?? "inset 0 1px 0 rgba(255,255,255,0.06)",
        zIndex: 2,
      }
      : cutout.type === "hole-punch"
      ? {
        position: "absolute",
        top: `${cutout.top * s}px`,
        left: "50%",
        transform: "translateX(-50%)",
        width: `${(cutout.diameter ?? 0) * s}px`,
        height: `${(cutout.diameter ?? 0) * s}px`,
        borderRadius: "999px",
        background: cutout.background ?? "#000",
        border: cutout.borderColor
          ? `${
            Math.max(1, (cutout.borderWidth ?? 1) * s)
          }px solid ${cutout.borderColor}`
          : undefined,
        boxShadow: cutout.shadow ??
          "0 0 0 1px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.04)",
        zIndex: 2,
      }
      : null
    : null;

  // ── Render ────────────────────────────────────────────────

  return (
    <div style={frameStyle}>
      {preset.buttons?.map((
        button: NonNullable<typeof preset.buttons>[number],
        index: number,
      ) => renderButton(index, button))}
      {frameFaceStyle && <div style={frameFaceStyle} />}
      {frameInnerStyle && <div style={frameInnerStyle} />}
      {topHighlightStyle && <div style={topHighlightStyle} />}

      <div style={screenStyle}>
        {cutoutStyle && <div style={cutoutStyle} />}
        {imageUrl
          ? <img src={imageUrl} alt="Screenshot" style={screenImageStyle} />
          : (
            <div
              style={{ width: "100%", height: "100%", background: "#1a1a1a" }}
            />
          )}
      </div>
    </div>
  );
}
