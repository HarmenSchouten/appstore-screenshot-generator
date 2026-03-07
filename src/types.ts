/**
 * Type definitions for screenshot configuration
 */

export type Platform = 'android' | 'ios';
export type Language = string;

export type GlowColor = 'purple' | 'blue' | 'pink' | 'cyan' | 'amber' | 'green' | 'red' | 'orange' | 'white';

export interface GlowEffect {
  color: GlowColor;
  size: number;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

/** Available shape types for decorative elements */
export type ShapeType = 
  // Basic shapes
  | 'circle' | 'ring' | 'rectangle' | 'pill'
  // Lines & Curves
  | 'curved-line' | 's-curve' | 'wave-line'
  // Arrows & Chevrons  
  | 'chevron' | 'double-chevron' | 'arrow'
  // Geometric
  | 'triangle' | 'diamond' | 'hexagon' | 'star' | 'sparkle' | 'cross'
  // Organic
  | 'blob' | 'crescent'
  // Patterns
  | 'dots-grid' | 'scattered-dots';

/** Decorative shape configuration */
export interface Shape {
  /** Shape type */
  type: ShapeType;
  
  /** Size as percentage of container width (1-500) */
  size: number;
  /** Color (hex) */
  color: string;
  /** Opacity (0-1) */
  opacity?: number;
  /** Blur amount in pixels (0-50) */
  blur?: number;
  /** Rotation angle in degrees (-180 to 180) */
  rotation?: number;
  /** Z-index (0=behind phone, 5=default, 10=above) */
  zIndex?: number;
  
  /** X position as percentage (0=left, 50=center, 100=right) */
  posX?: number;
  /** Y position as percentage (0=top, 50=center, 100=bottom) */
  posY?: number;
  
  /** Filled shape vs outline only */
  filled?: boolean;
  /** Stroke width for outlines (1-20) */
  strokeWidth?: number;
  /** Border radius for rectangles (0-50) */
  borderRadius?: number;
  
  // Line-specific properties
  /** Line orientation preset - simplifies configuration */
  orientation?: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
  /** Curvature amount (-100 to 100, negative curves opposite direction) */
  curvature?: number;
  
  // Advanced line positioning (optional, overrides orientation)
  /** Start X position as percentage (0-100) */
  startX?: number;
  /** Start Y position as percentage (0-100) */
  startY?: number;
  /** End X position as percentage (0-100) */
  endX?: number;
  /** End Y position as percentage (0-100) */
  endY?: number;
  /** Line dash style */
  dashStyle?: 'solid' | 'dashed' | 'dotted';
  /** Line cap style */
  lineCap?: 'round' | 'square' | 'butt';
  
  // Chevron-specific properties
  /** Direction chevron points to */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Chevron angle in degrees (30-120) */
  angle?: number;
  /** Number of stacked shapes (1-4) */
  count?: number;
  /** Gap between stacked shapes in pixels */
  gap?: number;
  
  // Star/sparkle-specific properties
  /** Number of points (4-8) */
  points?: number;
  /** Inner radius ratio (0.2-0.8) */
  innerRadius?: number;
  
  // Pattern-specific properties
  /** Number of rows for grid patterns */
  rows?: number;
  /** Number of columns for grid patterns */
  columns?: number;
  /** Spacing between pattern elements */
  spacing?: number;
  /** Size of individual dots in patterns */
  dotSize?: number;
  
  // Blob-specific properties
  /** Complexity/number of control points (3-8) */
  complexity?: number;
  /** Random seed for reproducible blobs */
  seed?: number;
  
