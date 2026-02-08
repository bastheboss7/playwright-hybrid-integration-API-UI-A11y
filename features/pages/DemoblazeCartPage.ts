import { Page, expect } from '@playwright/test';
import { DemoblazeLocators } from '../locators/DemoblazeLocators';
import { DemoblazeCartLocators } from '../locators/DemoblazeCartLocators';
import { BasePage } from '../base/BasePage';
import { WaitHelper } from '../utils/WaitHelper';

/**
 * DemoblazeCartPage - Page Object Model for demoblaze.com shopping cart
 * 
 * Manages cart operations using injected locators facade.
 * Locators are spread directly onto the instance for cleaner syntax.
 * 
 * TypeScript Mixin Pattern: Combines BasePage + DemoblazeCartLocators
 * - Full IntelliSense support for all locator properties
 * - Type-safe access to cartItems, orderModal, purchaseButton, etc.
 * - Enterprise-grade documentation via proper typing
 */
export interface DemoblazeCartPage extends DemoblazeCartLocators {}
export class DemoblazeCartPage extends BasePage {
  constructor(page: Page, locators: DemoblazeLocators) {
    super(page);
    Object.assign(this, locators.cart);
  }

  // ========================================================================
  // PRIVATE HELPERS (Internal mechanics)
  // - Element lookup and low-level waits
  // - Keep public methods focused on business actions
  // ========================================================================

  /**
   * Resolve a cart item locator by product name
   */
  private getCartItemLocator(productName: string) {
    return this.page.getByText(productName);
  }

  /**
   * Wait for order modal to remain visible (validation state)
   */
  private async waitForOrderModalVisible(
    timeoutMs: number = WaitHelper.SHORT_TIMEOUT_MS,
    pollIntervalMs: number = WaitHelper.DEFAULT_POLL_INTERVAL_MS
  ): Promise<void> {
    await WaitHelper.waitForCondition(
      async () => await this.isOrderModalVisible(),
      timeoutMs,
      pollIntervalMs
    );
  }

  /**
   * Wait for alert modal to appear and capture text
   */
  private async waitForAlertMessage(
    timeoutMs: number = WaitHelper.SHORT_TIMEOUT_MS
  ): Promise<string | null> {
    try {
      await this.alertBox.waitFor({ state: 'visible', timeout: timeoutMs });
      return (await this.alertBox.textContent())?.trim() || null;
    } catch {
      return null;
    }
  }

  /**
   * Standardized page load wait
   */
  private async waitForPageLoad(
    waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'load'
  ): Promise<void> {
    await this.page.waitForLoadState(waitUntil);
  }

  /**
   * Check if Place Order modal is visible
   */
  private async isOrderModalVisible(): Promise<boolean> {
    return await this.orderModal.isVisible().catch(() => false);
  }

  // ========================================================================
  // PUBLIC ACTIONS (Business workflows)
  // - Use private helpers for element lookup/waits
  // - Expose semantic operations to tests
  // ========================================================================

  /**
   * Get total price displayed in cart
   */
  async getTotalPrice(): Promise<string> {
    const text = await this.totalPrice.textContent();
    return text?.trim() || '';
  }

  /**
   * Get count of items in cart
   */
  async getCartItemCount(): Promise<number> {
    // Cart rows include header, so we subtract 1
    const rows = await this.cartItems.count();
    return Math.max(0, rows - 1);
  }

  /**
   * Delete an item from cart by index
   * @param index Index of the item to delete (0-based)
   */
  async deleteItem(index: number) {
    const deleteButtons = this.deleteButtons;
    await deleteButtons.nth(index).click();
    await this.waitForPageLoad();
  }

  /**
   * Click 'Place Order' button
   */
  async clickPlaceOrder() {
    await this.placeOrderButton.click();
    await expect(this.orderModal).toBeVisible();
  }

  /**
   * Fill order form with customer details
   */
  async fillOrderForm(
    name: string,
    country: string,
    city: string,
    creditCard: string,
    month: string,
    year: string
  ) {
    await this.orderName.fill(name);
    await this.orderCountry.fill(country);
    await this.orderCity.fill(city);
    await this.orderCreditCard.fill(creditCard);
    await this.orderMonth.fill(month);
    await this.orderYear.fill(year);
  }

  /**
   * Complete the purchase
   */
  async completePurchase() {
    await this.purchaseButton.click();
  }

  /**
   * Get purchase success message
   */
  async getSuccessMessage(): Promise<string> {
    await this.successMessage.waitFor({ state: 'visible', timeout: WaitHelper.DEFAULT_TIMEOUT_MS });
    const text = await this.successMessage.textContent();
    return text?.trim() || '';
  }

  /**
   * Verify purchase was successful (encapsulates validation logic)
   * Moves assertion from spec to page object for business-only specs
   * @throws if success message does not contain expected confirmation text
   */
  async verifyPurchaseSuccess(): Promise<void> {
    const successMsg = await this.getSuccessMessage();
    expect(successMsg).toContain('Thank you');
  }

