/**
 * Unified Screenshot Renderer
 * 
 * This module is the single source of truth for rendering screenshots.
 * Both the preview UI and the export generator use these functions.
 * 
 * All measurements use percentages to ensure consistency across preview and export.
 */

// Glow color definitions
export const GLOW_COLORS: Record<string, string> = {
  purple: '#a855f7',
  blue: '#3b82f6',
  pink: '#ec4899',
  cyan: '#06b6d4',
  amber: '#f59e0b',
  green: '#22c55e',
  red: '#ef4444',
  orange: '#f97316',
  white: '#ffffff',
};

// Type definitions
export interface GlowEffect {
  color: string;
  size: number;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface PhoneFrameOptions {
  scale?: number;
  bottomOffset?: number;
  dualRotation?: number;
  dualGap?: number;
}

export interface MascotOptions {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  imagePath?: string;
  size?: number;
  offset?: number;
  borderRadius?: number;
}

export interface Screenshot {
  id: string;
  headline: string;
  subtitle: string;
  headlineOffset?: number;
  imagePath: string | string[];
  glows: GlowEffect[];
  phoneFrame?: PhoneFrameOptions;
  mascot?: MascotOptions | null;
  typography?: TypographyOptions;
}

export interface TypographyOptions {
  headlineFontSize?: number;
  subtitleFontSize?: number;
  headlineFontWeight?: number;
  subtitleFontWeight?: number;
  headlineLineHeight?: number;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  horizontalPadding?: number;
}

export interface FeatureGraphic {
  headline: string;
  subtitle: string;
  imagePath: string;
  glows: GlowEffect[];
  showIcon?: boolean;
  showAppName?: boolean;
  phoneRotation?: number;
  phoneScale?: number;
  mascot?: MascotOptions | null;
  // Icon box styling
  iconBoxScale?: number;      // box size percentage, default 100
  iconBoxRadius?: number;     // box border radius in px
  iconBoxColor?: string;      // box background color
  // Icon image styling  
  iconScale?: number;         // image scale percentage, default 100
  iconRadius?: number;        // image border radius in px
  iconOffsetX?: number;       // image horizontal offset
  iconOffsetY?: number;       // image vertical offset
}

export interface ThemeConfig {
  background: { gradient: string };
  fontFamily: string;
  googleFontsUrl?: string;
}

export interface AppConfig {
  name: string;
  iconPath?: string;
  defaultMascotPath?: string;
}

export interface RenderOptions {
  screenshot: Screenshot;
  theme: ThemeConfig;
  app: AppConfig;
  dimensions: { width: number; height: number };
  assetUrlPrefix?: string; // For preview: '/assets/', for export: 'file:///...'
}

export interface FeatureGraphicRenderOptions {
  featureGraphic: FeatureGraphic;
  theme: ThemeConfig;
  app: AppConfig;
  assetUrlPrefix?: string;
}

/**
 * Phone frame CSS - iOS style frame with side buttons
 * Clean design matching real iPhone appearance
 */
const phoneFrameCSS = `
  .phone-frame {
    position: relative;
    background: linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 100%);
    border-radius: 70px;
    padding: 14px;
    box-shadow: 
      0 60px 120px rgba(0, 0, 0, 0.5),
      0 0 0 3px rgba(80, 80, 85, 0.6),
      inset 0 1px 1px rgba(255, 255, 255, 0.1);
  }
  
  /* Power button (right side) */
  .phone-frame::before {
    content: '';
    position: absolute;
    right: -6px;
    top: 20%;
    width: 6px;
    height: 6.5%;
    background: linear-gradient(90deg, #3a3a3e 0%, #2a2a2e 50%, #1a1a1e 100%);
    border-radius: 0 4px 4px 0;
    box-shadow: 1px 0 2px rgba(0, 0, 0, 0.3);
  }
  
  /* Mute switch + Volume buttons (left side) */
  /* Uses box-shadow stacking: mute switch (main), volume up (+70px), volume down (+130px) */
  .phone-frame::after {
    content: '';
    position: absolute;
    left: -6px;
    top: 14.5%;
    width: 6px;
    height: 2.2%;
    background: linear-gradient(270deg, #3a3a3e 0%, #2a2a2e 50%, #1a1a1e 100%);
    border-radius: 4px 0 0 4px;
    box-shadow: 
      -1px 0 2px rgba(0, 0, 0, 0.3),
      0 70px 0 0 #2a2a2e,
      0 130px 0 0 #2a2a2e;
  }
  
  .phone-screen {
    width: 100%;
    aspect-ratio: 9 / 19.5;
    background: #000;
    border-radius: 56px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .phone-screen img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/**
 * Glow effect CSS
 */
const glowCSS = `
  .glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(12%);
    opacity: 0.5;
    pointer-events: none;
  }
