/**
 * Shared layer metadata, display names, and default constructors.
 */

import type { Layer } from "@app-types";
import { DEVICE_PRESETS } from "@device-presets";
import {
  assertNever,
  generateLayerId,
  LAYER_DEFAULTS,
  POSITION_DEFAULTS,
  SHAPE_META,
} from "@lib";

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

/** Derive a descriptive base name from a layer's content. */
function layerBaseName(layer: Layer): string {
  switch (layer.type) {
    case "text":
      return layer.text || "Text";
    case "phone-frame":
      return layer.model
        ? DEVICE_PRESETS[layer.model]?.label ?? "Phone Frame"
        : "Phone Frame";
    case "image":
      if (layer.imagePath) {
        const file = layer.imagePath.split("/").pop() ?? "";
        return file.replace(/\.[^.]+$/, "") || "Image";
      }
      return "Image";
    case "shape":
      return SHAPE_META[layer.shapeType].label;
    case "glow":
      return "Glow";
    case "background":
      return "Background";
    default:
      return assertNever(layer);
  }
}

export function layerDisplayName(layer: Layer, allLayers: Layer[]): string {
  const name = layerBaseName(layer);
  const siblings = allLayers.filter((l) => layerBaseName(l) === name);
  if (siblings.length <= 1) return name;
  return `${name} #${siblings.indexOf(layer) + 1}`;
}

/** Layer types in add-menu order (alphabetical by label); `LAYER_META` has the icon and label. */
export const LAYER_TYPES: Layer["type"][] =
  (Object.keys(LAYER_META) as Layer["type"][])
    .sort((a, b) => LAYER_META[a].label.localeCompare(LAYER_META[b].label));

/**
 * A new layer: centred, plus that type's `LAYER_DEFAULTS` written out so
 * the editor shows the same values the preview renders.
 */
export function createDefaultLayer(type: Layer["type"]): Layer {
  const base = { id: generateLayerId(), ...POSITION_DEFAULTS };
  switch (type) {
    case "text":
      return { ...base, type, text: "New Text", ...LAYER_DEFAULTS.text };
    case "phone-frame":
      // No `model`: the layer inherits the platform's default device.
      return { ...base, type, ...LAYER_DEFAULTS["phone-frame"] };
    case "image":
      return { ...base, type, imagePath: "", ...LAYER_DEFAULTS.image };
    case "glow":
      return { ...base, type, ...LAYER_DEFAULTS.glow };
    case "shape":
      return { ...base, type, ...LAYER_DEFAULTS.shape };
    case "background":
      return { id: base.id, opacity: base.opacity, type };
    default:
      return assertNever(type);
  }
}
