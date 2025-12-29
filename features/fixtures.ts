import { test as base } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { DeliveryOptionsPage } from './pages/DeliveryOptionsPage';
import { ParcelShopPage } from './pages/ParcelShopPage';
import { ProhibitedItemsPage } from './pages/ProhibitedItemsPage';

/**
 * Evri Test Fixtures
 * 
 * Provides page objects with automatic setup/teardown following Playwright best practices.
 * Each fixture manages its lifecycle without redundant instantiation.
 */

type EvriFixtures = {
  homePage: HomePage;
  deliveryOptionsPage: DeliveryOptionsPage;
  parcelShopPage: ParcelShopPage;
  prohibitedItemsPage: ProhibitedItemsPage;
};

export const test = base.extend<EvriFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.gotoHome();
    await homePage.acceptCookies();
    await use(homePage);
  },

  deliveryOptionsPage: async ({ page }, use) => {
    const deliveryOptionsPage = new DeliveryOptionsPage(page);
    await use(deliveryOptionsPage);
  },

  parcelShopPage: async ({ page }, use) => {
    const parcelShopPage = new ParcelShopPage(page);
    await use(parcelShopPage);
  },

  prohibitedItemsPage: async ({ page }, use) => {
    const prohibitedItemsPage = new ProhibitedItemsPage(page);
    await use(prohibitedItemsPage);
  },
});

export { expect } from '@playwright/test';
