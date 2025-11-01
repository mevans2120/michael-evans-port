import { test, expect } from '@playwright/test';

/**
 * Visual Regression Testing Suite
 *
 * Purpose: Capture and compare screenshots to ensure CSS refactoring
 * doesn't introduce visual changes.
 *
 * Usage:
 * - Before refactoring: npm run test:visual:update (capture baselines)
 * - After changes: npm run test:visual (compare against baselines)
 * - Review diffs: open test-results/ to see visual differences
 */

const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

const PAGES_TO_TEST = [
  { path: '/', name: 'homepage' },
  // Add more pages as needed:
  // { path: '/about', name: 'about' },
  // { path: '/projects', name: 'projects' },
];

const COMPONENTS_TO_TEST = [
  {
    selector: '[data-testid="navigation-panel"]',
    name: 'navigation-panel',
    description: 'Navigation panel in default state',
  },
  {
    selector: '[data-testid="chat-section"]',
    name: 'chat-section',
    description: 'Chat section in default state',
  },
  {
    selector: '[data-testid="hero"]',
    name: 'hero',
    description: 'Hero section',
  },
  // Add more components as they get data-testid attributes
];

// Helper to wait for all animations to complete
async function waitForAnimations(page: any) {
  await page.waitForLoadState('networkidle');

  // Wait for any CSS transitions/animations to complete
  await page.evaluate(() => {
    return new Promise((resolve) => {
      // Wait for all animations to finish
      const animations = document.getAnimations();
      if (animations.length === 0) {
        resolve(true);
        return;
      }

      Promise.all(
        animations.map(animation => animation.finished)
      ).then(() => resolve(true));
    });
  });

  // Additional safety wait for any delayed animations
  await page.waitForTimeout(500);
}

// Test each viewport
for (const viewport of VIEWPORTS) {
  test.describe(`Visual Regression - ${viewport.name}`, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
    });

    // Full page screenshots
    for (const pageConfig of PAGES_TO_TEST) {
      test(`${pageConfig.name} - full page`, async ({ page }) => {
        await page.goto(pageConfig.path);
        await waitForAnimations(page);

        // Take full page screenshot
        await expect(page).toHaveScreenshot(
          `${pageConfig.name}-${viewport.name}-full.png`,
          {
            fullPage: true,
            maxDiffPixels: 100, // Allow tiny font rendering differences
            threshold: 0.2, // 20% threshold for anti-aliasing
          }
        );
      });
    }

    // Component screenshots
    for (const component of COMPONENTS_TO_TEST) {
      test(`component: ${component.name} - ${component.description}`, async ({ page }) => {
        await page.goto('/');
        await waitForAnimations(page);

        const element = page.locator(component.selector).first();

        // Check if element exists before screenshot
        const isVisible = await element.isVisible().catch(() => false);

        if (isVisible) {
          await expect(element).toHaveScreenshot(
            `component-${component.name}-${viewport.name}.png`,
            {
              maxDiffPixels: 50,
              threshold: 0.2,
            }
          );
        } else {
          // Skip test if component not found (needs data-testid)
          test.skip(true, `Component ${component.name} not found - needs data-testid attribute`);
        }
      });
    }
  });
}

