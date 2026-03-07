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
  <title>Screenshot Studio</title>
  <script src="https://unpkg.com/preact@10/dist/preact.umd.js"></script>
  <script src="https://unpkg.com/preact@10/hooks/dist/hooks.umd.js"></script>
  <script src="https://unpkg.com/htm@3/dist/htm.umd.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
        }
      }
    }
  </script>
  <style>
    * { font-family: 'Inter', system-ui, sans-serif; }
    .glow-effect { filter: blur(60px); opacity: 0.6; pointer-events: none; }
    .glow-effect-sm { filter: blur(30px); opacity: 0.5; pointer-events: none; }
    
    /* Phone frame styling */
    .phone-frame {
      background: linear-gradient(160deg, #3a3a40 0%, #1a1a20 100%);
      border-radius: 32px;
      padding: 8px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1);
    }
    .phone-screen {
      background: #000;
      border-radius: 24px;
      overflow: hidden;
      position: relative;
    }
    .phone-notch {
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 24px;
      background: #000;
      border-radius: 12px;
      z-index: 10;
    }
    
    /* Card preview phone */
    .phone-frame-sm {
      background: linear-gradient(160deg, #3a3a40 0%, #1a1a20 100%);
      border-radius: 12px;
      padding: 3px;
    }
    .phone-screen-sm {
      background: #000;
      border-radius: 9px;
      overflow: hidden;
    }
    
    /* Form elements */
    .input-field {
      background: rgba(55, 65, 81, 0.5);
      border: 1px solid rgba(75, 85, 99, 0.5);
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 14px;
      transition: all 0.15s;
      width: 100%;
    }
    .input-field:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
    .input-field:hover:not(:focus) {
      border-color: rgba(107, 114, 128, 0.7);
    }
    
    .select-field {
      background: rgba(55, 65, 81, 0.5);
      border: 1px solid rgba(75, 85, 99, 0.5);
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 14px;
      cursor: pointer;
      width: 100%;
    }
    .select-field:focus {
      outline: none;
      border-color: #6366f1;
    }
    
    .btn {
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.15s;
      cursor: pointer;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white;
    }
    .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }
    
    .btn-secondary {
      background: rgba(75, 85, 99, 0.5);
      color: white;
      border: 1px solid rgba(107, 114, 128, 0.3);
    }
    .btn-secondary:hover { background: rgba(75, 85, 99, 0.7); }
    
    .btn-success {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
    }
    .btn-success:hover { filter: brightness(1.1); }
    
    .btn-danger {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .btn-danger:hover { background: rgba(239, 68, 68, 0.3); }
    
    /* Section card */
    .section-card {
      background: rgba(31, 41, 55, 0.5);
      border: 1px solid rgba(55, 65, 81, 0.5);
      border-radius: 12px;
      padding: 20px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
    }
    
    /* Color picker */
    .color-swatch {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.15s;
    }
    .color-swatch:hover { transform: scale(1.1); }
    .color-swatch.selected { border-color: white; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5); }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: rgba(31, 41, 55, 0.3); border-radius: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(75, 85, 99, 0.5); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(75, 85, 99, 0.7); }
    
    /* Asset thumbnail */
    .asset-thumb {
      aspect-ratio: 9/16;
      border-radius: 6px;
      overflow: hidden;
      background: rgba(0,0,0,0.3);
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.15s;
    }
    .asset-thumb:hover { border-color: rgba(99, 102, 241, 0.5); }
    .asset-thumb.selected { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3); }
    
    /* Checkbox toggle */
    .toggle-checkbox {
      appearance: none;
      width: 44px;
      height: 24px;
      background: rgba(75, 85, 99, 0.5);
      border-radius: 12px;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
    }
    .toggle-checkbox::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 10px;
      transition: all 0.2s;
    }
    .toggle-checkbox:checked {
      background: #6366f1;
    }
    .toggle-checkbox:checked::after {
      left: 22px;
    }
  </style>
