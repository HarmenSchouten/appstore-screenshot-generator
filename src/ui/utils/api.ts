/**
 * API Client Utilities
 *
 * Every server call goes through `request`/`requestRaw`, which reject with
 * an `ApiError` on non-2xx responses instead of resolving with an error body.
 *
 * Everything inside a project takes that project's id: the server has no
 * "current project" for a call to land in by accident (#136).
 */

import type { Assets, ProjectConfig, ProjectInfo } from "@ui/types.ts";
import type { AppData, LastGenerated } from "@ui/types.ts";
import type {
  GenerationEvent,
  GenerationProgressEvent,
  LanguageConfig,
} from "@app-types";

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

/** Base path of the routes that act inside one project. */
function projectApi(projectId: string): string {
  return `/api/projects/${projectId}`;
}

/** The prefix a project's `images/…` asset paths resolve against. */
export function assetUrlPrefix(projectId: string): string {
  return `/assets/${projectId}/`;
}

/** URL of a file an export wrote, by its path inside the output folder. */
export function outputUrl(projectId: string, relativePath: string): string {
  return `/output/${projectId}/${relativePath}`;
}

/**
 * Fetch initial application data
 */
export function fetchInit(): Promise<AppData> {
  return request("/api/init");
}

/**
 * Save a project's config
 */
export async function saveConfig(
  projectId: string,
  config: ProjectConfig,
): Promise<void> {
  await request(`${projectApi(projectId)}/config`, json("PUT", config));
}

/**
 * Fetch a project's assets list
 */
export function fetchAssets(projectId: string): Promise<Assets> {
  return request(`${projectApi(projectId)}/assets`);
}

/**
 * Load a project to edit; the server opens it first on the next load
 */
export function openProject(
  projectId: string,
): Promise<{ projectId: string; config: ProjectConfig }> {
  return request(`${projectApi(projectId)}/open`, { method: "PUT" });
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
  await request(projectApi(projectId), { method: "DELETE" });
}

/**
 * Rename project
 */
export function renameProject(
  projectId: string,
  name: string,
): Promise<ProjectInfo> {
  return request(projectApi(projectId), json("PATCH", { name }));
}

/**
 * Duplicate project
 */
export function duplicateProject(
  projectId: string,
  name: string,
): Promise<ProjectInfo> {
  return request(
    `${projectApi(projectId)}/duplicate`,
    json("POST", { name }),
  );
}

/**
 * Add language
 */
export function addLanguage(
  projectId: string,
  language: string,
  copyFrom: string | null,
): Promise<LanguageConfig> {
  return request(
    `${projectApi(projectId)}/config/language`,
    json("POST", { language, copyFrom }),
  );
}

/**
 * Delete language
 */
export async function deleteLanguage(
  projectId: string,
  lang: string,
): Promise<void> {
  await request(`${projectApi(projectId)}/config/language/${lang}`, {
    method: "DELETE",
  });
}

/**
 * Copy platform screenshots
 */
export function copyPlatform(
  projectId: string,
  language: string,
  sourcePlatform: string,
  targetPlatform: string,
): Promise<LanguageConfig> {
  return request(
    `${projectApi(projectId)}/config/copy-platform`,
    json("POST", { language, sourcePlatform, targetPlatform }),
  );
}

/**
 * Fetch previously generated images
 */
export async function fetchGenerated(
  projectId: string,
): Promise<LastGenerated | null> {
  try {
    const data = await request<Omit<LastGenerated, "projectId">>(
      `${projectApi(projectId)}/generate/generated`,
    );
    return data.results && data.results.length > 0
      ? { ...data, projectId }
      : null;
  } catch {
    // probe — no prior output (or an unreachable server) is not an error here
    return null;
  }
}

/**
 * Start generation via SSE stream.
 *
 * Calls `onProgress` for each progress event and resolves when the stream
 * ends. Rejects with the server's message on an `error` event, and with an
 * AbortError when `signal` is aborted — the server sees the closed stream
 * and stops after the screenshot in flight.
 */
export async function generateStream(
  projectId: string,
  onProgress: (event: GenerationProgressEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await requestRaw(
    `${projectApi(projectId)}/generate/stream`,
    { ...json("POST", {}), signal },
  );

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
      const event = JSON.parse(line.slice(6)) as GenerationEvent;
      if (event.type === "error") throw new Error(event.message);
      onProgress(event);
    }
  }
}

/**
 * Open a project's output folder in the file explorer
 */
export async function openOutputFolder(projectId: string): Promise<void> {
  await request(
    `${projectApi(projectId)}/generate/open-folder`,
    json("POST", {}),
  );
}

/**
 * Upload an asset file
 */
export function uploadAsset(
  projectId: string,
  formData: FormData,
): Promise<{ path: string }> {
  return request(`${projectApi(projectId)}/assets/upload`, {
    method: "POST",
    body: formData,
  });
}

/**
 * Rename an asset
 */
export function renameAsset(
  projectId: string,
  oldPath: string,
  newName: string,
): Promise<{ newPath: string }> {
  return request(
    `${projectApi(projectId)}/assets/rename`,
    json("PATCH", { oldPath, newName }),
  );
}

/**
 * Delete an asset
 */
export async function deleteAsset(
  projectId: string,
  path: string,
): Promise<void> {
  await request(`${projectApi(projectId)}/assets`, json("DELETE", { path }));
}
