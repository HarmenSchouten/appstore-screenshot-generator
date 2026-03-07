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

/** Available shape types for decorative elements */
export type ShapeType = 
  | 'circle' | 'ring' | 'rectangle' | 'pill'
  | 'curved-line' | 's-curve' | 'wave-line'
  | 'chevron' | 'double-chevron' | 'arrow'
  | 'triangle' | 'diamond' | 'hexagon' | 'star' | 'sparkle' | 'cross'
  | 'blob' | 'crescent'
  | 'dots-grid' | 'scattered-dots';

/** Decorative shape configuration */
export interface Shape {
  type: ShapeType;
  size: number;
  color: string;
  opacity?: number;
  blur?: number;
  rotation?: number;
  zIndex?: number;
  // Position as percentages (0-100, where 50 is center)
  posX?: number;
  posY?: number;
  filled?: boolean;
  strokeWidth?: number;
  borderRadius?: number;
  // Line-specific
  orientation?: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  curvature?: number;
  dashStyle?: 'solid' | 'dashed' | 'dotted';
  lineCap?: 'round' | 'square' | 'butt';
  // Chevron-specific
  direction?: 'up' | 'down' | 'left' | 'right';
  angle?: number;
  count?: number;
  gap?: number;
  // Star/sparkle-specific
  points?: number;
  innerRadius?: number;
  // Pattern-specific
  rows?: number;
  columns?: number;
  spacing?: number;
  dotSize?: number;
  // Blob-specific
  complexity?: number;
  seed?: number;
  // Crescent-specific
  arcPercentage?: number;
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
  shapes?: Shape[];
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
  shapes?: Shape[];
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
 * Get line coordinates from orientation preset or explicit values
 */
function getLineCoordinates(shape: Shape): { startX: number; startY: number; endX: number; endY: number } {
  // If explicit coordinates provided, use them
  if (shape.startX !== undefined && shape.endX !== undefined) {
    return {
      startX: shape.startX,
      startY: shape.startY ?? 50,
      endX: shape.endX,
      endY: shape.endY ?? 50
    };
  }
  
  // Otherwise derive from orientation
  const orientation = shape.orientation ?? 'horizontal';
  switch (orientation) {
    case 'horizontal':
      return { startX: 10, startY: 50, endX: 90, endY: 50 };
    case 'vertical':
      return { startX: 50, startY: 10, endX: 50, endY: 90 };
    case 'diagonal-down':
      return { startX: 10, startY: 10, endX: 90, endY: 90 };
    case 'diagonal-up':
      return { startX: 10, startY: 90, endX: 90, endY: 10 };
    default:
      return { startX: 10, startY: 50, endX: 90, endY: 50 };
  }
}

/**
 * Generate SVG path for different shape types
 */
function generateShapeSVG(shape: Shape): string {
  const { type, color, opacity = 0.2, strokeWidth = 2, filled = false } = shape;
  const opacityAttr = `opacity="${opacity}"`;
  
  // Common SVG wrapper attributes
  const lineCap = shape.lineCap || 'round';
  const lineJoin = 'round';
  const dashArray = shape.dashStyle === 'dashed' ? 'stroke-dasharray="10 5"' : 
                    shape.dashStyle === 'dotted' ? 'stroke-dasharray="2 4"' : '';
  
  switch (type) {
    case 'circle':
      return `<circle cx="50%" cy="50%" r="45%" fill="${color}" ${opacityAttr} />`;
    
    case 'ring':
      return `<circle cx="50%" cy="50%" r="45%" fill="none" stroke="${color}" stroke-width="${strokeWidth}" ${opacityAttr} />`;
    
    case 'rectangle': {
      const rx = shape.borderRadius ?? 0;
      if (filled) {
        return `<rect x="5%" y="5%" width="90%" height="90%" rx="${rx}%" fill="${color}" ${opacityAttr} />`;
      }
      return `<rect x="5%" y="5%" width="90%" height="90%" rx="${rx}%" fill="none" stroke="${color}" stroke-width="${strokeWidth}" ${opacityAttr} />`;
    }
    
    case 'pill':
      if (filled) {
        return `<rect x="5%" y="20%" width="90%" height="60%" rx="30%" fill="${color}" ${opacityAttr} />`;
      }
      return `<rect x="5%" y="20%" width="90%" height="60%" rx="30%" fill="none" stroke="${color}" stroke-width="${strokeWidth}" ${opacityAttr} />`;
    
    case 'curved-line': {
      const { startX, startY, endX, endY } = getLineCoordinates(shape);
      const curvature = shape.curvature ?? 30;
      const orientation = shape.orientation ?? 'horizontal';
      
      // Calculate control point - curvature sign determines direction
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      let cpX = midX, cpY = midY;
      
      // For horizontal-ish lines, curve vertically; for vertical-ish, curve horizontally
      if (orientation === 'horizontal' || orientation === 'diagonal-down' || orientation === 'diagonal-up') {
        cpY = midY - curvature; // Positive = curve up, negative = curve down
      } else {
        cpX = midX - curvature; // Positive = curve left, negative = curve right
      }
      
      return `<path d="M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}" 
                    fill="none" stroke="${color}" stroke-width="${strokeWidth}" 
                    stroke-linecap="${lineCap}" ${dashArray} ${opacityAttr} />`;
    }
    
    case 's-curve': {
      const { startX, startY, endX, endY } = getLineCoordinates(shape);
      const curvature = Math.abs(shape.curvature ?? 40);
      const flip = (shape.curvature ?? 40) < 0 ? -1 : 1;
      
      // S-curve uses cubic bezier with two control points
      const cp1X = startX + (endX - startX) * 0.3;
      const cp1Y = startY - curvature * flip;
      const cp2X = startX + (endX - startX) * 0.7;
      const cp2Y = endY + curvature * flip;
      
      return `<path d="M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}" 
                    fill="none" stroke="${color}" stroke-width="${strokeWidth}" 
                    stroke-linecap="${lineCap}" ${dashArray} ${opacityAttr} />`;
    }
    
    case 'wave-line': {
      const { startX, startY, endX } = getLineCoordinates(shape);
      const waves = shape.count ?? 3;
      const amplitude = Math.abs(shape.curvature ?? 15);
      const flip = (shape.curvature ?? 15) < 0 ? -1 : 1;
      
      const segmentWidth = (endX - startX) / waves;
      let path = `M ${startX} ${startY}`;
      
      for (let i = 0; i < waves; i++) {
        const x1 = startX + segmentWidth * i + segmentWidth * 0.5;
        const y1 = i % 2 === 0 ? startY - amplitude * flip : startY + amplitude * flip;
        const x2 = startX + segmentWidth * (i + 1);
        const y2 = startY;
        path += ` Q ${x1} ${y1}, ${x2} ${y2}`;
      }
      
      return `<path d="${path}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" 
                    stroke-linecap="${lineCap}" ${dashArray} ${opacityAttr} />`;
    }
    
    case 'chevron': {
      const angle = shape.angle ?? 60;
      const dir = shape.direction ?? 'right';
      const halfAngle = angle / 2;
      
      let points: string;
      if (dir === 'right') {
        points = `30,${50 - halfAngle/2} 70,50 30,${50 + halfAngle/2}`;
      } else if (dir === 'left') {
        points = `70,${50 - halfAngle/2} 30,50 70,${50 + halfAngle/2}`;
      } else if (dir === 'up') {
        points = `${50 - halfAngle/2},70 50,30 ${50 + halfAngle/2},70`;
      } else {
        points = `${50 - halfAngle/2},30 50,70 ${50 + halfAngle/2},30`;
      }
      
      if (filled) {
        return `<polyline points="${points}" fill="${color}" stroke="${color}" stroke-width="${strokeWidth}" 
                          stroke-linecap="${lineCap}" stroke-linejoin="${lineJoin}" ${opacityAttr} />`;
      }
      return `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" 
                        stroke-linecap="${lineCap}" stroke-linejoin="${lineJoin}" ${opacityAttr} />`;
    }
    
    case 'double-chevron': {
      const angle = shape.angle ?? 60;
      const dir = shape.direction ?? 'right';
      const gap = shape.gap ?? 15;
      const halfAngle = angle / 2;
      
      let chevron1: string, chevron2: string;
      if (dir === 'right') {
        chevron1 = `<polyline points="${25 - gap/2},${50 - halfAngle/2} ${65 - gap/2},50 ${25 - gap/2},${50 + halfAngle/2}" 
                              fill="none" stroke="${color}" stroke-width="${strokeWidth}" 
                              stroke-linecap="${lineCap}" stroke-linejoin="${lineJoin}" ${opacityAttr} />`;
        chevron2 = `<polyline points="${35 + gap/2},${50 - halfAngle/2} ${75 + gap/2},50 ${35 + gap/2},${50 + halfAngle/2}" 
                              fill="none" stroke="${color}" stroke-width="${strokeWidth}" 
                              stroke-linecap="${lineCap}" stroke-linejoin="${lineJoin}" ${opacityAttr} />`;
      } else {
        chevron1 = `<polyline points="${75 + gap/2},${50 - halfAngle/2} ${35 + gap/2},50 ${75 + gap/2},${50 + halfAngle/2}" 
                              fill="none" stroke="${color}" stroke-width="${strokeWidth}" 
                              stroke-linecap="${lineCap}" stroke-linejoin="${lineJoin}" ${opacityAttr} />`;
        chevron2 = `<polyline points="${65 - gap/2},${50 - halfAngle/2} ${25 - gap/2},50 ${65 - gap/2},${50 + halfAngle/2}" 
                              fill="none" stroke="${color}" stroke-width="${strokeWidth}" 
                              stroke-linecap="${lineCap}" stroke-linejoin="${lineJoin}" ${opacityAttr} />`;
      }
      return chevron1 + chevron2;
    }
    
    case 'arrow': {
      const dir = shape.direction ?? 'right';
      const headSize = 25;
      
      let path: string;
      if (dir === 'right') {
        path = `M 15 50 L 75 50 M 60 ${50 - headSize/2} L 75 50 L 60 ${50 + headSize/2}`;
      } else if (dir === 'left') {
        path = `M 85 50 L 25 50 M 40 ${50 - headSize/2} L 25 50 L 40 ${50 + headSize/2}`;
      } else if (dir === 'up') {
        path = `M 50 85 L 50 25 M ${50 - headSize/2} 40 L 50 25 L ${50 + headSize/2} 40`;
      } else {
        path = `M 50 15 L 50 75 M ${50 - headSize/2} 60 L 50 75 L ${50 + headSize/2} 60`;
      }
      
      return `<path d="${path}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" 
                    stroke-linecap="${lineCap}" stroke-linejoin="${lineJoin}" ${opacityAttr} />`;
    }
    
    case 'triangle': {
      if (filled) {
        return `<polygon points="50,10 90,90 10,90" fill="${color}" ${opacityAttr} />`;
      }
      return `<polygon points="50,10 90,90 10,90" fill="none" stroke="${color}" 
                       stroke-width="${strokeWidth}" stroke-linejoin="${lineJoin}" ${opacityAttr} />`;
    }
    
    case 'diamond': {
      if (filled) {
        return `<polygon points="50,5 95,50 50,95 5,50" fill="${color}" ${opacityAttr} />`;
      }
      return `<polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="${color}" 
                       stroke-width="${strokeWidth}" stroke-linejoin="${lineJoin}" ${opacityAttr} />`;
    }
    
    case 'hexagon': {
      // Regular hexagon points
      const points = "50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5";
      if (filled) {
        return `<polygon points="${points}" fill="${color}" ${opacityAttr} />`;
      }
      return `<polygon points="${points}" fill="none" stroke="${color}" 
                       stroke-width="${strokeWidth}" stroke-linejoin="${lineJoin}" ${opacityAttr} />`;
    }
    
    case 'star': {
      const numPoints = shape.points ?? 5;
      const innerR = shape.innerRadius ?? 0.4;
      const outerR = 45;
      const innerRadius = outerR * innerR;
      
      let points = '';
      for (let i = 0; i < numPoints * 2; i++) {
        const radius = i % 2 === 0 ? outerR : innerRadius;
        const angle = (i * Math.PI) / numPoints - Math.PI / 2;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        points += `${x},${y} `;
      }
      
      if (filled) {
        return `<polygon points="${points.trim()}" fill="${color}" ${opacityAttr} />`;
      }
      return `<polygon points="${points.trim()}" fill="none" stroke="${color}" 
                       stroke-width="${strokeWidth}" stroke-linejoin="${lineJoin}" ${opacityAttr} />`;
    }
    
    case 'sparkle': {
      // 4-pointed starburst
      const innerR = shape.innerRadius ?? 0.2;
      const outerR = 45;
      const innerRadius = outerR * innerR;
      
      let points = '';
      for (let i = 0; i < 8; i++) {
        const radius = i % 2 === 0 ? outerR : innerRadius;
        const angle = (i * Math.PI) / 4 - Math.PI / 2;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        points += `${x},${y} `;
      }
      
      if (filled) {
        return `<polygon points="${points.trim()}" fill="${color}" ${opacityAttr} />`;
      }
      return `<polygon points="${points.trim()}" fill="none" stroke="${color}" 
                       stroke-width="${strokeWidth}" stroke-linejoin="${lineJoin}" ${opacityAttr} />`;
    }
    
    case 'cross': {
      const armWidth = 20;
      if (filled) {
        return `<polygon points="${50-armWidth/2},5 ${50+armWidth/2},5 ${50+armWidth/2},${50-armWidth/2} 
                                 95,${50-armWidth/2} 95,${50+armWidth/2} ${50+armWidth/2},${50+armWidth/2} 
                                 ${50+armWidth/2},95 ${50-armWidth/2},95 ${50-armWidth/2},${50+armWidth/2} 
                                 5,${50+armWidth/2} 5,${50-armWidth/2} ${50-armWidth/2},${50-armWidth/2}" 
                        fill="${color}" ${opacityAttr} />`;
      }
      return `<path d="M 50 5 L 50 95 M 5 50 L 95 50" fill="none" stroke="${color}" 
                    stroke-width="${strokeWidth}" stroke-linecap="${lineCap}" ${opacityAttr} />`;
    }
    
    case 'blob': {
      const complexity = shape.complexity ?? 6;
      const seed = shape.seed ?? 1;
      
      // Generate pseudo-random blob using seed
      const seededRandom = (s: number) => {
        const x = Math.sin(s) * 10000;
        return x - Math.floor(x);
      };
      
      // Create smooth blob using path with bezier curves
      const blobPoints: Array<{x: number, y: number}> = [];
      for (let i = 0; i < complexity; i++) {
        const angle = (i / complexity) * Math.PI * 2;
        const randomRadius = 30 + seededRandom(seed + i) * 20;
        blobPoints.push({
          x: 50 + randomRadius * Math.cos(angle),
          y: 50 + randomRadius * Math.sin(angle)
        });
      }
      
      // Generate smooth path
      let path = `M ${blobPoints[0].x} ${blobPoints[0].y}`;
      for (let i = 0; i < blobPoints.length; i++) {
        const p0 = blobPoints[(i - 1 + blobPoints.length) % blobPoints.length];
        const p1 = blobPoints[i];
        const p2 = blobPoints[(i + 1) % blobPoints.length];
        const p3 = blobPoints[(i + 2) % blobPoints.length];
        
        // Catmull-Rom to Bezier conversion
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      }
      path += ' Z';
      
      if (filled) {
        return `<path d="${path}" fill="${color}" ${opacityAttr} />`;
      }
      return `<path d="${path}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" ${opacityAttr} />`;
    }
    
    case 'crescent': {
      const arcPct = shape.arcPercentage ?? 70;
      const outerR = 45;
      const innerR = outerR * (arcPct / 100);
      const offset = outerR - innerR;
      
      // Create crescent using two overlapping circles
      return `
        <defs>
          <mask id="crescent-mask">
            <circle cx="50%" cy="50%" r="${outerR}%" fill="white" />
            <circle cx="${50 + offset}%" cy="50%" r="${innerR}%" fill="black" />
          </mask>
        </defs>
        <circle cx="50%" cy="50%" r="${outerR}%" fill="${color}" mask="url(#crescent-mask)" ${opacityAttr} />
      `;
    }
    
    case 'dots-grid': {
      const rows = shape.rows ?? 4;
      const cols = shape.columns ?? 4;
      const dotSize = shape.dotSize ?? 3;
      const spacing = shape.spacing ?? 20;
      
      let dots = '';
      const startX = 50 - ((cols - 1) * spacing) / 2;
      const startY = 50 - ((rows - 1) * spacing) / 2;
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * spacing;
          const y = startY + r * spacing;
          dots += `<circle cx="${x}%" cy="${y}%" r="${dotSize}%" fill="${color}" ${opacityAttr} />`;
        }
      }
      return dots;
    }
    
