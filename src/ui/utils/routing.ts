/**
 * URL Routing Utilities
 *
 * Two-way sync between React Router params and Zustand store.
 */

import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppStore } from "../store/index.ts";

/**
 * Build a URL path from store state segments.
 */
export function buildPath(
  project: string,
  lang: string | null,
  platform: string | null,
  screenshotId: string | null,
): string {
  let url = "/" + project;
  if (lang) url += "/" + lang;
  if (platform) url += "/" + platform;
  if (screenshotId) url += "/" + screenshotId;
  return url;
}

/**
 * Hook that keeps React Router params and the Zustand store in sync.
 *
 * - On mount / URL change → writes route params into the store.
 * - On store change → navigates to the matching URL.
 */
export function useStoreRouteSync() {
  const params = useParams<{
    project?: string;
    lang?: string;
    platform?: string;
    screenshotId?: string;
  }>();
  const navigate = useNavigate();
  const isRouteChange = useRef(false);

  // ── Route → Store (URL changed, push into Zustand) ───────────────
  useEffect(() => {
    const state = useAppStore.getState();

    // Validate project
    if (params.project && params.project !== state.currentProject) {
      const valid = state.projects.find((p) => p.id === params.project);
      if (valid) {
        isRouteChange.current = true;
        state.switchProject(params.project);
        return; // switchProject sets lang/item/etc
      }
    }

    // Lang
    if (params.lang && params.lang !== state.selectedLang) {
      const validLang = state.config.languages?.find(
        (l) => l.language === params.lang,
      );
      if (validLang) {
        isRouteChange.current = true;
        state.setSelectedLang(params.lang);
      }
    }

    // Platform
    if (
      params.platform &&
      ["android", "ios"].includes(params.platform) &&
      params.platform !== state.selectedPlatform
    ) {
      isRouteChange.current = true;
      state.setSelectedPlatform(params.platform as "android" | "ios");
    }

    // Screenshot (regular or feature-graphic — both use their id)
    if (params.screenshotId) {
      if (
        state.selectedItem?.type !== "screenshot" ||
        state.selectedItem.id !== params.screenshotId
      ) {
        isRouteChange.current = true;
        state.setSelectedItem({
          type: "screenshot",
          id: params.screenshotId,
        });
      }
    } else if (state.selectedItem !== null) {
      isRouteChange.current = true;
      state.setSelectedItem(null);
    }
  }, [params.project, params.lang, params.platform, params.screenshotId]);

  // ── Store → Route (state changed, update URL) ────────────────────
  const currentProject = useAppStore((s) => s.currentProject);
  const selectedLang = useAppStore((s) => s.selectedLang);
  const selectedPlatform = useAppStore((s) => s.selectedPlatform);
  const selectedItem = useAppStore((s) => s.selectedItem);

  useEffect(() => {
    // Skip if this render was triggered by route → store sync
    if (isRouteChange.current) {
      isRouteChange.current = false;
      return;
    }

    if (!currentProject) return;

    const screenshotId = selectedItem?.type === "screenshot"
      ? selectedItem.id
      : null;

    const target = buildPath(
      currentProject,
      selectedLang,
      selectedPlatform,
      screenshotId,
    );

    if (location.pathname !== target) {
      navigate(target, { replace: true });
    }
  }, [currentProject, selectedLang, selectedPlatform, selectedItem, navigate]);
}
