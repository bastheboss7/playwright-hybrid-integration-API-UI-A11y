import { Page, expect } from '@playwright/test';
import { DemoblazeLocators } from '../locators/DemoblazeLocators';
import { DemoblazeCartLocators } from '../locators/DemoblazeCartLocators';
import { BasePage } from '../base/BasePage';
import { WaitHelper } from '../utils/WaitHelper';

/**
 * Cart and checkout page object with injected locator facade.
 */
export interface DemoblazeCartPage extends DemoblazeCartLocators {}
export class DemoblazeCartPage extends BasePage {
  constructor(page: Page, locators: DemoblazeLocators) {
    super(page);
    Object.assign(this, locators.cart);
  }

  private getCartItemLocator(productName: string) {
    return this.page.getByText(productName);
  }

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

  private async waitForPageLoad(
    waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'load'
  ): Promise<void> {
    await this.page.waitForLoadState(waitUntil);
  }

  private async isOrderModalVisible(): Promise<boolean> {
    return await this.orderModal.isVisible().catch(() => false);
  }

  async getTotalPrice(): Promise<string> {
    const text = await this.totalPrice.textContent();
    return text?.trim() || '';
  }

  async getCartItemCount(): Promise<number> {
    const rows = await this.cartItems.count();
    return Math.max(0, rows - 1);
  }

  async deleteItem(index: number) {
    const deleteButtons = this.deleteButtons;
    await deleteButtons.nth(index).click();
    await this.waitForPageLoad();
  }

  async clickPlaceOrder() {
    await this.placeOrderButton.click();
    await expect(this.orderModal).toBeVisible();
  }

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

  async completePurchase() {
    await this.purchaseButton.click();
  }

  async getSuccessMessage(): Promise<string> {
    await this.successMessage.waitFor({ state: 'visible', timeout: WaitHelper.DEFAULT_TIMEOUT_MS });
    const text = await this.successMessage.textContent();
    return text?.trim() || '';
  }

  async verifyPurchaseSuccess(): Promise<void> {
    const successMsg = await this.getSuccessMessage();
    expect(successMsg).toContain('Thank you');
  }

  async goToHome() {
    await this.homeLink.click();
    await this.waitForPageLoad();
  }

  async hasCartItem(productName: string): Promise<boolean> {
    const item = this.getCartItemLocator(productName);
    return await item.isVisible().catch(() => false);
  }

  async verifyCartItem(productName: string) {
    const item = this.getCartItemLocator(productName);
    await item.waitFor({ state: 'visible', timeout: WaitHelper.DEFAULT_TIMEOUT_MS });
  }

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

  async verifyFormValidationOnEmptySubmit(): Promise<boolean> {
    const initiallyVisible = await this.isOrderModalVisible();
    await this.purchaseButton.click();
    await this.waitForOrderModalVisible();

    const stillVisible = await this.isOrderModalVisible();
    return initiallyVisible && stillVisible;
  }

  /**
   * Submit empty checkout form and verify validation
   */
  async submitEmptyCheckoutAndVerifyValidation(): Promise<{ validationWorks: boolean; alertMessage: string | null }> {
    const initiallyVisible = await this.isOrderModalVisible();
    await this.purchaseButton.click();
    const alertMessage = await this.waitForAlertMessage();
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

  async verifyFormAccessibilityAndLog(): Promise<void> {
    const labelsFound = await this.verifyFormLabelsAccessible();
    this.logger.info(`Form Labels: ${labelsFound}/6 found`);

    if (labelsFound === 6) {
      this.logger.info('Place Order Modal: All form labels present (accessible)');
    }
  }

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

  async testKeyboardNavigationAndLog(): Promise<boolean> {
    const keyboardWorks = await this.testKeyboardNavigation();
    if (keyboardWorks) {
      this.logger.info('Keyboard Navigation: Tab order works');
    } else {
      this.logger.warn('Keyboard Navigation: Tab order may not be correct');
    }
    
    return keyboardWorks;
  }

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
