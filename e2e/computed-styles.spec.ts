import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Computed Styles Snapshot Testing
 *
 * Purpose: Capture and compare actual computed CSS values to ensure
 * refactoring doesn't change any visual properties.
 *
 * Usage:
 * - Before refactoring: npm run test:styles:baseline (create baseline)
 * - After changes: npm run test:styles (compare against baseline)
 *
 * This catches changes that might not show up in screenshots due to
 * timing, dynamic content, or browser rendering differences.
 */

interface ComputedStyleSnapshot {
  selector: string;
  name: string;
  styles: Record<string, string>;
  timestamp: string;
}

interface ComponentStyleConfig {
  selector: string;
  name: string;
  description: string;
  properties: string[];
}

// Critical components and their CSS properties to track
const CRITICAL_COMPONENTS: ComponentStyleConfig[] = [
  {
    selector: '[data-testid="navigation-panel"]',
    name: 'navigation-panel',
    description: 'Navigation panel styling',
    properties: [
      'width',
      'height',
      'background-color',
      'border-color',
      'border-width',
      'border-style',
      'padding',
      'margin',
      'position',
      'z-index',
      'transition',
      'transform',
      'box-shadow',
    ],
  },
  {
    selector: '[data-testid="chat-section"]',
    name: 'chat-section',
    description: 'Chat section styling',
    properties: [
      'background-color',
      'color',
      'font-size',
      'font-family',
      'line-height',
      'font-weight',
      'padding',
      'margin',
      'border-radius',
      'box-shadow',
      'width',
      'height',
    ],
  },
  {
    selector: '[data-testid="hero"]',
    name: 'hero-section',
    description: 'Hero section styling',
    properties: [
      'background-color',
      'color',
      'padding',
      'margin',
      'font-size',
      'font-family',
      'line-height',
      'text-align',
    ],
  },
  {
    selector: 'button[type="submit"]',
    name: 'submit-button',
    description: 'Primary submit button',
    properties: [
      'background-color',
      'color',
      'border',
      'border-radius',
      'padding',
      'font-size',
      'font-weight',
      'cursor',
      'transition',
      'box-shadow',
    ],
  },
  {
    selector: 'input[placeholder*="Ask about"]',
    name: 'chat-input',
    description: 'Chat input field',
    properties: [
      'background-color',
      'color',
      'border',
      'border-radius',
      'padding',
      'font-size',
      'font-family',
      'line-height',
      'width',
      'height',
    ],
  },
];

// Colors that should be tracked (from hardcoded colors audit)
const COLOR_SPECIFIC_CHECKS = [
  {
    selector: '.border-purple', // Adjust based on actual classes
    name: 'purple-accent',
    expectedColor: 'rgb(168, 85, 247)',
  },
  {
    selector: '.text-orange', // Adjust based on actual classes
    name: 'orange-accent',
    expectedColor: 'rgb(234, 88, 12)',
  },
];

const BASELINE_PATH = path.join(__dirname, '../test-results/style-baseline.json');

// Helper to normalize CSS values for comparison
function normalizeValue(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/,\s*/g, ', ') // Normalize commas
    .replace(/\(\s*/g, '(') // Normalize parentheses
    .replace(/\s*\)/g, ')')
    .toLowerCase();
}

// Helper to wait for page to be ready
async function waitForPageReady(page: any) {
  await page.waitForLoadState('networkidle');

  // Wait for animations to complete
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const animations = document.getAnimations();
      if (animations.length === 0) {
        resolve(true);
        return;
      }
      Promise.all(animations.map(a => a.finished)).then(() => resolve(true));
    });
  });

  await page.waitForTimeout(500);
}

test.describe('Computed Styles Baseline', () => {
  test('capture computed styles baseline', async ({ page }) => {
    const snapshots: ComputedStyleSnapshot[] = [];

    await page.goto('/');
    await waitForPageReady(page);

    // Expand chat to ensure all components are visible
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 768) {
      const aiHeader = page.locator('text=AI Assistant').first();
      const headerVisible = await aiHeader.isVisible().catch(() => false);
      if (headerVisible) {
        await aiHeader.click();
        await waitForPageReady(page);
      }
    }

    for (const component of CRITICAL_COMPONENTS) {
      const element = page.locator(component.selector).first();
      const isVisible = await element.isVisible().catch(() => false);

      if (isVisible) {
        const styles = await element.evaluate((el, props) => {
          const computed = window.getComputedStyle(el);
          const result: Record<string, string> = {};
          props.forEach((prop: string) => {
            result[prop] = computed.getPropertyValue(prop);
          });
          return result;
        }, component.properties);

        snapshots.push({
          selector: component.selector,
          name: component.name,
          styles,
          timestamp: new Date().toISOString(),
        });

        console.log(`✅ Captured styles for ${component.name}`);
      } else {
        console.warn(`⚠️  Component not found: ${component.name} (${component.selector})`);
        console.warn(`    Add data-testid="${component.name}" to the component`);
      }
    }

    // Save baseline
    fs.mkdirSync(path.dirname(BASELINE_PATH), { recursive: true });
    fs.writeFileSync(BASELINE_PATH, JSON.stringify(snapshots, null, 2));

    console.log(`\n✅ Saved baseline with ${snapshots.length} components to:`);
    console.log(`   ${BASELINE_PATH}`);

    // This test always passes - it's just capturing the baseline
    expect(snapshots.length).toBeGreaterThan(0);
  });
});

