# App Store Screenshot Generator

![Deno](https://img.shields.io/badge/Deno-2.0+-000000?logo=deno&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Platforms](https://img.shields.io/badge/Platforms-iOS%20%7C%20Android-blue)
![License](https://img.shields.io/badge/License-MIT-green)

Visual screenshot generator for App Store and Google Play. Create professional marketing screenshots with a real-time preview editor—no code required.

## Features

- 🎨 **Visual Editor** - Design screenshots with live preview, no config files needed
- 🎨 **Theme System** - Color palettes with gradient presets, typography settings
- 📱 **Multi-platform** - Generate for both iOS App Store and Google Play
- 🌍 **Multi-language** - Create localized versions for each market
- 🖼️ **Phone Frames** - Realistic iOS and Android device frames with customizable scale
- ✨ **Glow Effects** - Dynamic gradient glows with palette color support
- 🎭 **Mascot Support** - Add character/branding elements with positioning controls
- 📊 **Feature Graphics** - Google Play feature graphic with app icon customization
- 📁 **Project Management** - Organize multiple apps with separate configurations
- 🗂️ **Media Manager** - Upload, rename, and delete assets
- 🔗 **Shareable URLs** - Deep links to specific screenshots for team collaboration

## Quick Start

### Prerequisites

- [Deno](https://deno.land/) 2.0 or higher
- [Node.js](https://nodejs.org/) 18+ (for Vite frontend)
- Google Chrome or Chromium (for PNG export)

### Run the Editor

```bash
# Clone the repo
git clone https://github.com/yourusername/appstore-screenshots.git
cd appstore-screenshots

# Install npm dependencies
npm install

# Start both servers (API + Vite)
deno task dev
```

Open **http://localhost:5173** in your browser.

## Using the Editor

### Creating Screenshots

1. **Select or create a project** - Click the project name in the sidebar header
2. **Choose language and platform** - Use the tabs in the sidebar (EN/NL, Android/iOS)
3. **Add screenshots** - Click "+ Add Screenshot" or "+ Feature Graphic"
4. **Edit in real-time** - Use the right panel to customize:
   - **Content**: Headline and subtitle text
   - **Typography**: Font sizes, weights, line height, alignment
   - **Layout**: Title offset from top
   - **Phone Screenshot**: Select or upload images, single/dual phone modes
   - **Phone Frame**: Scale, position, rotation (for dual layouts)
   - **Background Glows**: Add colorful gradient orbs using palette colors
   - **Mascot**: Optional character overlay with position controls

### Theme & Colors

Click **Theme & Colors** in the sidebar to set your project's color palette and background gradient. Changes apply to all screenshots in the project.

### Media Manager

Click **Media Library** in the sidebar to:
- View all uploaded assets (screenshots, mascots, icons)
- Upload new images with drag & drop
- Rename or delete existing assets

### Copy Between Platforms

Use the **⧉** button next to the platform tabs to copy your Android configuration to iOS (or vice versa). This saves time when creating similar screenshots for both stores.

## Generating PNG Files

1. Click **Generate** in the top right
2. Watch the progress modal as screenshots are rendered
3. Preview the generated images in the completion modal
4. Click **Open in Explorer** to access the output folder

Generated files are saved to `projects/{project-id}/output/{language}/{platform}/`.

## Project Structure

```
appstore-screenshots/
├── projects/               # Your projects (auto-created)
│   └── my-app/
│       ├── config.json     # Project configuration
│       ├── assets/         # Uploaded images
│       │   ├── screenshots/
│       │   ├── mascots/
│       │   └── icons/
│       └── output/         # Generated PNGs
│
├── src/
│   ├── server.ts           # Web server (route orchestration)
│   ├── renderer.ts         # Screenshot HTML rendering
│   ├── convert.ts          # HTML → PNG conversion
│   ├── projects.ts         # Project management
│   │
│   ├── types/              # TypeScript type definitions
│   ├── routes/             # API route modules
│   ├── lib/                # Shared utilities
│   │
│   └── ui/                 # Preact TSX frontend
│       ├── components/     # React-style components
│       │   ├── editors/    # Screenshot/glow/shape editors
│       │   ├── inputs/     # Form controls
│       │   └── modals/     # Dialogs
│       └── utils/          # API client, routing
│
├── dist/                   # Compiled UI bundle
├── scripts/                # Build scripts
└── deno.json               # Deno config & tasks
```

> See [docs/003-TSX-REFACTOR.md](docs/003-TSX-REFACTOR.md) for detailed architecture documentation.

## Rendering
The preview and export share the same renderer components to keep output consistent.
In the editor, the preview renders those components directly in the browser.
For generation, the server renders full HTML with React `renderToStaticMarkup`, then converts that HTML to PNG.

## Screenshot Options

### Phone Frame Settings

| Setting | Description | Range |
|---------|-------------|-------|
| Scale | Phone size relative to canvas | 50-100% |
| Bottom Offset | Distance from bottom edge | 0-100% |
| Rotation | Angle for dual phone layouts | 0-15° |
| Gap | Space between dual phones | 0-10% |

### Typography Settings

| Setting | Description | Range |
|---------|-------------|-------|
| Headline Size | Main text size | 3-8% |
| Subtitle Size | Secondary text size | 1.5-4% |
| Headline Weight | Font weight (400-900) | Regular to Black |
| Line Height | Text line spacing | 1.0-1.5 |
| Text Align | Left, center, or right | - |
| Padding | Horizontal margin | 2-15% |

### Glow Colors

Glows can use your palette colors (Primary, Secondary, Accent) or preset colors:
- `purple`, `blue`, `pink`, `cyan`
- `amber`, `green`, `red`, `orange`

You can also use the color picker for any custom hex color.

### Theme & Colors

Access the **Theme & Colors** modal from the sidebar to configure:

| Setting | Description |
|---------|-------------|
| **Color Palette** | Primary, secondary, and accent colors (hex) |
| **Preset Palettes** | Quick-apply palettes: Purple Night, Ocean Blue, Sunset, Forest, Rose, Midnight, Ember, Teal |
| **Background Gradient** | Choose from 10 gradient templates or use custom CSS |
| **Typography** | Font family and Google Fonts URL |

Gradient templates automatically use your palette colors:
- Solid Primary/Secondary
- Primary → Dark, Primary → Secondary, Secondary → Primary
- Radial Primary/Secondary
- Mesh Primary, Diagonal Split, Triple Gradient

### Mascot Options

| Setting | Description |
|---------|-------------|
| Position | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| Scale | Size relative to canvas (10-100%) |
| Offset X/Y | Fine-tune position in pixels |

### Feature Graphic Options

Feature graphics (1024×500) are used for Google Play Store headers.

| Setting | Description |
|---------|-------------|
| **Headline/Subtitle** | Text content with typography inherited from theme |
| **App Icon** | Select from uploaded icons in Media Manager |
| **Icon Box Scale** | Size of the icon container (50-150%) |
| **Icon Box Radius** | Corner roundness of container (0-50%) |
| **Icon Box Color** | Background color of container (hex) |
| **Icon Scale** | Image size within the box (50-150%) |
| **Icon Radius** | Corner roundness of icon image (0-50%) |
| **Icon Offset X/Y** | Fine-tune icon position |

## Dimensions

Default dimensions follow App Store / Google Play requirements:

| Platform | Screenshot Size | Feature Graphic |
|----------|----------------|-----------------|
| iOS | 1242 × 2688 | N/A |
| Android | 1242 × 2688 | 1024 × 500 |

## Troubleshooting

### Chrome not found

The converter searches for Chrome/Chromium automatically. If not found:

```bash
# Set the path manually
export PUPPETEER_EXECUTABLE_PATH="/path/to/chrome"
```

### Fonts not loading

Ensure you have an internet connection for Google Fonts loading during generation.

## Development

```bash
# Build UI bundle (required after UI changes)
deno task build:ui

# Run with file watching (UI + server)
deno task dev

# Type check
deno check src/server.ts
```

## License

MIT
