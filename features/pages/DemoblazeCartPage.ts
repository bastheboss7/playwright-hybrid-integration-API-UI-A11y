import { Page, Locator, expect } from '@playwright/test';
import { DemoblazeLocators } from '../locators/DemoblazeLocators';
import { BasePage } from '../base/BasePage';
import { WaitHelper } from '../utils/WaitHelper';

/**
 * DemoblazeCartPage - Page Object Model for demoblaze.com shopping cart
 * 
 * Manages cart operations using injected locators facade.
 */
export class DemoblazeCartPage extends BasePage {
  readonly locators: DemoblazeLocators;

  // Expose order modal form fields for direct access
  readonly orderName: Locator;
  readonly orderCountry: Locator;
  readonly orderCity: Locator;
  readonly orderCreditCard: Locator;
  readonly orderMonth: Locator;
  readonly orderYear: Locator;
  readonly placeOrderButton: Locator;
  readonly purchaseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.locators = new DemoblazeLocators(page);

    // Initialize order form fields
    this.orderName = this.locators.orderName;
    this.orderCountry = this.locators.orderCountry;
    this.orderCity = this.locators.orderCity;
    this.orderCreditCard = this.locators.orderCreditCard;
    this.orderMonth = this.locators.orderMonth;
    this.orderYear = this.locators.orderYear;
    this.placeOrderButton = this.locators.placeOrderButton;
    this.purchaseButton = this.locators.purchaseButton;
  }

  /**
   * Get total price displayed in cart
   */
  async getTotalPrice(): Promise<string> {
    return (await this.getText(this.locators.totalPrice)) || '';
  }

  /**
   * Get count of items in cart
   */
  async getCartItemCount(): Promise<number> {
    // Cart rows include header, so we subtract 1
    const rows = await this.locators.cartItems.count();
    return Math.max(0, rows - 1);
  }

  /**
   * Delete an item from cart by index
   * @param index Index of the item to delete (0-based)
   */
  async deleteItem(index: number) {
    const deleteButtons = this.locators.deleteButtons;
    await this.click(deleteButtons.nth(index));
    await this.waitForLoad();
  }

  /**
   * Click 'Place Order' button
   */
  async clickPlaceOrder() {
    await this.click(this.locators.placeOrderButton);
    await expect(this.locators.orderModal).toBeVisible();
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
    await this.locators.orderName.fill(name);
    await this.locators.orderCountry.fill(country);
    await this.locators.orderCity.fill(city);
    await this.locators.orderCreditCard.fill(creditCard);
    await this.locators.orderMonth.fill(month);
    await this.locators.orderYear.fill(year);
  }

  /**
   * Complete the purchase
   */
  async completePurchase() {
    await this.click(this.locators.purchaseButton);
  }

  /**
   * Get purchase success message
   */
  async getSuccessMessage(): Promise<string> {
    await this.locators.successMessage.waitFor({ state: 'visible', timeout: 5000 });
    return (await this.getText(this.locators.successMessage)) || '';
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
    await this.click(this.locators.homeLink);
    await this.waitForLoad();
  }

  /**
   * Check if cart item exists by product name
   * @param productName The product name to check for
   * @returns true if item exists in cart
   */
  async hasCartItem(productName: string): Promise<boolean> {
    const item = this.page.getByText(productName);
    return await this.isVisible(item);
  }

  /**
   * Verify cart item is visible
   * @param productName The product name to verify
   */
  async verifyCartItem(productName: string) {
    const item = this.page.getByText(productName);
    await item.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Check if Place Order modal is visible
   */
  async isOrderModalVisible(): Promise<boolean> {
    return await this.isVisible(this.locators.orderModal);
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
    await this.click(this.purchaseButton);
    await WaitHelper.waitForCondition(
      async () => await this.isOrderModalVisible(),
      3000,
      100
    );

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
    await this.click(this.purchaseButton);

    // Wait for on-screen alert modal (sweet-alert) to appear and capture text
    let alertMessage: string | null = null;
    try {
      await this.locators.alertBox.waitFor({ state: 'visible', timeout: 3000 });
      alertMessage = (await this.getText(this.locators.alertBox))?.trim() || null;
    } catch {
      // No sweet-alert appeared; leave message as null
    }

    // Ensure the order modal remains visible (validation should prevent closing)
    await WaitHelper.waitForCondition(
      async () => await this.isOrderModalVisible(),
      3000,
      100
    ).catch(() => undefined);

    const stillVisible = await this.isOrderModalVisible();
    const preventedSuccess = !(alertMessage && /thank you/i.test(alertMessage));
    const validationWorks = initiallyVisible && stillVisible && !!alertMessage && preventedSuccess;

    if (validationWorks) {
      console.log('✅ Validation: Modal remains open and error message displayed');
    } else {
      console.log('❌ Validation BUG: No error alert shown or modal dismissed on empty submission');
    }

    return { validationWorks, alertMessage };
  }

  /**
   * Verify form accessibility and log results
   * Encapsulates label count check with conditional logging
   */
  async verifyFormAccessibilityAndLog(): Promise<void> {
    const labelsFound = await this.verifyFormLabelsAccessible();
    console.log(`✅ Form Labels: ${labelsFound}/6 found`);

    if (labelsFound === 6) {
      console.log('✅ Place Order Modal: All form labels present (accessible)');
    }
  }

  /**
   * Test keyboard navigation and log results
   * @returns true if keyboard navigation works correctly
   */
  async testKeyboardNavigationAndLog(): Promise<boolean> {
    const keyboardWorks = await this.testKeyboardNavigation();
    if (keyboardWorks) {
      console.log('✅ Keyboard Navigation: Tab order works');
    } else {
      console.log('⚠️  Keyboard Navigation: Tab order may not be correct');
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
      console.log('✅ Error Handling: Modal remains open (validation works)');
    } else {
      console.log('⚠️  Error Handling: Modal state unexpected');
    }
    
    return validationWorks;
  }
}
