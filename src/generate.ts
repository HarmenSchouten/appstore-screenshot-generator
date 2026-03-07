#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Generate screenshot HTML files from configuration
 *
 * Usage:
 *   deno run --allow-read --allow-write src/generate.ts
 *   deno run --allow-read --allow-write src/generate.ts --lang en
 *   deno run --allow-read --allow-write src/generate.ts --platform android
 *   deno run --allow-read --allow-write src/generate.ts --lang nl --platform ios
 */

import { join } from '@std/path';
import { ensureDir } from '@std/fs';
import type {
  Screenshot,
  GlowEffect,
  Platform,
  Language,
  PlatformConfig,
  ScreenshotConfig,
} from './types.ts';

// Parse command line arguments
const parseArgs = () => {
  const args = Deno.args;
  return {
    lang: args.includes('--lang') ? args[args.indexOf('--lang') + 1] as Language : null,
    platform: args.includes('--platform') ? args[args.indexOf('--platform') + 1] as Platform : null,
  };
};

interface GenerateOptions {
  config: ScreenshotConfig;
  language: Language;
  platform: Platform;
  screenshot: Screenshot;
  screenshotNumber: number;
}

/**
 * Generate glow effect HTML
 */
const generateGlow = (glow: GlowEffect): string => {
  const styles = [
    `width: ${glow.size}px`,
    `height: ${glow.size}px`,
    glow.top !== undefined && `top: ${glow.top}`,
    glow.right !== undefined && `right: ${glow.right}`,
    glow.bottom !== undefined && `bottom: ${glow.bottom}`,
    glow.left !== undefined && `left: ${glow.left}`,
  ].filter(Boolean).join('; ');

  const needsTransform = glow.left?.includes('%');
  const transform = needsTransform ? ' transform: translateX(-50%);' : '';

  return `  <div class="glow ${glow.color}" style="${styles};${transform}"></div>`;
};

/**
 * Generate phone frame HTML
 */
const generatePhoneFrame = (
  imagePath: string,
  index: number,
  options: {
    platform: Platform;
    phoneFrame?: Screenshot['phoneFrame'];
    isDual: boolean;
    assetsBasePath: string;
    screenshotId: string;
  }
): string => {
  const { platform, phoneFrame, isDual, assetsBasePath, screenshotId } = options;
  const frameClass = `phone-frame ${platform}${phoneFrame?.wide ? ' wide' : ''}${phoneFrame?.small || isDual ? ' small' : ''}`;
  const tiltClass = isDual ? (index === 0 ? ' tilted-left' : ' tilted-right') : '';

  return `    <div class="${frameClass}${tiltClass}">
      <div class="phone-screen">
        <img src="../../../../${assetsBasePath}/${imagePath}" alt="${screenshotId}">
      </div>
    </div>`;
};

/**
 * Generate HTML template for a screenshot
 */
const generateScreenshotHTML = (options: GenerateOptions): string => {
  const { config, language, platform, screenshot, screenshotNumber } = options;
  const { theme, assetsBasePath, app } = config;

  const platformName = platform === 'ios' ? 'iOS' : 'Android';
  const isDual = Array.isArray(screenshot.imagePath);
  const images = Array.isArray(screenshot.imagePath) ? screenshot.imagePath : [screenshot.imagePath];

  const mascotPath = screenshot.mascot?.imagePath
    ? `../../../../${assetsBasePath}/${screenshot.mascot.imagePath}`
    : app.defaultMascotPath
      ? `../../../../${app.defaultMascotPath}`
      : null;

  const fontLink = theme.googleFontsUrl
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${theme.googleFontsUrl}" rel="stylesheet">`
    : '';

  return `<!DOCTYPE html>
<html lang="${language}" class="${platform}">
<head>
  <meta charset="UTF-8" />
  <title>${app.name} - Screenshot ${screenshotNumber}: ${screenshot.id} (${platformName})</title>
  ${fontLink}
  <link rel="stylesheet" href="../../../../src/shared.css">
  <style>
    .slide {
      background: ${theme.background.gradient};
    }
    body {
      font-family: ${theme.fontFamily};
    }
  </style>
</head>
<body>

<div class="slide">
${screenshot.glows.map(generateGlow).join('\n')}

  <div class="headline">
    <h1>${screenshot.headline}</h1>
    <p>${screenshot.subtitle}</p>
  </div>

  <div class="screenshot-area${isDual ? ' dual' : ''}">
${images.map((img, idx) => generatePhoneFrame(img, idx, {
  platform,
  phoneFrame: screenshot.phoneFrame,
  isDual,
  assetsBasePath,
  screenshotId: screenshot.id,
})).join('\n')}
  </div>
${mascotPath && screenshot.mascot ? `
  <div class="mascot ${screenshot.mascot.position}">
    <img src="${mascotPath}" alt="Mascot">
  </div>` : ''}
</div>

</body>
</html>
`;
};

/**
 * Generate HTML for Google Play feature graphic
 */
