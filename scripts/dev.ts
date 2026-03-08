/**
 * Dev server runner
 * 
 * Runs both:
 * 1. esbuild in watch mode for UI
 * 2. Deno server with file watching
 */

// Start UI watcher
const uiProcess = new Deno.Command('deno', {
  args: ['run', '-A', 'scripts/build-ui.ts', '--watch'],
  stdout: 'inherit',
  stderr: 'inherit',
}).spawn();

// Give esbuild a moment to do initial build
await new Promise(resolve => setTimeout(resolve, 500));

// Start server with watch
const serverProcess = new Deno.Command('deno', {
  args: ['run', '-A', '--watch=src/server.ts,src/routes/', 'src/server.ts'],
  stdout: 'inherit',
  stderr: 'inherit',
}).spawn();

// Handle shutdown - kill() without signal works cross-platform
const shutdown = () => {
  try { uiProcess.kill(); } catch { /* ignore */ }
  try { serverProcess.kill(); } catch { /* ignore */ }
  Deno.exit(0);
};

// Only SIGINT (ctrl-c) is supported on Windows
Deno.addSignalListener('SIGINT', shutdown);

// Wait for either to exit
await Promise.race([uiProcess.status, serverProcess.status]);
shutdown();
