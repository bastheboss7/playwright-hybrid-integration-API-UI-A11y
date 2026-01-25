import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async wait(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  async waitForLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async click(locator: Locator) {
    await locator.click();
  }

  async clickAndWait(locator: Locator) {
    await locator.click();
    await this.waitForLoad();
  }

  async getText(locator: Locator): Promise<string | null> {
    return await locator.textContent();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible().catch(() => false);
  }

  async fill(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitForLoad();
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForLoad();
  }
}

export default BasePage;
