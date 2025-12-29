import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Resolve environment URLs based on TEST_ENV
const TEST_ENV = (process.env.TEST_ENV || 'staging').toLowerCase();
const ENV_URLS: Record<string, string> = {
  test: process.env.BASE_URL_TEST || 'https://test.evri.com',
  staging: process.env.BASE_URL_STAGING || 'https://staging.evri.com',
  production: process.env.BASE_URL_PRODUCTION || 'https://www.evri.com',
};
const BASE_URL = ENV_URLS[TEST_ENV] || ENV_URLS.staging;

// Resolve other environment variables with sensible defaults
const CI_MODE = process.env.CI === 'true' || process.env.CI === '1';
const DEFAULT_TIMEOUT = Number(process.env.DEFAULT_TIMEOUT || 60000);
const EXPECT_TIMEOUT = Number(process.env.EXPECT_TIMEOUT || 10000);
const ACTION_TIMEOUT = Number(process.env.ACTION_TIMEOUT || 15000);
const NAVIGATION_TIMEOUT = Number(process.env.NAVIGATION_TIMEOUT || 30000);
const WORKERS = CI_MODE ? 1 : Number(process.env.PARALLEL_WORKERS || 4);
const RETRIES = CI_MODE ? Number(process.env.CI_RETRIES || 2) : 0;
const HEADLESS = CI_MODE ? true : process.env.HEADLESS !== 'false';
const REPORT_FOLDER = process.env.REPORT_PATH || './playwright-report';
const TRACE_MODE = process.env.TRACE_MODE || 'retain-on-failure';
const SCREENSHOT_MODE = process.env.SCREENSHOT_MODE || 'only-on-failure';
const VIDEO_MODE = process.env.VIDEO_MODE || 'retain-on-failure';
const VIEWPORT_WIDTH = Number(process.env.VIEWPORT_WIDTH || 1920);
const VIEWPORT_HEIGHT = Number(process.env.VIEWPORT_HEIGHT || 1080);

/**
 * Playwright Configuration - Enterprise Standards
 * Framework for Evri Parcel Delivery Testing
 */
export default defineConfig({
  testDir: './features',
  timeout: DEFAULT_TIMEOUT,
  expect: {
    timeout: EXPECT_TIMEOUT
  },
  fullyParallel: true,
  forbidOnly: CI_MODE,
  retries: RETRIES,
  workers: WORKERS,
  reporter: [
    ['html', { outputFolder: REPORT_FOLDER }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
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
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT }
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT }
      },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});