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
import "./styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./utils/query.ts";
import { useInitData } from "@hooks";

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-zinc-950 text-white">
      <EmptyState title="Loading..." subtitle="" />
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
// deno-lint-ignore no-explicit-any
const hot = (import.meta as any).hot;
const root: Root = hot?.data?.root ?? createRoot(container);
if (hot) {
  hot.data.root = root;
}

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AppShell />
      </ErrorBoundary>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
);
