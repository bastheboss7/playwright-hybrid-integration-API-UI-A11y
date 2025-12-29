import { Page, Locator, expect } from '@playwright/test';

export class DeliveryOptionsPage {
  // Delivery calculation requires longer wait than standard operations
  private static readonly DELIVERY_CONTINUE_TIMEOUT = 10000;

  readonly page: Page;
  readonly standardSpeed: Locator;
  readonly courierMethod: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.standardSpeed = page.locator('#standard-speed');
    this.courierMethod = page.locator('#courier-method');
    this.continueButton = page.getByRole('button', { name: 'Click here to continue with' });
  }

  async selectStandardSpeed() {
    await this.standardSpeed.click();
  }

  async selectCourierMethod() {
    await this.courierMethod.click();
  }

  async continueAfterOptions() {
    await expect(this.continueButton).toBeVisible({ 
      timeout: DeliveryOptionsPage.DELIVERY_CONTINUE_TIMEOUT 
    });
    await expect(this.continueButton).toBeEnabled({ 
      timeout: DeliveryOptionsPage.DELIVERY_CONTINUE_TIMEOUT 
    });
    await this.continueButton.click();
  }
}
