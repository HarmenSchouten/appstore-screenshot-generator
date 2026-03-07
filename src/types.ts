/**
 * Type definitions for screenshot configuration
 */

export type Platform = 'android' | 'ios';
export type Language = string;

export type GlowColor = 'purple' | 'blue' | 'pink' | 'cyan' | 'amber' | 'green' | 'red' | 'orange';

export interface GlowEffect {
  color: GlowColor;
  size: number;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface PhoneFrameOptions {
  /** Use wide frame variant */
  wide?: boolean;
  /** Use small frame variant (for dual layouts) */
  small?: boolean;
}

export interface MascotOptions {
  /** Position of the mascot */
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Path to mascot image (relative to assets) */
  imagePath?: string;
}

export interface Screenshot {
  /** Unique identifier for this screenshot */
  id: string;
  /** Marketing headline (supports <br> for line breaks) */
  headline: string;
  /** Subtitle text */
  subtitle: string;
  /** Path to screenshot image (relative to assets), or array for dual phone layout */
  imagePath: string | string[];
  /** Background glow effects */
  glows: GlowEffect[];
  /** Phone frame configuration */
  phoneFrame?: PhoneFrameOptions;
  /** Mascot configuration */
  mascot?: MascotOptions;
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
  };
  /** Font family */
  fontFamily: string;
  /** Google Fonts URL (optional) */
  googleFontsUrl?: string;
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