  // Crescent-specific properties
  /** Arc percentage for crescents (10-90) */
  arcPercentage?: number;
}

export interface PhoneFrameOptions {
  /** Phone size as percentage of container width (50-95 for single, 30-50 for dual) */
  scale?: number;
  /** Bottom offset as percentage (0-25) */
  bottomOffset?: number;
  /** Rotation angle for dual mode phones (0-15 degrees) */
  dualRotation?: number;
  /** Gap between phones in dual mode (0-30px) */
  dualGap?: number;
}

export interface MascotOptions {
  /** Position of the mascot */
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Path to mascot image (relative to assets) */
  imagePath?: string;
  /** Size of mascot as percentage of container width (5-30) */
  size?: number;
  /** Offset from edges in pixels (10-100) */
  offset?: number;
  /** Border radius as percentage (0-50) - 50 = circular, 20 = rounded corners */
  borderRadius?: number;
}

/** Typography settings for headlines and subtitles */
export interface TypographyOptions {
  /** Headline font size as percentage of screen width (3-8) */
  headlineFontSize?: number;
  /** Subtitle font size as percentage of screen width (1.5-4) */
  subtitleFontSize?: number;
  /** Headline font weight (400-900) */
  headlineFontWeight?: number;
  /** Subtitle font weight (400-700) */
  subtitleFontWeight?: number;
  /** Line height for headline (1-1.5) */
  headlineLineHeight?: number;
  /** Text color (hex) - defaults to white */
  textColor?: string;
  /** Text alignment */
  textAlign?: 'left' | 'center' | 'right';
  /** Horizontal padding as percentage (2-15) */
  horizontalPadding?: number;
}

export interface Screenshot {
  /** Unique identifier for this screenshot */
  id: string;
  /** Marketing headline (supports <br> for line breaks) */
  headline: string;
  /** Subtitle text */
  subtitle: string;
  /** Headline offset from top as percentage (0-30) */
  headlineOffset?: number;
  /** Path to screenshot image (relative to assets), or array for dual phone layout */
  imagePath: string | string[];
  /** Background glow effects */
  glows: GlowEffect[];
  /** Decorative shapes */
  shapes?: Shape[];
  /** Phone frame configuration */
  phoneFrame?: PhoneFrameOptions;
  /** Mascot configuration */
  mascot?: MascotOptions;
  /** Typography settings (overrides theme defaults) */
  typography?: TypographyOptions;
}

export interface FeatureGraphic {
  /** Headline text */
  headline: string;
  /** Subtitle text */
  subtitle: string;
  /** Screenshot image to display */
  imagePath: string;
  /** Background glow effects */
  glows: GlowEffect[];
  /** Show app icon */
  showIcon?: boolean;
  /** Show app name */
  showAppName?: boolean;
  /** Phone rotation angle (degrees) */
  phoneRotation?: number;
  /** Phone scale (percentage) */
  phoneScale?: number;
  /** Mascot configuration */
  mascot?: MascotOptions;
  /** Decorative shapes */
  shapes?: Shape[];
}

export interface PlatformConfig {
  /** Platform-specific dimensions */
  dimensions: {
    width: number;
    height: number;
  };
  /** Screenshots for this platform */
  screenshots: Screenshot[];
  /** Feature graphic (Google Play only) */
  featureGraphic?: FeatureGraphic;
}

export interface LanguageConfig {
  /** Language code */
  language: Language;
  /** Screenshots per platform for this language */
  platforms: {
    android: PlatformConfig;
    ios: PlatformConfig;
  };
}

export interface ThemeConfig {
  /** Primary gradient background */
  background: {
    gradient: string;
    /** Gradient color stops for visual editing */
    colors?: string[];
    /** Gradient direction in degrees (0 = top to bottom, 90 = left to right) */
    direction?: number;
  };
  /** Font family */
  fontFamily: string;
  /** Google Fonts URL (optional) */
  googleFontsUrl?: string;
  /** Default typography settings (can be overridden per screenshot) */
  defaultTypography?: TypographyOptions;
}

export interface AppBranding {
  /** App name */
  name: string;
  /** App icon path (relative to assets) */
  iconPath?: string;
  /** Default mascot image path */
  defaultMascotPath?: string;
}

export interface ScreenshotConfig {
  /** App branding */
  app: AppBranding;
  /** Theme configuration */
  theme: ThemeConfig;
  /** Base path for assets */
  assetsBasePath: string;
  /** All language configurations */
  languages: LanguageConfig[];
}
