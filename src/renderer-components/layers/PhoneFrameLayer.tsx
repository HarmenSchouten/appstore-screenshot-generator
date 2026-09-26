/**
 * PhoneFrameLayer — renders a device-preset driven phone mockup
 * positioned absolutely inside the screenshot container.
 *
 * Contains the single source of truth for phone frame rendering.
 */

import type { CSSProperties, ReactElement } from "react";
import {
  DEFAULT_MATERIAL,
  DEVICE_PRESET_REFERENCE_WIDTH,
  getDevicePreset,
} from "@device-presets";
import type {
  DeviceButtonPreset,
  DeviceCutoutPreset,
  DevicePreset,
  DevicePresetId,
  PhoneFrameLayerProps,
} from "@app-types";
import { assertNever, LAYER_DEFAULTS, withDefaults } from "@lib";
import { assetUrl } from "@renderer/utils.ts";
import { PositionedLayer } from "./PositionedLayer.tsx";

interface PhoneFrameLayerRenderProps extends PhoneFrameLayerProps {
  /** Prefix for resolving asset paths (e.g. "/assets/<projectId>/" in preview) */
  assetUrlPrefix?: string;
  /** Screenshot container width in pixels — used to scale geometry correctly.
   * Required: a fallback here would silently mask preview/export mismatches. */
  containerWidth: number;
  /** Preset rendered when the layer has no explicit `model`.
   * Required so preview and export can't resolve differently. */
  defaultDevicePresetId: DevicePresetId;
  /**
   * Off for export: the empty screen's pulse would make the PNG's opacity
   * depend on when Chrome captured it.
   */
  animate?: boolean;
}

export const PhoneFrameLayer = ({
  model,
  imagePath,
  scale = LAYER_DEFAULTS["phone-frame"].scale,
  assetUrlPrefix = "/assets/",
  containerWidth,
  defaultDevicePresetId,
  animate = true,
  ...position
}: PhoneFrameLayerRenderProps) => {
  const pixelWidth = Math.round(containerWidth * (scale / 100));

  return (
    <PositionedLayer layer={position} style={{ width: `${scale}%` }}>
      <PhoneFrameCore
        preset={getDevicePreset(model ?? defaultDevicePresetId)}
        imageUrl={assetUrl(imagePath, assetUrlPrefix)}
        pixelWidth={pixelWidth}
        animate={animate}
      />
    </PositionedLayer>
  );
};

// ── Core frame rendering ────────────────────────────────────

interface PhoneFrameCoreProps {
  preset: DevicePreset;
  imageUrl: string;
  pixelWidth: number;
  animate: boolean;
}

function PhoneFrameCore(
  { preset, imageUrl, pixelWidth, animate }: PhoneFrameCoreProps,
): ReactElement {
  const s = pixelWidth / DEVICE_PRESET_REFERENCE_WIDTH;
  const material = withDefaults(DEFAULT_MATERIAL, preset.material);
  const frameBorderWidth = Math.max(1, material.borderWidth * s);
  const faceInset = material.faceInset * s;
  const faceBorderWidth = material.faceBorderColor
    ? Math.max(1, material.faceBorderWidth * s)
    : 0;
  const innerInset = Math.max(1, frameBorderWidth);
  const outerRadius = preset.outerRadius * s;

  const frameStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    aspectRatio: `${DEVICE_PRESET_REFERENCE_WIDTH} / ${preset.bodyHeight}`,
    background: material.frameFill,
    borderRadius: `${outerRadius}px`,
    boxShadow: material.shadow,
    border: material.borderColor
      ? `${frameBorderWidth}px solid ${material.borderColor}`
      : undefined,
  };

  const frameFaceStyle: CSSProperties | null = material.faceFill
    ? {
      position: "absolute",
      inset: `${faceInset}px`,
      borderRadius: `${Math.max(outerRadius - faceInset, 0)}px`,
      background: material.faceFill,
      border: material.faceBorderColor
        ? `${faceBorderWidth}px solid ${material.faceBorderColor}`
        : undefined,
      boxShadow: material.faceShadow,
      pointerEvents: "none",
    }
    : null;

  const topHighlightStyle: CSSProperties | null = material.topHighlight
    ? {
      position: "absolute",
      inset: `${innerInset}px`,
      borderRadius: `${Math.max(outerRadius - innerInset, 0)}px`,
      background: material.topHighlight,
      pointerEvents: "none",
    }
    : null;

  const screenStyle: CSSProperties = {
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
  };

  const screenPixelWidth = pixelWidth -
    (preset.screen.left + preset.screen.right) * s;

  return (
    <div style={frameStyle}>
      {preset.buttons.map((button, index) => (
        <FrameButton
          key={index}
          button={button}
          scale={s}
          fill={material.buttonFill ?? material.frameFill}
        />
      ))}
      {frameFaceStyle && <div style={frameFaceStyle} />}
      {topHighlightStyle && <div style={topHighlightStyle} />}

      <div style={screenStyle}>
        {preset.cutout && <div style={cutoutStyle(preset.cutout, s)} />}
        {imageUrl
          ? (
            <img
              src={imageUrl}
              alt="Screenshot"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          )
          : <EmptyScreen screenWidth={screenPixelWidth} animate={animate} />}
      </div>
    </div>
  );
}

