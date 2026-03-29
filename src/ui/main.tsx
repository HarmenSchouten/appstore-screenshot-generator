/**
 * UI Entry Point
 *
 * Initializes the React application.
 * useInitData fetches server state via React Query; Suspense + ErrorBoundary
 * handle loading and error states declaratively.
 */

import React from "react";
import { createRoot } from "react-dom/client";
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
  const { isPending } = useInitData();

  if (isPending) return <LoadingScreen />;

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

const root = createRoot(document.getElementById("root")!);
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