    case 'scattered-dots': {
      const count = shape.count ?? 12;
      const dotSize = shape.dotSize ?? 2;
      const seed = shape.seed ?? 1;
      
      const seededRandom = (s: number) => {
        const x = Math.sin(s) * 10000;
        return x - Math.floor(x);
      };
      
      let dots = '';
      for (let i = 0; i < count; i++) {
        const x = 10 + seededRandom(seed + i * 2) * 80;
        const y = 10 + seededRandom(seed + i * 2 + 1) * 80;
        const sizeVar = dotSize * (0.5 + seededRandom(seed + i * 3) * 1);
        dots += `<circle cx="${x}%" cy="${y}%" r="${sizeVar}%" fill="${color}" ${opacityAttr} />`;
      }
      return dots;
    }
    
    default:
      return `<circle cx="50%" cy="50%" r="45%" fill="${color}" ${opacityAttr} />`;
  }
}

/**
 * Render decorative shapes
 */
function renderShapes(shapes: Shape[] | undefined, _containerWidth: number): string {
  if (!shapes || shapes.length === 0) return '';
  
  return shapes.map((shape) => {
    const size = shape.size ?? 20;
    const rotation = shape.rotation ?? 0;
    const blur = shape.blur ?? 0;
    const zIndex = shape.zIndex ?? 5;
    
    // Position using X/Y percentages (default to center)
    const posX = shape.posX ?? 50;
    const posY = shape.posY ?? 50;
    
    const transformParts = ['translate(-50%, -50%)'];
    if (rotation !== 0) {
      transformParts.push(`rotate(${rotation}deg)`);
    }
    
    const filterStyle = blur > 0 ? `filter: blur(${blur}px);` : '';
    
    // Size is percentage of container width
    const sizePercent = size;
    
    const containerStyle = [
      'position: absolute',
      `left: ${posX}%`,
      `top: ${posY}%`,
      `width: ${sizePercent}%`,
      'aspect-ratio: 1',
      `transform: ${transformParts.join(' ')}`,
      filterStyle,
      `z-index: ${zIndex}`,
      'pointer-events: none',
      'overflow: visible',
    ].filter(Boolean).join('; ');
    
    const svgContent = generateShapeSVG(shape);
    
    return `
      <div style="${containerStyle}">
        <svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible;">
          ${svgContent}
        </svg>
      </div>
    `;
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
    
    <!-- Decorative Shapes -->
    ${renderShapes(screenshot.shapes, dimensions.width)}
    
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
    
    <!-- Decorative Shapes -->
    ${renderShapes(featureGraphic.shapes, 1024)}
    
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
