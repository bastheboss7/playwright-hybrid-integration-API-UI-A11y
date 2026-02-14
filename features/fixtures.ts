import { test as base } from '@playwright/test';
import { DemoblazeHomePage } from './pages/DemoblazeHomePage';
import { DemoblazeProductPage } from './pages/DemoblazeProductPage';
import { DemoblazeCartPage } from './pages/DemoblazeCartPage';
import { DemoblazeLocators } from './locators/DemoblazeLocators';
import { AccessibilityAudit } from './utils/AccessibilityAudit';
import { DemoblazeApiClient } from './clients/DemoblazeApiClient';
import { TestLogger } from './utils/TestLogger';

type DemoblazeFixtures = {
  locators: DemoblazeLocators;
  demoblazeHomePage: DemoblazeHomePage;
  demoblazeProductPage: DemoblazeProductPage;
  demoblazeCartPage: DemoblazeCartPage;
  a11yAudit: AccessibilityAudit;
  apiClient: DemoblazeApiClient;
  logger: TestLogger;
};

export const test = base.extend<DemoblazeFixtures>({
  locators: async ({ page }, use) => {
    const locators = new DemoblazeLocators(page);
    await use(locators);
  },

  demoblazeHomePage: async ({ page, locators }, use) => {
    const homePage = new DemoblazeHomePage(page, locators);
    const baseUrl = process.env.BASE_URL || 'https://www.demoblaze.com/index.html';
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await use(homePage);
  },

  demoblazeProductPage: async ({ page, locators }, use) => {
    const productPage = new DemoblazeProductPage(page, locators);
    await use(productPage);
  },

  demoblazeCartPage: async ({ page, locators }, use) => {
    const cartPage = new DemoblazeCartPage(page, locators);
    await use(cartPage);
  },

  a11yAudit: async ({ page }, use) => {
    const audit = new AccessibilityAudit(page, 'a11y-results');
    await use(audit);
    await audit.exportResults();
  },

  apiClient: async ({}, use) => {
    const API_BASE_URL = process.env.API_BASE_URL || 'https://api.demoblaze.com';
    const client = new DemoblazeApiClient(API_BASE_URL);
    await use(client);
  },

  logger: async ({}, use, testInfo) => {
    const logger = new TestLogger(testInfo.title);
    await use(logger);
  },
});

export { expect } from '@playwright/test';