test.describe('Computed Styles Comparison', () => {
  test('compare computed styles against baseline', async ({ page }) => {
    // Check if baseline exists
    if (!fs.existsSync(BASELINE_PATH)) {
      throw new Error(
        'No baseline found! Run: npm run test:styles:baseline first'
      );
    }

    const baseline: ComputedStyleSnapshot[] = JSON.parse(
      fs.readFileSync(BASELINE_PATH, 'utf-8')
    );

    await page.goto('/');
    await waitForPageReady(page);

    // Expand chat
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 768) {
      const aiHeader = page.locator('text=AI Assistant').first();
      const headerVisible = await aiHeader.isVisible().catch(() => false);
      if (headerVisible) {
        await aiHeader.click();
        await waitForPageReady(page);
      }
    }

    const differences: Array<{
      component: string;
      selector: string;
      property: string;
      baseline: string;
      current: string;
    }> = [];

    for (const baselineComponent of baseline) {
      const element = page.locator(baselineComponent.selector).first();
      const isVisible = await element.isVisible().catch(() => false);

      if (isVisible) {
        const currentStyles = await element.evaluate((el, props) => {
          const computed = window.getComputedStyle(el);
          const result: Record<string, string> = {};
          props.forEach((prop: string) => {
            result[prop] = computed.getPropertyValue(prop);
          });
          return result;
        }, Object.keys(baselineComponent.styles));

        // Compare each property
        for (const [property, baselineValue] of Object.entries(baselineComponent.styles)) {
          const currentValue = currentStyles[property];

          if (normalizeValue(currentValue) !== normalizeValue(baselineValue)) {
            differences.push({
              component: baselineComponent.name,
              selector: baselineComponent.selector,
              property,
              baseline: baselineValue,
              current: currentValue,
            });
          }
        }

        console.log(`✅ ${baselineComponent.name} - styles match`);
      } else {
        console.warn(`⚠️  Component not visible: ${baselineComponent.name}`);
      }
    }

    // Report results
    if (differences.length > 0) {
      console.error('\n❌ STYLE DIFFERENCES DETECTED:\n');
      console.error('═'.repeat(80));

      const groupedByComponent = differences.reduce((acc, diff) => {
        if (!acc[diff.component]) acc[diff.component] = [];
        acc[diff.component].push(diff);
        return acc;
      }, {} as Record<string, typeof differences>);

      for (const [component, diffs] of Object.entries(groupedByComponent)) {
        console.error(`\n${component} (${diffs[0].selector}):`);
        diffs.forEach(diff => {
          console.error(`  • ${diff.property}:`);
          console.error(`    Expected: ${diff.baseline}`);
          console.error(`    Got:      ${diff.current}`);
        });
      }

      console.error('\n═'.repeat(80));
      console.error(`Total differences: ${differences.length}\n`);

      throw new Error(
        `${differences.length} style difference(s) found! See details above.`
      );
    }

    console.log('\n✅ All computed styles match baseline!\n');
  });
});

test.describe('Specific Color Validation', () => {
  test('verify critical colors match expected values', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const colorIssues: Array<{
      name: string;
      selector: string;
      expected: string;
      actual: string;
    }> = [];

    // Check navigation border color (purple accent)
    const nav = page.locator('[data-testid="navigation-panel"]').first();
    const navVisible = await nav.isVisible().catch(() => false);

    if (navVisible) {
      const borderColor = await nav.evaluate((el) => {
        return window.getComputedStyle(el).borderColor;
      });

      // Purple should be rgb(168, 85, 247)
      if (!borderColor.includes('168') || !borderColor.includes('85') || !borderColor.includes('247')) {
        colorIssues.push({
          name: 'Navigation border (purple accent)',
          selector: '[data-testid="navigation-panel"]',
          expected: 'rgb(168, 85, 247)',
          actual: borderColor,
        });
      }
    }

    if (colorIssues.length > 0) {
      console.error('\n❌ COLOR VALIDATION FAILED:\n');
      colorIssues.forEach(issue => {
        console.error(`  ${issue.name} (${issue.selector}):`);
        console.error(`    Expected: ${issue.expected}`);
        console.error(`    Got:      ${issue.actual}`);
      });

      throw new Error(`${colorIssues.length} color validation issue(s) found!`);
    }

    console.log('✅ All critical colors validated');
  });
});

test.describe('Interactive State Styles', () => {
  test('button hover state styles', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const button = page.locator('button[type="submit"]').first();
    const buttonVisible = await button.isVisible().catch(() => false);

    if (buttonVisible) {
      // Capture default state
      const defaultBg = await button.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Hover
      await button.hover();
      await page.waitForTimeout(300);

      // Capture hover state
      const hoverBg = await button.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Hover state should be different from default
      expect(defaultBg).not.toBe(hoverBg);

      console.log(`✅ Button hover state: ${defaultBg} → ${hoverBg}`);
    } else {
      test.skip(true, 'Submit button not found');
    }
  });

  test('input focus state styles', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const input = page.locator('input[placeholder*="Ask about"]').first();
    const inputVisible = await input.isVisible().catch(() => false);

    if (inputVisible) {
      // Capture default state
      const defaultBorder = await input.evaluate((el) => {
        return window.getComputedStyle(el).borderColor;
      });

      // Focus
      await input.focus();
      await page.waitForTimeout(300);

      // Capture focus state
      const focusBorder = await input.evaluate((el) => {
        return window.getComputedStyle(el).borderColor;
      });

      // Focus state should be different from default
      expect(defaultBorder).not.toBe(focusBorder);

      console.log(`✅ Input focus state: ${defaultBorder} → ${focusBorder}`);
    } else {
      test.skip(true, 'Chat input not found');
    }
  });
});
