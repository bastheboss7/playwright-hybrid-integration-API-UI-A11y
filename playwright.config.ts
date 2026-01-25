import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration - Demoblaze Automation
 * 
 * Test automation framework for demoblaze.com e-commerce platform
 * Companies House Assessment Reference: 437782
 * 
 * Single source of truth for all configuration. Override via environment variables in CI/CD.
 */

// Configuration with sensible defaults - override via environment variables in CI/CD
const BASE_URL = process.env.BASE_URL || 'https://www.demoblaze.com/index.html';
// Support both PLAYWRIGHT_* (pipeline) and custom env vars (local)
const DEFAULT_TIMEOUT = Number(process.env.PLAYWRIGHT_TEST_TIMEOUT || process.env.DEFAULT_TIMEOUT || 60000);
const EXPECT_TIMEOUT = Number(process.env.PLAYWRIGHT_EXPECT_TIMEOUT || process.env.EXPECT_TIMEOUT || 10000);
const ACTION_TIMEOUT = Number(process.env.ACTION_TIMEOUT || 15000);
const NAVIGATION_TIMEOUT = Number(process.env.NAVIGATION_TIMEOUT || 30000);
const WORKERS = Number(process.env.CI ? 1 : process.env.PARALLEL_WORKERS || 4);
const RETRIES = Number(process.env.CI ? 2 : process.env.RETRIES || 0);
const HEADLESS = process.env.HEADLESS !== 'false';
const REPORT_FOLDER = process.env.REPORT_PATH || './playwright-report';
const TRACE_MODE = process.env.TRACE_MODE || 'retain-on-failure';
const SCREENSHOT_MODE = process.env.SCREENSHOT_MODE || 'only-on-failure';
const VIDEO_MODE = process.env.VIDEO_MODE || 'on';
const VIEWPORT_WIDTH = Number(process.env.VIEWPORT_WIDTH || 1920);
const VIEWPORT_HEIGHT = Number(process.env.VIEWPORT_HEIGHT || 1080);

export default defineConfig({
  testDir: './features',
  timeout: DEFAULT_TIMEOUT,
  expect: {
    timeout: EXPECT_TIMEOUT
  },
  fullyParallel: true,
  retries: RETRIES,
  workers: WORKERS,
  reporter: [
    ['html', { outputFolder: REPORT_FOLDER }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: BASE_URL,
    headless: HEADLESS,
    trace: TRACE_MODE as 'on' | 'off' | 'retain-on-failure' | 'on-first-retry',
    screenshot: SCREENSHOT_MODE as 'on' | 'off' | 'only-on-failure',
    video: VIDEO_MODE as 'on' | 'off' | 'retain-on-failure' | 'on-first-retry',
    actionTimeout: ACTION_TIMEOUT,
    navigationTimeout: NAVIGATION_TIMEOUT,
  },
  projects: [
    // API Layer - No browser needed (HTTP-only tests)
    {
      name: 'api',
      testMatch: '**/tests/api/**/*.spec.ts',
      use: {
        // API tests use page.request directly - no browser context needed
      },
    },
    // E2E-UI Layer - Chromium (primary browser)
    {
      name: 'chromium',
      testMatch: '**/tests/{e2e-ui,accessibility}/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT }
      },
    },
    // E2E-UI Layer - Firefox (cross-browser validation)
    {
      name: 'firefox',
      testMatch: '**/tests/{e2e-ui,accessibility}/**/*.spec.ts',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT }
      },
    },
    // E2E-UI Layer - WebKit (cross-browser validation)
    {
      name: 'webkit',
      testMatch: '**/tests/{e2e-ui,accessibility}/**/*.spec.ts',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT }
      },
    },
  ],
});