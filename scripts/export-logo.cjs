/**
 * Export MEvans logo to PNG
 *
 * Creates high-resolution PNG exports of the MEvans logo in both light and dark modes.
 * Uses canvas to render the text with gradient applied to "Evans".
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Color definitions from design system
const colors = {
  light: {
    foreground: 'rgb(8, 8, 8)',      // --color-text: 0 0% 3.1%
    accent: 'rgb(139, 92, 246)',      // --color-accent: 276 70% 45% (purple)
  },
  dark: {
    foreground: 'rgb(250, 250, 250)', // --color-text: 0 0% 98%
    accent: 'rgb(217, 170, 254)',     // --color-accent: 276 100% 75% (bright purple)
  },
  'light-orange': {
    foreground: 'rgb(8, 8, 8)',      // --color-text: 0 0% 3.1%
    accent: 'rgb(249, 115, 22)',      // Orange accent (orange-500)
  },
  'dark-orange': {
    foreground: 'rgb(250, 250, 250)', // --color-text: 0 0% 98%
    accent: 'rgb(251, 146, 60)',      // Bright orange for dark mode (orange-400)
  }
};

function createLogo(mode = 'dark', width = 1200, height = 400) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Clear canvas with transparent background
  ctx.clearRect(0, 0, width, height);

  // Add black background for dark mode logos
  if (mode.includes('dark')) {
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, width, height);
  }

  // Font setup - use system serif font
  // Scale font size based on canvas dimensions for square formats
  const isSquare = width === height;
  const fontSize = isSquare ? Math.floor(width * 0.25) : 180;
  ctx.font = `${fontSize}px Georgia, serif`;
  ctx.textBaseline = 'middle';

  // Calculate text metrics for positioning
  const fullText = 'MEvans';
  const mText = 'M';
  const evansText = 'Evans';

  const fullWidth = ctx.measureText(fullText).width;
  const mWidth = ctx.measureText(mText).width;

  // Center the entire text
  const startX = (width - fullWidth) / 2;
  const startY = height / 2;

  // Draw "M" in foreground color
  ctx.fillStyle = colors[mode].foreground;
  ctx.fillText(mText, startX, startY);

  // Create gradient for "Evans"
  const evansStartX = startX + mWidth;
  const evansWidth = ctx.measureText(evansText).width;
  const gradient = ctx.createLinearGradient(
    evansStartX,
    startY - fontSize / 2,
    evansStartX + evansWidth,
    startY + fontSize / 2
  );

  // Gradient colors (135deg diagonal - accent to foreground)
  gradient.addColorStop(0, colors[mode].accent);
  gradient.addColorStop(1, colors[mode].foreground);

  // Draw "Evans" with gradient
  ctx.fillStyle = gradient;
  ctx.fillText(evansText, evansStartX, startY);

  return canvas;
}

// Create output directory
const outputDir = path.join(__dirname, '../public/logo');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate logos in both modes and multiple sizes
const configs = [
  // Purple accent versions
  { mode: 'dark', width: 1200, height: 400, suffix: '' },
  { mode: 'dark', width: 600, height: 200, suffix: '-small' },
  { mode: 'dark', width: 300, height: 300, suffix: '-linkedin' },
  { mode: 'light', width: 1200, height: 400, suffix: '' },
  { mode: 'light', width: 600, height: 200, suffix: '-small' },
  { mode: 'light', width: 300, height: 300, suffix: '-linkedin' },
  // Orange accent versions
  { mode: 'dark-orange', width: 1200, height: 400, suffix: '' },
  { mode: 'dark-orange', width: 600, height: 200, suffix: '-small' },
  { mode: 'dark-orange', width: 300, height: 300, suffix: '-linkedin' },
  { mode: 'light-orange', width: 1200, height: 400, suffix: '' },
  { mode: 'light-orange', width: 600, height: 200, suffix: '-small' },
  { mode: 'light-orange', width: 300, height: 300, suffix: '-linkedin' },
];

configs.forEach(({ mode, width, height, suffix }) => {
  const canvas = createLogo(mode, width, height);
  const filename = `mevans-logo-${mode}${suffix}.png`;
  const filepath = path.join(outputDir, filename);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filepath, buffer);

  console.log(`✅ Created: ${filename} (${width}x${height})`);
});

console.log(`\n📁 Logos exported to: ${outputDir}`);
console.log('\nPurple accent versions:');
console.log('  - mevans-logo-dark.png (1200x400)');
console.log('  - mevans-logo-dark-small.png (600x200)');
console.log('  - mevans-logo-dark-linkedin.png (300x300)');
console.log('  - mevans-logo-light.png (1200x400)');
console.log('  - mevans-logo-light-small.png (600x200)');
console.log('  - mevans-logo-light-linkedin.png (300x300)');
console.log('\nOrange accent versions:');
console.log('  - mevans-logo-dark-orange.png (1200x400)');
console.log('  - mevans-logo-dark-orange-small.png (600x200)');
console.log('  - mevans-logo-dark-orange-linkedin.png (300x300)');
console.log('  - mevans-logo-light-orange.png (1200x400)');
console.log('  - mevans-logo-light-orange-small.png (600x200)');
console.log('  - mevans-logo-light-orange-linkedin.png (300x300)');
