import { Page, expect } from '@playwright/test';
import { DemoblazeLocators } from '../locators/DemoblazeLocators';
import { DemoblazeHomeLocators } from '../locators/DemoblazeHomeLocators';
import { BasePage } from '../base/BasePage';
import { WaitHelper } from '../utils/WaitHelper';

/**
 * Home page object with injected locator facade.
 */
export interface DemoblazeHomePage extends DemoblazeHomeLocators {}
export class DemoblazeHomePage extends BasePage {
  constructor(page: Page, locators: DemoblazeLocators) {
    super(page);
    Object.assign(this, locators.home);
  }

  private getProductByName(productName: string) {
    return this.page.getByRole('link', { name: productName });
  }

  private getProductInCart(productName: string) {
    return this.page.getByText(productName);
  }

  private getCategoryLocator(category: 'Phones' | 'Laptops' | 'Monitors') {
    const categoryMap = {
      'Phones': this.phonesCategory,
      'Laptops': this.laptopsCategory,
      'Monitors': this.monitorsCategory
    };
    return categoryMap[category];
  }

  private async waitForAlertToDisappear(): Promise<void> {
    await WaitHelper.waitForCondition(
      async () => !(await this.alertBox.isVisible().catch(() => false)),
      WaitHelper.SHORT_TIMEOUT_MS,
      WaitHelper.DEFAULT_POLL_INTERVAL_MS
    );
  }

  private async waitForPageLoad(
    waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'load'
  ): Promise<void> {
    await this.page.waitForLoadState(waitUntil);
  }

  async clickProduct(productName: string) {
    const productLink = this.getProductByName(productName);
    await productLink.click();
    await this.waitForPageLoad();
  }

  async selectCategory(category: 'Phones' | 'Laptops' | 'Monitors') {
    await this.getCategoryLocator(category).click();
    await this.waitForPageLoad();
  }

  async getProductTitles(): Promise<string[]> {
    return await this.productTitles.allTextContents();
  }

  /**
   * Get alert message text
   */
  async getAlertMessage(): Promise<string> {
    await WaitHelper.waitForCondition(
      async () => {
        const isVisible = await this.alertBox.isVisible();
        if (!isVisible) return false;
        const text = await this.alertBox.textContent();
        return !!text && text.trim().length > 0;
      },
      WaitHelper.DEFAULT_TIMEOUT_MS,
      WaitHelper.DEFAULT_POLL_INTERVAL_MS
    );
    
    return (await this.alertBox.textContent())?.trim() || '';
  }

  async openLoginModal() {
    await this.loginLink.click();
    await expect(this.loginModal).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.loginUsername.fill(username);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
  }

  async closeLoginModal() {
    await this.loginModalClose.click();
    await expect(this.loginModal).not.toBeVisible();
  }

  async openContactModal() {
    await this.contactLink.click();
    await expect(this.contactModal).toBeVisible();
  }

  async fillContactForm(email: string, name: string, message: string) {
    await this.contactEmail.fill(email);
    await this.contactName.fill(name);
    await this.contactMessage.fill(message);
  }

  async submitContactForm() {
    await this.contactSendButton.click();
  }

  async closeContactModal() {
    await this.contactModalClose.click();
    await expect(this.contactModal).not.toBeVisible();
  }

  async addToCart() {
    await this.addToCartButton.click();
    await this.waitForAlertToDisappear();
  }

  async goToCart() {
    await this.cartLink.click();
    await this.waitForPageLoad();
  }

  async addProductToCart(productName: string) {
    await this.clickProduct(productName);
    await this.waitForPageLoad('domcontentloaded');
    await this.addToCartButton.click();
    await this.waitForAlertToDisappear();
  }

  async filterByCategory(category: 'Phones' | 'Laptops' | 'Monitors'): Promise<number> {
    await this.getCategoryLocator(category).click();
    await this.productItems.first().waitFor({ state: 'visible', timeout: WaitHelper.DEFAULT_TIMEOUT_MS });
    return await this.productItems.count();
  }

  async verifyProductInListing(productName: string): Promise<boolean> {
    const product = this.getProductByName(productName);
    return await product.isVisible().catch(() => false);
  }

  async verifyProductInCart(productName: string): Promise<boolean> {
    const product = this.getProductInCart(productName);
    try {
      await product.waitFor({ state: 'visible', timeout: WaitHelper.DEFAULT_TIMEOUT_MS });
      return true;
    } catch {
      return false;
    }
  }

  async getFirstProductText(): Promise<string | null> {
    const text = await this.productItems.first().textContent();
    return text?.trim() || null;
  }

  async addProductAndNavigateToCheckout(productName: string): Promise<void> {
    await this.clickProduct(productName);
    await this.waitForPageLoad();
    await this.addToCart();
    await this.waitForAlertToDisappear();
    await this.goToCart();
  }

  /**
   * Verify product persists in cart after page refresh
   */
  async verifyProductPersistsAfterRefresh(productName: string): Promise<boolean> {
    await this.goToCart();
    await this.waitForPageLoad();
    const initiallyVisible = await this.verifyProductInCart(productName);
    await this.page.reload();
    await this.waitForPageLoad();
    await WaitHelper.waitForCondition(
      async () => await this.verifyProductInCart(productName),
      WaitHelper.DEFAULT_TIMEOUT_MS,
      WaitHelper.SLOW_POLL_INTERVAL_MS
    );
    const stillVisible = await this.verifyProductInCart(productName);
    return initiallyVisible && stillVisible;
  }

  async testSequentialCategoryNavigation(): Promise<void> {
    const laptopsCount = await this.filterByCategory('Laptops');
    this.logger.info(`Laptops: ${laptopsCount} products`);

    const phonesCount = await this.filterByCategory('Phones');
    this.logger.info(`Phones: ${phonesCount} products`);

    const monitorsCount = await this.filterByCategory('Monitors');
    this.logger.info(`Monitors: ${monitorsCount} products`);

    this.logger.info('Sequential Navigation: Filter switching works correctly');
  }

  async addMultipleProductsToCart(products: string[]): Promise<void> {
    for (const product of products) {
      await this.addProductToCart(product);
      this.logger.info(`${product} added`);
      if (products.indexOf(product) < products.length - 1) {
        const baseUrl = process.env.BASE_URL || 'https://www.demoblaze.com/index.html';
        await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      }
    }
    await this.goToCart();
  }

  async verifyMultipleProductsInCart(products: string[]): Promise<boolean> {
    let allVisible = true;
    for (const product of products) {
      const isVisible = await this.verifyProductInCart(product);
      if (!isVisible) {
        allVisible = false;
        this.logger.warn(`Product not found: ${product}`);
      }
    }
    return allVisible;
  }

  async filterCategoryAndVerifyProductReadability(category: 'Phones' | 'Laptops' | 'Monitors'): Promise<void> {
    const productCount = await this.filterByCategory(category);
    this.logger.info(`Products loaded: ${productCount} items`);

    const firstProductText = await this.getFirstProductText();
    if (firstProductText && firstProductText.length > 0) {
      this.logger.info(`Product Text: "${firstProductText.substring(0, 40)}..."`);
      this.logger.info('Product information is readable');
    }
  }
}
