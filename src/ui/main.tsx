/// <reference types="vite/client" />
/**
 * UI Entry Point
 *
 * Initializes the React application.
 * useInitData fetches server state via React Query; ErrorBoundary catches
 * init failures, and AppShell gates rendering on the query's loading state.
 */

import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./components/App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { EmptyState } from "./components/EmptyState.tsx";
// Font Awesome is bundled (not loaded from a CDN) so the editor works offline.
// Only the icon styles actually used are imported; add regular.min.css if needed.
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/solid.min.css";
import "@fortawesome/fontawesome-free/css/brands.min.css";
import "./styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HotkeysProvider } from "@tanstack/react-hotkeys";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { hotkeysDevtoolsPlugin } from "@tanstack/react-hotkeys-devtools";
import { queryClient } from "./utils/query.ts";
import { useInitData } from "@hooks";

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-zinc-950 text-white">
      <EmptyState title="Loading..." subtitle="" showShortcuts={false} />
    </div>
  );
}

function AppShell() {
  const { isPending, isError, error } = useInitData();

  if (isPending) return <LoadingScreen />;
  if (isError) throw error;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/:project?/:lang?/:platform?/:screenshotId?"
          element={<App />}
        />
      </Routes>
    </BrowserRouter>
  );
}

const container = document.getElementById("root")!;

// Reuse the React root across HMR updates to prevent mounting duplicate trees.
// import.meta.hot.data persists across HMR instances of the same module (Vite API).
// Calling root.render() again on the same root is safe — React reconciles the tree.
const hot = import.meta.hot;
const root: Root = (hot?.data.root as Root | undefined) ??
  createRoot(container);
if (hot) {
  hot.data.root = root;
}

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HotkeysProvider>
        <ErrorBoundary>
          <AppShell />
        </ErrorBoundary>
      </HotkeysProvider>
      {import.meta.env.DEV && (
        <>
          <ReactQueryDevtools />
          <TanStackDevtools
            config={{ triggerHidden: true }}
            plugins={[hotkeysDevtoolsPlugin()]}
          />
        </>
      )}
    </QueryClientProvider>
  </React.StrictMode>,
);
