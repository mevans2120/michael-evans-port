import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  // Visual regression testing configuration
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,  // Allow minor rendering differences (fonts, anti-aliasing)
      threshold: 0.2,       // 20% threshold for pixel color difference
    },
  },

  // Store screenshots in organized folders
  snapshotDir: './e2e/snapshots',

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,  // Always reuse existing server
    timeout: 120000,
  },
});
