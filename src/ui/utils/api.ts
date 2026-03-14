/**
 * API Client Utilities
 */

import type { ProjectConfig, ProjectInfo, Assets } from '../types';

/**
 * Save config to server
 */
export async function saveConfig(config: ProjectConfig): Promise<void> {
  await fetch('/api/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
}

/**
 * Fetch assets list
 */
export async function fetchAssets(): Promise<Assets> {
  const res = await fetch('/api/assets');
  return res.json();
}

/**
 * Switch to a project
 */
export async function activateProject(projectId: string): Promise<{ projectId: string; config: ProjectConfig }> {
  const res = await fetch(`/api/projects/${projectId}/activate`, { method: 'PUT' });
  return res.json();
}

/**
 * Create new project
 */
export async function createProject(name: string): Promise<ProjectInfo> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

/**
 * Delete project
 */
export async function deleteProject(projectId: string): Promise<void> {
  await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
}

/**
 * Rename project
 */
export async function renameProject(projectId: string, name: string): Promise<ProjectInfo> {
  const res = await fetch(`/api/projects/${projectId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

/**
 * Add language
 */
export async function addLanguage(language: string, copyFrom: string | null): Promise<unknown> {
  const res = await fetch('/api/config/language', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, copyFrom }),
  });
  return res.json();
}

/**
 * Delete language
 */
export async function deleteLanguage(lang: string): Promise<void> {
  await fetch(`/api/config/language/${lang}`, { method: 'DELETE' });
}

/**
 * Copy platform screenshots
 */
export async function copyPlatform(
  language: string,
  sourcePlatform: string,
  targetPlatform: string
): Promise<unknown> {
  const res = await fetch('/api/config/copy-platform', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, sourcePlatform, targetPlatform }),
  });
  return res.json();
}

/**
 * Fetch previously generated images
 */
export async function fetchGenerated(): Promise<{ results: unknown[]; outputDir: string } | null> {
  try {
    const res = await fetch('/api/generated');
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
 * Open output folder in file explorer
 */
export async function openOutputFolder(): Promise<void> {
  await fetch('/api/generate/open-folder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
}
