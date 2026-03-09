# Vite/React Migration Analysis

This document analyzes whether to migrate from the current Preact/esbuild/iframe-based architecture to a proper Vite + React + Deno setup, specifically to address the preview flickering issue.

## Current Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Preact UI (bundled by esbuild)                          ││
│  │ ┌──────────────┐  ┌────────────────────────────────────┐││
│  │ │   Sidebar    │  │           Preview                  │││
│  │ │   + Editor   │  │  ┌──────────────────────────────┐  │││
│  │ │              │  │  │  iframe                      │  │││
│  │ │  [options]──────────> /preview/screenshot/:id     │  │││
│  │ │              │  │  │  (full HTTP request)         │  │││
│  │ │              │  │  └──────────────────────────────┘  │││
│  │ └──────────────┘  └────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Deno Server (Hono)                                          │
│  ├── /preview/*      → renderScreenshot() → HTML doc         │
│  ├── /api/config/*   → CRUD config                           │
│  ├── /api/generate/* → renderScreenshot() → HTML → Puppeteer │
│  └── /assets/*       → Static file serving                   │
└─────────────────────────────────────────────────────────────┘
```

### Why It Flickers

1. User changes option (e.g., phone scale slider)
2. `saveConfig()` is called (debounced 50ms)
3. Config persisted to server via API call
4. `previewVersion` increments
5. `Preview.tsx` sets new iframe `src` with cache-buster
6. Browser initiates **full HTTP request** to `/preview/...`
7. Server runs `renderScreenshot()` and returns HTML
8. Browser **destroys old iframe content and renders new**



**Total latency**: ~100-300ms per change (API save + HTTP + HTML parse + render)

### Current Value of Unified Flow

The same `renderScreenshot()` function is used for:
- **Preview**: Server returns HTML → loaded in iframe
- **Generation**: Server writes HTML to disk → Puppeteer screenshots it

This ensures **WYSIWYG consistency** - what you see is exactly what gets exported.

---

## The Core Problem

The flickering isn't just a cosmetic issue - it makes real-time editing feel sluggish. When dragging a slider to adjust phone position, you want to see smooth updates, not a flash-reload-flash pattern.

---

## Solution Analysis

### Solution 1: Keep Architecture, Mitigate Flickering

**Approach**: Keep the iframe-based system but add visual smoothing.

**Implementation**:
- Add a CSS transition/fade between iframe reloads
- Keep previous frame visible while new one loads (opacity crossfade)
- Use `iframe.onload` to swap visibility only when content is ready

```typescript
// Preview.tsx with crossfade
const [activeSrc, setActiveSrc] = useState(url);
const [pendingSrc, setPendingSrc] = useState<string | null>(null);

useEffect(() => {
  if (url !== activeSrc) {
    setPendingSrc(url); // Start loading in hidden iframe
  }
}, [url]);

return (
  <div class="relative">
    <iframe src={activeSrc} class="transition-opacity" style={{ opacity: pendingSrc ? 0.5 : 1 }} />
    {pendingSrc && (
      <iframe
        src={pendingSrc}
        onLoad={() => { setActiveSrc(pendingSrc); setPendingSrc(null); }}
        class="absolute inset-0 opacity-0"
      />
    )}
  </div>
);
```

**Pros**:
- Minimal code changes (~50 lines)
- No architectural disruption
- Keeps unified generation flow
- No new dependencies

**Cons**:
- Still has inherent latency - just hides it better
- Double iframe memory usage during transitions
- Doesn't fix the fundamental "full reload" problem
- Slider dragging still feels delayed

**Effort**: 2-4 hours
**Flicker fix quality**: ⭐⭐ (masked, not eliminated)

---

### Solution 2: Client-Side Rendering with React DOM

**Approach**: Render the screenshot preview directly in React, eliminating the iframe entirely.

**Implementation**:
- Port `renderScreenshot()` to return a React component instead of HTML string
- Render preview content inline in the main React tree
- Use CSS `transform: scale()` for the "scaled preview" effect
- Keep server-side HTML rendering only for generation

```tsx
// PreviewInline.tsx
function PreviewInline({ screenshot, theme, app, dimensions }) {
  return (
    <div 
      className="screenshot" 
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
        background: theme.background.gradient,
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      {screenshot.glows.map(glow => <Glow key={glow.id} {...glow} />)}
      <HeadlineArea headline={screenshot.headline} subtitle={screenshot.subtitle} />
      <PhoneDisplay images={screenshot.imagePath} frame={screenshot.phoneFrame} />
      {screenshot.mascot && <Mascot {...screenshot.mascot} />}
    </div>
  );
}
```

**Pros**:
- **Instant updates** - no HTTP roundtrip, no reload
- React's diffing only updates what changed
- Smooth slider interactions
- Lower memory usage (no iframe)

**Cons**:
- **Two renderers to maintain**: React components for preview, string templates for generation
- Risk of preview/export divergence (WYSIWYG broken)
- Complex shapes/SVGs need to work in both systems
- CSS may behave differently (isolation vs inherited styles)

**Effort**: 2-3 days (porting all render logic to React components)
**Flicker fix quality**: ⭐⭐⭐⭐⭐ (eliminated)
**WYSIWYG risk**: 🔴 High - two separate implementations

---

### Solution 3: Shared Renderer (Isomorphic)

**Approach**: Create a renderer that works identically on both client and server.

**Implementation**:
- Refactor `renderScreenshot()` to output virtual DOM or JSX
- On client: hydrate/render as React component
- On server: render to HTML string

```typescript
// Isomorphic renderer
function ScreenshotVDOM(props: RenderOptions) {
  return (
    <div class="screenshot" style={{ background: props.theme.background.gradient }}>
      {props.screenshot.glows.map(g => <Glow {...g} />)}
      {/* ... */}
    </div>
  );
}