const generateFeatureGraphicHTML = (options: {
  config: ScreenshotConfig;
  language: Language;
  featureGraphic: NonNullable<PlatformConfig['featureGraphic']>;
}): string => {
  const { config, language, featureGraphic } = options;
  const { theme, assetsBasePath, app } = config;

  const imagePath = `../../../../${assetsBasePath}/${featureGraphic.imagePath}`;
  const mascotPath = app.defaultMascotPath ? `../../../../${app.defaultMascotPath}` : null;
  const iconPath = app.iconPath ? `../../../../${app.iconPath}` : null;

  const fontLink = theme.googleFontsUrl
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${theme.googleFontsUrl}" rel="stylesheet">`
    : '';

  return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8" />
  <title>${app.name} - Google Play Feature Graphic</title>
  ${fontLink}
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 1024px;
      height: 500px;
      overflow: hidden;
    }

    body {
      font-family: ${theme.fontFamily};
    }

    .feature-graphic {
      width: 1024px;
      height: 500px;
      background: ${theme.background.gradient};
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      padding: 0 80px;
    }

    .content {
      flex: 1;
      z-index: 10;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .logo-icon {
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .logo-icon img {
      width: 48px;
      height: 48px;
      object-fit: contain;
    }

    .logo-text {
      color: white;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .headline {
      color: white;
      margin-bottom: 16px;
    }

    .headline h1 {
      font-size: 48px;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -1px;
    }

    .headline p {
      font-size: 22px;
      font-weight: 500;
      opacity: 0.85;
      margin-top: 12px;
    }

    .phone-area {
      position: relative;
      width: 280px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .phone-frame {
      width: 200px;
      height: 420px;
      background: #1a1a2e;
      border-radius: 32px;
      padding: 8px;
      box-shadow:
        0 40px 80px rgba(0, 0, 0, 0.4),
        0 0 0 2px rgba(255, 255, 255, 0.1);
      transform: rotate(5deg);
    }

    .phone-screen {
      width: 100%;
      height: 100%;
      background: #000;
      border-radius: 24px;
      overflow: hidden;
    }

    .phone-screen img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .mascot {
      position: absolute;
      bottom: 0px;
      right: 260px;
      width: 120px;
      height: 120px;
      z-index: 20;
    }

    .mascot img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      pointer-events: none;
    }

    .glow.purple { background: #a855f7; }
    .glow.blue { background: #3b82f6; }
    .glow.pink { background: #ec4899; }
    .glow.cyan { background: #06b6d4; }
    .glow.amber { background: #f59e0b; }
    .glow.green { background: #22c55e; }
    .glow.red { background: #ef4444; }
    .glow.orange { background: #f97316; }
  </style>
</head>
<body>

<div class="feature-graphic">
${featureGraphic.glows.map(generateGlow).join('\n')}

  <div class="content">
    <div class="logo">
      ${iconPath ? `<div class="logo-icon">
        <img src="${iconPath}" alt="${app.name}">
      </div>` : ''}
      <span class="logo-text">${app.name}</span>
    </div>

    <div class="headline">
      <h1>${featureGraphic.headline}</h1>
      <p>${featureGraphic.subtitle}</p>
    </div>
  </div>

  <div class="phone-area">
    <div class="phone-frame">
      <div class="phone-screen">
        <img src="${imagePath}" alt="App Screenshot">
      </div>
    </div>
${mascotPath ? `
    <div class="mascot">
      <img src="${mascotPath}" alt="Mascot">
    </div>` : ''}
  </div>
</div>

</body>
</html>
`;
};

/**
 * Main generation function
 */
const generate = async (config: ScreenshotConfig) => {
  const { lang: langFilter, platform: platformFilter } = parseArgs();

  console.log('🎨 Generating screenshot HTML files\n');

  let totalGenerated = 0;

  for (const langConfig of config.languages) {
    if (langFilter && langConfig.language !== langFilter) continue;

    for (const [platformKey, platformConfig] of Object.entries(langConfig.platforms)) {
      const platform = platformKey as Platform;
      if (platformFilter && platform !== platformFilter) continue;

      const outputDir = join(Deno.cwd(), 'output', 'html', langConfig.language, platform);
      await ensureDir(outputDir);

      const emoji = platform === 'ios' ? '🍎' : '🤖';
      console.log(`${emoji} ${platform.toUpperCase()} (${langConfig.language})`);

      // Generate screenshot HTML files
      for (let i = 0; i < platformConfig.screenshots.length; i++) {
        const screenshot = platformConfig.screenshots[i];
        const filename = `${String(i + 1).padStart(2, '0')}-${screenshot.id}.html`;
        const filepath = join(outputDir, filename);

        const html = generateScreenshotHTML({
          config,
          language: langConfig.language,
          platform,
          screenshot,
          screenshotNumber: i + 1,
        });

        await Deno.writeTextFile(filepath, html);
        console.log(`   ✅ ${filename}`);
        totalGenerated++;
      }

      // Generate feature graphic for Android
      if (platform === 'android' && platformConfig.featureGraphic) {
        const filename = 'feature-graphic.html';
        const filepath = join(outputDir, filename);

        const html = generateFeatureGraphicHTML({
          config,
          language: langConfig.language,
          featureGraphic: platformConfig.featureGraphic,
        });

        await Deno.writeTextFile(filepath, html);
        console.log(`   ✅ ${filename}`);
        totalGenerated++;
      }

      console.log();
    }
  }

  console.log(`📊 Generated ${totalGenerated} HTML files\n`);
};

// Export for use as module
export { generate };

// Run if executed directly
if (import.meta.main) {
  const configPath = join(Deno.cwd(), 'config', 'config.ts');
  const { screenshotConfig } = await import(configPath);
  await generate(screenshotConfig);
}
