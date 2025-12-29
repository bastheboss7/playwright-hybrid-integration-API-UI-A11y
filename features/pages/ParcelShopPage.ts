import { Page, Locator, expect } from '@playwright/test';

export class ParcelShopPage {
  readonly page: Page;
  readonly postcodeSearch: Locator;

  constructor(page: Page) {
    this.page = page;
    this.postcodeSearch = page.locator('[data-test-id="psf-input"]').first();
  }

  async gotoParcelShop() {
    await this.page.goto('/find-a-parcelshop');
    await expect(this.page).toHaveURL(/find-a-parcelshop/);
  }

  async assertSearchVisible() {
    await expect(this.postcodeSearch).toBeVisible();
  }
}
