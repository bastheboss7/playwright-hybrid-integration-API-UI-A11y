import { Page } from '@playwright/test';
import { DemoblazeLocators } from '../locators/DemoblazeLocators';
import { DemoblazeProductLocators } from '../locators/DemoblazeProductLocators';
import { BasePage } from '../base/BasePage';
import { WaitHelper } from '../utils/WaitHelper';

/**
 * Product detail page object with injected locator facade.
 */
export interface DemoblazeProductPage extends DemoblazeProductLocators {}
export class DemoblazeProductPage extends BasePage {
  constructor(page: Page, locators: DemoblazeLocators) {
    super(page);
    Object.assign(this, locators.product);
  }

  /**
    * Wait for a dialog message and auto-accept.
   */
  private async waitForDialogMessage(timeoutMs: number = WaitHelper.SHORT_TIMEOUT_MS): Promise<string> {
    return await new Promise<string>((resolve) => {
      this.page.once('dialog', dialog => {
        resolve(dialog.message());
        dialog.accept();
      });

      setTimeout(() => resolve(''), timeoutMs);
    });
  }

  private async waitForPageLoad(
    waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'
  ): Promise<void> {
    await this.page.waitForLoadState(waitUntil);
  }

  async getProductTitle(): Promise<string> {
    return await this.productTitle.textContent() || '';
  }

  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() || '';
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  /**
   * Get alert message after adding to cart
   * INTENTIONAL BUG NOTE: Alert auto-dismisses after ~3 seconds, making capture timing-sensitive
   */
  async getAddToCartAlert(): Promise<string> {
    try {
      return await this.waitForDialogMessage();
    } catch {
      // If alert pattern fails, return empty string
      return '';
    }
  }

  async goToHome() {
    await this.homeLink.click();
    await this.waitForPageLoad();
  }

  async goToCart() {
    await this.cartLink.click();
    await this.waitForPageLoad();
  }
}
