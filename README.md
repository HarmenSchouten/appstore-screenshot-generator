# App Store Screenshot Generator

![Deno](https://img.shields.io/badge/Deno-2.0+-000000?logo=deno&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Platforms](https://img.shields.io/badge/Platforms-iOS%20%7C%20Android-blue)
![License](https://img.shields.io/badge/License-MIT-green)

Visual screenshot generator for App Store and Google Play. Create professional marketing screenshots with a real-time preview editor—no code required.

## Features

- 🎨 **Visual Editor** - Design screenshots with live preview, no config files needed
- 📱 **Multi-platform** - Generate for both iOS App Store and Google Play
- 🌍 **Multi-language** - Create localized versions for each market
- 🖼️ **Phone Frames** - Realistic iOS and Android device frames with customizable scale
- ✨ **Glow Effects** - Dynamic gradient glows for depth and visual interest
- 🎭 **Mascot Support** - Add character/branding elements with positioning controls
- 📊 **Feature Graphics** - Google Play feature graphic generation
- 📁 **Project Management** - Organize multiple apps with separate configurations
- 🔗 **Shareable URLs** - Deep links to specific screenshots for team collaboration

## Quick Start

### Prerequisites

- [Deno](https://deno.land/) 2.0 or higher
- Google Chrome or Chromium (for PNG export)

### Run the Editor

```bash
# Clone and start
git clone https://github.com/yourusername/appstore-screenshots.git
cd appstore-screenshots
deno task dev
```

Open **http://localhost:3000** in your browser.

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
   - **Background Glows**: Add colorful gradient orbs
   - **Mascot**: Optional character overlay with position controls

### URL Routing

Every screenshot has a stable URL in the format:
```
http://localhost:3000/{project}/{language}/{platform}/{screenshot-id}
```

Share these links with your team to reference specific screenshots.

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
│       │   └── mascots/
│       └── output/         # Generated PNGs
│           ├── en/
│           │   ├── android/
│           │   └── ios/
│           └── nl/
│               └── ...
├── src/
│   ├── server.ts           # Web UI server
│   ├── renderer.ts         # Screenshot rendering
│   ├── convert.ts          # HTML → PNG conversion
│   ├── projects.ts         # Project management
│   └── types.ts            # TypeScript definitions
└── deno.json               # Deno tasks
```

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

Available colors for background glows:
- `purple`, `blue`, `pink`, `cyan`
- `amber`, `green`, `red`, `orange`

### Mascot Options

| Setting | Description |
|---------|-------------|
| Position | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| Scale | Size relative to canvas (10-100%) |
| Offset X/Y | Fine-tune position in pixels |

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

### Preview not matching output

The preview uses an iframe with the same renderer as export—what you see is what you get. If there's a mismatch, try refreshing the browser.

## Development

```bash
# Type check
deno check src/server.ts

# Run with file watching
deno task dev
```

## License

MIT
