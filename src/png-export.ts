/**
 * PNG export
 *
 * Renders an HTML document to PNG with Puppeteer driving a system Chrome at
 * 2× device scale, then downsamples with sharp for crisper output. The
 * browser is a lazily-launched singleton shared across runs; server.ts wires
 * `closeBrowser`/`killBrowser` to process shutdown so Chrome doesn't outlive
 * the server.
 */

import puppeteer, { type Browser } from "puppeteer";
import sharp from "sharp";
import { join, toFileUrl } from "@std/path";
import type { Dimensions } from "@app-types";

/** Upper bound for loading one screenshot document (local file + web fonts). */
const NAVIGATION_TIMEOUT_MS = 15_000;
/** Web fonts get this long, then the screenshot renders with fallback fonts. */
const FONTS_TIMEOUT_MS = 5_000;

const CHROME_CANDIDATES: Partial<Record<typeof Deno.build.os, string[]>> = {
  windows: [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    `${Deno.env.get("LOCALAPPDATA")}\\Google\\Chrome\\Application\\chrome.exe`,
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

/** PUPPETEER_EXECUTABLE_PATH wins; otherwise the usual install locations. */
function findChromePath(): string | undefined {
  const fromEnv = Deno.env.get("PUPPETEER_EXECUTABLE_PATH");
  if (fromEnv) return fromEnv;
  return (CHROME_CANDIDATES[Deno.build.os] ?? []).find((path) => {
    try {
      Deno.statSync(path);
      return true;
    } catch {
      // Whatever stopped the stat, this candidate isn't usable here
      return false;
    }
  });
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function launch(): Promise<Browser> {
  const executablePath = findChromePath();
  if (!executablePath) {
    throw new Error(
      "Chrome or Chromium was not found. Install Google Chrome, or set PUPPETEER_EXECUTABLE_PATH to a Chromium binary.",
    );
  }
  try {
    return await puppeteer.launch({ headless: true, executablePath });
  } catch (error) {
    throw new Error(
      `Chrome failed to start (${executablePath}): ${errorMessage(error)}`,
    );
  }
}

let browser: Browser | null = null;
let launching: Promise<Browser> | null = null;

/**
 * The shared browser, launched on first use. One in-flight launch is shared
 * by overlapping runs (no second Chrome), a dead instance — crashed, or
 * killed from outside — is replaced, and a failed launch is not cached so
 * the next run retries.
 */
function getBrowser(): Promise<Browser> {
  if (browser?.connected) return Promise.resolve(browser);
  browser = null;
  if (!launching) {
    launching = launch()
      .then((launched) => {
        browser = launched;
        return launched;
      })
      .finally(() => {
        launching = null;
      });
  }
  return launching;
}

/**
 * Render an HTML document to a PNG file.
 *
 * The document is written to a temp file and loaded over file:// so that its
 * file:// asset URLs are same-scheme — Chrome refuses local resources from an
 * about:blank document, which rules out page.setContent. Web fonts get a
 * bounded wait, so an offline machine renders with fallback fonts instead of
 * hanging on Google Fonts until the navigation timeout.
 */
export async function renderHtmlToPng(
  html: string,
  pngPath: string,
  { width, height }: Dimensions,
): Promise<void> {
  const browser = await getBrowser();
  const tempDir = await Deno.makeTempDir({ prefix: "appstore-screenshot-" });
  const page = await browser.newPage();
  try {
    const htmlPath = join(tempDir, "screenshot.html");
    await Deno.writeTextFile(htmlPath, html);
    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    try {
      await page.goto(toFileUrl(htmlPath).href, {
        waitUntil: "load",
        timeout: NAVIGATION_TIMEOUT_MS,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new Error(
          `The screenshot document did not finish loading within ${
            NAVIGATION_TIMEOUT_MS / 1000
          } s. If you are offline, web fonts may be unreachable.`,
        );
      }
      throw error;
    }
    await page.evaluate(
      (timeoutMs) =>
        Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, timeoutMs)),
        ]).then(() => undefined),
      FONTS_TIMEOUT_MS,
    );

    const buffer = await page.screenshot({
      type: "png",
      omitBackground: false,
    });
    await sharp(buffer)
      .resize(width, height, { kernel: "lanczos3", fit: "fill" })
      .png({ quality: 100, compressionLevel: 6 })
      .toFile(pngPath);
  } finally {
    // Cleanup must not mask the error that got us here: a crashed browser
    // rejects page.close(), and removing the temp dir is best effort
    await page.close().catch(() => {});
    await Deno.remove(tempDir, { recursive: true }).catch(() => {});
  }
}

/** Graceful shutdown: close Chrome and forget it. */
export async function closeBrowser(): Promise<void> {
  const current = browser ??
    (launching ? await launching.catch(() => null) : null);
  browser = null;
  await current?.close();
}

/** For `unload`, where nothing async can complete: kill the Chrome process. */
export function killBrowser(): void {
  browser?.process()?.kill();
  browser = null;
}