`;

/**
 * Generate the base styles used by all screenshots
 */
export function getBaseStyles(theme: ThemeConfig): string {
  const fontUrl = theme.googleFontsUrl 
    ? `@import url('${theme.googleFontsUrl}');` 
    : '';
    
  return `
    ${fontUrl}
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    
    body {
      font-family: ${theme.fontFamily};
    }
    
    .screenshot {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      background: ${theme.background.gradient};
    }
    
    .headline-area {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      text-align: center;
      color: white;
      padding: 5% 6% 3% 6%;
      z-index: 10;
    }
    
    .headline-area h1 {
      font-size: 5%;
      font-weight: 800;
      line-height: 1.15;
      margin-bottom: 0.8%;
      letter-spacing: -0.02em;
      text-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    
    .headline-area p {
      font-size: 2.2%;
      font-weight: 500;
      opacity: 0.9;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    
    .phone-area {
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: flex-end;
    }
    
    .mascot {
      position: absolute;
      z-index: 20;
    }
    
    .mascot img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    ${phoneFrameCSS}
    ${glowCSS}
  `;
}

/**
 * Create asset URL based on context (preview vs export)
 */
function assetUrl(path: string | undefined, prefix: string): string {
  if (!path) return '';
  // Remove leading 'assets/' if present since prefix handles it
  const cleanPath = path.replace(/^assets\//, '');
  return `${prefix}${cleanPath}`;
}

/**
 * Render glow effects
 */
function renderGlows(glows: GlowEffect[], containerWidth: number): string {
  return glows.map(glow => {
    // Support both named colors and hex values
    const color = glow.color.startsWith('#') 
      ? glow.color 
      : (GLOW_COLORS[glow.color] || GLOW_COLORS.purple);
    // Size is relative to container width
    const sizePercent = (glow.size / containerWidth) * 100;
    
    const styles = [
      'position: absolute',
      'border-radius: 50%',
      `width: ${sizePercent}%`,
      `height: ${sizePercent}%`,
      `background: ${color}`,
      'filter: blur(80px)',
      'opacity: 0.5',
      glow.top && `top: ${glow.top}`,
      glow.right && `right: ${glow.right}`,
      glow.bottom && `bottom: ${glow.bottom}`,
      glow.left && `left: ${glow.left}`,
    ].filter(Boolean).join('; ');
    
    return `<div style="${styles}"></div>`;
  }).join('\n');
}

/**
 * Render a single phone frame
 */
function renderPhoneFrame(imageUrl: string, widthPercent: number, rotation: number = 0, extraStyles: string = ''): string {
  const rotateStyle = rotation !== 0 ? `transform: rotate(${rotation}deg);` : '';
  
  return `
    <div style="width: ${widthPercent}%; ${rotateStyle} ${extraStyles}">
      <div class="phone-frame">
        <div class="phone-screen">
          ${imageUrl ? `<img src="${imageUrl}" alt="Screenshot" />` : '<div style="width:100%;height:100%;background:#1a1a1a;"></div>'}
        </div>
      </div>
    </div>
  `;
}

/**
 * Render phones (single or dual)
 */
function renderPhones(options: RenderOptions): string {
  const { screenshot, assetUrlPrefix = '/assets/' } = options;
  const isDual = Array.isArray(screenshot.imagePath);
  const images = isDual ? screenshot.imagePath as string[] : [screenshot.imagePath as string];
  
  const phoneScale = screenshot.phoneFrame?.scale ?? (isDual ? 42 : 70);
  const bottomOffset = screenshot.phoneFrame?.bottomOffset ?? 6;
  const dualRotation = screenshot.phoneFrame?.dualRotation ?? 6;
  const dualGap = screenshot.phoneFrame?.dualGap ?? 2;
  
  if (isDual) {
    const phones = images.map((img, i) => {
      const rotation = i === 0 ? -dualRotation : dualRotation;
      const zIndex = i === 0 ? 1 : 2;
      const margin = i === 0 ? 'margin-right: -2%;' : 'margin-left: -2%;';
      return renderPhoneFrame(
        assetUrl(img, assetUrlPrefix),
        phoneScale,
        rotation,
        `z-index: ${zIndex}; ${margin}`
      );
    }).join('\n');
    
    return `
      <div class="phone-area" style="bottom: ${bottomOffset}%;">
        <div style="display: flex; justify-content: center; align-items: flex-end; gap: ${dualGap}%; width: 100%; padding: 0 3%;">
          ${phones}
        </div>
      </div>
    `;
  } else {
    const horizontalPadding = (100 - phoneScale) / 2;
    return `
      <div class="phone-area" style="bottom: ${bottomOffset}%; padding-left: ${horizontalPadding}%; padding-right: ${horizontalPadding}%;">
        ${renderPhoneFrame(assetUrl(images[0], assetUrlPrefix), 100)}
      </div>
    `;
  }
}

/**
 * Render mascot
 */
function renderMascot(mascot: MascotOptions | null | undefined, app: AppConfig, assetUrlPrefix: string): string {
  if (!mascot) return '';
  
  const size = mascot.size ?? 8; // percentage of container width
  const offset = mascot.offset ?? 20; // pixels from edge
  const borderRadius = mascot.borderRadius ?? 0;
  
  const imagePath = mascot.imagePath || app.defaultMascotPath;
  if (!imagePath) return '';
  
  const positionStyles = [
    mascot.position.includes('bottom') && `bottom: ${offset}px`,
    mascot.position.includes('top') && `top: ${offset}px`,
    mascot.position.includes('right') && `right: ${offset}px`,
    mascot.position.includes('left') && `left: ${offset}px`,
  ].filter(Boolean).join('; ');
  
  // Border radius as percentage (50 = circular, 20 = rounded corners)
  // The container uses aspect-ratio: 1 to ensure it's always square
  const borderRadiusStyle = borderRadius > 0 ? `border-radius: ${borderRadius}%;` : '';
  
  return `
    <div class="mascot" style="width: ${size}%; aspect-ratio: 1; ${positionStyles}; overflow: hidden; ${borderRadiusStyle}">
      <img src="${assetUrl(imagePath, assetUrlPrefix)}" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
  `;
}

/**
 * Render a complete screenshot HTML document
 */
export function renderScreenshot(options: RenderOptions): string {
  const { screenshot, theme, app, dimensions, assetUrlPrefix = '/assets/' } = options;
  
  // Use viewport width for relative sizing
  const baseStyles = getBaseStyles(theme);
  
  // Typography settings with defaults
  const typo = screenshot.typography || {};
  const headlineFontSize = dimensions.width * ((typo.headlineFontSize ?? 5.2) / 100);
  const subtitleFontSize = dimensions.width * ((typo.subtitleFontSize ?? 2.4) / 100);
  const headlineFontWeight = typo.headlineFontWeight ?? 800;
  const subtitleFontWeight = typo.subtitleFontWeight ?? 500;
  const headlineLineHeight = typo.headlineLineHeight ?? 1.15;
  const textColor = typo.textColor ?? 'white';
  const textAlign = typo.textAlign ?? 'center';
  const horizontalPadding = typo.horizontalPadding ?? 6;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=${dimensions.width}, height=${dimensions.height}" />
  <title>${app.name} - ${screenshot.id}</title>
  <style>
    ${baseStyles}
    
    .headline-area {
      text-align: ${textAlign};
      color: ${textColor};
      padding-left: ${horizontalPadding}%;
      padding-right: ${horizontalPadding}%;
    }
    
    .headline-area h1 {
      font-size: ${headlineFontSize}px;
      font-weight: ${headlineFontWeight};
      line-height: ${headlineLineHeight};
    }
    
    .headline-area p {
      font-size: ${subtitleFontSize}px;
      font-weight: ${subtitleFontWeight};
    }
  </style>
</head>
<body>
  <div class="screenshot">
    <!-- Glow Effects -->
    ${renderGlows(screenshot.glows, dimensions.width)}
    
    <!-- Headline -->
    <div class="headline-area" style="top: ${screenshot.headlineOffset ?? 0}%">
      <h1>${screenshot.headline}</h1>
      <p>${screenshot.subtitle}</p>
    </div>
    
    <!-- Phone Mockups -->
    ${renderPhones(options)}
    
    <!-- Mascot -->
    ${renderMascot(screenshot.mascot, app, assetUrlPrefix)}
  </div>
</body>
</html>`;
}

/**
 * Render feature graphic HTML (1024x500)
 */
export function renderFeatureGraphic(options: FeatureGraphicRenderOptions): string {
  const { featureGraphic, theme, app, assetUrlPrefix = '/assets/' } = options;
  
  const phoneRotation = featureGraphic.phoneRotation ?? 5;
  const phoneScale = featureGraphic.phoneScale ?? 100;
  const showIcon = featureGraphic.showIcon !== false;
  const showAppName = featureGraphic.showAppName !== false;
  // Icon box
  const iconBoxScale = featureGraphic.iconBoxScale ?? 100;
  const iconBoxRadius = featureGraphic.iconBoxRadius ?? 16;
  const iconBoxColor = featureGraphic.iconBoxColor || 'rgba(255,255,255,0.15)';
  const iconBoxSize = Math.round(64 * iconBoxScale / 100);
  // Icon image
  const iconScale = featureGraphic.iconScale ?? 100;
  const iconRadius = featureGraphic.iconRadius ?? 0;
  const iconOffsetX = featureGraphic.iconOffsetX ?? 0;
  const iconOffsetY = featureGraphic.iconOffsetY ?? 0;
  const iconImgSize = Math.round(48 * iconBoxScale / 100 * iconScale / 100);
  
  const fontUrl = theme.googleFontsUrl 
    ? `@import url('${theme.googleFontsUrl}');` 
    : '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=1024, height=500" />
  <title>${app.name} - Feature Graphic</title>
  <style>
    ${fontUrl}
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 1024px; height: 500px; overflow: hidden; }
    body { font-family: ${theme.fontFamily}; }
    
    .feature-graphic {
      width: 100%;
      height: 100%;
      background: ${theme.background.gradient};
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      padding: 0 80px;
    }
    
    .glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.5;
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
      width: ${iconBoxSize}px;
      height: ${iconBoxSize}px;
      background: ${iconBoxColor};
      border-radius: ${iconBoxRadius}px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    .logo-icon img {
      width: ${iconImgSize}px;
      height: ${iconImgSize}px;
      object-fit: contain;
      border-radius: ${iconRadius}px;
      transform: translate(${iconOffsetX}px, ${iconOffsetY}px);
    }
    
    .logo-text {
      color: white;
      font-size: 32px;
      font-weight: 800;
    }
    
    .headline h1 {
      color: white;
      font-size: 48px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 12px;
    }
    
    .headline p {
      color: white;
      font-size: 22px;
      font-weight: 500;
      opacity: 0.85;
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
      width: ${200 * phoneScale / 100}px;
      height: ${420 * phoneScale / 100}px;
      background: linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 100%);
      border-radius: 28px;
      padding: 6px;
      box-shadow: 
        0 40px 80px rgba(0,0,0,0.4), 
        0 0 0 2px rgba(80, 80, 85, 0.5),
        inset 0 1px 1px rgba(255,255,255,0.1);
      transform: rotate(${phoneRotation}deg);
      position: relative;
    }
    
    .phone-screen {
      width: 100%;
      height: 100%;
      background: #000;
      border-radius: 22px;
      overflow: hidden;
    }
    
    .phone-screen img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .mascot {
      position: absolute;
      z-index: 20;
    }
    
    .mascot img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  </style>
