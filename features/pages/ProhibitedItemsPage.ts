import { Page, Locator, expect } from '@playwright/test';

export class ProhibitedItemsPage {
  readonly page: Page;
  readonly contentsInput: Locator;
  readonly valueInput: Locator;
  readonly errorMessage: Locator;
  readonly finalContinueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.contentsInput = page.locator('#parcel-contents');
    this.valueInput = page.locator('#parcel-value');
    this.errorMessage = page.locator('text=Parcel contents are prohibited');
    this.finalContinueButton = page.locator('button[data-test-id="continue-button"]').last();
  }

  async enterContents(text: string) {
    await this.contentsInput.fill(text);
  }

  async enterValue(value: string) {
    await this.valueInput.fill(value);
  }

  async assertProhibitedErrorVisible() {
    await expect(this.errorMessage).toBeVisible();
  }

  async assertFinalContinueDisabled() {
    await expect(this.finalContinueButton).toBeDisabled();
  }
}
