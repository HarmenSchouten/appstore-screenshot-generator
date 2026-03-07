#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env --allow-run
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
import type { ScreenshotConfig, Screenshot, LanguageConfig } from './types.ts';

const app = new Hono();

// Enable CORS for development
app.use('/*', cors());

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
    try {
      for await (const entry of Deno.readDir(dir)) {
        const path = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory) {
          await walk(join(dir, entry.name), path);
        } else if (entry.isFile && /\.(png|jpg|jpeg|webp)$/i.test(entry.name)) {
          files.push(path);
        }
      }
    } catch {
      // Directory doesn't exist
    }
  };

  await walk(assetsDir);
  return c.json({ files });
});

// Upload asset
app.post('/api/assets/upload', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'screenshots';

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const assetsDir = join(Deno.cwd(), 'assets', folder);
    await Deno.mkdir(assetsDir, { recursive: true });

    const filePath = join(assetsDir, file.name);
    const buffer = await file.arrayBuffer();
    await Deno.writeFile(filePath, new Uint8Array(buffer));

    return c.json({ success: true, path: `${folder}/${file.name}` });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Generate screenshots
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
    return c.json({ success: result.success, output: stdout + stderr });
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
    return c.json({ success: result.success, output: stdout + stderr });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Serve assets
app.use('/assets/*', serveStatic({ root: './' }));
app.use('/output/*', serveStatic({ root: './' }));

// Main UI
app.get('/', (c) => c.html(indexHtml));

const indexHtml = /*html*/`<!DOCTYPE html>
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
    .glow-preview { filter: blur(30px); opacity: 0.5; pointer-events: none; }
    .phone-frame-preview {
      background: linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 100%);
      border-radius: 24px;
      padding: 6px;
    }
    .phone-screen-preview {
      background: #000;
      border-radius: 18px;
      overflow: hidden;
    }
    input[type="range"]::-webkit-slider-thumb { cursor: grab; }
  </style>
</head>
<body class="bg-gray-900 text-white min-h-screen">
  <div id="app"></div>
  <script type="module">
    const { h, render } = preact;
    const { useState, useEffect, useRef } = preactHooks;
    const html = htm.bind(h);

    const GLOW_COLORS = ['purple', 'blue', 'pink', 'cyan', 'amber', 'green', 'red', 'orange'];
    const GLOW_HEX = {
      purple: '#a855f7', blue: '#3b82f6', pink: '#ec4899', cyan: '#06b6d4',
      amber: '#f59e0b', green: '#22c55e', red: '#ef4444', orange: '#f97316'
    };
    const MASCOT_POSITIONS = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];

    const emptyScreenshot = () => ({
      id: 'screenshot-' + Date.now(),
      headline: 'Your Headline',
      subtitle: 'Your subtitle here',
      imagePath: '',
      glows: [
        { color: 'purple', size: 500, top: '-150px', right: '-150px' },
        { color: 'blue', size: 400, bottom: '100px', left: '-100px' }
      ],
      phoneFrame: { wide: false, small: false },
      mascot: null
    });

    // Screenshot Editor Modal
    const ScreenshotEditor = ({ screenshot, assets, config, onSave, onCancel }) => {
      const [data, setData] = useState({ ...screenshot });
      const [isDualMode, setIsDualMode] = useState(Array.isArray(screenshot.imagePath));

      const updateField = (field, value) => setData(prev => ({ ...prev, [field]: value }));

      const updateGlow = (index, field, value) => {
        setData(prev => {
          const glows = [...prev.glows];
          glows[index] = { ...glows[index], [field]: value };
          return { ...prev, glows };
        });
      };

      const addGlow = () => {
        setData(prev => ({
          ...prev,
          glows: [...prev.glows, { color: 'cyan', size: 400, top: '50%', left: '50%' }]
        }));
      };

      const removeGlow = (index) => {
        setData(prev => ({ ...prev, glows: prev.glows.filter((_, i) => i !== index) }));
      };

      const toggleMascot = () => {
        setData(prev => ({
          ...prev,
          mascot: prev.mascot ? null : { position: 'bottom-right' }
        }));
      };

      const gradient = config?.theme?.background?.gradient || 'linear-gradient(180deg, #6366f1 0%, #4f46e5 50%, #3730a3 100%)';

      return html\`
        <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto">
          <div class="bg-gray-800 rounded-xl max-w-6xl w-full max-h-[95vh] overflow-auto">
            <div class="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center z-10">
              <h2 class="text-xl font-bold">Edit Screenshot</h2>
              <div class="flex gap-2">
                <button class="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500" onClick=\${onCancel}>Cancel</button>
                <button class="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500" onClick=\${() => onSave(data)}>Save</button>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <!-- Preview -->
              <div class="order-2 lg:order-1">
                <h3 class="font-semibold mb-3">Preview</h3>
                <div class="aspect-[9/19] rounded-lg overflow-hidden relative" style=\${{ background: gradient }}>
                  \${data.glows.map((glow, i) => html\`
                    <div key=\${i} class="glow-preview absolute rounded-full" style=\${{
                      width: glow.size / 5 + 'px',
                      height: glow.size / 5 + 'px',
                      background: GLOW_HEX[glow.color],
                      top: glow.top, right: glow.right, bottom: glow.bottom, left: glow.left,
                    }}/>
                  \`)}
                  <div class="absolute inset-0 flex flex-col items-center text-center p-6 pt-12">
                    <h1 class="text-2xl font-bold mb-2" dangerouslySetInnerHTML=\${{ __html: data.headline }}/>
                    <p class="text-sm opacity-80">\${data.subtitle}</p>
                  </div>
                  <div class="absolute bottom-16 left-1/2 -translate-x-1/2 \${isDualMode ? 'flex gap-2' : 'w-32'}">
                    \${isDualMode ? html\`
                      \${[0, 1].map(i => {
                        const img = Array.isArray(data.imagePath) ? data.imagePath[i] : '';
                        return html\`
                          <div key=\${i} class="w-24 \${i === 0 ? '-rotate-6' : 'rotate-6'}">
                            <div class="phone-frame-preview">
                              <div class="phone-screen-preview aspect-[9/19]">
                                \${img && html\`<img src="/assets/\${img}" class="w-full h-full object-cover" />\`}
                              </div>
                            </div>
                          </div>
                        \`;
                      })}
                    \` : html\`
                      <div class="phone-frame-preview">
                        <div class="phone-screen-preview aspect-[9/19]">
                          \${data.imagePath && typeof data.imagePath === 'string' && html\`
                            <img src="/assets/\${data.imagePath}" class="w-full h-full object-cover" />
                          \`}
                        </div>
                      </div>
                    \`}
                  </div>
                  \${data.mascot && html\`
                    <div class="absolute w-16 h-16" style=\${{
                      bottom: data.mascot.position.includes('bottom') ? '8px' : 'auto',
                      top: data.mascot.position.includes('top') ? '8px' : 'auto',
                      right: data.mascot.position.includes('right') ? '8px' : 'auto',
                      left: data.mascot.position.includes('left') ? '8px' : 'auto',
                    }}>
                      <img src="/assets/\${config?.app?.defaultMascotPath?.replace('assets/', '') || 'mascot.png'}" 
                           class="w-full h-full object-contain" onerror="this.style.display='none'" />
                    </div>
                  \`}
                </div>
              </div>

              <!-- Form -->
              <div class="order-1 lg:order-2 space-y-6 overflow-auto max-h-[70vh]">
                <!-- Basic Info -->
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <h3 class="font-semibold mb-4">Basic Info</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm text-gray-400 mb-1">ID</label>
                      <input type="text" class="w-full bg-gray-700 rounded px-3 py-2" 
                        value=\${data.id} onChange=\${(e) => updateField('id', e.target.value)} />
                    </div>
                    <div>
                      <label class="block text-sm text-gray-400 mb-1">Headline (use &lt;br&gt; for line breaks)</label>
                      <input type="text" class="w-full bg-gray-700 rounded px-3 py-2" 
                        value=\${data.headline} onChange=\${(e) => updateField('headline', e.target.value)} />
                    </div>
                    <div>
                      <label class="block text-sm text-gray-400 mb-1">Subtitle</label>
                      <input type="text" class="w-full bg-gray-700 rounded px-3 py-2" 
                        value=\${data.subtitle} onChange=\${(e) => updateField('subtitle', e.target.value)} />
                    </div>
                  </div>
                </div>

                <!-- Screenshot Image -->
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <h3 class="font-semibold mb-4">Screenshot Image</h3>
                  <div class="space-y-3">
                    <label class="flex items-center gap-2 mb-3">
                      <input type="checkbox" checked=\${isDualMode} onChange=\${(e) => {
                        setIsDualMode(e.target.checked);
                        updateField('imagePath', e.target.checked ? ['', ''] : '');
                        if (e.target.checked) {
                          setData(prev => ({ ...prev, phoneFrame: { ...prev.phoneFrame, small: true }}));
                        }
                      }} />
                      <span class="text-sm">Dual phone layout</span>
                    </label>

                    \${isDualMode ? html\`
                      <div class="grid grid-cols-2 gap-3">
                        \${[0, 1].map(idx => html\`
                          <div key=\${idx}>
                            <label class="block text-sm text-gray-400 mb-1">Image \${idx + 1}</label>
                            <select class="w-full bg-gray-700 rounded px-3 py-2 text-sm"
                              value=\${Array.isArray(data.imagePath) ? data.imagePath[idx] : ''}
                              onChange=\${(e) => {
                                const paths = Array.isArray(data.imagePath) ? [...data.imagePath] : ['', ''];
                                paths[idx] = e.target.value;
                                updateField('imagePath', paths);
                              }}>
                              <option value="">Select image...</option>
                              \${assets.map(a => html\`<option key=\${a} value=\${a}>\${a}</option>\`)}
                            </select>
                          </div>
                        \`)}
                      </div>
                    \` : html\`
                      <select class="w-full bg-gray-700 rounded px-3 py-2"
                        value=\${typeof data.imagePath === 'string' ? data.imagePath : ''}
                        onChange=\${(e) => updateField('imagePath', e.target.value)}>
                        <option value="">Select image...</option>
                        \${assets.map(a => html\`<option key=\${a} value=\${a}>\${a}</option>\`)}
                      </select>
                    \`}
                  </div>
                </div>

                <!-- Phone Frame -->
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <h3 class="font-semibold mb-4">Phone Frame</h3>
                  <div class="flex gap-4">
                    <label class="flex items-center gap-2">
                      <input type="checkbox" 
                        checked=\${data.phoneFrame?.wide || false}
                        onChange=\${(e) => setData(prev => ({ ...prev, phoneFrame: { ...prev.phoneFrame, wide: e.target.checked }}))} />
                      <span class="text-sm">Wide</span>
                    </label>
                    <label class="flex items-center gap-2">
                      <input type="checkbox" 
                        checked=\${data.phoneFrame?.small || false}
                        onChange=\${(e) => setData(prev => ({ ...prev, phoneFrame: { ...prev.phoneFrame, small: e.target.checked }}))} />
                      <span class="text-sm">Small</span>
                    </label>
                  </div>
                </div>

                <!-- Mascot -->
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold">Mascot</h3>
                    <button class=\${"text-sm px-3 py-1 rounded " + (data.mascot ? "bg-red-600" : "bg-green-600")}
                      onClick=\${toggleMascot}>
                      \${data.mascot ? 'Remove' : 'Add Mascot'}
                    </button>
                  </div>
                  \${data.mascot && html\`
                    <div>
                      <label class="block text-sm text-gray-400 mb-1">Position</label>
                      <select class="w-full bg-gray-700 rounded px-3 py-2"
                        value=\${data.mascot.position}
                        onChange=\${(e) => setData(prev => ({ ...prev, mascot: { ...prev.mascot, position: e.target.value }}))}>
                        \${MASCOT_POSITIONS.map(p => html\`<option key=\${p} value=\${p}>\${p}</option>\`)}
                      </select>
                    </div>
                  \`}
                </div>

                <!-- Glow Effects -->
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold">Glow Effects (\${data.glows.length})</h3>
                    <button class="text-sm px-3 py-1 bg-green-600 rounded" onClick=\${addGlow}>+ Add Glow</button>
                  </div>
                  <div class="space-y-4">
                    \${data.glows.map((glow, idx) => html\`
                      <div key=\${idx} class="bg-gray-800 rounded p-3">
                        <div class="flex items-center justify-between mb-3">
                          <div class="flex items-center gap-2">
                            <div class="w-6 h-6 rounded-full" style=\${{ background: GLOW_HEX[glow.color] }}/>
                            <span class="text-sm font-medium">Glow \${idx + 1}</span>
                          </div>
                          <button class="text-red-400 text-sm hover:text-red-300" onClick=\${() => removeGlow(idx)}>Remove</button>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                          <div>
                            <label class="block text-xs text-gray-400 mb-1">Color</label>
                            <select class="w-full bg-gray-700 rounded px-2 py-1 text-sm"
                              value=\${glow.color} onChange=\${(e) => updateGlow(idx, 'color', e.target.value)}>
                              \${GLOW_COLORS.map(c => html\`<option key=\${c} value=\${c}>\${c}</option>\`)}
                            </select>
                          </div>
                          <div>
                            <label class="block text-xs text-gray-400 mb-1">Size: \${glow.size}px</label>
                            <input type="range" min="100" max="1000" step="50" class="w-full"
                              value=\${glow.size} onChange=\${(e) => updateGlow(idx, 'size', parseInt(e.target.value))} />
                          </div>
                          <div>
                            <label class="block text-xs text-gray-400 mb-1">Top</label>
                            <input type="text" class="w-full bg-gray-700 rounded px-2 py-1 text-sm" placeholder="-200px"
                              value=\${glow.top || ''} onChange=\${(e) => updateGlow(idx, 'top', e.target.value || undefined)} />
                          </div>
                          <div>
                            <label class="block text-xs text-gray-400 mb-1">Right</label>
                            <input type="text" class="w-full bg-gray-700 rounded px-2 py-1 text-sm" placeholder="-150px"
                              value=\${glow.right || ''} onChange=\${(e) => updateGlow(idx, 'right', e.target.value || undefined)} />
                          </div>
                          <div>
                            <label class="block text-xs text-gray-400 mb-1">Bottom</label>
                            <input type="text" class="w-full bg-gray-700 rounded px-2 py-1 text-sm" placeholder="100px"
                              value=\${glow.bottom || ''} onChange=\${(e) => updateGlow(idx, 'bottom', e.target.value || undefined)} />
                          </div>
                          <div>
                            <label class="block text-xs text-gray-400 mb-1">Left</label>
                            <input type="text" class="w-full bg-gray-700 rounded px-2 py-1 text-sm" placeholder="-100px"
                              value=\${glow.left || ''} onChange=\${(e) => updateGlow(idx, 'left', e.target.value || undefined)} />
                          </div>
                        </div>
                      </div>
                    \`)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      \`;
    };

    // File Upload Component
    const FileUpload = ({ onUpload }) => {
      const inputRef = useRef(null);
      const [uploading, setUploading] = useState(false);

      const handleUpload = async (files) => {
        setUploading(true);
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', 'screenshots');
          try {
            await fetch('/api/assets/upload', { method: 'POST', body: formData });
          } catch (e) {
            console.error('Upload failed:', e);
          }
        }
        setUploading(false);
        onUpload();
      };

      return html\`
        <div class="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-500 transition-colors">
          <input ref=\${inputRef} type="file" accept="image/*" multiple class="hidden"
            onChange=\${(e) => handleUpload(Array.from(e.target.files))} />
          <button class="text-sm text-gray-400 hover:text-white" 
            onClick=\${() => inputRef.current?.click()}
            disabled=\${uploading}>
            \${uploading ? 'Uploading...' : 'Upload Screenshots'}
          </button>
        </div>
      \`;
    };

    // Main App
    const App = () => {
      const [config, setConfig] = useState(null);
      const [assets, setAssets] = useState([]);
      const [loading, setLoading] = useState(true);
      const [building, setBuilding] = useState(false);
      const [output, setOutput] = useState('');
      const [selectedLang, setSelectedLang] = useState(null);
      const [selectedPlatform, setSelectedPlatform] = useState('android');
      const [editingScreenshot, setEditingScreenshot] = useState(null);
      const [editingIndex, setEditingIndex] = useState(-1);

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
          if (configData.languages?.length > 0 && !selectedLang) {
            setSelectedLang(configData.languages[0].language);
          }
        } catch (error) {
          console.error('Failed to load:', error);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => { loadData(); }, []);

      const getCurrentScreenshots = () => {
        if (!config || !selectedLang) return [];
        const langConfig = config.languages.find(l => l.language === selectedLang);
        return langConfig?.platforms[selectedPlatform]?.screenshots || [];
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

      const handleAddScreenshot = () => {
        setEditingScreenshot(emptyScreenshot());
        setEditingIndex(-1);
      };

      const handleEditScreenshot = (screenshot, index) => {
        setEditingScreenshot(JSON.parse(JSON.stringify(screenshot)));
        setEditingIndex(index);
      };

      const handleSaveScreenshot = (screenshot) => {
        setConfig(prev => {
          const newConfig = JSON.parse(JSON.stringify(prev));
          const langConfig = newConfig.languages.find(l => l.language === selectedLang);
          if (langConfig) {
            const screenshots = langConfig.platforms[selectedPlatform].screenshots;
            if (editingIndex >= 0) {
              screenshots[editingIndex] = screenshot;
            } else {
              screenshots.push(screenshot);
            }
          }
          return newConfig;
        });
        setEditingScreenshot(null);
        setEditingIndex(-1);
      };

      const handleDeleteScreenshot = (index) => {
        if (!confirm('Delete this screenshot?')) return;
        setConfig(prev => {
          const newConfig = JSON.parse(JSON.stringify(prev));
          const langConfig = newConfig.languages.find(l => l.language === selectedLang);
          if (langConfig) {
            langConfig.platforms[selectedPlatform].screenshots.splice(index, 1);
          }
          return newConfig;
        });
      };

      const handleExportConfig = () => {
        const langConfig = config.languages.find(l => l.language === selectedLang);
        const screenshots = langConfig?.platforms[selectedPlatform]?.screenshots || [];
        
        // Format as TypeScript
        const formatValue = (val, indent = 0) => {
          const spaces = '  '.repeat(indent);
          if (val === null || val === undefined) return 'null';
          if (typeof val === 'string') return "'" + val + "'";
          if (typeof val === 'number' || typeof val === 'boolean') return String(val);
          if (Array.isArray(val)) {
            if (val.length === 0) return '[]';
            const items = val.map(v => formatValue(v, indent + 1));
            if (val.every(v => typeof v === 'string')) {
              return '[' + items.join(', ') + ']';
            }
            return '[\\n' + items.map(i => spaces + '  ' + i).join(',\\n') + '\\n' + spaces + ']';
          }
          if (typeof val === 'object') {
            const entries = Object.entries(val).filter(([_, v]) => v !== undefined && v !== '');
            if (entries.length === 0) return '{}';
            const props = entries.map(([k, v]) => spaces + '  ' + k + ': ' + formatValue(v, indent + 1));
            return '{\\n' + props.join(',\\n') + '\\n' + spaces + '}';
          }
          return String(val);
        };
        
        const formatted = screenshots.map(s => formatValue(s, 2)).join(',\\n        ');
        const output = 'screenshots: [\\n        ' + formatted + '\\n      ]';
        
        navigator.clipboard.writeText(output);
        alert('Config copied to clipboard!\\n\\nPaste into config.' + selectedLang + '.ts');
      };

      const gradient = config?.theme?.background?.gradient || 'linear-gradient(180deg, #6366f1 0%, #4f46e5 50%, #3730a3 100%)';
      const screenshots = getCurrentScreenshots();

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
                <select class="w-full bg-gray-700 rounded px-3 py-2"
                  value=\${selectedLang} onChange=\${(e) => setSelectedLang(e.target.value)}>
                  \${config.languages.map(l => html\`
                    <option key=\${l.language} value=\${l.language}>\${l.language.toUpperCase()}</option>
                  \`)}
                </select>
              </div>

              <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="font-semibold mb-3">Platform</h3>
                <div class="flex gap-2">
                  <button class=\${"flex-1 py-2 rounded " + (selectedPlatform === 'android' ? "bg-green-600" : "bg-gray-700")}
                    onClick=\${() => setSelectedPlatform('android')}>Android</button>
                  <button class=\${"flex-1 py-2 rounded " + (selectedPlatform === 'ios' ? "bg-blue-600" : "bg-gray-700")}
                    onClick=\${() => setSelectedPlatform('ios')}>iOS</button>
                </div>
              </div>

              <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="font-semibold mb-3">Actions</h3>
                <div class="space-y-2">
                  <button class="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded disabled:opacity-50"
                    onClick=\${handleBuild} disabled=\${building}>
                    \${building ? 'Building...' : 'Generate Images'}
                  </button>
                  <button class="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded"
                    onClick=\${handleExportConfig}>Copy Config</button>
                  <button class="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded"
                    onClick=\${loadData}>Refresh</button>
                </div>
              </div>

              <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="font-semibold mb-3">Upload</h3>
                <\${FileUpload} onUpload=\${loadData} />
              </div>

              <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="font-semibold mb-3">Theme Preview</h3>
                <div class="rounded h-16" style=\${{ background: gradient }}></div>
              </div>
            </div>

            <!-- Main Content -->
            <div class="lg:col-span-3">
              <div class="bg-gray-800 rounded-lg p-4 mb-6">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-xl font-semibold">Screenshots (\${screenshots.length})</h2>
                  <button class="px-4 py-2 bg-green-600 hover:bg-green-500 rounded flex items-center gap-2"
                    onClick=\${handleAddScreenshot}>
                    <span>+</span> Add Screenshot
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  \${screenshots.map((screenshot, idx) => html\`
                    <div key=\${screenshot.id + idx} class="bg-gray-700 rounded-lg overflow-hidden group relative">
                      <div class="aspect-[9/16] relative" style=\${{ background: gradient }}>
                        \${screenshot.glows?.map((glow, i) => html\`
                          <div key=\${i} class="glow-preview absolute rounded-full" style=\${{
                            width: glow.size / 6 + 'px',
                            height: glow.size / 6 + 'px',
                            background: GLOW_HEX[glow.color],
                            top: glow.top, right: glow.right, bottom: glow.bottom, left: glow.left,
                          }}/>
                        \`)}
                        <div class="absolute inset-0 flex flex-col items-center justify-start p-4 pt-8 text-center">
                          <h3 class="text-base font-bold mb-1" dangerouslySetInnerHTML=\${{ __html: screenshot.headline.replace(/<br>/g, ' ') }}/>
                          <p class="text-xs opacity-75">\${screenshot.subtitle}</p>
                        </div>
                        \${screenshot.imagePath && !Array.isArray(screenshot.imagePath) && html\`
                          <div class="absolute bottom-8 left-1/2 -translate-x-1/2 w-20">
                            <div class="phone-frame-preview">
                              <div class="phone-screen-preview aspect-[9/19]">
                                <img src="/assets/\${screenshot.imagePath}" class="w-full h-full object-cover" />
                              </div>
                            </div>
                          </div>
                        \`}
                        \${Array.isArray(screenshot.imagePath) && screenshot.imagePath[0] && html\`
                          <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
                            \${screenshot.imagePath.map((img, i) => img && html\`
                              <div key=\${i} class="w-14 \${i === 0 ? '-rotate-6' : 'rotate-6'}">
                                <div class="phone-frame-preview">
                                  <div class="phone-screen-preview aspect-[9/19]">
                                    <img src="/assets/\${img}" class="w-full h-full object-cover" />
                                  </div>
                                </div>
                              </div>
                            \`)}
                          </div>
                        \`}
                      </div>
                      <div class="p-3">
                        <div class="flex items-center justify-between">
                          <span class="font-medium text-sm">\${idx + 1}. \${screenshot.id}</span>
                          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button class="px-2 py-1 text-xs bg-indigo-600 rounded hover:bg-indigo-500"
                              onClick=\${() => handleEditScreenshot(screenshot, idx)}>Edit</button>
                            <button class="px-2 py-1 text-xs bg-red-600 rounded hover:bg-red-500"
                              onClick=\${() => handleDeleteScreenshot(idx)}>Delete</button>
                          </div>
                        </div>
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

          \${editingScreenshot && html\`
            <\${ScreenshotEditor}
              screenshot=\${editingScreenshot}
              assets=\${assets}
              config=\${config}
              onSave=\${handleSaveScreenshot}
              onCancel=\${() => setEditingScreenshot(null)}
            />
          \`}
        </div>
      \`;
    };

    render(html\`<\${App} />\`, document.getElementById('app'));
  </script>
</body>
</html>`;

// Start server
const port = parseInt(Deno.env.get('PORT') || '3000');
console.log(`🚀 Screenshot Generator UI running at http://localhost:${port}`);
console.log('   Press Ctrl+C to stop\n');

Deno.serve({ port }, app.fetch);
