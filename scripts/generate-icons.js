#!/usr/bin/env node

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, '../public/icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function drawLogicIcon(size, isMaskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Calculate dimensions
  const center = size / 2;
  const padding = isMaskable ? size * 0.2 : size * 0.1;
  const radius = (size - padding * 2) / 2;

  // Create radial gradient background
  const gradient = ctx.createRadialGradient(
    center,
    center,
    0,
    center,
    center,
    radius
  );
  gradient.addColorStop(0, '#60a5fa'); // Lighter blue
  gradient.addColorStop(1, '#3b82f6'); // Theme blue

  // Draw circular background
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw logic symbols
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size * 0.04;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const symbolSize = radius * 0.6;
  const symbolY = center - symbolSize * 0.2;

  // Draw AND symbol (∧)
  ctx.font = `bold ${symbolSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('∧', center - symbolSize * 0.5, symbolY);

  // Draw OR symbol (∨)
  ctx.fillText('∨', center + symbolSize * 0.5, symbolY);

  // Draw IMPLIES arrow (→)
  const arrowY = center + symbolSize * 0.5;
  const arrowStartX = center - symbolSize * 0.6;
  const arrowEndX = center + symbolSize * 0.6;

  // Arrow line
  ctx.beginPath();
  ctx.moveTo(arrowStartX, arrowY);
  ctx.lineTo(arrowEndX, arrowY);
  ctx.stroke();

  // Arrow head
  ctx.beginPath();
  ctx.moveTo(arrowEndX, arrowY);
  ctx.lineTo(arrowEndX - symbolSize * 0.15, arrowY - symbolSize * 0.1);
  ctx.moveTo(arrowEndX, arrowY);
  ctx.lineTo(arrowEndX - symbolSize * 0.15, arrowY + symbolSize * 0.1);
  ctx.stroke();

  return canvas;
}

// Generate standard icons
console.log('Generating standard icons...');
sizes.forEach((size) => {
  const canvas = drawLogicIcon(size, false);
  const buffer = canvas.toBuffer('image/png');
  const filename = path.join(outputDir, `icon-${size}.png`);
  fs.writeFileSync(filename, buffer);
  console.log(`✓ Generated ${filename}`);
});

// Generate maskable icons (with more padding for Android adaptive icons)
console.log('\nGenerating maskable icons...');
sizes.forEach((size) => {
  const canvas = drawLogicIcon(size, true);
  const buffer = canvas.toBuffer('image/png');
  const filename = path.join(outputDir, `icon-maskable-${size}.png`);
  fs.writeFileSync(filename, buffer);
  console.log(`✓ Generated ${filename}`);
});

console.log('\n✓ All icons generated successfully!');
