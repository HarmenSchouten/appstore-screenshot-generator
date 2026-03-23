/**
 * Shared layer metadata, display names, and default constructors.
 */

import type { Layer } from "../../../types/layers.ts";

// ── Layer metadata ──────────────────────────────────────────────────

export const LAYER_META: Record<
  Layer["type"],
  { icon: string; label: string; color: string }
> = {
  background: {
    icon: "fa-solid fa-fill-drip",
    label: "Background",
    color: "text-violet-400",
  },
  text: {
    icon: "fa-solid fa-font",
    label: "Text",
    color: "text-sky-400",
  },
  "phone-frame": {
    icon: "fa-solid fa-mobile-screen-button",
    label: "Phone Frame",
    color: "text-emerald-400",
  },
  image: {
    icon: "fa-solid fa-image",
    label: "Image",
    color: "text-amber-400",
  },
  glow: {
    icon: "fa-solid fa-sun",
    label: "Glow",
    color: "text-pink-400",
  },
  shape: {
    icon: "fa-solid fa-shapes",
    label: "Shape",
    color: "text-orange-400",
  },
};

export function layerDisplayName(layer: Layer, index: number): string {
  const meta = LAYER_META[layer.type];
  switch (layer.type) {
    case "text":
      return layer.text || `${meta.label} ${index + 1}`;
    default:
      return `${meta.label} ${index + 1}`;
  }
}

/** Sorted alphabetically by label for the add-layer picker. */
export const ADDABLE_LAYERS: {
  type: Layer["type"];
  icon: string;
  label: string;
}[] = [
  { type: "background", icon: "fa-solid fa-fill-drip", label: "Background" },
  { type: "glow", icon: "fa-solid fa-sun", label: "Glow" },
  { type: "image", icon: "fa-solid fa-image", label: "Image" },
  {
    type: "phone-frame",
    icon: "fa-solid fa-mobile-screen-button",
    label: "Phone Frame",
  },
  { type: "shape", icon: "fa-solid fa-shapes", label: "Shape" },
  { type: "text", icon: "fa-solid fa-font", label: "Text" },
];

let _nextLayerId = 1;

export function generateLayerId(): string {
  return globalThis.crypto.randomUUID?.() ?? `layer-${_nextLayerId++}`;
}

export function createDefaultLayer(type: Layer["type"]): Layer {
  const base = {
    id: generateLayerId(),
    posX: 50,
    posY: 50,
    opacity: 1,
    rotation: 0,
  };
  switch (type) {
    case "text":
      return {
        ...base,
        type: "text",
        text: "New Text",
        fontSize: 48,
        fontWeight: 700,
        textAlign: "center" as const,
        textColor: "#ffffff",
        lineHeight: 1.2,
      };
    case "phone-frame":
      return { ...base, type: "phone-frame", model: "ios-iphone-15-pro" };
    case "image":
      return { ...base, type: "image", imagePath: "", size: 20 };
    case "glow":
      return { ...base, type: "glow", color: "#8b5cf6", size: 200 };
    case "shape":
      return {
        ...base,
        type: "shape",
        shapeType: "circle",
        size: 30,
        color: "#ffffff",
      };
    case "background":
      return {
        ...base,
        type: "background",
      };
  }
}
