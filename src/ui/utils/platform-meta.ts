/**
 * How each platform is presented — label and brand icon.
 */

import type { Platform } from "@app-types";

export const PLATFORM_META: Record<Platform, { label: string; icon: string }> =
  {
    android: { label: "Android", icon: "fa-brands fa-android" },
    ios: { label: "iOS", icon: "fa-brands fa-apple" },
  };