</head>
<body class="bg-gray-900 text-white min-h-screen">
  <div id="app"></div>
  <script type="module">
    const { h, render } = preact;
    const { useState, useEffect, useRef, useMemo } = preactHooks;
    const html = htm.bind(h);

    // Constants
    const GLOW_COLORS = ['purple', 'blue', 'pink', 'cyan', 'amber', 'green', 'red', 'orange', 'white'];
    const GLOW_HEX = {
      purple: '#a855f7', blue: '#3b82f6', pink: '#ec4899', cyan: '#06b6d4',
      amber: '#f59e0b', green: '#22c55e', red: '#ef4444', orange: '#f97316', white: '#ffffff'
    };
    const MASCOT_POSITIONS = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
    const PRESET_GRADIENTS = [
      { name: 'Indigo', gradient: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 50%, #3730a3 100%)' },
      { name: 'Purple', gradient: 'linear-gradient(180deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%)' },
      { name: 'Blue', gradient: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)' },
      { name: 'Cyan', gradient: 'linear-gradient(180deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)' },
      { name: 'Green', gradient: 'linear-gradient(180deg, #22c55e 0%, #16a34a 50%, #15803d 100%)' },
      { name: 'Orange', gradient: 'linear-gradient(180deg, #f97316 0%, #ea580c 50%, #c2410c 100%)' },
      { name: 'Pink', gradient: 'linear-gradient(180deg, #ec4899 0%, #db2777 50%, #be185d 100%)' },
      { name: 'Rose', gradient: 'linear-gradient(180deg, #f43f5e 0%, #e11d48 50%, #be123c 100%)' },
      { name: 'Slate', gradient: 'linear-gradient(180deg, #64748b 0%, #475569 50%, #334155 100%)' },
    ];

    const emptyScreenshot = () => ({
      id: 'screenshot-' + Date.now(),
      headline: 'Your Headline Here',
      subtitle: 'Add a compelling subtitle',
      imagePath: '',
      glows: [
        { color: 'purple', size: 500, top: '-150px', right: '-150px' },
        { color: 'blue', size: 400, bottom: '100px', left: '-100px' }
      ],
      phoneFrame: { wide: false, small: false },
      mascot: null
    });

    // Screenshot Editor Modal - Full Featured
    const ScreenshotEditor = ({ screenshot, assets, config, onSave, onCancel }) => {
      const [data, setData] = useState({ ...screenshot });
      const [isDualMode, setIsDualMode] = useState(Array.isArray(screenshot.imagePath));
      const [customGradient, setCustomGradient] = useState({
        color1: '#6366f1',
        color2: '#4f46e5', 
        color3: '#3730a3'
      });
      const [useCustomGradient, setUseCustomGradient] = useState(false);

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

      const baseGradient = config?.theme?.background?.gradient || PRESET_GRADIENTS[0].gradient;
      const gradient = useCustomGradient 
        ? 'linear-gradient(180deg, ' + customGradient.color1 + ' 0%, ' + customGradient.color2 + ' 50%, ' + customGradient.color3 + ' 100%)'
        : baseGradient;

      const screenshotAssets = assets.filter(a => a.includes('screenshot') || a.includes('screen'));

      return html\`
        <div class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
          <div class="bg-gray-800 rounded-2xl w-full max-w-7xl h-[calc(100vh-48px)] flex flex-col shadow-2xl border border-gray-700/50">
            
            <!-- Header -->
            <div class="flex-shrink-0 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 class="text-xl font-semibold">Edit Screenshot</h2>
                <p class="text-sm text-gray-400 mt-0.5">Configure your App Store screenshot</p>
              </div>
              <div class="flex gap-3">
                <button class="btn btn-secondary" onClick=\${onCancel}>Cancel</button>
                <button class="btn btn-primary" onClick=\${() => onSave(data)}>
                  <span class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Save Changes
                  </span>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 flex min-h-0">
              
              <!-- Left: Live Preview -->
              <div class="w-[420px] flex-shrink-0 bg-gray-900/50 p-6 flex flex-col border-r border-gray-700">
                <div class="section-title">Live Preview</div>
                <div class="flex-1 flex items-center justify-center">
                  <div class="w-full max-w-[320px] aspect-[9/19.5] rounded-2xl overflow-hidden relative shadow-2xl" style=\${{ background: gradient }}>
                    <!-- Glow effects -->
                    \${data.glows.map((glow, i) => html\`
                      <div key=\${i} class="glow-effect absolute rounded-full" style=\${{
                        width: (glow.size * 0.8) + 'px',
                        height: (glow.size * 0.8) + 'px',
                        background: GLOW_HEX[glow.color],
                        top: glow.top, right: glow.right, bottom: glow.bottom, left: glow.left,
                        transform: 'scale(0.35)',
                        transformOrigin: 'center'
                      }}/>
                    \`)}
                    
                    <!-- Text content -->
                    <div class="absolute inset-x-0 top-0 flex flex-col items-center text-center px-5 pt-10">
                      <h1 class="text-xl font-bold mb-2 leading-tight drop-shadow-lg" 
                          dangerouslySetInnerHTML=\${{ __html: data.headline }}/>
                      <p class="text-sm opacity-90 drop-shadow">\${data.subtitle}</p>
                    </div>
                    
                    <!-- Phone mockup -->
                    <div class="absolute inset-x-0 bottom-0 flex justify-center pb-6 \${isDualMode ? 'px-4' : 'px-12'}">
                      \${isDualMode ? html\`
                        <div class="flex gap-2 w-full justify-center">
                          \${[0, 1].map(i => {
                            const img = Array.isArray(data.imagePath) ? data.imagePath[i] : '';
                            return html\`
                              <div key=\${i} class="w-[42%] \${i === 0 ? '-rotate-6' : 'rotate-6'} \${i === 0 ? '-mr-4' : '-ml-4'}" style="z-index: \${i === 0 ? 1 : 2}">
                                <div class="phone-frame">
                                  <div class="phone-screen aspect-[9/19.5]">
                                    \${img ? html\`<img src="/assets/\${img}" class="w-full h-full object-cover" />\` 
                                           : html\`<div class="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs">No image</div>\`}
                                  </div>
                                </div>
                              </div>
                            \`;
                          })}
                        </div>
                      \` : html\`
                        <div class="w-full">
                          <div class="phone-frame">
                            <div class="phone-screen aspect-[9/19.5]">
                              \${data.imagePath && typeof data.imagePath === 'string' 
                                ? html\`<img src="/assets/\${data.imagePath}" class="w-full h-full object-cover" />\`
                                : html\`<div class="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-sm">Select an image</div>\`}
                            </div>
                          </div>
                        </div>
                      \`}
                    </div>
                    
                    <!-- Mascot -->
                    \${data.mascot && html\`
                      <div class="absolute w-16 h-16 drop-shadow-lg" style=\${{
                        bottom: data.mascot.position.includes('bottom') ? '16px' : 'auto',
                        top: data.mascot.position.includes('top') ? '16px' : 'auto',
                        right: data.mascot.position.includes('right') ? '16px' : 'auto',
                        left: data.mascot.position.includes('left') ? '16px' : 'auto',
                      }}>
                        <img src="/assets/\${config?.app?.defaultMascotPath?.replace('assets/', '') || 'mascot.png'}" 
                             class="w-full h-full object-contain" onerror="this.style.display='none'" />
                      </div>
                    \`}
                  </div>
                </div>
              </div>

              <!-- Right: Settings Panel -->
              <div class="flex-1 overflow-y-auto p-6">
                <div class="space-y-5 max-w-2xl">
                  
                  <!-- Content Section -->
                  <div class="section-card">
                    <div class="section-title">Content</div>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium mb-2">Screenshot ID</label>
                        <input type="text" class="input-field" placeholder="unique-identifier"
                          value=\${data.id} onChange=\${(e) => updateField('id', e.target.value)} />
                      </div>
                      <div>
                        <label class="block text-sm font-medium mb-2">Headline <span class="text-gray-500 font-normal">(supports &lt;br&gt; for line breaks)</span></label>
                        <input type="text" class="input-field" placeholder="Your Amazing Feature"
                          value=\${data.headline} onChange=\${(e) => updateField('headline', e.target.value)} />
                      </div>
                      <div>
                        <label class="block text-sm font-medium mb-2">Subtitle</label>
                        <input type="text" class="input-field" placeholder="A brief description of the feature"
                          value=\${data.subtitle} onChange=\${(e) => updateField('subtitle', e.target.value)} />
                      </div>
                    </div>
                  </div>
                  
                  <!-- Screenshot Image Section -->
                  <div class="section-card">
                    <div class="section-title">Screenshot Image</div>
                    <div class="space-y-4">
                      <label class="flex items-center justify-between">
                        <div>
                          <span class="font-medium">Dual Phone Layout</span>
                          <p class="text-sm text-gray-400">Show two phones side by side</p>
                        </div>
                        <input type="checkbox" class="toggle-checkbox" checked=\${isDualMode} onChange=\${(e) => {
                          setIsDualMode(e.target.checked);
                          updateField('imagePath', e.target.checked ? ['', ''] : '');
                          if (e.target.checked) {
                            setData(prev => ({ ...prev, phoneFrame: { ...prev.phoneFrame, small: true }}));
                          }
                        }} />
                      </label>
                      
                      <div>
                        <label class="block text-sm font-medium mb-3">\${isDualMode ? 'Select Images' : 'Select Image'}</label>
                        <div class="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1">
                          \${isDualMode ? html\`
                            \${[0, 1].map(idx => html\`
                              <div key=\${idx} class="col-span-4">
                                <label class="text-xs text-gray-400 mb-2 block">Phone \${idx + 1}</label>
                                <div class="grid grid-cols-4 gap-2">
                                  \${screenshotAssets.map(asset => {
                                    const isSelected = Array.isArray(data.imagePath) && data.imagePath[idx] === asset;
                                    return html\`
                                      <div key=\${asset} 
                                           class=\${"asset-thumb " + (isSelected ? "selected" : "")}
                                           onClick=\${() => {
                                             const paths = Array.isArray(data.imagePath) ? [...data.imagePath] : ['', ''];
                                             paths[idx] = asset;
                                             updateField('imagePath', paths);
                                           }}>
                                        <img src="/assets/\${asset}" class="w-full h-full object-cover" />
                                      </div>
                                    \`;
                                  })}
                                </div>
                              </div>
                            \`)}
                          \` : html\`
                            \${screenshotAssets.map(asset => {
                              const isSelected = data.imagePath === asset;
                              return html\`
                                <div key=\${asset} 
                                     class=\${"asset-thumb " + (isSelected ? "selected" : "")}
                                     onClick=\${() => updateField('imagePath', asset)}>
                                  <img src="/assets/\${asset}" class="w-full h-full object-cover" />
                                </div>
                              \`;
                            })}
                          \`}
                          \${screenshotAssets.length === 0 && html\`
                            <div class="col-span-4 text-center py-8 text-gray-500">
                              <p>No screenshots uploaded yet.</p>
                              <p class="text-sm mt-1">Upload images to the assets/screenshots folder.</p>
                            </div>
                          \`}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Theme Section -->
                  <div class="section-card">
                    <div class="section-title">Background Theme</div>
                    <div class="space-y-4">
                      <label class="flex items-center justify-between">
                        <div>
                          <span class="font-medium">Custom Gradient</span>
                          <p class="text-sm text-gray-400">Override default theme colors</p>
                        </div>
                        <input type="checkbox" class="toggle-checkbox" checked=\${useCustomGradient} 
                          onChange=\${(e) => setUseCustomGradient(e.target.checked)} />
                      </label>
                      
                      \${useCustomGradient ? html\`
                        <div class="space-y-3 pt-2">
                          <div class="grid grid-cols-3 gap-4">
                            <div>
                              <label class="block text-xs text-gray-400 mb-2">Top Color</label>
                              <div class="flex items-center gap-2">
                                <input type="color" class="w-10 h-10 rounded cursor-pointer"
                                  value=\${customGradient.color1} 
                                  onChange=\${(e) => setCustomGradient(prev => ({ ...prev, color1: e.target.value }))} />
                                <input type="text" class="input-field text-xs flex-1" 
                                  value=\${customGradient.color1}
                                  onChange=\${(e) => setCustomGradient(prev => ({ ...prev, color1: e.target.value }))} />
                              </div>
                            </div>
                            <div>
                              <label class="block text-xs text-gray-400 mb-2">Middle Color</label>
                              <div class="flex items-center gap-2">
                                <input type="color" class="w-10 h-10 rounded cursor-pointer"
                                  value=\${customGradient.color2}
                                  onChange=\${(e) => setCustomGradient(prev => ({ ...prev, color2: e.target.value }))} />
                                <input type="text" class="input-field text-xs flex-1"
                                  value=\${customGradient.color2}
                                  onChange=\${(e) => setCustomGradient(prev => ({ ...prev, color2: e.target.value }))} />
                              </div>
                            </div>
                            <div>
                              <label class="block text-xs text-gray-400 mb-2">Bottom Color</label>
                              <div class="flex items-center gap-2">
                                <input type="color" class="w-10 h-10 rounded cursor-pointer"
                                  value=\${customGradient.color3}
                                  onChange=\${(e) => setCustomGradient(prev => ({ ...prev, color3: e.target.value }))} />
                                <input type="text" class="input-field text-xs flex-1"
                                  value=\${customGradient.color3}
                                  onChange=\${(e) => setCustomGradient(prev => ({ ...prev, color3: e.target.value }))} />
                              </div>
                            </div>
                          </div>
                        </div>
                      \` : html\`
                        <div>
                          <label class="block text-xs text-gray-400 mb-2">Preset Themes</label>
                          <div class="flex flex-wrap gap-2">
                            \${PRESET_GRADIENTS.map((preset, idx) => html\`
                              <button key=\${idx} 
                                class="w-12 h-12 rounded-lg transition-transform hover:scale-105 border-2 border-white/10 hover:border-white/30"
                                style=\${{ background: preset.gradient }}
                                title=\${preset.name}
                                onClick=\${() => {
                                  // In a real app, this would update the config
                                  setUseCustomGradient(true);
                                  const colors = preset.gradient.match(/#[a-f0-9]{6}/gi);
                                  if (colors && colors.length >= 3) {
                                    setCustomGradient({ color1: colors[0], color2: colors[1], color3: colors[2] });
                                  }
                                }}
                              />
                            \`)}
                          </div>
                        </div>
                      \`}
                    </div>
                  </div>
                  
                  <!-- Glow Effects Section -->
                  <div class="section-card">
                    <div class="flex items-center justify-between mb-4">
                      <div class="section-title mb-0">Glow Effects</div>
                      <button class="btn btn-success text-sm py-2" onClick=\${addGlow}>
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                          </svg>
                          Add Glow
                        </span>
                      </button>
                    </div>
                    
                    \${data.glows.length === 0 ? html\`
                      <p class="text-gray-500 text-sm text-center py-4">No glow effects. Add one to create depth.</p>
                    \` : html\`
                      <div class="space-y-3">
                        \${data.glows.map((glow, idx) => html\`
                          <div key=\${idx} class="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                            <div class="flex items-center justify-between mb-3">
                              <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full shadow-lg" style=\${{ background: GLOW_HEX[glow.color] }}/>
                                <span class="font-medium">Glow \${idx + 1}</span>
                              </div>
                              <button class="btn btn-danger text-xs py-1.5 px-3" onClick=\${() => removeGlow(idx)}>Remove</button>
                            </div>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                              <div>
                                <label class="block text-xs text-gray-400 mb-1">Color</label>
                                <select class="select-field text-sm"
                                  value=\${glow.color} onChange=\${(e) => updateGlow(idx, 'color', e.target.value)}>
                                  \${GLOW_COLORS.map(c => html\`<option key=\${c} value=\${c}>\${c.charAt(0).toUpperCase() + c.slice(1)}</option>\`)}
                                </select>
                              </div>
                              <div>
                                <label class="block text-xs text-gray-400 mb-1">Size (px)</label>
                                <input type="number" class="input-field text-sm" min="100" max="1500" step="50"
                                  value=\${glow.size} onChange=\${(e) => updateGlow(idx, 'size', parseInt(e.target.value) || 400)} />
                              </div>
                              <div>
                                <label class="block text-xs text-gray-400 mb-1">Top</label>
                                <input type="text" class="input-field text-sm" placeholder="-100px or 20%"
                                  value=\${glow.top || ''} onChange=\${(e) => updateGlow(idx, 'top', e.target.value || undefined)} />
                              </div>
                              <div>
                                <label class="block text-xs text-gray-400 mb-1">Right</label>
                                <input type="text" class="input-field text-sm" placeholder="-100px"
                                  value=\${glow.right || ''} onChange=\${(e) => updateGlow(idx, 'right', e.target.value || undefined)} />
                              </div>
                              <div>
                                <label class="block text-xs text-gray-400 mb-1">Bottom</label>
                                <input type="text" class="input-field text-sm" placeholder="50px"
                                  value=\${glow.bottom || ''} onChange=\${(e) => updateGlow(idx, 'bottom', e.target.value || undefined)} />
                              </div>
                              <div>
                                <label class="block text-xs text-gray-400 mb-1">Left</label>
                                <input type="text" class="input-field text-sm" placeholder="-100px"
                                  value=\${glow.left || ''} onChange=\${(e) => updateGlow(idx, 'left', e.target.value || undefined)} />
                              </div>
                            </div>
                          </div>
                        \`)}
                      </div>
                    \`}
                  </div>
                  
                  <!-- Phone Frame & Mascot Section -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="section-card">
                      <div class="section-title">Phone Display</div>
                      <div class="space-y-3">
                        <label class="flex items-center justify-between">
                          <span>Wide Frame</span>
                          <input type="checkbox" class="toggle-checkbox"
                            checked=\${data.phoneFrame?.wide || false}
                            onChange=\${(e) => setData(prev => ({ ...prev, phoneFrame: { ...prev.phoneFrame, wide: e.target.checked }}))} />
                        </label>
                        <label class="flex items-center justify-between">
                          <span>Smaller Size</span>
                          <input type="checkbox" class="toggle-checkbox"
                            checked=\${data.phoneFrame?.small || false}
                            onChange=\${(e) => setData(prev => ({ ...prev, phoneFrame: { ...prev.phoneFrame, small: e.target.checked }}))} />
                        </label>
                      </div>
                    </div>
                    
                    <div class="section-card">
                      <div class="flex items-center justify-between mb-4">
                        <div class="section-title mb-0">Mascot</div>
                        <button class=\${"btn text-sm py-2 " + (data.mascot ? "btn-danger" : "btn-success")}
                          onClick=\${toggleMascot}>
                          \${data.mascot ? 'Remove' : 'Add Mascot'}
                        </button>
                      </div>
                      \${data.mascot && html\`
                        <div>
                          <label class="block text-xs text-gray-400 mb-2">Position</label>
                          <select class="select-field"
                            value=\${data.mascot.position}
                            onChange=\${(e) => setData(prev => ({ ...prev, mascot: { ...prev.mascot, position: e.target.value }}))}>
                            \${MASCOT_POSITIONS.map(p => html\`<option key=\${p} value=\${p}>\${p.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>\`)}
                          </select>
                        </div>
                      \`}
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      \`;
    };

    // File Upload Component with Preview
    const FileUpload = ({ onUpload, assets }) => {
      const inputRef = useRef(null);
      const [uploading, setUploading] = useState(false);
      const [dragOver, setDragOver] = useState(false);

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

      const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) handleUpload(files);
      };

      const screenshotAssets = assets.filter(a => a.includes('screenshot') || a.includes('screen'));

      return html\`
        <div class="space-y-4">
          <div 
            class=\${"border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer " + 
              (dragOver ? "border-indigo-500 bg-indigo-500/10" : "border-gray-600 hover:border-gray-500 hover:bg-gray-800/30")}
            onDragOver=\${(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave=\${() => setDragOver(false)}
            onDrop=\${handleDrop}
            onClick=\${() => inputRef.current?.click()}>
            <input ref=\${inputRef} type="file" accept="image/*" multiple class="hidden"
              onChange=\${(e) => handleUpload(Array.from(e.target.files))} />
            <div class="flex flex-col items-center gap-2">
              <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <div class="text-sm">
                \${uploading ? html\`<span class="text-indigo-400">Uploading...</span>\` : html\`
                  <span class="text-gray-300">Drop images here</span>
                  <span class="text-gray-500"> or click to browse</span>
                \`}
              </div>
            </div>
          </div>
          
          \${screenshotAssets.length > 0 && html\`
            <div>
              <div class="text-xs text-gray-500 mb-2">Uploaded (\${screenshotAssets.length})</div>
              <div class="grid grid-cols-4 gap-2">
                \${screenshotAssets.slice(0, 8).map(asset => html\`
                  <div key=\${asset} class="aspect-[9/16] rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                    <img src="/assets/\${asset}" class="w-full h-full object-cover" />
                  </div>
                \`)}
                \${screenshotAssets.length > 8 && html\`
                  <div class="aspect-[9/16] rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500 text-xs">
                    +\${screenshotAssets.length - 8} more
                  </div>
                \`}
              </div>
            </div>
          \`}
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
        return html\`
          <div class="flex items-center justify-center h-screen">
            <div class="flex flex-col items-center gap-4">
              <div class="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <div class="text-gray-400">Loading configuration...</div>
            </div>
          </div>
        \`;
      }

      if (!config) {
        return html\`
          <div class="flex items-center justify-center h-screen">
            <div class="text-center">
              <div class="text-6xl mb-4">⚠️</div>
              <div class="text-xl text-red-400 mb-2">Configuration Not Found</div>
              <p class="text-gray-500">Make sure config/config.ts exists and is valid.</p>
            </div>
          </div>
        \`;
      }

      return html\`
        <div class="min-h-screen">
          <!-- Top Navigation -->
          <nav class="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-40">
            <div class="container mx-auto px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h1 class="text-lg font-semibold">\${config.app?.name || 'Screenshot Studio'}</h1>
                      <p class="text-xs text-gray-500">App Store Screenshot Generator</p>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-3">
                  <!-- Language Selector -->
                  <select class="select-field w-auto pr-8"
                    value=\${selectedLang} onChange=\${(e) => setSelectedLang(e.target.value)}>
                    \${config.languages.map(l => html\`
                      <option key=\${l.language} value=\${l.language}>\${l.language.toUpperCase()}</option>
                    \`)}
                  </select>
                  
                  <!-- Platform Toggle -->
                  <div class="flex bg-gray-700/50 rounded-lg p-1">
                    <button 
                      class=\${"px-4 py-2 rounded-md text-sm font-medium transition-all " + 
                        (selectedPlatform === 'android' ? "bg-green-600 text-white shadow" : "text-gray-400 hover:text-white")}
                      onClick=\${() => setSelectedPlatform('android')}>
                      Android
                    </button>
                    <button 
                      class=\${"px-4 py-2 rounded-md text-sm font-medium transition-all " + 
                        (selectedPlatform === 'ios' ? "bg-blue-600 text-white shadow" : "text-gray-400 hover:text-white")}
                      onClick=\${() => setSelectedPlatform('ios')}>
                      iOS
                    </button>
                  </div>
                  
                  <button class="btn btn-secondary" onClick=\${handleExportConfig}>
                    <span class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                      Export
                    </span>
                  </button>
                  
                  <button class="btn btn-primary" onClick=\${handleBuild} disabled=\${building}>
                    <span class="flex items-center gap-2">
                      \${building ? html\`
                        <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      \` : html\`
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                        </svg>
                      \`}
                      \${building ? 'Building...' : 'Generate'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <div class="container mx-auto px-6 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              <!-- Sidebar -->
              <div class="lg:col-span-1 space-y-5">
                <!-- Upload Section -->
                <div class="section-card">
                  <div class="section-title">Upload Screenshots</div>
                  <\${FileUpload} onUpload=\${loadData} assets=\${assets} />
                </div>

                <!-- Theme Preview -->
                <div class="section-card">
                  <div class="section-title">Theme Preview</div>
                  <div class="space-y-3">
                    <div class="h-24 rounded-xl shadow-lg" style=\${{ background: gradient }}></div>
                    <div class="text-xs text-gray-500 text-center">
                      Edit theme colors in screenshot editor
                    </div>
                  </div>
                </div>
                
                <!-- Quick Stats -->
                <div class="section-card">
                  <div class="section-title">Quick Stats</div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-700/30 rounded-lg p-3 text-center">
                      <div class="text-2xl font-bold text-indigo-400">\${screenshots.length}</div>
                      <div class="text-xs text-gray-500">Screenshots</div>
                    </div>
                    <div class="bg-gray-700/30 rounded-lg p-3 text-center">
                      <div class="text-2xl font-bold text-green-400">\${assets.length}</div>
                      <div class="text-xs text-gray-500">Assets</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Main Content -->
              <div class="lg:col-span-3">
                <!-- Header -->
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <h2 class="text-2xl font-semibold">Screenshots</h2>
                    <p class="text-gray-500 text-sm mt-1">
                      \${selectedLang?.toUpperCase()} • \${selectedPlatform === 'ios' ? 'iOS App Store' : 'Google Play Store'}
                    </p>
                  </div>
                  <button class="btn btn-success" onClick=\${handleAddScreenshot}>
                    <span class="flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      Add Screenshot
                    </span>
                  </button>
                </div>

                <!-- Screenshot Grid -->
                \${screenshots.length === 0 ? html\`
                  <div class="section-card text-center py-16">
                    <div class="text-6xl mb-4">📱</div>
                    <h3 class="text-xl font-medium mb-2">No Screenshots Yet</h3>
                    <p class="text-gray-500 mb-6">Get started by adding your first screenshot.</p>
                    <button class="btn btn-primary" onClick=\${handleAddScreenshot}>
                      Create Your First Screenshot
                    </button>
                  </div>
                \` : html\`
                  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    \${screenshots.map((screenshot, idx) => html\`
                      <div key=\${screenshot.id + idx} 
                           class="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600 transition-all group">
                        <!-- Preview -->
                        <div class="aspect-[9/16] relative overflow-hidden" style=\${{ background: gradient }}>
                          \${screenshot.glows?.map((glow, i) => html\`
                            <div key=\${i} class="glow-effect-sm absolute rounded-full" style=\${{
                              width: glow.size / 4 + 'px',
                              height: glow.size / 4 + 'px',
                              background: GLOW_HEX[glow.color],
                              top: glow.top, right: glow.right, bottom: glow.bottom, left: glow.left,
                            }}/>
                          \`)}
                          
                          <!-- Text -->
                          <div class="absolute inset-0 flex flex-col items-center pt-8 px-4 text-center">
                            <h3 class="text-lg font-bold mb-1 leading-tight drop-shadow" 
                                dangerouslySetInnerHTML=\${{ __html: screenshot.headline.replace(/<br>/g, ' ') }}/>
                            <p class="text-sm opacity-80">\${screenshot.subtitle}</p>
                          </div>
                          
                          <!-- Phone -->
                          \${screenshot.imagePath && !Array.isArray(screenshot.imagePath) && html\`
                            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 w-24">
                              <div class="phone-frame-sm">
                                <div class="phone-screen-sm aspect-[9/19]">
                                  <img src="/assets/\${screenshot.imagePath}" class="w-full h-full object-cover" />
                                </div>
                              </div>
                            </div>
                          \`}
                          \${Array.isArray(screenshot.imagePath) && screenshot.imagePath[0] && html\`
                            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
                              \${screenshot.imagePath.map((img, i) => img && html\`
                                <div key=\${i} class="w-16 \${i === 0 ? '-rotate-6 -mr-2' : 'rotate-6 -ml-2'}" style="z-index: \${i}">
                                  <div class="phone-frame-sm">
                                    <div class="phone-screen-sm aspect-[9/19]">
                                      <img src="/assets/\${img}" class="w-full h-full object-cover" />
                                    </div>
                                  </div>
                                </div>
                              \`)}
                            </div>
                          \`}
                          
                          <!-- Hover overlay -->
                          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button class="btn btn-primary" onClick=\${() => handleEditScreenshot(screenshot, idx)}>
                              Edit
                            </button>
                            <button class="btn btn-danger" onClick=\${() => handleDeleteScreenshot(idx)}>
                              Delete
                            </button>
                          </div>
                        </div>
                        
                        <!-- Info -->
                        <div class="p-4 border-t border-gray-700/50">
                          <div class="flex items-center justify-between">
                            <div>
                              <div class="font-medium">\${idx + 1}. \${screenshot.id}</div>
                              <div class="text-xs text-gray-500 mt-0.5">
                                \${screenshot.glows?.length || 0} glows • \${screenshot.mascot ? 'With mascot' : 'No mascot'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    \`)}
                  </div>
                \`}

                <!-- Build Output -->
                \${output && html\`
                  <div class="section-card mt-6">
                    <div class="flex items-center justify-between mb-3">
                      <div class="section-title mb-0">Build Output</div>
                      <button class="text-xs text-gray-500 hover:text-white" onClick=\${() => setOutput('')}>Clear</button>
                    </div>
                    <pre class="bg-gray-900/50 rounded-lg p-4 text-sm overflow-auto max-h-48 text-gray-300 font-mono">\${output}</pre>
                  </div>
                \`}
              </div>
            </div>
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
