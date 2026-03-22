import { ALL_DEVICE_PRESETS } from "@device-presets";
import type { TypographyOptions } from "@types";

interface BaseLayerProps {
  posX: number;
  posY: number;
  zIndex: number;
  opacity: number;
  rotation: number;
}

/** The properties for a text layer */
export interface TextLayerProps extends BaseLayerProps, TypographyOptions {
  type: "text";
  /** The text to display */
  text: string;
}

/** The properties for a text block layer displaying a headline and a subtitle */
export interface TextBlockLayerProps extends BaseLayerProps {
  type: "text-block";
  headline: string;
  headlineTypography: TypographyOptions;
  subTitle: string;
  subTitleTypography: TypographyOptions;
}

export interface PhoneFrameLayerProps extends BaseLayerProps {
  type: "phone-frame";
  model: keyof typeof ALL_DEVICE_PRESETS;
}

/** A layer can be one of several layer types, discriminated by the `type` property */
export type Layer =
  | TextLayerProps
  | TextBlockLayerProps
  | PhoneFrameLayerProps;
