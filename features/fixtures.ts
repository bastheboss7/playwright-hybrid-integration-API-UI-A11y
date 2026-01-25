import { test as base } from '@playwright/test';
import { DemoblazeHomePage } from './pages/DemoblazeHomePage';
import { DemoblazeProductPage } from './pages/DemoblazeProductPage';
import { DemoblazeCartPage } from './pages/DemoblazeCartPage';
import { AccessibilityAudit } from './utils/AccessibilityAudit';
import { DemoblazeApiClient } from './clients/DemoblazeApiClient';

/**
 * Demoblaze Test Fixtures
 * 
 * Provides page objects with automatic setup/teardown following Playwright best practices.
 * Uses Playwright's fixture pattern as an alternative to traditional beforeEach/afterEach hooks.
 * 
 * Benefits over hooks:
 * - Page objects are initialized once and reused throughout the test
 * - Automatic cleanup after test completes
 * - Type-safe dependency injection
 * - No manual instantiation in each test
 */

type DemoblazeFixtures = {
  demoblazeHomePage: DemoblazeHomePage;
  demoblazeProductPage: DemoblazeProductPage;
  demoblazeCartPage: DemoblazeCartPage;
  a11yAudit: AccessibilityAudit;
  apiClient: DemoblazeApiClient;
};

export const test = base.extend<DemoblazeFixtures>({
  /**
   * DemoblazeHomePage Fixture
   * 
   * Automatically:
   * 1. Creates page object instance
   * 2. Navigates to home page (setUp)
   * 3. Provides to test via fixture injection
   * 4. Cleans up after test (tearDown)
   */
  demoblazeHomePage: async ({ page }, use) => {
    const homePage = new DemoblazeHomePage(page);
    // Implicit setup: Navigate to home page
    const baseUrl = process.env.BASE_URL || 'https://www.demoblaze.com/index.html';
    await homePage.goto(baseUrl);
    // Provide to test
    await use(homePage);
    // Implicit teardown: Test complete, page closes automatically
  },

  /**
   * DemoblazeProductPage Fixture
   * 
   * Automatically:
   * 1. Creates page object instance
   * 2. Provides to test via fixture injection
   * 3. Cleans up after test (tearDown)
   */
  demoblazeProductPage: async ({ page }, use) => {
    const productPage = new DemoblazeProductPage(page);
    // Provide to test
    await use(productPage);
    // Implicit teardown: Test complete
  },

  /**
   * DemoblazeCartPage Fixture
   * 
   * Automatically:
   * 1. Creates page object instance
   * 2. Provides to test via fixture injection
   * 3. Cleans up after test (tearDown)
   */
  demoblazeCartPage: async ({ page }, use) => {
    const cartPage = new DemoblazeCartPage(page);
    // Provide to test
    await use(cartPage);
    // Implicit teardown: Test complete
  },

  /**
   * AccessibilityAudit Fixture (A11y)
   * 
   * Provides WCAG 2.1 AA compliance auditing with soft assertions.
   * Non-blocking - violations logged to JSON, doesn't fail tests.
   * 
   * Automatically:
   * 1. Creates AccessibilityAudit instance for current page
   * 2. Provides to test via fixture injection
   * 3. Exports audit results to JSON on test cleanup
   */
  a11yAudit: async ({ page }, use) => {
    const audit = new AccessibilityAudit(page, 'a11y-results');
    // Provide to test
    await use(audit);
    // Automatic cleanup: Export results
    await audit.exportResults();
  },

  /**
   * DemoblazeApiClient Fixture (API Testing)
   * 
   * Provides API client for HTTP testing without manual instantiation.
   * Eliminates repetitive `new DemoblazeApiClient()` calls in API specs.
   * 
   * Automatically:
   * 1. Reads API_BASE_URL from environment
   * 2. Creates DemoblazeApiClient instance
   * 3. Provides to test via fixture injection
   * 4. No teardown needed (stateless client)
   */
  apiClient: async ({}, use) => {
    const API_BASE_URL = process.env.API_BASE_URL || 'https://api.demoblaze.com';
    const client = new DemoblazeApiClient(API_BASE_URL);
    // Provide to test
    await use(client);
    // No cleanup needed (stateless)
  },
});

export { expect } from '@playwright/test';