  /**
   * Navigate to home page
   */
  async goToHome() {
    await this.homeLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Check if cart item exists by product name
   * @param productName The product name to check for
   * @returns true if item exists in cart
   */
  async hasCartItem(productName: string): Promise<boolean> {
    const item = this.getCartItemLocator(productName);
    return await item.isVisible().catch(() => false);
  }

  /**
   * Verify cart item is visible
   * @param productName The product name to verify
   */
  async verifyCartItem(productName: string) {
    const item = this.getCartItemLocator(productName);
    await item.waitFor({ state: 'visible', timeout: WaitHelper.DEFAULT_TIMEOUT_MS });
  }

  /**
   * Verify form labels are present and accessible
   * Encapsulates form accessibility validation
   * @returns Number of accessible labels found
   */
  async verifyFormLabelsAccessible(): Promise<number> {
    const requiredLabels = [
      /Name on Card/i,
      /Country/i,
      /City/i,
      /Credit Card/i,
      /Month/i,
      /Year/i,
    ];

    let labelsFound = 0;
    for (const label of requiredLabels) {
      const labelElement = this.page.getByLabel(label).first();
      const isVisible = await labelElement.isVisible().catch(() => false);
      if (isVisible) {
        labelsFound++;
      }
    }

    return labelsFound;
  }

  /**
   * Test keyboard navigation (Tab key between fields)
   * Encapsulates keyboard accessibility validation
   * @returns true if keyboard navigation works
   */
  async testKeyboardNavigation(): Promise<boolean> {
    try {
      const nameInput = this.page.getByLabel(/Name on Card/i).first();
      await nameInput.focus();

      // Tab to next field
      await this.page.keyboard.press('Tab');
      const countryInput = this.page.getByLabel(/Country/i).first();
      const isCountryFocused = await countryInput.evaluate((el) => {
        return el === document.activeElement;
      });

      return isCountryFocused;
    } catch {
      return false;
    }
  }

  /**
   * Verify modal remains visible after empty submission attempt
   * Encapsulates form validation behavior
   * @returns true if modal is still visible (validation worked)
   */
  async verifyFormValidationOnEmptySubmit(): Promise<boolean> {
    const initiallyVisible = await this.isOrderModalVisible();
    
    // Attempt submit
    await this.purchaseButton.click();
    await this.waitForOrderModalVisible();

    // Check if modal still visible (validation worked)
    const stillVisible = await this.isOrderModalVisible();
    
    return initiallyVisible && stillVisible;
  }

  /**
   * Submit empty checkout form and verify validation
   * @returns true if validation works (modal remains open)
   */
  async submitEmptyCheckoutAndVerifyValidation(): Promise<{ validationWorks: boolean; alertMessage: string | null }> {
    const initiallyVisible = await this.isOrderModalVisible();

    // Attempt submit (empty form)
    await this.purchaseButton.click();

    // Wait for on-screen alert modal (sweet-alert) to appear and capture text
    const alertMessage = await this.waitForAlertMessage();

    // Ensure the order modal remains visible (validation should prevent closing)
    await this.waitForOrderModalVisible().catch(() => undefined);

    const stillVisible = await this.isOrderModalVisible();
    const preventedSuccess = !(alertMessage && /thank you/i.test(alertMessage));
    const validationWorks = initiallyVisible && stillVisible && !!alertMessage && preventedSuccess;

    if (validationWorks) {
      this.logger.info('Validation: Modal remains open and error message displayed');
    } else {
      this.logger.warn('Validation BUG: No error alert shown or modal dismissed on empty submission');
    }

    return { validationWorks, alertMessage };
  }

  /**
   * Verify form accessibility and log results
   * Encapsulates label count check with conditional logging
   */
  async verifyFormAccessibilityAndLog(): Promise<void> {
    const labelsFound = await this.verifyFormLabelsAccessible();
    this.logger.info(`Form Labels: ${labelsFound}/6 found`);

    if (labelsFound === 6) {
      this.logger.info('Place Order Modal: All form labels present (accessible)');
    }
  }

  /**
   * Check accessibility-first locator compliance for order form labels
   * Logs warnings when label-based locators are missing and fallbacks may be used
   * @returns list of missing label names
   */
  async checkOrderFormLabelCompliance(): Promise<string[]> {
    const requiredLabels: { name: string; pattern: RegExp }[] = [
      { name: 'Name', pattern: /Name/i },
      { name: 'Country', pattern: /Country/i },
      { name: 'City', pattern: /City/i },
      { name: 'Credit Card', pattern: /Credit card/i },
      { name: 'Month', pattern: /Month/i },
      { name: 'Year', pattern: /Year/i },
    ];

    const missing: string[] = [];
    for (const label of requiredLabels) {
      const count = await this.page.getByLabel(label.pattern).count().catch(() => 0);
      if (count === 0) {
        missing.push(label.name);
      }
    }

    if (missing.length > 0) {
      this.logger.warn(`Accessibility-first locator warning: missing labels -> ${missing.join(', ')}`);
    } else {
      this.logger.info('Accessibility-first locator compliance: all labels present');
    }

    return missing;
  }

  /**
   * Test keyboard navigation and log results
   * @returns true if keyboard navigation works correctly
   */
  async testKeyboardNavigationAndLog(): Promise<boolean> {
    const keyboardWorks = await this.testKeyboardNavigation();
    if (keyboardWorks) {
      this.logger.info('Keyboard Navigation: Tab order works');
    } else {
      this.logger.warn('Keyboard Navigation: Tab order may not be correct');
    }
    
    return keyboardWorks;
  }

  /**
   * Test error handling and log results
   * @returns true if error handling works correctly
   */
  async testErrorHandlingAndLog(): Promise<boolean> {
    const validationWorks = await this.verifyFormValidationOnEmptySubmit();
    if (validationWorks) {
      this.logger.info('Error Handling: Modal remains open (validation works)');
    } else {
      this.logger.warn('Error Handling: Modal state unexpected');
    }
    
    return validationWorks;
  }
}
