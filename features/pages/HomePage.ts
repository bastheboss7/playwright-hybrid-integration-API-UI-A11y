import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly acceptCookiesButton: Locator;
  readonly fromPostcode: Locator;
  readonly toPostcode: Locator;
  readonly weightSelect: Locator;
  readonly sendButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.acceptCookiesButton = page.locator('#onetrust-accept-btn-handler');
    this.fromPostcode = page.locator('#from-postcode');
    this.toPostcode = page.locator('#to-postcode');
    this.weightSelect = page.locator('#weight-choice-select');
    this.sendButton = page.locator('button[data-test-id="send-entry-submit"]');
  }

  async gotoHome() {
    await this.page.goto('/');
  }

  async acceptCookies() {
    await this.acceptCookiesButton.click();
  }

  async fillFromPostcode(value: string) {
    await this.fromPostcode.fill(value);
    await expect(this.fromPostcode).toHaveValue(value);
  }

  async fillToPostcode(value: string) {
    await this.toPostcode.fill(value);
    await expect(this.toPostcode).toHaveValue(value);
  }

  async selectWeight(option: string) {
    await this.weightSelect.selectOption(option);
  }

  async clickSendParcel() {
    await expect(this.sendButton).toBeEnabled();
    await this.sendButton.click();
  }
}
