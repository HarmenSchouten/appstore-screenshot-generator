# App Store Screenshot Generator

![Deno](https://img.shields.io/badge/Deno-2.0+-000000?logo=deno&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Platforms](https://img.shields.io/badge/Platforms-iOS%20%7C%20Android-blue)
![License](https://img.shields.io/badge/License-MIT-green)

Configuration-based screenshot generator for App Store and Google Play. Define your screenshots once in TypeScript config files, then generate localized marketing images for multiple platforms.

## Features

- 📱 **Multi-platform** - Generate for iOS App Store and Google Play
- 🌍 **Multi-language** - Easy localization with separate config files per language
- 🎨 **Customizable themes** - Gradients, glow effects, phone frames
- 📐 **Pixel-perfect** - 2x supersampling for crisp output
- 🖼️ **Phone frames** - Realistic iOS and Android device frames
- 🎭 **Mascot support** - Optional character/branding elements
- 📊 **Feature graphics** - Google Play feature graphic generation

## Directory Structure

```
appstore-screenshots/
├── config/
│   ├── config.ts          # Main config (imports language configs)
│   └── config.en.ts       # English screenshot definitions
├── src/
│   ├── types.ts           # TypeScript type definitions
│   ├── generate.ts        # Config → HTML generation
│   ├── convert.ts         # HTML → PNG conversion
│   ├── build.ts           # Combined build script
│   └── shared.css         # Shared styles for templates
├── assets/                # Your app screenshots and images
│   ├── screenshots/       # Device screenshots
│   ├── icon.png           # App icon
│   └── mascot.png         # Optional mascot image
├── output/                # Generated files (gitignored)
│   ├── html/              # Intermediate HTML files
│   └── images/            # Final PNG screenshots
├── deno.json              # Deno tasks and imports
└── package.json           # npm scripts (wraps deno tasks)
```

## Quick Start

### Prerequisites

- [Deno](https://deno.land/) 2.0 or higher
- Google Chrome or Chromium (for PNG conversion)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/appstore-screenshots.git
cd appstore-screenshots

# Install dependencies (optional, for puppeteer)
npm install
```

### Generate Screenshots

```bash
# Generate all screenshots (HTML + PNG)
deno task build

# Or use npm
npm run build
```

### Development Server (Web UI)

```bash
# Start the development server with web UI
deno task dev

# Open http://localhost:3000 in your browser
```

The web UI allows you to:
- Preview all configured screenshots
- Switch between languages and platforms
- Generate screenshots with one click
- View build output

### Generate by Language

```bash
# English only
deno task build:en

# Or generate HTML and convert separately
deno task generate:en
deno task convert:en
```

## Configuration

### Main Config (`config/config.ts`)

```typescript
import type { ScreenshotConfig } from '../src/types.ts';
import { enConfig } from './config.en.ts';

export const screenshotConfig: ScreenshotConfig = {
  // App branding
  app: {
    name: 'My App',
    iconPath: 'assets/icon.png',
    defaultMascotPath: 'assets/mascot.png',
  },

  // Theme configuration
  theme: {
    background: {
      gradient: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 50%, #3730a3 100%)',
    },
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap',
  },

  assetsBasePath: 'assets',
  languages: [enConfig],
};
```

### Language Config (`config/config.en.ts`)

```typescript
import type { LanguageConfig } from '../src/types.ts';

export const enConfig: LanguageConfig = {
  language: 'en',
  platforms: {
    android: {
      dimensions: { width: 1242, height: 2688 },
      screenshots: [
        {
          id: 'hero',
          headline: 'Track your reading',
          subtitle: 'Your personal library',
          imagePath: 'screenshots/home.png',
          glows: [
            { color: 'purple', size: 600, top: '-200px', right: '-200px' },
            { color: 'blue', size: 500, bottom: '200px', left: '-150px' },
          ],
          phoneFrame: { wide: true },
          mascot: { position: 'bottom-right' },
        },
        // ... more screenshots
      ],
      featureGraphic: {
        headline: 'App Name',
        subtitle: 'Your tagline here',
        imagePath: 'screenshots/home.png',
        glows: [/* ... */],
      },
    },
    ios: {
      dimensions: { width: 1242, height: 2688 },
      screenshots: [/* ... */],
    },
  },
};
```

## Screenshot Options

### Glow Effects

Available colors: `purple`, `blue`, `pink`, `cyan`, `amber`, `green`, `red`, `orange`

```typescript
glows: [
  {
    color: 'purple',
    size: 600,        // Width/height in pixels
    top: '-200px',    // Position (top, right, bottom, left)
    right: '-200px',
  },
]
```

### Phone Frames

```typescript
phoneFrame: {
  wide: true,   // Wider frame variant
  small: true,  // Smaller frame (for dual layouts)
}
```

### Dual Phone Layout

Pass an array of image paths to show two phones side-by-side:

```typescript
{
  id: 'comparison',
  headline: 'Before & After',
  subtitle: 'See the difference',
  imagePath: ['screenshots/before.png', 'screenshots/after.png'],
  phoneFrame: { small: true },  // Recommended for dual layouts
  glows: [/* ... */],
}
```

### Mascot

```typescript
mascot: {
  position: 'bottom-right',  // bottom-right, bottom-left, top-right, top-left
  imagePath: 'mascot-alt.png',  // Optional, uses default if omitted
}
```

## Adding Languages

1. Copy `config/config.en.ts` to `config/config.nl.ts` (or your language code)
2. Update the `language` property and translate all text
3. Import in `config/config.ts`:

```typescript
import { enConfig } from './config.en.ts';
import { nlConfig } from './config.nl.ts';

export const screenshotConfig: ScreenshotConfig = {
  // ...
  languages: [enConfig, nlConfig],
};
```

4. Add tasks to `deno.json`:

```json
{
  "tasks": {
    "generate:nl": "deno run --allow-read --allow-write src/generate.ts --lang nl",
    "convert:nl": "deno run -A src/convert.ts --lang nl",
    "build:nl": "deno task generate:nl && deno task convert:nl"
  }
}
```

## Output

Screenshots are generated to `output/images/{language}/{platform}/`:

```
output/images/
├── en/
│   ├── android/
│   │   ├── 01-hero.png
│   │   ├── 02-feature-1.png
│   │   └── feature-graphic.png
│   └── ios/
│       ├── 01-hero.png
│       └── 02-feature-1.png
└── nl/
    └── ...
```

## Dimensions

Default dimensions follow App Store / Google Play requirements:

| Platform | Screenshot Size | Feature Graphic |
|----------|----------------|-----------------|
| iOS | 1242 × 2688 | N/A |
| Android | 1242 × 2688 | 1024 × 500 |

## Troubleshooting

### Chrome not found

The converter automatically searches for Chrome/Chromium. If not found:

```bash
# Set the path manually via environment variable
export PUPPETEER_EXECUTABLE_PATH="/path/to/chrome"
```

### Fonts not loading

Ensure you have an internet connection for Google Fonts, or use system fonts:

```typescript
theme: {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  // Remove googleFontsUrl to use system fonts
}
```

## License

MIT
