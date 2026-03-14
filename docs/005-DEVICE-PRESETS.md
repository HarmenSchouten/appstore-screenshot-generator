# 005 - Device Presets and Platform Frame Geometry

Date: 2026-03-14
Status: Accepted

## Context

The project currently supports platform-level output dimensions, but not platform-specific device identities.

Today, the renderer uses a single hard-coded phone mockup in `src/renderer-components/PhoneFrame.tsx`:

- one iPhone-like outer frame
- one fixed screen aspect ratio: `9 / 19.5`
- one set of side button positions
- no device preset registry
- no distinction between store upload size and in-canvas device geometry

That is good enough for a generic premium phone look, but it breaks down if we want screenshots to match specific devices more closely.

This matters for two reasons:

1. iOS and Android devices differ in visible screen aspect ratios, corner radii, cutouts, and bezel language.
2. App store upload size is not the same thing as the phone frame shown inside the screenshot.

The current configuration model also nudges us toward conflating these concepts:

- `PlatformConfig.dimensions` controls the full exported marketing image size.
- `Screenshot.phoneFrame` only controls placement and scale.
- There is no place to say which device the frame is supposed to represent.

## Problem

If we add “device selection” without separating responsibilities, we will create a confusing model where one dropdown tries to mean all of the following at once:

- App Store / Play upload target size
- front-of-device visual style
- visible screen mask geometry
- screenshot layout defaults

That would make the system harder to reason about and harder to extend.

## Decision

Introduce a curated device preset system with three clear responsibilities:

1. existing platform output dimensions
- Keep `PlatformConfig.dimensions` exactly as it works today.

2. platform default device preset
- Add a default frame identity per platform.

3. layout overrides
- Keep per-screenshot adjustments such as scale, bottom offset, dual rotation, and optional device override.

The default device choice should be made per project, per platform, and inherited by all screenshots for that platform.

Per-screenshot device selection should exist only as an advanced override.

## Why This Scope Is Right

### Not per screenshot by default

Per-screenshot device choice would make it too easy to create an inconsistent screenshot set.
In most store listings, consistency across a platform set is more important than maximum flexibility.

It also does not match the current editor structure, which is already organized first by language, then by platform, then by screenshot.

### Not global for the whole project

Android and iOS need different preset pools and often different visible screen ratios.
A single project-wide device selection would either be misleading or require hidden platform exceptions.

### Per platform default, with optional override

This fits the current mental model best:

- choose Android or iOS
- choose that platform's default device frame
- optionally override one screenshot if a hero composition needs it

This is the right tradeoff between consistency and flexibility.

## Platform Differences That Matter

### iOS

iPhone front designs are relatively consistent within a generation family.
The main differences relevant to this project are:

- Dynamic Island size and placement
- screen aspect family
- outer device aspect family
- corner radius and bezel thickness
- side button layout

This means iOS presets can be built from a small number of reusable front-face templates.

### Android

Android is more fragmented.
For front-view screenshot mockups, the most important differences are:

- `20:9` versus `19.5:9` visible screen ratio
- centered hole-punch size and vertical offset
- symmetric versus slightly asymmetric bezel feel
- rounded versus squarer outer corners
- button placement and frame thickness

This means Android support should start with a narrow, curated preset set rather than a large catalog.

## What Needs To Change In The Codebase

### 1. Add a device preset registry

The project needs a canonical registry that describes each supported frame.

Suggested location:

- `src/device-presets/` or `src/renderer-components/device-presets.ts`

Suggested shape:

```ts
interface DevicePreset {
  id: string;
  label: string;
  platform: 'ios' | 'android';
  family: string;
  outer: {
    aspectRatio: number;
    cornerRadius: number;
    framePadding: number;
    frameFill: string;
    borderStroke?: string;
    shadow?: string;
  };
  screen: {
    aspectRatio: number;
    cornerRadius: number;
    insetTop: number;
    insetRight: number;
    insetBottom: number;
    insetLeft: number;
  };
  cutout?: {
    type: 'dynamic-island' | 'hole-punch' | 'none';
    width: number;
    height: number;
    top: number;
    radius?: number;
    diameter?: number;
  };
  buttons?: Array<{
    side: 'left' | 'right';
    top: number;
    height: number;
    width: number;
    radius: number;
  }>;
}
```

