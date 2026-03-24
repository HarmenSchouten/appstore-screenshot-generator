/**
 * UI Entry Point
 *
 * Initializes the React application.
 * In Vite mode, we fetch initial data from the API.
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./components/App.tsx";
import { useAppStore } from "./store/index.ts";
import "./styles.css";

// Fetch initial data and mount application
async function init() {
  try {
    // Fetch initial application data from server
    const response = await fetch("/api/init");
    if (!response.ok) {
      throw new Error(`Failed to load app data: ${response.status}`);
    }

    const appData = await response.json();

    // Hydrate Zustand store with server data (URL params handled by React Router)
    useAppStore.setState({
      config: appData.config,
      projects: appData.projects,
      currentProject: appData.projectId,
      initialProjectId: appData.projectId,
    });

    // Mount application with React Router
    const root = createRoot(document.getElementById("root")!);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route
              path="/:project?/:lang?/:platform?/:screenshotId?"
              element={<App />}
            />
          </Routes>
        </BrowserRouter>
      </React.StrictMode>,
    );
  } catch (error) {
    console.error("Failed to initialize app:", error);
    document.getElementById("root")!.innerHTML = `
      <div class="flex items-center justify-center h-screen">
        <div class="text-center">
          <h1 class="text-xl font-bold text-red-500 mb-2">Failed to load application</h1>
          <p class="text-zinc-400">Make sure the API server is running on port 3000</p>
          <p class="text-zinc-500 text-sm mt-2">Run: deno task dev:server</p>
        </div>
      </div>
    `;
  }
}

init();
