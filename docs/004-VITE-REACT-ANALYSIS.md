# ADR-004: Migrate to Vite + React with Isomorphic Renderer

> **Status**: Accepted & Implemented  
> **Date**: 2026-03-09  
> **Deciders**: Development Team

## Context

The screenshot generator was experiencing **preview flickering** when users edited screenshot settings. Each edit triggered an HTTP request to re-render HTML server-side, which was then loaded into an iframe. This caused:

1. Visible white flash between updates
2. Lag between user input and visual feedback  
3. Possible WYSIWYG inconsistencies between preview and export

The existing architecture was:
- **UI Framework**: Preact (lightweight React alternative)
- **Bundler**: Custom esbuild script
- **Preview**: iframe loading server-rendered HTML via `/api/preview`
- **Export**: Server-side HTML string templates

## Decision

Migrate to **Vite + React with an isomorphic renderer** - a complete architecture overhaul that renders screenshots using the same React components on both client (preview) and server (export).

## Options Considered

### Option 1: CSS Crossfade Transition
Add a crossfade animation to hide the iframe reload flash.

**Pros:**
- Quick to implement (< 1 hour)
- No architecture changes

**Cons:**
- Only masks the symptom, doesn't fix the delay
- Still has network latency on each update
- Doesn't guarantee WYSIWYG

**Estimated effort**: 1 hour

---

### Option 2: PostMessage Communication
Pre-initialize iframe and send JSON updates via postMessage instead of reloading.

**Pros:**
- Eliminates reload, faster updates
- Minimal server changes

**Cons:**
- Still requires server roundtrip for initial render
- Two separate rendering codebases (client script + server template)
- Complex state synchronization

**Estimated effort**: 4-6 hours

---

### Option 3: Canvas/SVG Preview
Render preview using Canvas or SVG instead of HTML/CSS.

**Pros:**
- Fast rendering
- No iframe needed

**Cons:**
- Completely different rendering engine
- WYSIWYG not guaranteed
- Would need to maintain two renderers
- Text rendering differs from HTML

**Estimated effort**: 2-3 days

---

### Option 4: Isomorphic React Components (Chosen)
Create React components that render both client-side (instant preview) and server-side (HTML export via `renderToStaticMarkup`).

**Pros:**
- **Zero flicker** - renders instantly in-place
- **Guaranteed WYSIWYG** - same components for preview and export
- **Modern tooling** - Vite HMR, React DevTools
- **Better DX** - faster builds, hot reloading
- **Future-proof** - industry standard stack

**Cons:**
- Significant migration effort
- Requires Preact → React conversion
- New build tooling to learn

**Estimated effort**: 1-2 days

## Consequences

### Positive
- Preview updates are instant (no network latency)
- Perfect WYSIWYG - preview and export use identical code
- Vite provides fast HMR and better build times
- React ecosystem access (DevTools, libraries)
- Simplified codebase - one renderer instead of two

### Negative
- Bundle size slightly larger (React vs Preact)
- Required learning curve for Vite configuration
- One-time migration effort across 26 UI components

### Neutral
- Deno server unchanged (still serves API + static files)
- Project structure reorganized with `src/renderer-components/`

## Implementation Summary

The migration was completed in 6 phases:

1. **Foundation** - Set up Vite, React, Tailwind, API proxy
2. **UI Migration** - Converted 26 Preact components to React
3. **Isomorphic Renderer** - Created `renderer-components/` with shared React components
4. **Generation Pipeline** - Integrated `renderToStaticMarkup()` for HTML export
5. **Preview Rewrite** - Replaced iframe with inline `<ScreenshotContent>` rendering
6. **Cleanup** - Removed old esbuild scripts and string-template renderer

### Architecture After Migration

```
Editor UI (React) ─────> <ScreenshotContent /> ─────> React components (instant)
                                                            │
Export (Puppeteer) <── HTML <── renderToStaticMarkup(<Screenshot />) ──┘
```

