/**
 * PNG export
 *
 * Renders an HTML file to PNG with Puppeteer (system Chrome) at 2× device
 * scale, then downsamples with sharp for crisper output. Used by the
 * generation routes; the browser is a lazily-launched singleton shared across
 * requests.
 */

import puppeteer, { type Browser, type Page } from "puppeteer";
import sharp from "sharp";
import { toFileUrl } from "@std/path";

/**
 * Find a system Chrome/Chromium executable for the current OS
 */
function findChromePath(): string | undefined {
  const paths: Record<string, string[]> = {
    win32: [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      `${
        Deno.env.get("LOCALAPPDATA")
      }\\Google\\Chrome\\Application\\chrome.exe`,
    ],
    darwin: [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ],
    linux: [
      "/usr/bin/google-chrome",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
    ],
  };

  const osType = Deno.build.os === "windows" ? "win32" : Deno.build.os;
  const osPaths = paths[osType] || [];

  for (const path of osPaths) {
    try {
      Deno.statSync(path);
      return path;
    } catch {
      // Path doesn't exist, try next
    }
  }

  return undefined;
}

/**
 * Convert HTML file to PNG with 2x supersampling
 */
async function convertHTMLtoPNG(
  page: Page,
  htmlPath: string,
  outputPath: string,
  width: number,
  height: number,
): Promise<boolean> {
  try {
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: 2,
    });
    await page.goto(toFileUrl(htmlPath).href, { waitUntil: "networkidle0" });

    const buffer = await page.screenshot({
      type: "png",
      omitBackground: false,
    });

    await sharp(buffer)
      .resize(width, height, {
        kernel: "lanczos3",
        fit: "fill",
      })
      .png({
        quality: 100,
        compressionLevel: 6,
      })
      .toFile(outputPath);

    return true;
  } catch (error) {
    console.error(`   ❌ Failed to convert: ${error}`);
    return false;
  }
}

// Shared browser instance across requests
let sharedBrowser: Browser | null = null;

/**
 * Get or create shared browser instance
 */
async function getSharedBrowser(): Promise<Browser> {
  if (!sharedBrowser) {
    const chromePath = findChromePath();
    if (!chromePath) {
      throw new Error("Could not find Chrome/Chromium");
    }
    sharedBrowser = await puppeteer.launch({
      headless: true,
      executablePath: chromePath,
    });
  }
  return sharedBrowser;
}

/**
 * Convert a single HTML file to PNG
 */
export async function convertHtmlFileToPng(
  htmlPath: string,
  outputPath: string,
  dimensions: { width: number; height: number },
): Promise<void> {
  const browser = await getSharedBrowser();
  const page = await browser.newPage();

  try {
    const success = await convertHTMLtoPNG(
      page,
      htmlPath,
      outputPath,
      dimensions.width,
      dimensions.height,
    );

    if (!success) {
      throw new Error("Conversion failed");
    }
  } finally {
    await page.close();
  }
}

/**
 * Cleanup shared browser
 */
export async function closeBrowser(): Promise<void> {
  if (sharedBrowser) {
    await sharedBrowser.close();
    sharedBrowser = null;
  }
}