All renderer logic should derive from this registry instead of hard-coded iPhone values.

### 2. Add platform-level frame choice without changing dimensions

`PlatformConfig.dimensions` currently represents the full marketing canvas.
That should remain untouched in this phase.

What is missing is a platform-level frame choice that does not depend on language and does not change export size.

Recommended model:

```ts
interface ProjectConfig {
  app: AppBranding;
  theme: ThemeConfig;
  palette?: ColorPalette;
  assetsBasePath: string;
  platformDefaults: {
    android: {
      defaultDevicePresetId: string;
    };
    ios: {
      defaultDevicePresetId: string;
    };
  };
  languages: LanguageConfig[];
}

interface PhoneFrameOptions {
  scale?: number;
  bottomOffset?: number;
  dualRotation?: number;
  dualGap?: number;
  deviceMode?: 'inherit' | 'override';
  devicePresetId?: string;
}
```

Important: device preset selection must not silently mutate the exported canvas size.

### 3. Rebuild `PhoneFrame.tsx` around preset geometry

The existing component assumes:

- fixed outer radius
- fixed padding
- fixed screen ratio
- fixed button positions

That component should become a renderer for a `DevicePreset`.

At minimum it must support:

- per-preset outer frame aspect ratio
- per-preset screen mask ratio
- per-preset screen corner radius
- Dynamic Island and hole-punch rendering
- per-preset button placement
- per-preset material styling

### 4. Preview and export must use the same preset resolution path

The current WYSIWYG architecture is a strength and should be preserved.

The following paths must all resolve the same effective device preset:

- inline preview
- server-side HTML generation
- PNG export
- Android feature graphic phone preview

The Android feature graphic should default to the Android platform device preset, with an optional override only if needed later.

### 5. Adjust project config now for platform-level defaults

Since this is a greenfield project and migration compatibility is not a concern, the config should be cleaned up now instead of being deferred.

Conceptually, device preset is a project-level platform choice, not a language choice.

The current config nests all platform data inside each language:

- `languages[n].platforms.android`
- `languages[n].platforms.ios`

That is still fine for localized screenshot content, but it is the wrong place for a platform default device preset because it allows the same project to drift between languages.

Recommended split:

- keep localized screenshot content under each language/platform
- add `platformDefaults.android.defaultDevicePresetId`
- add `platformDefaults.ios.defaultDevicePresetId`

This ADR does not propose changing how `dimensions` are modeled yet.
They can stay where they are today so device preset work remains small and focused.

That yields a practical boundary:

- `platformDefaults`: shared platform-wide frame defaults
- `languages[*].platforms[*]`: localized screenshots, feature graphics, and existing dimensions

If output target handling later becomes more sophisticated, that can be revisited separately.

## UI Recommendation

### Primary control surface

Offer device selection in a platform-level settings area, not inside each screenshot editor by default.

Best fit for the current UI:

- add a compact “Platform Settings” panel near the platform tabs or above the screenshot list
- show:
  - `Default device`
  - maybe a short summary like `Dynamic Island, 19.5:9 screen`

This keeps the decision close to the platform tabs, which already define the editing scope.

### Screenshot editor behavior

Keep the existing `Phone Frame` section for layout controls, but add one advanced control:

- `Use platform device` (default: on)
- if disabled, show `Override device` dropdown

This preserves the current lightweight editing flow for normal work.

### Feature graphic behavior

For Android feature graphics:

- default to the Android platform device preset
- do not expose a separate device control initially
- only add a feature-graphic-specific override if a real use case appears

## Renderer Strategy

Use parametric HTML/CSS/SVG rendering, not baked bitmap frame images, for the built-in presets.

Why:

- it fits the current React renderer architecture
- it keeps preview and export identical
- it scales cleanly at different output sizes
- it avoids shipping heavy frame assets

Practical guidance:

