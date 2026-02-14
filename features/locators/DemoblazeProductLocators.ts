import { Page, Locator } from '@playwright/test';

/**
 * Product detail page locators.
 */
export class DemoblazeProductLocators {
  readonly page: Page;

  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly addToCartButton: Locator;
  readonly homeLink: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productTitle = page.getByRole('heading', { level: 2 }).or(page.locator('h2'));
    this.productPrice = page.locator('.price');
    this.productDescription = page.locator('.product-description');
    this.addToCartButton = page.getByRole('link', { name: 'Add to cart' });
    this.homeLink = page.locator('#nbarBrand');
    this.cartLink = page.getByRole('link', { name: 'Cart', exact: true });
  }
}

export default DemoblazeProductLocators;
