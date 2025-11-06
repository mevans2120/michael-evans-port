/**
 * Export MEvans logo to PNG
 *
 * Creates high-resolution PNG exports of the MEvans logo in both light and dark modes.
 * Uses canvas to render the text with gradient applied to "Evans".
 */

const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Font configuration
// Canvas uses system fonts, so we specify font families with fallbacks
// Matching the site: font-serif (Newsreader) with font-medium (500 weight)
const FONTS = {
  sans: '400 {size}px "DM Sans", "Helvetica Neue", Arial, sans-serif',
  serif: '500 {size}px "Newsreader", Georgia, serif'
};

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
    accent: 'rgb(255, 102, 26)',      // 100% saturated coral-orange: HSL(20 100% 55%) #FF661A
  },
  'dark-orange': {
    foreground: 'rgb(250, 250, 250)', // --color-text: 0 0% 98%
    accent: 'rgb(255, 102, 26)',      // 100% saturated coral-orange for dark mode
  }
};

function createLogo(mode = 'dark', width = 1200, height = 400, text = 'MEvans', fontFamily = 'sans') {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Clear canvas with transparent background
  ctx.clearRect(0, 0, width, height);

  // Add black background for dark mode logos
  if (mode.includes('dark')) {
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, width, height);
  }

  // Font setup - DM Sans (sans-serif) or Newsreader (serif) with bold weight
  // Scale font size based on canvas dimensions
  const isSquare = width === height;
  // For rectangles: scale from base 1200x400 with 180px font
  // For squares: use 50% of width
  const fontSize = isSquare ? Math.floor(width * 0.50) : Math.floor((width / 1200) * 180);
  ctx.font = FONTS[fontFamily].replace('{size}', fontSize);
  ctx.textBaseline = 'middle';

  // For short "ME" logo, match the full logo style: M in foreground, E with gradient
  if (text === 'ME') {
    const mText = 'M';
    const eText = 'E';
    const fullWidth = ctx.measureText(text).width;
    const mWidth = ctx.measureText(mText).width;

    const startX = (width - fullWidth) / 2;
    const startY = height / 2;

    // Draw "M" in foreground color
    ctx.fillStyle = colors[mode].foreground;
    ctx.fillText(mText, startX, startY);

    // Create gradient for "E"
    const eStartX = startX + mWidth;
    const eWidth = ctx.measureText(eText).width;
    const gradient = ctx.createLinearGradient(
      eStartX,
      startY - fontSize / 2,
      eStartX + eWidth,
      startY + fontSize / 2
    );

    // Gradient colors (135deg diagonal - accent to foreground)
    gradient.addColorStop(0, colors[mode].accent);
    gradient.addColorStop(1, colors[mode].foreground);

    // Draw "E" with gradient
    ctx.fillStyle = gradient;
    ctx.fillText(eText, eStartX, startY);

    return canvas;
  }

  // Original "MEvans" logo logic
  const fullText = text;
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

