/**
 * API Client Utilities
 *
 * Every server call goes through `request`/`requestRaw`, which reject with
 * an `ApiError` on non-2xx responses instead of resolving with an error body.
 */

import type { Assets, ProjectConfig, ProjectInfo } from "@ui/types.ts";
import type { AppData, GenerateResult } from "@ui/types.ts";
import type { LanguageConfig } from "@app-types";

/** Error thrown for non-2xx API responses, carrying the server's message. */
export class ApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Fetch that rejects with `ApiError` on non-2xx responses, using the
 * server's `{ error }` body as the message when present.
 */
async function requestRaw(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(input, init);
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body?.error === "string" && body.error) {
        message = body.error;
      }
    } catch {
      // non-JSON error body — keep the generic message
    }
    throw new ApiError(res.status, message);
  }
  return res;
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await requestRaw(input, init);
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

function json(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

/**
 * Fetch initial application data
 */
export function fetchInit(): Promise<AppData> {
  return request("/api/init");
}

/**
 * Save config to server
 */
export async function saveConfig(config: ProjectConfig): Promise<void> {
  await request("/api/config", json("PUT", config));
}

/**
 * Fetch assets list
 */
export function fetchAssets(): Promise<Assets> {
  return request("/api/assets");
}

/**
 * Switch to a project
 */
export function activateProject(
  projectId: string,
): Promise<{ projectId: string; config: ProjectConfig }> {
  return request(`/api/projects/${projectId}/activate`, { method: "PUT" });
}

/**
 * Create new project
 */
export function createProject(name: string): Promise<ProjectInfo> {
  return request("/api/projects", json("POST", { name }));
}

/**
 * Delete project
 */
export async function deleteProject(projectId: string): Promise<void> {
  await request(`/api/projects/${projectId}`, { method: "DELETE" });
}

/**
 * Rename project
 */
export function renameProject(
  projectId: string,
  name: string,
): Promise<ProjectInfo> {
  return request(`/api/projects/${projectId}`, json("PATCH", { name }));
}

/**
 * Duplicate project
 */
export function duplicateProject(
  projectId: string,
  name: string,
): Promise<ProjectInfo> {
  return request(
    `/api/projects/${projectId}/duplicate`,
    json("POST", { name }),
  );
}

/**
 * Add language
 */
export function addLanguage(
  language: string,
  copyFrom: string | null,
): Promise<LanguageConfig> {
  return request("/api/config/language", json("POST", { language, copyFrom }));
}

/**
 * Delete language
 */
export async function deleteLanguage(lang: string): Promise<void> {
  await request(`/api/config/language/${lang}`, { method: "DELETE" });
}

/**
 * Copy platform screenshots
 */
export function copyPlatform(
  language: string,
  sourcePlatform: string,
  targetPlatform: string,
): Promise<LanguageConfig> {
  return request(
    "/api/config/copy-platform",
    json("POST", { language, sourcePlatform, targetPlatform }),
  );
}

/**
 * Fetch previously generated images
 */
export async function fetchGenerated(): Promise<
  { results: GenerateResult[]; outputDir: string } | null
> {
  try {
    const data = await request<
      { results: GenerateResult[]; outputDir: string }
    >(
      "/api/generate/generated",
    );
    return data.results && data.results.length > 0 ? data : null;
  } catch {
    // probe — no prior output (or an unreachable server) is not an error here
    return null;
  }
}

/**
 * Start generation via SSE stream.
 * Calls `onProgress` for each SSE event; resolves when the stream ends.
 */
export async function generateStream(
  onProgress: (data: {
    type: "start" | "progress" | "complete";
    total?: number;
    current?: number;
    item?: string;
    results?: GenerateResult[];
    outputDir?: string;
  }) => void,
): Promise<void> {
  const response = await requestRaw("/api/generate/stream", json("POST", {}));

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    // Keep the last (possibly incomplete) line in the buffer
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const data = JSON.parse(line.slice(6));
        onProgress(data);
      } catch {
        // Ignore parse errors from malformed events
      }
    }
  }
}

/**
 * Open output folder in file explorer
 */
export async function openOutputFolder(): Promise<void> {
  await request("/api/generate/open-folder", json("POST", {}));
}

/**
 * Upload an asset file
 */
export function uploadAsset(
  formData: FormData,
): Promise<{ path: string }> {
  return request("/api/assets/upload", { method: "POST", body: formData });
}

/**
 * Rename an asset
 */
export function renameAsset(
  oldPath: string,
  newName: string,
): Promise<{ newPath: string }> {
  return request("/api/assets/rename", json("PATCH", { oldPath, newName }));
}

/**
 * Delete an asset
 */
export async function deleteAsset(path: string): Promise<void> {
  await request("/api/assets", json("DELETE", { path }));
}
