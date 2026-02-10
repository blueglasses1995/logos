#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, '../public/icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function generateSVGIcon(size, isMaskable = false) {
  const padding = isMaskable ? size * 0.2 : size * 0.1;
  const radius = (size - padding * 2) / 2;
  const center = size / 2;

  // Symbol sizes
  const fontSize = radius * 0.6;
  const symbolSpacing = fontSize * 0.5;
  const arrowY = center + fontSize * 0.5;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg-gradient-${size}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </radialGradient>
  </defs>

  <!-- Circular background -->
  <circle cx="${center}" cy="${center}" r="${radius}" fill="url(#bg-gradient-${size})" />

  <!-- Logic symbols -->
  <g fill="white" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">
    <!-- AND symbol (∧) -->
    <text x="${center - symbolSpacing}" y="${center - fontSize * 0.2}" font-size="${fontSize}" dominant-baseline="middle">∧</text>

    <!-- OR symbol (∨) -->
    <text x="${center + symbolSpacing}" y="${center - fontSize * 0.2}" font-size="${fontSize}" dominant-baseline="middle">∨</text>
  </g>

  <!-- IMPLIES arrow (→) -->
  <g stroke="white" stroke-width="${size * 0.04}" stroke-linecap="round" fill="none">
    <line x1="${center - fontSize * 0.6}" y1="${arrowY}" x2="${center + fontSize * 0.6}" y2="${arrowY}" />
    <polyline points="${center + fontSize * 0.6},${arrowY} ${center + fontSize * 0.45},${arrowY - fontSize * 0.1} ${center + fontSize * 0.6},${arrowY} ${center + fontSize * 0.45},${arrowY + fontSize * 0.1}" />
  </g>
</svg>`;
}

// Generate SVG files
console.log('Generating SVG icon files...');

// Generate standard icons
sizes.forEach((size) => {
  const svg = generateSVGIcon(size, false);
  const filename = path.join(outputDir, `icon-${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`✓ Generated ${filename}`);
});

// Generate maskable icons
sizes.forEach((size) => {
  const svg = generateSVGIcon(size, true);
  const filename = path.join(outputDir, `icon-maskable-${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`✓ Generated ${filename}`);
});

console.log('\n✓ All SVG icons generated successfully!');
console.log('\nNote: SVG files can be used directly in the manifest.');
console.log('If PNG files are needed, you can convert them using an online tool or ImageMagick.');