// Generate logos in both modes, multiple sizes, and both font families
const configs = [
  // Purple accent versions - DM Sans (sans-serif)
  { mode: 'dark', width: 9600, height: 3200, suffix: '-8x', fontFamily: 'sans' },
  { mode: 'dark', width: 2400, height: 800, suffix: '-2x', fontFamily: 'sans' },
  { mode: 'dark', width: 1200, height: 400, suffix: '', fontFamily: 'sans' },
  { mode: 'dark', width: 600, height: 200, suffix: '-small', fontFamily: 'sans' },
  { mode: 'dark', width: 300, height: 300, suffix: '-linkedin', fontFamily: 'sans' },
  { mode: 'light', width: 9600, height: 3200, suffix: '-8x', fontFamily: 'sans' },
  { mode: 'light', width: 2400, height: 800, suffix: '-2x', fontFamily: 'sans' },
  { mode: 'light', width: 1200, height: 400, suffix: '', fontFamily: 'sans' },
  { mode: 'light', width: 600, height: 200, suffix: '-small', fontFamily: 'sans' },
  { mode: 'light', width: 300, height: 300, suffix: '-linkedin', fontFamily: 'sans' },

  // Purple accent versions - Newsreader (serif)
  { mode: 'dark', width: 9600, height: 3200, suffix: '-8x-serif', fontFamily: 'serif' },
  { mode: 'dark', width: 2400, height: 800, suffix: '-2x-serif', fontFamily: 'serif' },
  { mode: 'dark', width: 1200, height: 400, suffix: '-serif', fontFamily: 'serif' },
  { mode: 'dark', width: 600, height: 200, suffix: '-small-serif', fontFamily: 'serif' },
  { mode: 'light', width: 9600, height: 3200, suffix: '-8x-serif', fontFamily: 'serif' },
  { mode: 'light', width: 2400, height: 800, suffix: '-2x-serif', fontFamily: 'serif' },
  { mode: 'light', width: 1200, height: 400, suffix: '-serif', fontFamily: 'serif' },
  { mode: 'light', width: 600, height: 200, suffix: '-small-serif', fontFamily: 'serif' },

  // Orange accent versions - DM Sans (sans-serif)
  { mode: 'dark-orange', width: 9600, height: 3200, suffix: '-8x', fontFamily: 'sans' },
  { mode: 'dark-orange', width: 2400, height: 800, suffix: '-2x', fontFamily: 'sans' },
  { mode: 'dark-orange', width: 1200, height: 400, suffix: '', fontFamily: 'sans' },
  { mode: 'dark-orange', width: 600, height: 200, suffix: '-small', fontFamily: 'sans' },
  { mode: 'dark-orange', width: 300, height: 300, suffix: '-linkedin', fontFamily: 'sans' },
  { mode: 'light-orange', width: 9600, height: 3200, suffix: '-8x', fontFamily: 'sans' },
  { mode: 'light-orange', width: 2400, height: 800, suffix: '-2x', fontFamily: 'sans' },
  { mode: 'light-orange', width: 1200, height: 400, suffix: '', fontFamily: 'sans' },
  { mode: 'light-orange', width: 600, height: 200, suffix: '-small', fontFamily: 'sans' },
  { mode: 'light-orange', width: 300, height: 300, suffix: '-linkedin', fontFamily: 'sans' },

  // Orange accent versions - Newsreader (serif)
  { mode: 'dark-orange', width: 9600, height: 3200, suffix: '-8x-serif', fontFamily: 'serif' },
  { mode: 'dark-orange', width: 2400, height: 800, suffix: '-2x-serif', fontFamily: 'serif' },
  { mode: 'dark-orange', width: 1200, height: 400, suffix: '-serif', fontFamily: 'serif' },
  { mode: 'dark-orange', width: 600, height: 200, suffix: '-small-serif', fontFamily: 'serif' },
  { mode: 'light-orange', width: 9600, height: 3200, suffix: '-8x-serif', fontFamily: 'serif' },
  { mode: 'light-orange', width: 2400, height: 800, suffix: '-2x-serif', fontFamily: 'serif' },
  { mode: 'light-orange', width: 1200, height: 400, suffix: '-serif', fontFamily: 'serif' },
  { mode: 'light-orange', width: 600, height: 200, suffix: '-small-serif', fontFamily: 'serif' },

  // Short "ME" versions (for collapsed nav) - Both fonts
  { mode: 'light-orange', width: 1600, height: 1600, suffix: '-short-8x', text: 'ME', fontFamily: 'sans' },
  { mode: 'light-orange', width: 400, height: 400, suffix: '-short-2x', text: 'ME', fontFamily: 'sans' },
  { mode: 'light-orange', width: 200, height: 200, suffix: '-short', text: 'ME', fontFamily: 'sans' },
  { mode: 'dark-orange', width: 1600, height: 1600, suffix: '-short-8x', text: 'ME', fontFamily: 'sans' },
  { mode: 'dark-orange', width: 400, height: 400, suffix: '-short-2x', text: 'ME', fontFamily: 'sans' },
  { mode: 'dark-orange', width: 200, height: 200, suffix: '-short', text: 'ME', fontFamily: 'sans' },
  { mode: 'light-orange', width: 1600, height: 1600, suffix: '-short-8x-serif', text: 'ME', fontFamily: 'serif' },
  { mode: 'light-orange', width: 400, height: 400, suffix: '-short-2x-serif', text: 'ME', fontFamily: 'serif' },
  { mode: 'light-orange', width: 200, height: 200, suffix: '-short-serif', text: 'ME', fontFamily: 'serif' },
  { mode: 'dark-orange', width: 1600, height: 1600, suffix: '-short-8x-serif', text: 'ME', fontFamily: 'serif' },
  { mode: 'dark-orange', width: 400, height: 400, suffix: '-short-2x-serif', text: 'ME', fontFamily: 'serif' },
  { mode: 'dark-orange', width: 200, height: 200, suffix: '-short-serif', text: 'ME', fontFamily: 'serif' },
];

configs.forEach(({ mode, width, height, suffix, text, fontFamily }) => {
  const canvas = createLogo(mode, width, height, text, fontFamily);
  const filename = `mevans-logo-${mode}${suffix}.png`;
  const filepath = path.join(outputDir, filename);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filepath, buffer);

  const fontLabel = fontFamily === 'serif' ? 'Newsreader' : 'DM Sans';
  console.log(`✅ Created: ${filename} (${width}x${height}) - ${fontLabel}`);
});