// ── Buttons ─────────────────────────────────────────────────

function FrameButton(
  { button, scale: s, fill }: {
    button: DeviceButtonPreset;
    scale: number;
    fill: string;
  },
): ReactElement {
  const isLeft = button.side === "left";
  const offset = button.offset * s;
  const r = button.radius * s;
  const borderRadius = isLeft ? `${r}px 0 0 ${r}px` : `0 ${r}px ${r}px 0`;

  // Metallic surface: bright catch on the outer face, fading toward the frame
  const outerCatch = `linear-gradient(${
    isLeft ? "90deg" : "270deg"
  }, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 40%, transparent 100%)`;
  const topEdge =
    "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 20%)";

  // Scale-aware shadow values — no hard border, just soft depth
  const sp = Math.max(0.5, 0.5 * s);
  const bp = Math.max(1, s);

  return (
    <div
      style={{
        position: "absolute",
        top: `${button.top * s}px`,
        [isLeft ? "left" : "right"]: `${-offset}px`,
        width: `${button.width * s}px`,
        height: `${button.height * s}px`,
        background: `${outerCatch}, ${topEdge}, ${fill}`,
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
        borderRadius,
      }}
    />
  );
}

// ── Cutout ──────────────────────────────────────────────────

function cutoutStyle(cutout: DeviceCutoutPreset, s: number): CSSProperties {
  const shared: CSSProperties = {
    position: "absolute",
    top: `${cutout.top * s}px`,
    left: "50%",
    transform: "translateX(-50%)",
    background: cutout.background,
    border: `${
      Math.max(1, cutout.borderWidth * s)
    }px solid ${cutout.borderColor}`,
    boxShadow: cutout.shadow,
    zIndex: 2,
  };
  switch (cutout.type) {
    case "dynamic-island":
      return {
        ...shared,
        width: `${cutout.width * s}px`,
        height: `${cutout.height * s}px`,
        borderRadius: `${cutout.radius * s}px`,
      };
    case "hole-punch":
      return {
        ...shared,
        width: `${cutout.diameter * s}px`,
        height: `${cutout.diameter * s}px`,
        borderRadius: "999px",
      };
    default:
      return assertNever(cutout);
  }
}

// ── Empty screen ────────────────────────────────────────────

/** Placeholder shown while the frame has no image; sizes scale with the screen. */
function EmptyScreen(
  { screenWidth: sw, animate }: { screenWidth: number; animate: boolean },
): ReactElement {
  const label = {
    fontFamily: "system-ui, sans-serif",
    userSelect: "none",
  } as const;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#1a1a1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: `${sw * 0.03}px`,
      }}
    >
      <div
        style={{
          // The pulse (keyframes in BaseStyles) swings around this resting
          // opacity; without it the export gets the same value every time.
          opacity: 0.4,
          animation: animate
            ? "phoneFrameEmptyPulse 3s ease-in-out infinite"
            : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: `${sw * 0.03}px`,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: `${sw * 0.25}px`, height: `${sw * 0.25}px` }}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: `${sw * 0.012}px`,
          }}
        >
          <span
            style={{
              ...label,
              color: "rgba(255,255,255,0.50)",
              fontSize: `${sw * 0.075}px`,
              fontWeight: 700,
              letterSpacing: `${sw * 0.001}px`,
            }}
          >
            No screenshot
          </span>
          <span
            style={{
              ...label,
              color: "rgba(255,255,255,0.30)",
              fontSize: `${sw * 0.045}px`,
              fontWeight: 400,
              textAlign: "center",
              lineHeight: 1.4,
              padding: `0 ${sw * 0.06}px`,
            }}
          >
            Choose an image in the layer settings
          </span>
        </div>
      </div>
    </div>
  );
}
