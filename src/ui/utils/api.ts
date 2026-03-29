/**
 * API Client Utilities
 */

import type { Assets, ProjectConfig, ProjectInfo } from "../types.ts";
import type { AppData, GenerateResult } from "@ui/types.ts";
import type { LanguageConfig } from "@types";

/**
 * Fetch initial application data
 */
export async function fetchInit(): Promise<AppData> {
  const res = await fetch("/api/init");
  if (!res.ok) {
    throw new Error(`Failed to load app data: ${res.status}`);
  }
  return res.json();
}

/**
 * Save config to server
 */
export async function saveConfig(config: ProjectConfig): Promise<void> {
  await fetch("/api/config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
}

/**
 * Fetch assets list
 */
export async function fetchAssets(): Promise<Assets> {
  const res = await fetch("/api/assets");
  return res.json();
}

/**
 * Switch to a project
 */
export async function activateProject(
  projectId: string,
): Promise<{ projectId: string; config: ProjectConfig }> {
  const res = await fetch(`/api/projects/${projectId}/activate`, {
    method: "PUT",
  });
  return res.json();
}

/**
 * Create new project
 */
export async function createProject(name: string): Promise<ProjectInfo> {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

/**
 * Delete project
 */
export async function deleteProject(projectId: string): Promise<void> {
  await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
}

/**
 * Rename project
 */
export async function renameProject(
  projectId: string,
  name: string,
): Promise<ProjectInfo> {
  const res = await fetch(`/api/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

/**
 * Add language
 */
export async function addLanguage(
  language: string,
  copyFrom: string | null,
): Promise<LanguageConfig> {
  const res = await fetch("/api/config/language", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, copyFrom }),
  });
  return res.json();
}

/**
 * Delete language
 */
export async function deleteLanguage(lang: string): Promise<void> {
  await fetch(`/api/config/language/${lang}`, { method: "DELETE" });
}

/**
 * Copy platform screenshots
 */
export async function copyPlatform(
  language: string,
  sourcePlatform: string,
  targetPlatform: string,
): Promise<LanguageConfig> {
  const res = await fetch("/api/config/copy-platform", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, sourcePlatform, targetPlatform }),
  });
  return res.json();
}

/**
 * Fetch previously generated images
 */
export async function fetchGenerated(): Promise<
  { results: GenerateResult[]; outputDir: string } | null
> {
  try {
    const res = await fetch("/api/generate/generated");
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Start generation via SSE stream.
 * Calls `onProgress` for each SSE event; resolves with final results.
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
  const response = await fetch("/api/generate/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    const lines = text.split("\n").filter((l) => l.startsWith("data: "));

    for (const line of lines) {
      try {
        const data = JSON.parse(line.slice(6));
        onProgress(data);
      } catch {
        // Ignore parse errors from partial SSE chunks
      }
    }
  }
}

/**
 * Open output folder in file explorer
 */
export async function openOutputFolder(): Promise<void> {
  await fetch("/api/generate/open-folder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
}

/**
 * Upload an asset file
 */
export async function uploadAsset(
  formData: FormData,
): Promise<{ path: string }> {
  const res = await fetch("/api/assets/upload", {
    method: "POST",
    body: formData,
  });
  return res.json();
}

/**
 * Rename an asset
 */
export async function renameAsset(
  oldPath: string,
  newName: string,
): Promise<void> {
  const res = await fetch("/api/assets/rename", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oldPath, newName }),
  });
  if (!res.ok) throw new Error("Rename failed");
}

/**
 * Delete an asset
 */
export async function deleteAsset(path: string): Promise<void> {
  const res = await fetch("/api/assets", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  if (!res.ok) throw new Error("Delete failed");
}