console.log(`\n📁 Logos exported to: ${outputDir}`);
console.log('\n🔤 DM Sans Regular (400 weight) versions:');
console.log('Purple accent:');
console.log('  - mevans-logo-dark-8x.png (9600x3200) - Ultra high-res');
console.log('  - mevans-logo-dark-2x.png (2400x800) - High-res');
console.log('  - mevans-logo-dark.png (1200x400)');
console.log('  - mevans-logo-dark-small.png (600x200)');
console.log('  - mevans-logo-dark-linkedin.png (300x300)');
console.log('  - mevans-logo-light-8x.png (9600x3200) - Ultra high-res');
console.log('  - mevans-logo-light-2x.png (2400x800) - High-res');
console.log('  - mevans-logo-light.png (1200x400)');
console.log('  - mevans-logo-light-small.png (600x200)');
console.log('  - mevans-logo-light-linkedin.png (300x300)');
console.log('Orange accent:');
console.log('  - mevans-logo-dark-orange-8x.png (9600x3200) - Ultra high-res');
console.log('  - mevans-logo-dark-orange-2x.png (2400x800) - High-res');
console.log('  - mevans-logo-dark-orange.png (1200x400)');
console.log('  - mevans-logo-dark-orange-small.png (600x200)');
console.log('  - mevans-logo-dark-orange-linkedin.png (300x300)');
console.log('  - mevans-logo-light-orange-8x.png (9600x3200) - Ultra high-res');
console.log('  - mevans-logo-light-orange-2x.png (2400x800) - High-res');
console.log('  - mevans-logo-light-orange.png (1200x400)');
console.log('  - mevans-logo-light-orange-small.png (600x200)');
console.log('  - mevans-logo-light-orange-linkedin.png (300x300)');
console.log('  - mevans-logo-light-orange-short-8x.png (1600x1600) - Ultra high-res "ME"');
console.log('  - mevans-logo-light-orange-short-2x.png (400x400) - High-res "ME"');
console.log('  - mevans-logo-light-orange-short.png (200x200) - "ME" for collapsed nav');
console.log('  - mevans-logo-dark-orange-short-8x.png (1600x1600) - Ultra high-res "ME"');
console.log('  - mevans-logo-dark-orange-short-2x.png (400x400) - High-res "ME"');
console.log('  - mevans-logo-dark-orange-short.png (200x200) - "ME" for collapsed nav');
console.log('\n📖 Newsreader Medium (500 weight) versions:');
console.log('Purple accent:');
console.log('  - mevans-logo-dark-8x-serif.png (9600x3200) - Ultra high-res');
console.log('  - mevans-logo-dark-2x-serif.png (2400x800) - High-res');
console.log('  - mevans-logo-dark-serif.png (1200x400)');
console.log('  - mevans-logo-dark-small-serif.png (600x200)');
console.log('  - mevans-logo-light-8x-serif.png (9600x3200) - Ultra high-res');
console.log('  - mevans-logo-light-2x-serif.png (2400x800) - High-res');
console.log('  - mevans-logo-light-serif.png (1200x400)');
console.log('  - mevans-logo-light-small-serif.png (600x200)');
console.log('Orange accent:');
console.log('  - mevans-logo-dark-orange-8x-serif.png (9600x3200) - Ultra high-res');
console.log('  - mevans-logo-dark-orange-2x-serif.png (2400x800) - High-res');
console.log('  - mevans-logo-dark-orange-serif.png (1200x400)');
console.log('  - mevans-logo-dark-orange-small-serif.png (600x200)');
console.log('  - mevans-logo-light-orange-8x-serif.png (9600x3200) - Ultra high-res');
console.log('  - mevans-logo-light-orange-2x-serif.png (2400x800) - High-res');
console.log('  - mevans-logo-light-orange-serif.png (1200x400)');
console.log('  - mevans-logo-light-orange-small-serif.png (600x200)');
console.log('  - mevans-logo-light-orange-short-8x-serif.png (1600x1600) - Ultra high-res "ME"');
console.log('  - mevans-logo-light-orange-short-2x-serif.png (400x400) - High-res "ME"');
console.log('  - mevans-logo-light-orange-short-serif.png (200x200) - "ME" for collapsed nav');
console.log('  - mevans-logo-dark-orange-short-8x-serif.png (1600x1600) - Ultra high-res "ME"');
console.log('  - mevans-logo-dark-orange-short-2x-serif.png (400x400) - High-res "ME"');
console.log('  - mevans-logo-dark-orange-short-serif.png (200x200) - "ME" for collapsed nav');
