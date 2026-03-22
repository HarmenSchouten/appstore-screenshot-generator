# 006 — Layer-Based Composition System

**Status:** Proposed  
**Date:** 2026-03-22

## Context

Every screenshot follows a fixed composition: background gradient → glows → shapes → headline (top) → phone frame (center-bottom) → mascot (corner). The Feature Graphic has a separate parallel system with its own type, renderer, editor, and API routes.

### Pain Points

1. **Rigid layout** — Phone frames are always center-bottom. Headlines are always top area. Mascots pick from 4 corners. There's no way to compose a "phone on the left, text on the right" layout or position a phone at the top.

2. **Dual code paths** — `Screenshot` and `FeatureGraphic` are separate types with separate renderers (`ScreenshotContent`, `FeatureGraphicContent`), separate editors (`ScreenshotEditor`, `FeatureGraphicEditor`), and separate API endpoints. They share the same sub-elements (glows, shapes, mascot, phone) but wire them differently.

3. **Inconsistent positioning** — Shapes use `posX`/`posY` (percentage-based). Glows use CSS strings (`top: "20%"`, `left: "30%"`). Mascots use 4 enum corners. Phone frames use `scale` + `bottomOffset`. Four different positioning models for the same canvas.

4. **Dead-end extensibility** — Every new layout idea means adding special-case fields to `Screenshot`. Dual phone mode needed `dualRotation`, `dualGap`. Want 3 phones? New fields. Want text below the phone? New fields. The type grows without bound.

5. **No composition reuse** — Can't save a layout and apply it to other screenshots. Every screenshot is configured from scratch.

## Decision

Replace the fixed-slot composition model with a **layer-based system** where each visual element is an independently positioned layer.

### Core Concept

A screenshot becomes a canvas with an ordered list of layers. Each layer has a type, position, and type-specific configuration.

```ts
interface Screenshot {
  id: string
  role: 'screenshot' | 'feature-graphic'
  width: number
  height: number
  layers: Layer[]
}
```

All visual elements — text, phone frames, images, glows, shapes — become layers with a unified positioning model (`posX`, `posY`, `zIndex`, `opacity`, `rotation`).

### Layer Types

| Type | Replaces | Properties |
|------|----------|------------|
| `text` | Single text element | text, fontSize, fontWeight, lineHeight, color, align, padding |
| `text-block` | Headline + subtitle pair | headline, subtitle, typography config |
| `phone-frame` | PhoneFrame + imagePath | imagePath, scale, devicePresetId |
| `image` | Mascot | imagePath, size, borderRadius, objectFit |
| `glow` | GlowEffect | color, size, blur |
| `shape` | Shape | All existing shape properties (proven model) |
| `background` | Theme gradient | gradient, colors, direction (defaults to project theme) |

**Text vs Text Block:** Both will exist. `text` is a single text string — maximum flexibility for labels, badges, callouts. `text-block` is a headline + subtitle pair — the common App Store pattern where 90%+ of screenshots use this pairing. This is a shorthand, not a compromise. Either can be used, and both are just layers.

**Image replaces Mascot:** The mascot was an image locked to 4 corners. An image layer is an image at any position and size. Strict superset.

**Background as a layer.** The background becomes a `background` layer — always z-index 0 by default. When created (by a preset or "Add Layer"), its gradient values are **copied** from the project theme config. It's a snapshot, not a live reference, changing the theme later does not retroactively update existing background layers. Users can override the background per screenshot without touching the theme. This keeps "everything is a layer" consistent and makes per-screenshot backgrounds trivial (e.g. a dark screenshot next to a light one).

**Dual phone mode is eliminated.** Want two phones? Add two `phone-frame` layers. Position them independently. Different screenshots, different devices, different rotations. More powerful, less special-case code.

### Feature Graphic Unification

Feature Graphics become screenshots with dimensions `1024×500` and a different default layer preset. No separate type, renderer, editor, or API routes. The current parallel code path is deleted entirely.

A Feature Graphic "preset" is defined as a layer combination:
- `text-block` layer (left area, with headline + subtitle)
- `image` layer (app icon, top-left)
- `phone-frame` layer (right side, rotated)