### Key Files Created
- `vite.config.ts` - Vite configuration with API proxy
- `src/renderer-components/` - Isomorphic React components
  - `Screenshot.tsx`, `FeatureGraphic.tsx` - Main components
  - `PhoneFrame.tsx`, `Glow.tsx`, `Shape.tsx`, `Mascot.tsx` - Sub-components
  - `BaseStyles.tsx` - CSS generation
  - `server.ts` - Deno SSR helpers

### Key Files Removed
- `src/renderer.ts` - Old string-template renderer
- `scripts/build-ui.ts` - Old esbuild bundler
- `scripts/dev.ts` - Old dev runner
- `src/ui/shell.ts`, `src/ui/index.ts` - Old entry points

## Related Decisions
- Phone frame styling moved to inline React styles for proper scaling across sizes
- Feature graphic now uses shared `PhoneFrame` component with position controls

1. Add crossfade to mask loading latency (2-4 hours)
2. Optionally add postMessage for slider interactions (1 day)

**Result**:
- Much better perceived performance
- No major refactor
- Some technical debt

### If the unified flow isn't critical:

**Solution 2: Client-Side React only**

If you're willing to accept that preview and generation might have minor differences:
- Build React components for preview
- Keep HTML templates for generation
- Test exports frequently

**Result**:
- Best preview UX
- Risk of preview/export mismatch
- Two codebases to maintain

---

## Losing the Unified Flow: What Changes?

If you drop the requirement that preview and generation use the same code:

**Gains**:
- Complete freedom in preview implementation
- Can use React component libraries for preview
- Real-time updates are trivial

**Losses**:
- WYSIWYG guarantee broken
- Must manually test every change against exports
- Double maintenance burden
- Subtle bugs where preview looks right but export is wrong

**Verdict**: The unified flow is valuable enough to preserve. The isomorphic renderer approach keeps it while solving the flicker problem.

---

## Implementation Roadmap

### Phase 1: Foundation (Optional, 1-2 days)
- Migrate from esbuild to Vite
- Keep Preact or migrate to React
- Verify everything still works

### Phase 2: Quick Win (4 hours)
- Implement crossfade in Preview.tsx
- Reduces perceived flicker immediately

### Phase 3: Isomorphic Renderer (3-5 days)
1. Create `src/renderer-components/` with JSX versions of:
   - `Screenshot.tsx` (main container)
   - `Glow.tsx` (glow effects)
   - `Shape.tsx` (decorative shapes)
   - `PhoneFrame.tsx` (device mockup)
   - `Mascot.tsx` (character overlay)
   
2. Update `renderer.ts`:
   ```typescript
   import { renderToString } from 'preact-render-to-string';
   import { Screenshot } from './renderer-components/Screenshot.tsx';
   
   export function renderScreenshot(options: RenderOptions): string {
     return `<!DOCTYPE html>
       <html>
       <head>...</head>
       <body>${renderToString(<Screenshot {...options} />)}</body>
       </html>`;
   }
   ```

3. Update `Preview.tsx` to render inline:
   ```tsx
   import { Screenshot } from '../renderer-components/Screenshot.tsx';
   
   function Preview({ screenshot, theme, app, dimensions }) {
     return (
       <div class="preview-container">
         <div style={{ transform: `scale(${scale})` }}>
           <Screenshot 
             screenshot={screenshot}
             theme={theme}
             app={app}
             dimensions={dimensions}
           />
         </div>
       </div>
     );
   }
   ```

### Phase 4: Cleanup
- Remove iframe-based preview code
- Simplify Preview.tsx
- Update documentation

---

## Conclusion

**Yes, it's worth considering Vite + React**, but **not for the reasons you might think**. Vite itself doesn't solve the flicker - it just provides better DX.

The real solution is **isomorphic rendering** - using the same React/Preact components for both preview (instant updates) and generation (HTML string output).

**Recommended path**:
1. Quick win now: Add crossfade (hours, not days)
2. Plan for: Isomorphic renderer refactor (1 week)
3. Optional: Vite migration (can be done independently)

This preserves the unified generation flow while eliminating flicker entirely.
