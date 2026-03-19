/**
 * Example English screenshot configuration
 *
 * This file defines all screenshots for the English language.
 * Copy this file and modify for additional languages.
 */

import type { LanguageConfig } from "../src/types.ts";

export const enConfig: LanguageConfig = {
  language: "en",
  platforms: {
    android: {
      dimensions: {
        width: 1242,
        height: 2688,
      },
      screenshots: [
        {
          id: "hero",
          headline: "Your App Headline",
          subtitle: "A compelling subtitle for your app",
          imagePath: "screenshots/home.png",
          glows: [
            { color: "purple", size: 600, top: "-200px", right: "-200px" },
            { color: "blue", size: 500, bottom: "200px", left: "-150px" },
          ],
          phoneFrame: { scale: 75, bottomOffset: 6 },
          mascot: { position: "bottom-right", size: 100, offset: 40 },
        },
        {
          id: "feature-1",
          headline: "Amazing Feature",
          subtitle: "Describe what makes your app special",
          imagePath: "screenshots/feature-1.png",
          glows: [
            { color: "pink", size: 600, top: "100px", right: "-100px" },
            { color: "purple", size: 500, bottom: "300px", left: "-200px" },
          ],
        },
        {
          id: "feature-2",
          headline: "Side by Side",
          subtitle: "Show multiple screens at once",
          imagePath: ["screenshots/detail-1.png", "screenshots/detail-2.png"],
          glows: [
            { color: "blue", size: 800, top: "300px", left: "50%" },
          ],
          phoneFrame: {
            scale: 42,
            bottomOffset: 6,
            dualRotation: 6,
            dualGap: 8,
          },
        },
      ],
      featureGraphic: {
        headline: "Your App Name",
        subtitle: "The perfect tagline for Google Play",
        imagePath: "screenshots/home.png",
        glows: [
          { color: "purple", size: 400, top: "-150px", left: "-100px" },
          { color: "blue", size: 300, bottom: "-100px", right: "200px" },
        ],
        showIcon: true,
        showAppName: true,
        phoneRotation: 5,
        phoneScale: 100,
      },
    },
    ios: {
      dimensions: {
        width: 1242,
        height: 2688,
      },
      screenshots: [
        {
          id: "hero",
          headline: "Your App Headline",
          subtitle: "A compelling subtitle for your app",
          imagePath: "screenshots/home.png",
          glows: [
            { color: "purple", size: 600, top: "-200px", right: "-200px" },
            { color: "blue", size: 500, bottom: "200px", left: "-150px" },
          ],
          phoneFrame: { scale: 75, bottomOffset: 6 },
          mascot: { position: "bottom-right", size: 100, offset: 40 },
        },
        {
          id: "feature-1",
          headline: "Amazing Feature",
          subtitle: "Describe what makes your app special",
          imagePath: "screenshots/feature-1.png",
          glows: [
            { color: "pink", size: 600, top: "100px", right: "-100px" },
            { color: "purple", size: 500, bottom: "300px", left: "-200px" },
          ],
        },
        {
          id: "feature-2",
          headline: "Side by Side",
          subtitle: "Show multiple screens at once",
          imagePath: ["screenshots/detail-1.png", "screenshots/detail-2.png"],
          glows: [
            { color: "blue", size: 800, top: "300px", left: "50%" },
          ],
          phoneFrame: {
            scale: 42,
            bottomOffset: 6,
            dualRotation: 6,
            dualGap: 8,
          },
        },
      ],
    },
  },
};