// Interactive state screenshots
test.describe('Visual Regression - Interactive States', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('navigation panel - collapsed state', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    const nav = page.locator('[data-testid="navigation-panel"]').first();
    const isVisible = await nav.isVisible().catch(() => false);

    if (isVisible) {
      // Ensure navigation is in collapsed state (56px)
      // This depends on your implementation
      await expect(nav).toHaveScreenshot('nav-collapsed.png', {
        maxDiffPixels: 50,
      });
    } else {
      test.skip(true, 'Navigation panel needs data-testid attribute');
    }
  });

  test('navigation panel - expanded state', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    const nav = page.locator('[data-testid="navigation-panel"]').first();
    const isVisible = await nav.isVisible().catch(() => false);

    if (isVisible) {
      // Click the chevron button to expand navigation
      const chevronButton = page.locator('button[aria-label*="Expand navigation"]').first();
      const chevronVisible = await chevronButton.isVisible().catch(() => false);

      if (chevronVisible) {
        await chevronButton.click({ force: true });
        await waitForAnimations(page);

        await expect(nav).toHaveScreenshot('nav-expanded.png', {
          maxDiffPixels: 50,
        });
      } else {
        // Skip if chevron not found - panel may already be expanded
        test.skip(true, 'Navigation already expanded or chevron not found');
      }
    } else {
      test.skip(true, 'Navigation panel needs data-testid attribute');
    }
  });

  test('chat section - with messages', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    // Expand chat by clicking the expand button instead of header
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 768) {
      const expandButton = page.locator('button[aria-label*="Expand chat"]').first();
      const buttonVisible = await expandButton.isVisible().catch(() => false);
      if (buttonVisible) {
        await expandButton.click({ force: true });
        await waitForAnimations(page);
      }
    }

    // Send a message
    const input = page.locator('input[placeholder*="Ask about Michael"]').first();
    const inputVisible = await input.isVisible().catch(() => false);

    if (inputVisible) {
      await input.fill('Tell me about your work');
      const sendButton = page.locator('button[type="submit"]').first();
      await sendButton.click();

      // Wait for message to appear
      await page.waitForTimeout(2000);

      const chatSection = page.locator('[data-testid="chat-section"]').first();
      const chatVisible = await chatSection.isVisible().catch(() => false);

      if (chatVisible) {
        await expect(chatSection).toHaveScreenshot('chat-with-messages.png', {
          maxDiffPixels: 100, // Allow more variance due to dynamic content
          threshold: 0.3,
        });
      } else {
        test.skip(true, 'Chat section needs data-testid attribute');
      }
    } else {
      test.skip(true, 'Chat input not found');
    }
  });

  test('buttons - hover state', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    // Find a primary button (adjust selector as needed)
    const button = page.locator('button').first();
    const buttonVisible = await button.isVisible().catch(() => false);

    if (buttonVisible) {
      // Hover over button
      await button.hover();
      await page.waitForTimeout(300); // Wait for hover transition

      await expect(button).toHaveScreenshot('button-hover.png', {
        maxDiffPixels: 50,
      });
    } else {
      test.skip(true, 'No buttons found on page');
    }
  });

  test('input - focus state', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    const input = page.locator('input[placeholder*="Ask about Michael"]').first();
    const inputVisible = await input.isVisible().catch(() => false);

    if (inputVisible) {
      await input.focus();
      await page.waitForTimeout(300); // Wait for focus styles

      await expect(input).toHaveScreenshot('input-focus.png', {
        maxDiffPixels: 50,
      });
    } else {
      test.skip(true, 'Chat input not found');
    }
  });
});

// Light mode testing
test.describe('Visual Regression - Light Mode', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
    colorScheme: 'light',
  });

  test('homepage - light mode', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    await expect(page).toHaveScreenshot('homepage-light-mode.png', {
      fullPage: true,
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });

  for (const component of COMPONENTS_TO_TEST) {
    test(`component: ${component.name} - light mode`, async ({ page }) => {
      await page.goto('/');
      await waitForAnimations(page);

      const element = page.locator(component.selector).first();
      const isVisible = await element.isVisible().catch(() => false);

      if (isVisible) {
        await expect(element).toHaveScreenshot(
          `component-${component.name}-light.png`,
          {
            maxDiffPixels: 50,
            threshold: 0.2,
          }
        );
      } else {
        test.skip(true, `Component ${component.name} not found - needs data-testid attribute`);
      }
    });
  }
});

// Dark mode testing
test.describe('Visual Regression - Dark Mode', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
    colorScheme: 'dark',
  });

  test('homepage - dark mode', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
      fullPage: true,
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });

  for (const component of COMPONENTS_TO_TEST) {
    test(`component: ${component.name} - dark mode`, async ({ page }) => {
      await page.goto('/');
      await waitForAnimations(page);

      const element = page.locator(component.selector).first();
      const isVisible = await element.isVisible().catch(() => false);

      if (isVisible) {
        await expect(element).toHaveScreenshot(
          `component-${component.name}-dark.png`,
          {
            maxDiffPixels: 50,
            threshold: 0.2,
          }
        );
      } else {
        test.skip(true, `Component ${component.name} not found - needs data-testid attribute`);
      }
    });
  }
});
