import { Page, Locator } from '@playwright/test';
import { DemoblazeLocators } from '../locators/DemoblazeLocators';
import { BasePage } from '../base/BasePage';

/**
 * DemoblazeProductPage - Page Object Model for demoblaze.com product detail page
 * 
 * Encapsulates product detail viewing and cart operations using injected locators facade.
 */
export class DemoblazeProductPage extends BasePage {
  readonly locators: DemoblazeLocators;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.locators = new DemoblazeLocators(page);
    this.addToCartButton = this.locators.addToCartButton;
  }

  /**
   * Get product title
   */
  async getProductTitle(): Promise<string> {
    return await this.locators.productTitle.textContent() || '';
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<string> {
    return await this.locators.productPrice.textContent() || '';
  }

  /**
   * Click 'Add to cart' button
   */
  async addToCart() {
    await this.locators.addToCartButton.click();
  }

  /**
   * Get alert message after adding to cart
   * INTENTIONAL BUG NOTE: Alert auto-dismisses after ~3 seconds, making capture timing-sensitive
   */
  async getAddToCartAlert(): Promise<string> {
    try {
      // Listen for the alert dialog
      const alertMessage = await new Promise<string>((resolve) => {
        this.page.once('dialog', dialog => {
          resolve(dialog.message());
          dialog.accept();
        });
        
        // Set a timeout in case no dialog appears
        setTimeout(() => resolve(''), 2000);
      });
      return alertMessage;
    } catch {
      // If alert pattern fails, return empty string
      return '';
    }
  }

  /**
   * Navigate to home page
   */
  async goToHome() {
    await this.locators.homeLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Navigate to cart
   */
  async goToCart() {
    await this.locators.cartLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