- use CSS for frame body, shadow, and materials
- use SVG or CSS masks for the screen cutout and Dynamic Island / hole-punch details
- keep all geometry normalized to a reference width, then scale proportionally

## Copyright and Asset Safety

Built-in presets should be geometric recreations of front-face device classes, not copied vendor artwork.

That means the project should ship:

- unbranded frame geometry
- no vendor logos
- no copied press renders
- no proprietary frame PNGs unless the user provides them

If later the product needs exact official hardware renders, those should be user-supplied or licensed overlay assets, not bundled defaults.

## Recommended Starter Presets

Start with a very small set that satisfies two constraints:

1. visually distinct enough to matter
2. simple enough to reproduce accurately with front-view vector geometry

### iOS

#### 1. iPhone 15 Pro

Why start here:

- very common modern iPhone reference shape
- front view is easy to model: rounded rectangle, thin bezel, Dynamic Island, flat sides
- screen ratio is clear and stable

Reference specs used for geometry research:

- body: `146.6 x 70.6 x 8.3 mm`
- display: `1179 x 2556`
- screen ratio: `19.5:9`

Implementation confidence: High

#### 2. iPhone 15 Pro Max

Why start here:

- same front design language as the 15 Pro
- covers the larger iPhone family without needing a new visual language
- easy to build from the same rendering template with different proportions

Implementation confidence: High

### Android

#### 3. Google Pixel 9 Pro

Why start here:

- clear front identity without overcomplicated details
- flat front, centered hole-punch, rounded corners, balanced bezel language
- represents a distinctly Android look while still being easy to reproduce

Reference specs used for geometry research:

- body: `152.8 x 72 x 8.5 mm`
- display: `1280 x 2856`
- screen ratio: `20:9`

Implementation confidence: High

#### 4. Samsung Galaxy S24 Ultra

Why start here:

- visibly different from the Pixel due to squarer corners and a more boxy silhouette
- strong flagship Android reference device
- still front-view reproducible without needing rear-camera detail

Reference specs used for geometry research:

- body: `162.3 x 79 x 8.6 mm`
- display: `1440 x 3120`
- screen ratio: `19.5:9`

Implementation confidence: High

## Devices Not Recommended For Phase 1

Do not start with:

- foldables
- tablets
- landscape-specific devices
- highly curved-edge displays
- angled 3D marketing mockups

Those introduce a much bigger jump in layout complexity, masking, and composition behavior.

## Consequences

### Positive

- screenshots can visually match the selected platform more credibly
- Android and iOS can diverge in a controlled, explicit way
- the editor stays simple for normal workflows
- preview/export consistency remains intact

### Negative

- more renderer complexity
- more config surface area
- preset maintenance becomes a product responsibility

## Implementation Plan

### Phase 1

- add preset registry
- add `platformDefaults.android.defaultDevicePresetId`
- add `platformDefaults.ios.defaultDevicePresetId`
- add platform default device preset
- refactor `PhoneFrame.tsx` to render by preset
- apply same preset logic to screenshot preview and export

### Phase 2

- add screenshot-level override toggle
- add feature-graphic inheritance from Android platform preset
- add a small preset preview thumbnail in the UI

### Phase 3

- reconsider `dimensions` only if output target requirements become more complex
- consider more iPhone and Android families only after real demand

## Research Notes

Sources used for this ADR:

- current repository architecture and renderer code
- Apple App Store Connect screenshot specification reference
- Google Play store listing and preview asset guidance
- accessible hardware reference pages for front-view body and display ratios:
  - GSMArena: iPhone 15 Pro
  - GSMArena: Google Pixel 9 Pro
  - GSMArena: Samsung Galaxy S24 Ultra

## Summary

The correct first step is not “add a device dropdown to each screenshot.”

The correct first step is to introduce a platform-level device preset model, leave export dimensions alone, and make the default inherit across all screenshots for that platform.

Start with four presets:

- iPhone 15 Pro
- iPhone 15 Pro Max
- Google Pixel 9 Pro
- Samsung Galaxy S24 Ultra

That gives the project one clear iOS family and two clearly different Android families, while staying within a level of visual fidelity that can be reproduced safely and reliably in the current renderer architecture.