# UI Options Investigation

This document explores options for adding a web-based configuration UI to the
screenshot generator.

## Option 1: Deno + Hono (Recommended for Simplicity)

**Hono** is a lightweight, fast web framework that works great with Deno.

### Pros

- Pure Deno, no Node.js required
- Lightweight (~25KB)
- TypeScript-first
- Built-in middleware support
- Can serve static files + API endpoints

### Cons

- No built-in state management
- Need to add a frontend framework separately

### Implementation

```typescript
import { Hono } from "https://deno.land/x/hono/mod.ts";
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";

const app = new Hono();
app.use("/static/*", serveStatic({ root: "./" }));
app.get("/api/config", (c) => c.json(config));
app.post("/api/generate", async (c) => {/* ... */});

Deno.serve(app.fetch);
```

---

## Option 2: Deno Fresh (Full-Featured)

**Fresh** is Deno's official full-stack framework with Islands architecture.

### Pros

- Official Deno framework
- Islands architecture (partial hydration)
- No build step needed
- Preact-based (React-like)
- Built-in routing

### Cons

- More opinionated structure
- Larger learning curve
- Might be overkill for this use case

### Implementation

```bash
deno run -A -r https://fresh.deno.dev my-project
```

---

## Option 3: React + Vite (Most Familiar)

Traditional React SPA with Vite as bundler.

### Pros

- Most familiar ecosystem
- Rich component libraries (shadcn/ui, etc.)
- Hot module replacement
- Large community

### Cons

- Requires Node.js for Vite
- Build step required
- Separate from Deno scripts

### Implementation

```bash
npm create vite@latest ui -- --template react-ts
```

---

## Option 4: Vanilla JS + Deno Server (Minimal)

Simple HTML/CSS/JS served by Deno's built-in HTTP server.

### Pros

- Zero dependencies
- Fastest to implement
- Easy to understand
- No build step

### Cons

- Limited interactivity
- Manual DOM manipulation
- No component reusability

---

## Option 5: Tauri (Desktop App)

Native desktop app with React frontend.

### Pros

- Native performance
- File system access
- Cross-platform
- Professional feel

### Cons

- Complex setup
- Requires Rust toolchain
- Overkill for this use case

---

## Recommendation

For this project, I recommend **Option 1 (Deno + Hono)** with a simple frontend:

1. **Backend**: Hono for API endpoints and static file serving
2. **Frontend**: Preact (lightweight React alternative) or Alpine.js for
   interactivity
3. **Styling**: Tailwind CSS via CDN

This gives you:

- Single runtime (Deno)
- No build step for development
- Type-safe API
- Familiar React-like syntax (if using Preact)
- Easy to extend

### UI Features to Build

1. **Dashboard**
   - List all configured screenshots
   - Preview thumbnails
   - Generate/regenerate buttons

2. **Screenshot Editor**
   - Edit headline/subtitle text
   - Select/upload images
   - Configure glow effects (color picker, position)
   - Phone frame options
   - Live preview

3. **Theme Editor**
   - Background gradient picker
   - Font selection
   - Color palette

4. **Language Manager**
   - Add/remove languages
   - Copy config between languages
   - Translation status

5. **Export**
   - Generate all screenshots
   - Progress indicator
   - Download ZIP

---

## Next Steps

1. Add Hono to `deno.json` imports
2. Create `src/server.ts` with API endpoints
3. Create `ui/` directory with Preact components
4. Add `deno task dev` for development server

Would you like me to implement Option 1 (Hono + Preact)?
