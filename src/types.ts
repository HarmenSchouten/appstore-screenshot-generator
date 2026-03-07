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