### Screenshot Role & Dimensions

Every screenshot entry carries `width`, `height`, and a `role` field:

```
role: 'screenshot' | 'feature-graphic'
width: number   // e.g. 1290 (from device preset) or 1024 (feature graphic)
height: number  // e.g. 2796 (from device preset) or 500 (feature graphic)
```

**`role` is a UI-only concern.** It has zero effect on rendering, the layer system, or export. Its purpose is sidebar presentation:

- The left sidebar groups entries per platform into **"Screenshots"** and **"Feature Graphic"** sections.
- Feature Graphic is constrained to one per platform. Screenshots are N per platform.
- "Add Screenshot" offers device-preset-based dimensions. "Add Feature Graphic" sets 1024×500 automatically and applies the Feature Graphic layer preset.

For regular screenshots, `width`/`height` come from the selected device preset (e.g. iPhone 15 Pro Max → 1290×2796, Galaxy S24 Ultra → 1440×3120). iOS and Android screenshots naturally have different dimensions because they belong to different platforms, each with their own device presets. Layers use percentage-based positioning, so they adapt to any canvas size without adjustment.

### Presets

Presets are saved layer combinations applied when creating a new screenshot. Examples:

- **Classic** — background + text-block (top-center) + phone-frame (center-bottom)
- **Side by Side** — background + text-block (left) + phone-frame (right)
- **Feature Graphic** — background + text-block (left) + image/icon (top-left) + phone-frame (right, rotated)
- **Comparison** — background + text-block (top) + 2× phone-frame (side by side)
- **Blank** — background only

Presets are for new screenshots only. Applying to existing screenshots replaces all layers.

Future: users can save their own layer combinations as custom presets.

### Sidebar & Editing

Layers are displayed as an ordered list in the sidebar. List order matches z-index (top layer first). Each layer shows as a compact card with type icon, name, and action buttons (duplicate, delete). Drag handles allow reordering, which updates z-index.

Clicking a layer card navigates into a **focused detail view** for that layer. The detail view shows:

- Back button to return to the layer list
- Layer name (editable)
- Full type-specific editor (positioning, appearance, type-specific properties)

This drill-down pattern avoids cluttering the sidebar with many expanded editors simultaneously. Each layer gets the full sidebar width for its controls. The layer list stays clean and scannable.

An **"Add Layer"** button opens a type picker. This is the primary way to add elements. New layers get a default name based on their type (e.g. "Text", "Phone Frame", "Glow 2"). Names are user-editable in the detail view.

All interactions remain sidebar-based. No drag-and-drop on the canvas in this phase. Positioning via percentage sliders (`posX`, `posY`) in the layer editor. Canvas interactions can be added as a future enhancement once the model is proven.

### Unified Positioning Model

Every layer gets:

```
posX: number    // 0-100% (0=left, 50=center, 100=right)
posY: number    // 0-100% (0=top, 50=center, 100=bottom)
zIndex: number  // Layer stacking order
opacity: number // 0-1
rotation: number // degrees
```

This is the model shapes already use. It's proven. All other element types adopt it, eliminating the 4 different positioning systems.

The `background` layer is the exception — it ignores `posX`/`posY`/`rotation` and always fills the canvas. It only uses `zIndex` (default 0) and its own gradient properties.

### Rendering

The renderer iterates `layers` sorted by `zIndex` and renders each by type. The same isomorphic approach (React components → `renderToStaticMarkup` → Puppeteer → PNG) stays intact. HTML/CSS absolute positioning handles free placement without needing a `<canvas>` element.

### What This Unlocks

- Phone frames anywhere on the canvas (top, left, overlapping edges)
- Text anywhere (below phone, beside phone, as overlaid badges)
- 3+ phones per screenshot (comparison layouts)
- Images at any position and size (not just 4 corners)
- Full z-order interleaving of all elements
- Feature Graphic as a preset, not a separate system
- Layout reuse via presets
- Foundation for future canvas drag-and-drop interactions

## Alternatives Considered

### A. Layout Presets Only (No Free Positioning)

Add predefined layout templates ("Hero Phone", "Side by Side", "Phone Trio") that rearrange elements in fixed slots.

