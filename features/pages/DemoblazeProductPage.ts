import { Page } from '@playwright/test';
import { DemoblazeLocators } from '../locators/DemoblazeLocators';
import { DemoblazeProductLocators } from '../locators/DemoblazeProductLocators';
import { BasePage } from '../base/BasePage';
import { WaitHelper } from '../utils/WaitHelper';

/**
 * DemoblazeProductPage - Page Object Model for demoblaze.com product detail page
 * 
 * Encapsulates product detail viewing and cart operations using injected locators facade.
 * Locators are spread directly onto the instance for cleaner syntax.
 * 
 * TypeScript Mixin Pattern: Combines BasePage + DemoblazeProductLocators
 * - Full IntelliSense support for all locator properties
 * - Type-safe access to productTitle, productPrice, addToCartButton, etc.
 * - Enterprise-grade documentation via proper typing
 */
export interface DemoblazeProductPage extends DemoblazeProductLocators {}
export class DemoblazeProductPage extends BasePage {
  constructor(page: Page, locators: DemoblazeLocators) {
    super(page);
    Object.assign(this, locators.product);
  }

  // ========================================================================
  // PRIVATE HELPERS (Internal mechanics)
  // - Element lookup and low-level waits
  // - Keep public methods focused on business actions
  // ========================================================================

  /**
   * Wait for a dialog message and auto-accept
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

  /**
   * Standardized page load wait
   */
  private async waitForPageLoad(
    waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'
  ): Promise<void> {
    await this.page.waitForLoadState(waitUntil);
  }

  // ========================================================================
  // PUBLIC ACTIONS (Business workflows)
  // - Use private helpers for element lookup/waits
  // - Expose semantic operations to tests
  // ========================================================================

  /**
   * Get product title
   */
  async getProductTitle(): Promise<string> {
    return await this.productTitle.textContent() || '';
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() || '';
  }

  /**
   * Click 'Add to cart' button
   */
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

  /**
   * Navigate to home page
   */
  async goToHome() {
    await this.homeLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Navigate to cart
   */
  async goToCart() {
    await this.cartLink.click();
    await this.waitForPageLoad();
  }
}