// Client
ReactDOM.render(<ScreenshotVDOM {...options} />, container);

// Server (generation)
import { renderToString } from 'preact-render-to-string';
const html = renderToString(<ScreenshotVDOM {...options} />);
```

**Pros**:
- **Single source of truth** - same code for preview and export
- Instant client-side updates
- Maintains WYSIWYG guarantee
- Can use React for both editor UI and preview content

**Cons**:
- Significant refactor of renderer.ts (~1000 lines)
- Need to handle asset URLs differently (relative vs file://)
- Some CSS-in-JS complexity
- Shape rendering (SVGs) needs careful handling

**Effort**: 3-5 days
**Flicker fix quality**: ⭐⭐⭐⭐⭐ (eliminated)
**WYSIWYG risk**: 🟢 Low - same code path

---

### Solution 4: PostMessage-Based Live Update

**Approach**: Keep iframe but make it a mini-SPA that receives updates via `postMessage`.

**Implementation**:
```typescript
// Preview iframe content (loaded once)
window.addEventListener('message', (e) => {
  if (e.data.type === 'UPDATE_OPTIONS') {
    updateScreenshot(e.data.options);
  }
});

// Parent app (no reload needed)
iframeRef.current.contentWindow.postMessage({
  type: 'UPDATE_OPTIONS',
  options: screenshot
}, '*');
```

**Diagram**:
```
┌──────────────────┐    postMessage     ┌──────────────────┐
│     Editor       │ ────────────────►  │    iframe SPA    │
│  (main window)   │                    │  (loaded once)   │
│                  │                    │                  │
│  config change   │                    │  DOM update      │
│       ├─────── postMessage ────────► │  (no reload)     │
└──────────────────┘                    └──────────────────┘
```

**Pros**:
- Keeps iframe isolation (CSS doesn't leak)
- Single initial load, then instant updates
- Relatively small changes to current architecture
- Preview iframe can still use the exact HTML structure

**Cons**:
- Need to bundle update logic into iframe content
- Two-way sync complexity (what if iframe needs to signal readiness?)
- Still need separate "generation" HTML that doesn't have the postMessage listener
- Slightly more complex than needed

**Effort**: 1-2 days
**Flicker fix quality**: ⭐⭐⭐⭐ (eliminated after initial load)
**WYSIWYG risk**: 🟡 Medium - update logic could diverge from static render

---

### Solution 5: Full Vite + React + Deno Setup

**Approach**: Complete tooling modernization with Vite for development.

**Implementation**:
- Replace esbuild with Vite
- Migrate from Preact to React
- Use Vite's HMR for instant development feedback
- Still use Deno for the server (Vite just for frontend build)

```
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'src/ui/main.tsx'
    }
  }
});
```

**What this solves**:
- Better development experience (HMR, fast refresh)
- Larger ecosystem (React vs Preact)
- Modern tooling

**What this doesn't solve by itself**:
- The iframe flickering (still need one of the above solutions)

**Pros**:
- Industry-standard tooling
- Better debugging with React DevTools
- Larger community, more libraries
- Foundation for future enhancements

**Cons**:
- Vite adds complexity (but also provides value)
- React is larger than Preact (~40KB vs ~3KB gzipped)
- Migration effort
- **Does not inherently solve the flicker problem**

**Effort**: 1-2 days (tooling only)
**Flicker fix quality**: ⭐ (doesn't address it)

---

## Recommendation Matrix

| Solution | Flicker Fix | WYSIWYG Safe | Effort | Recommended? |
|----------|-------------|--------------|--------|--------------|
| 1. Crossfade mitigation | ⭐⭐ | ✅ | Low | For quick win |
| 2. Client-side React render | ⭐⭐⭐⭐⭐ | ❌ | Medium | No |
| 3. Isomorphic renderer | ⭐⭐⭐⭐⭐ | ✅ | High | **Best long-term** |
| 4. PostMessage updates | ⭐⭐⭐⭐ | 🟡 | Medium | Good middle ground |
| 5. Vite migration only | ⭐ | ✅ | Medium | As foundation |

---

## Verdict

### If you want the best architecture (recommended):

**Combine Solution 5 + Solution 3: Vite + Isomorphic Renderer**

1. **Migrate to Vite + React** (1-2 days)
   - Better DX, HMR, modern tooling
   - This is a one-time investment that pays dividends

2. **Refactor renderer to JSX components** (3-5 days)
   - Single `<Screenshot>` component that works everywhere
   - Use `renderToString()` for generation
   - Use direct render for preview
   - Same code = guaranteed WYSIWYG

**Result**:
- Zero flicker (instant updates)
- Guaranteed WYSIWYG (same code path)
- Modern tooling (Vite, React)
- Better developer experience

### If you want a quick fix:

**Solution 1: Crossfade + Solution 4: PostMessage**

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