**Trade-off:** Fast to ship, clean UX, but fundamentally still rigid. Every new layout is another template to build and maintain. Doesn't unlock creative freedom. Kicks the can down the road.

### B. Hybrid Mode (Structured Default + Canvas Toggle)

Keep current fixed layout as default. Add an "Advanced Mode" toggle that converts elements to freely positionable layers.

**Trade-off:** Backward compatible, but maintains two code paths indefinitely. Conversion between modes is lossy. The "simple mode" becomes legacy debt. Users who discover canvas mode never go back, making simple mode maintenance cost without benefit.

### C. Full Canvas Editor (Drag-and-Drop First)

Build interactive canvas with direct manipulation (click, drag, resize) as the primary interface.

**Trade-off:** Best UX for spatial editing, but massive scope increase. Requires hit testing, selection management, resize handles, snap guides, keyboard shortcuts, undo/redo. Can be layered on top of the layer system later — not mutually exclusive, just a separate initiative.

## Config Migration

No migration tooling will be built. The project is in early development with no external users depending on config stability. Existing `config.json` files will need to be recreated. The default project config will ship with the new layer-based format.

## Implementation Scope

Implementation order: **Types → Renderer → UI → API → Presets.** Types and renderer come first because the UI needs working preview rendering to develop against. API routes adapt once the data shape is settled. Presets come last since they're just predefined layer arrays.

### Theme Relationship

`ThemeConfig` continues to exist as a project-level concept. It holds the default color palette, font family, Google Fonts URL, and app branding. When creating new layers, the UI reads from the theme to set initial values (background gradient, text colors, font family). Layers store their own values after creation — there's no live binding to the theme. This keeps layers self-contained and portable across presets.

### Types & Data Model
- Define `Layer` discriminated union type (`type` field as discriminant) and per-type interfaces
- Define `BaseLayerProps` (id, name, type, posX, posY, zIndex, opacity, rotation) shared across all layer types
- Replace `Screenshot.headline/subtitle/imagePath/glows/shapes/phoneFrame/mascot` with `Screenshot.layers`
- Add `role` field (`'screenshot' | 'feature-graphic'`) and `width`/`height` to `Screenshot`
- Remove `FeatureGraphic` type entirely
- Update `PlatformConfig` (remove separate `featureGraphic` field — it's a screenshot with a role)

### Renderer
- New `LayerRenderer` component — receives a `Layer`, switches on `layer.type` to delegate to the correct renderer component
- Each layer type renders as a positioned `<div>` wrapper (absolute positioning via `posX`/`posY`) containing the type-specific visuals
- Existing `Glow`, `Shape`, `PhoneFrame` components adapt to receive layer props instead of their current prop shapes
- Delete `ScreenshotContent` fixed composition, `FeatureGraphicContent`, and `FeatureGraphic` renderer
- Update `BaseStyles` for layer-based positioning

### UI / Editor
- **Layer list view** — ordered, reorderable layer cards with drag handles. Compact: type icon + name + actions
- **Layer detail view** — drill-down editor for a single layer. Back button returns to list. Full sidebar width for controls
- **Shared position editor** — reusable component for posX/posY/zIndex/opacity/rotation (rendered in every layer's detail view)
- **Per-type editors** — `TextLayerEditor`, `TextBlockLayerEditor`, `PhoneFrameLayerEditor`, `ImageLayerEditor`, `GlowLayerEditor`, `ShapeLayerEditor`, `BackgroundLayerEditor`
- "Add Layer" type picker
- Layer duplicate/delete/reorder actions
- Delete `ScreenshotEditor`, `FeatureGraphicEditor`, `MascotEditorInline` (replaced by layer system)
- `GlowEditorInline` and `ShapeEditorInline` refactored into layer editors

### API Routes
- Remove feature-graphic-specific endpoints
- Screenshot CRUD stays, but payload shape changes to layer-based
- Preset endpoints (list available presets, apply preset)

### Presets
- Define built-in presets (Classic, Side by Side, Feature Graphic, Comparison, Blank)
- "Add Screenshot" uses preset picker instead of hardcoded defaults
