#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env --allow-run
/**
 * Build script - generates HTML and converts to PNG in one command
 */

console.log('🎨 App Store Screenshot Generator\n');

// Step 1: Generate HTML
console.log('Step 1/2: Generating HTML files from config...\n');
const generateProcess = new Deno.Command('deno', {
  args: ['task', 'generate'],
  stdout: 'inherit',
  stderr: 'inherit',
});
const generateResult = await generateProcess.output();

if (!generateResult.success) {
  console.error('\n❌ Failed to generate HTML files');
  Deno.exit(1);
}

console.log('\n─────────────────────────────────────────\n');

// Step 2: Convert to PNG
console.log('Step 2/2: Converting HTML to PNG...\n');
const convertProcess = new Deno.Command('deno', {
  args: ['task', 'convert'],
  stdout: 'inherit',
  stderr: 'inherit',
});
const convertResult = await convertProcess.output();

if (!convertResult.success) {
  console.error('\n❌ Failed to convert to PNG');
  Deno.exit(1);
}

console.log('\n✨ All done! Screenshots are ready in output/images/\n');
