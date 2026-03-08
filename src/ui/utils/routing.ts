/**
 * URL Routing Utilities
 */

export interface UrlParams {
  project: string | null;
  lang: string | null;
  platform: string | null;
  screenshotId: string | null;
}

export function parseUrlParams(): UrlParams {
  const path = location.pathname;
  const parts = path.split('/').filter(Boolean);
  return {
    project: parts[0] || null,
    lang: parts[1] || null,
    platform: parts[2] || null,
    screenshotId: parts[3] || null,
  };
}

export function buildUrl(
  project: string,
  lang: string | null,
  platform: string | null,
  screenshotId: string | null
): string {
  let url = '/' + project;
  if (lang) url += '/' + lang;
  if (platform) url += '/' + platform;
  if (screenshotId) url += '/' + screenshotId;
  return url;
}