</head>
<body>
  <div class="feature-graphic">
    <!-- Glows -->
    ${featureGraphic.glows.map(glow => `
      <div class="glow" style="
        width: ${glow.size}px;
        height: ${glow.size}px;
        background: ${GLOW_COLORS[glow.color] || GLOW_COLORS.purple};
        ${glow.top ? `top: ${glow.top};` : ''}
        ${glow.right ? `right: ${glow.right};` : ''}
        ${glow.bottom ? `bottom: ${glow.bottom};` : ''}
        ${glow.left ? `left: ${glow.left};` : ''}
      "></div>
    `).join('\n')}
    
    <!-- Content -->
    <div class="content">
      ${(showIcon || showAppName) ? `
        <div class="logo">
          ${showIcon && app.iconPath ? `
            <div class="logo-icon">
              <img src="${assetUrl(app.iconPath, assetUrlPrefix)}" alt="${app.name}" />
            </div>
          ` : ''}
          ${showAppName ? `<span class="logo-text">${app.name}</span>` : ''}
        </div>
      ` : ''}
      
      <div class="headline">
        <h1>${featureGraphic.headline}</h1>
        <p>${featureGraphic.subtitle}</p>
      </div>
    </div>
    
    <!-- Phone -->
    <div class="phone-area">
      <div class="phone-frame">
        <div class="phone-screen">
          ${featureGraphic.imagePath ? `<img src="${assetUrl(featureGraphic.imagePath, assetUrlPrefix)}" alt="Screenshot" />` : ''}
        </div>
      </div>
    </div>
    ${featureGraphic.mascot ? (() => {
      const mascot = featureGraphic.mascot;
      const size = mascot.size || 120;
      const offset = mascot.offset || 20;
      const position = mascot.position || 'bottom-right';
      const posStyles = [
        position.includes('bottom') ? `bottom: ${offset}px` : `top: ${offset}px`,
        position.includes('right') ? `right: ${offset}px` : `left: ${offset}px`,
      ].join('; ');
      return `
        <div class="mascot" style="
          width: ${size}px;
          height: ${size}px;
          ${posStyles};
          overflow: hidden;
          ${mascot.borderRadius ? `border-radius: ${mascot.borderRadius}px;` : ''}
        ">
          <img src="${assetUrl(mascot.imagePath || app.defaultMascotPath, assetUrlPrefix)}" 
               style="width: 100%; height: 100%; object-fit: contain;" />
        </div>
      `;
    })() : ''}
  </div>
</body>
</html>`;
}

/**
 * Render preview HTML - same as screenshot but optimized for small display
 * Uses the exact same rendering, just different wrapper
 */
export function renderPreviewHTML(options: RenderOptions): string {
  return renderScreenshot(options);
}
