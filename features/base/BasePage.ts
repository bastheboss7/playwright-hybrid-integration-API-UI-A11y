import { Page, Locator } from '@playwright/test';
import { TestLogger } from '../utils/TestLogger';
import { WaitHelper } from '../utils/WaitHelper';

/**
 * BasePage - Lean base class for page objects
 * 
 * PHILOSOPHY: Only include methods that add value beyond Playwright's API
 * - Custom business logic (safeClick with retry)
 * - Convenience combinations (clickAndWait)
 * - Framework integration (logging, screenshots with path management)
 * 
 * REMOVED: Zero-value wrappers (use Playwright directly)
 * - fill, type, clear, check, uncheck → use locator.fill(), locator.check()
 * - getText, isVisible, isEnabled → use locator.textContent(), locator.isVisible()
 * - verifyVisible, verifyText → use expect(locator).toBeVisible()
 * - scrollToElement → use locator.scrollIntoViewIfNeeded()
 * - waitForCondition → use WaitHelper.waitForCondition()
 * 
 * WHY: Playwright's API is already excellent - don't reinvent it
 */
export class BasePage {
  private static readonly DEFAULT_RETRIES = 3;
  private static readonly SCREENSHOT_DIR = 'screenshots';

  readonly page: Page;
  protected logger: TestLogger;

  constructor(page: Page) {
    this.page = page;
    this.logger = new TestLogger(this.constructor.name);
  }

  // =========================================================================
  // PAGE LIFECYCLE
  // =========================================================================
  
  async reload(waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'): Promise<void> {
    this.logger.debug('Reloading page');
    await this.page.reload({ waitUntil });
  }

  // =========================================================================
  // ROBUST ACTIONS (Methods with real added value)
  // =========================================================================
  
  /**
   * Click with retry logic and error handling
   * Use when element interactions are flaky or timing-sensitive
   */
  async safeClick(locator: Locator, options?: { retries?: number, force?: boolean }): Promise<void> {
    const retries = options?.retries || BasePage.DEFAULT_RETRIES;
    const force = options?.force || false;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await locator.click({ force, timeout: WaitHelper.DEFAULT_TIMEOUT_MS });
        this.logger.debug(`Click successful on attempt ${attempt}`);
        return;
      } catch (error) {
        if (attempt === retries) {
          this.logger.error(`Click failed after ${retries} attempts`);
          throw error;
        }
        this.logger.warn(`Click attempt ${attempt} failed, retrying...`);
        await this.page.waitForTimeout(WaitHelper.RETRY_DELAY_MS);
      }
    }
  }

  /**
   * Click and wait for navigation/load state
   * Convenience method for common pattern
   */
  async clickAndWait(locator: Locator, waitFor: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'): Promise<void> {
    await locator.click();
    await this.page.waitForLoadState(waitFor);
  }

  // =========================================================================
  // SCREENSHOTS WITH PATH MANAGEMENT
  // =========================================================================
  
  async screenshot(name: string, options?: { fullPage?: boolean }): Promise<Buffer> {
    const fullPage = options?.fullPage || false;
    this.logger.info(`Taking screenshot: ${name}`);
    return await this.page.screenshot({ 
      path: `${BasePage.SCREENSHOT_DIR}/${name}.png`, 
      fullPage 
    });
  }

  async screenshotElement(locator: Locator, name: string): Promise<Buffer> {
    this.logger.info(`Taking element screenshot: ${name}`);
    return await locator.screenshot({ path: `${BasePage.SCREENSHOT_DIR}/${name}.png` });
  }

  // =========================================================================
  // BROWSER CONTEXT HELPERS (WITH LOGGING)
  // =========================================================================
  
  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
    this.logger.debug('localStorage cleared');
  }

  async clearSessionStorage(): Promise<void> {
    await this.page.evaluate(() => sessionStorage.clear());
    this.logger.debug('sessionStorage cleared');
  }

  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
    this.logger.debug('Cookies cleared');
  }

  async setLocalStorageItem(key: string, value: string): Promise<void> {
    await this.page.evaluate(({ k, v }) => localStorage.setItem(k, v), { k: key, v: value });
  }

  async getLocalStorageItem(key: string): Promise<string | null> {
    return await this.page.evaluate((k) => localStorage.getItem(k), key);
  }
}

export default BasePage;
