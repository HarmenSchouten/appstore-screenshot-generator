/**
 * Renderer Type Definitions
 * 
 * Shared types for isomorphic rendering components.
 */

/** Glow effect configuration */
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
  posX?: number;
  posY?: number;
  filled?: boolean;
  strokeWidth?: number;
  borderRadius?: number;
  orientation?: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  curvature?: number;
  dashStyle?: 'solid' | 'dashed' | 'dotted';
  lineCap?: 'round' | 'square' | 'butt';
  direction?: 'up' | 'down' | 'left' | 'right';
  angle?: number;
  count?: number;
  gap?: number;
  points?: number;
  innerRadius?: number;
  rows?: number;
  columns?: number;
  spacing?: number;
  dotSize?: number;
  complexity?: number;
  seed?: number;
  arcPercentage?: number;
}

/** Phone frame display options */
export interface PhoneFrameOptions {
  scale?: number;
  bottomOffset?: number;
  dualRotation?: number;
  dualGap?: number;
}

/** Mascot display options */
export interface MascotOptions {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  imagePath?: string;
  size?: number;
  offset?: number;
  borderRadius?: number;
}

/** Typography customization */
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

/** Screenshot configuration */
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

/** Feature graphic configuration */
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
  phoneX?: number;
  phoneY?: number;
  mascot?: MascotOptions | null;
  iconBoxScale?: number;
  iconBoxRadius?: number;
  iconBoxColor?: string;
  iconScale?: number;
  iconRadius?: number;
  iconOffsetX?: number;
  iconOffsetY?: number;
}

/** Theme configuration */
export interface ThemeConfig {
  background: { gradient: string };
  fontFamily: string;
  googleFontsUrl?: string;
}

/** Application configuration */
export interface AppConfig {
  name: string;
  iconPath?: string;
  defaultMascotPath?: string;
}

/** Screenshot render options */
export interface RenderOptions {
  screenshot: Screenshot;
  theme: ThemeConfig;
  app: AppConfig;
  dimensions: { width: number; height: number };
  assetUrlPrefix?: string;
}

/** Feature graphic render options */
export interface FeatureGraphicRenderOptions {
  featureGraphic: FeatureGraphic;
  theme: ThemeConfig;
  app: AppConfig;
  assetUrlPrefix?: string;
}
