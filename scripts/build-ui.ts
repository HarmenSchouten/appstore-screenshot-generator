/**
 * Build script for UI using esbuild
 * 
 * Usage:
 *   deno run -A scripts/build-ui.ts [--watch]
 */

import * as esbuild from 'npm:esbuild@0.20.0';

const watch = Deno.args.includes('--watch');

const config: esbuild.BuildOptions = {
  entryPoints: ['src/ui/main.tsx'],
  bundle: true,
  outfile: 'dist/app.js',
  format: 'esm',
  target: 'es2020',
  jsx: 'automatic',
  jsxImportSource: 'preact',
  minify: !watch,
  sourcemap: watch ? 'inline' : false,
  logLevel: 'info',
};

if (watch) {
  const ctx = await esbuild.context(config);
  await ctx.watch();
  console.log('👀 Watching for changes...');
} else {
  await esbuild.build(config);
  console.log('✅ Build complete');
  Deno.exit(0);
}
