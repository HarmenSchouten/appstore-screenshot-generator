#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env
/**
 * Development server with web UI for configuring screenshots
 *
 * Usage:
 *   deno task dev
 *   # Then open http://localhost:3000
 */

import { Hono } from 'npm:hono@4';
import { serveStatic } from 'npm:hono@4/deno';
import { cors } from 'npm:hono@4/cors';
import { join } from '@std/path';
import type { ScreenshotConfig } from './types.ts';

const app = new Hono();

// Enable CORS for development
app.use('/*', cors());

// Serve static files from ui/ directory
app.use('/ui/*', serveStatic({ root: './' }));

// API Routes
app.get('/api/config', async (c) => {
  try {
    const configPath = join(Deno.cwd(), 'config', 'config.ts');
    const { screenshotConfig } = await import(`file://${configPath}?t=${Date.now()}`);
    return c.json(screenshotConfig);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

app.get('/api/assets', async (c) => {
  const assetsDir = join(Deno.cwd(), 'assets');
  const files: string[] = [];

  const walk = async (dir: string, prefix = '') => {
    for await (const entry of Deno.readDir(dir)) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory) {
        await walk(join(dir, entry.name), path);
      } else if (entry.isFile && /\.(png|jpg|jpeg|webp)$/i.test(entry.name)) {
        files.push(path);
      }
    }
  };

  try {
    await walk(assetsDir);
    return c.json({ files });
  } catch {
    return c.json({ files: [] });
  }
});

app.post('/api/generate', async (c) => {
  try {
    const process = new Deno.Command('deno', {
      args: ['task', 'generate'],
      stdout: 'piped',
      stderr: 'piped',
    });
    const result = await process.output();
    const stdout = new TextDecoder().decode(result.stdout);
    const stderr = new TextDecoder().decode(result.stderr);

    return c.json({
      success: result.success,
      output: stdout + stderr,
    });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/api/convert', async (c) => {
  try {
    const process = new Deno.Command('deno', {
      args: ['task', 'convert'],
      stdout: 'piped',
      stderr: 'piped',
    });
    const result = await process.output();
    const stdout = new TextDecoder().decode(result.stdout);
    const stderr = new TextDecoder().decode(result.stderr);

    return c.json({
      success: result.success,
      output: stdout + stderr,
    });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/api/build', async (c) => {
  try {
    const process = new Deno.Command('deno', {
      args: ['task', 'build'],
      stdout: 'piped',
      stderr: 'piped',
    });
    const result = await process.output();
    const stdout = new TextDecoder().decode(result.stdout);
    const stderr = new TextDecoder().decode(result.stderr);

    return c.json({
      success: result.success,
      output: stdout + stderr,
    });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Serve assets for preview
app.use('/assets/*', serveStatic({ root: './' }));

// Serve output images
app.use('/output/*', serveStatic({ root: './' }));

// Main UI
app.get('/', (c) => {
  return c.html(indexHtml);
});

// Index HTML with embedded UI
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Screenshot Generator</title>
  <script src="https://unpkg.com/preact@10/dist/preact.umd.js"></script>
  <script src="https://unpkg.com/preact@10/hooks/dist/hooks.umd.js"></script>
  <script src="https://unpkg.com/htm@3/dist/htm.umd.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .glow-preview { filter: blur(40px); opacity: 0.4; }
  </style>
</head>
<body class="bg-gray-900 text-white min-h-screen">
  <div id="app"></div>
  <script type="module">
    const { h, render } = preact;
    const { useState, useEffect } = preactHooks;
    const html = htm.bind(h);

    const App = () => {
      const [config, setConfig] = useState(null);
      const [assets, setAssets] = useState([]);
      const [loading, setLoading] = useState(true);
      const [building, setBuilding] = useState(false);
      const [output, setOutput] = useState('');
      const [selectedLang, setSelectedLang] = useState(null);
      const [selectedPlatform, setSelectedPlatform] = useState('android');

      useEffect(() => {
        loadData();
      }, []);

      const loadData = async () => {
        try {
          const [configRes, assetsRes] = await Promise.all([
            fetch('/api/config'),
            fetch('/api/assets'),
          ]);
          const configData = await configRes.json();
          const assetsData = await assetsRes.json();

          setConfig(configData);
          setAssets(assetsData.files || []);
          if (configData.languages?.length > 0) {
            setSelectedLang(configData.languages[0].language);
          }
        } catch (error) {
          console.error('Failed to load config:', error);
        } finally {
          setLoading(false);
        }
      };

      const handleBuild = async () => {
        setBuilding(true);
        setOutput('Building screenshots...');
        try {
          const res = await fetch('/api/build', { method: 'POST' });
          const data = await res.json();
          setOutput(data.output || (data.success ? 'Build complete!' : 'Build failed'));
        } catch (error) {
          setOutput('Error: ' + error.message);
        } finally {
          setBuilding(false);
        }
      };

      const getCurrentScreenshots = () => {
        if (!config || !selectedLang) return [];
        const langConfig = config.languages.find(l => l.language === selectedLang);
        return langConfig?.platforms[selectedPlatform]?.screenshots || [];
      };

      if (loading) {
        return html\`<div class="flex items-center justify-center h-screen">
          <div class="text-xl">Loading...</div>
        </div>\`;
      }

      if (!config) {
        return html\`<div class="flex items-center justify-center h-screen">
          <div class="text-xl text-red-500">Failed to load configuration</div>
        </div>\`;
      }

      const screenshots = getCurrentScreenshots();

      return html\`
        <div class="container mx-auto px-4 py-8">
          <header class="mb-8">
            <h1 class="text-3xl font-bold mb-2">\${config.app?.name || 'Screenshot Generator'}</h1>
            <p class="text-gray-400">Configure and generate App Store screenshots</p>
          </header>

          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <!-- Sidebar -->
            <div class="lg:col-span-1 space-y-4">
              <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="font-semibold mb-3">Language</h3>
                <select
                  class="w-full bg-gray-700 rounded px-3 py-2"
                  value=\${selectedLang}
                  onChange=\${(e) => setSelectedLang(e.target.value)}
                >
                  \${config.languages.map(l => html\`
                    <option value=\${l.language}>\${l.language.toUpperCase()}</option>
                  \`)}
                </select>
              </div>

              <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="font-semibold mb-3">Platform</h3>
                <div class="flex gap-2">
                  <button
                    class=\${'flex-1 py-2 rounded ' + (selectedPlatform === 'android' ? 'bg-green-600' : 'bg-gray-700')}
                    onClick=\${() => setSelectedPlatform('android')}
                  >Android</button>
                  <button
                    class=\${'flex-1 py-2 rounded ' + (selectedPlatform === 'ios' ? 'bg-blue-600' : 'bg-gray-700')}
                    onClick=\${() => setSelectedPlatform('ios')}
                  >iOS</button>
                </div>
              </div>

              <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="font-semibold mb-3">Actions</h3>
                <button
                  class="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded mb-2 disabled:opacity-50"
                  onClick=\${handleBuild}
                  disabled=\${building}
                >
                  \${building ? 'Building...' : 'Generate All Screenshots'}
                </button>
                <button
                  class="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded"
                  onClick=\${loadData}
                >Refresh Config</button>
              </div>

              <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="font-semibold mb-3">Theme</h3>
                <div class="rounded h-20 mb-2" style=\${{ background: config.theme?.background?.gradient || '#6366f1' }}></div>
                <p class="text-sm text-gray-400">
                  Font: \${config.theme?.fontFamily?.split(',')[0]?.replace(/'/g, '') || 'Default'}
                </p>
              </div>
            </div>

            <!-- Main Content -->
            <div class="lg:col-span-3">
              <div class="bg-gray-800 rounded-lg p-4 mb-6">
                <h2 class="text-xl font-semibold mb-4">
                  Screenshots (\${screenshots.length})
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  \${screenshots.map((screenshot, idx) => html\`
                    <div key=\${screenshot.id} class="bg-gray-700 rounded-lg overflow-hidden">
                      <div class="aspect-[9/16] relative" style=\${{ background: config.theme?.background?.gradient }}>
                        <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                          <h3 class="text-lg font-bold mb-1">\${screenshot.headline.replace(/<br>/g, ' ')}</h3>
                          <p class="text-sm opacity-75">\${screenshot.subtitle}</p>
                        </div>
                        \${screenshot.glows?.map((glow, i) => html\`
                          <div
                            key=\${i}
                            class="glow-preview absolute rounded-full"
                            style=\${{
                              width: glow.size / 4 + 'px',
                              height: glow.size / 4 + 'px',
                              background: glow.color === 'purple' ? '#a855f7' :
                                          glow.color === 'blue' ? '#3b82f6' :
                                          glow.color === 'pink' ? '#ec4899' :
                                          glow.color === 'cyan' ? '#06b6d4' :
                                          glow.color === 'amber' ? '#f59e0b' : '#a855f7',
                              top: glow.top,
                              right: glow.right,
                              bottom: glow.bottom,
                              left: glow.left,
                            }}
                          />
                        \`)}
                      </div>
                      <div class="p-3">
                        <div class="flex items-center justify-between mb-2">
                          <span class="font-medium">\${idx + 1}. \${screenshot.id}</span>
                          <span class="text-xs px-2 py-1 bg-gray-600 rounded">
                            \${Array.isArray(screenshot.imagePath) ? 'Dual' : 'Single'}
                          </span>
                        </div>
                        <p class="text-xs text-gray-400 truncate">
                          \${Array.isArray(screenshot.imagePath)
                            ? screenshot.imagePath.join(', ')
                            : screenshot.imagePath}
                        </p>
                      </div>
                    </div>
                  \`)}
                </div>
              </div>

              \${output && html\`
                <div class="bg-gray-800 rounded-lg p-4">
                  <h3 class="font-semibold mb-2">Output</h3>
                  <pre class="bg-gray-900 rounded p-3 text-sm overflow-auto max-h-60 whitespace-pre-wrap">\${output}</pre>
                </div>
              \`}
            </div>
          </div>
        </div>
      \`;
    };

    render(html\`<\${App} />\`, document.getElementById('app'));
  </script>
</body>
</html>`;

// Start server
const port = parseInt(Deno.env.get('PORT') || '3000');
console.log(\`🚀 Screenshot Generator UI running at http://localhost:\${port}\`);
console.log('   Press Ctrl+C to stop\\n');

Deno.serve({ port }, app.fetch);
