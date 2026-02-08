import { Page, expect } from '@playwright/test';
import { DemoblazeLocators } from '../locators/DemoblazeLocators';
import { DemoblazeHomeLocators } from '../locators/DemoblazeHomeLocators';
import { BasePage } from '../base/BasePage';
import { WaitHelper } from '../utils/WaitHelper';

/**
 * DemoblazeHomePage - Page Object Model for demoblaze.com home page
 * 
 * Encapsulates home page interactions using injected locators facade.
 * All selectors are managed in DemoblazeLocators facade for single source of truth.
 * Locators are spread directly onto the instance for cleaner syntax.
 * 
 * TypeScript Mixin Pattern: Combines BasePage + DemoblazeHomeLocators
 * - Full IntelliSense support for all locator properties
 * - Type-safe access to phonesCategory, laptopsCategory, loginModal, etc.
 * - Enterprise-grade documentation via proper typing
 */
export interface DemoblazeHomePage extends DemoblazeHomeLocators {}
export class DemoblazeHomePage extends BasePage {
  constructor(page: Page, locators: DemoblazeLocators) {
    super(page);
    Object.assign(this, locators.home);
  }

  // ========================================================================
  // PRIVATE HELPERS (Internal mechanics)
  // - Element lookup and low-level waits
  // - Keep public methods focused on business actions
  // ========================================================================

  /**
   * Find a product link by name on home/listing pages
   * Business logic method - belongs in page object, not locators
   * @param productName The exact name of the product
   * @returns A locator pointing to the product link
   */
  private getProductByName(productName: string) {
    return this.page.getByRole('link', { name: productName });
  }

  /**
   * Find a product in cart by name (as table cell)
   * Uses getByText to match cart page implementation pattern
   * @param productName The exact name of the product
   * @returns A locator pointing to the product text in cart
   */
  private getProductInCart(productName: string) {
    return this.page.getByText(productName);
  }

  /**
   * Resolve category locator from enum value
   */
  private getCategoryLocator(category: 'Phones' | 'Laptops' | 'Monitors') {
    const categoryMap = {
      'Phones': this.phonesCategory,
      'Laptops': this.laptopsCategory,
      'Monitors': this.monitorsCategory
    };
    return categoryMap[category];
  }

  /**
   * Wait for transient alert to disappear (post add-to-cart)
   */
  private async waitForAlertToDisappear(): Promise<void> {
    await WaitHelper.waitForCondition(
      async () => !(await this.alertBox.isVisible().catch(() => false)),
      WaitHelper.SHORT_TIMEOUT_MS,
      WaitHelper.DEFAULT_POLL_INTERVAL_MS
    );
  }

  /**
   * Standardized page load wait
   */
  private async waitForPageLoad(
    waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'load'
  ): Promise<void> {
    await this.page.waitForLoadState(waitUntil);
  }

  // ========================================================================
  // PUBLIC ACTIONS (Business workflows)
  // - Use private helpers for element lookup/waits
  // - Expose semantic operations to tests
  // ========================================================================

  /**
   * Click on a product by name
   * @param productName The name of the product to click
   */
  async clickProduct(productName: string) {
    // Use semantic role-based locator
    const productLink = this.getProductByName(productName);
    await productLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Select a product category
   * @param category 'Phones', 'Laptops', or 'Monitors'
   */
  async selectCategory(category: 'Phones' | 'Laptops' | 'Monitors') {
    await this.getCategoryLocator(category).click();
    await this.waitForPageLoad();
  }

  /**
   * Get all product titles currently displayed
   * @returns Array of product title strings
   */
  async getProductTitles(): Promise<string[]> {
    return await this.productTitles.allTextContents();
  }

  /**
   * Get alert message text
   * Uses condition-based wait to capture alert reliably without hard timeouts.
   */
  async getAlertMessage(): Promise<string> {
    // Wait until alert is visible AND has text content
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

  /**
   * Open login modal
   */
  async openLoginModal() {
    await this.loginLink.click();
    await expect(this.loginModal).toBeVisible();
  }

  /**
   * Perform login attempt
   * @param username Username to login with
   * @param password Password to login with
   */
  async login(username: string, password: string) {
    await this.loginUsername.fill(username);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
  }

  /**
   * Close login modal
   */
  async closeLoginModal() {
    await this.loginModalClose.click();
    await expect(this.loginModal).not.toBeVisible();
  }

  /**
   * Open contact modal
   */
  async openContactModal() {
    await this.contactLink.click();
    await expect(this.contactModal).toBeVisible();
  }

  /**
   * Fill contact form
   * @param email Email address
   * @param name Contact name
   * @param message Message text
   */
  async fillContactForm(email: string, name: string, message: string) {
    await this.contactEmail.fill(email);
    await this.contactName.fill(name);
    await this.contactMessage.fill(message);
  }

  /**
   * Submit contact form
   */
  async submitContactForm() {
    await this.contactSendButton.click();
  }

  /**
   * Close contact modal
   */
  async closeContactModal() {
    await this.contactModalClose.click();
    await expect(this.contactModal).not.toBeVisible();
  }

  /**
   * Add a product to cart
   * Note: Must be called after clickProduct()
   */
  async addToCart() {
    await this.addToCartButton.click();
    await this.waitForAlertToDisappear();
  }

  /**
   * Navigate to cart page
   */
  async goToCart() {
    await this.cartLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Add a product to cart by name
   * @param productName The name of the product to add
   */
  async addProductToCart(productName: string) {
    await this.clickProduct(productName);
    await this.waitForPageLoad('domcontentloaded');
    await this.addToCartButton.click();
    await this.waitForAlertToDisappear();
  }

  /**
   * Filter products by category and verify results loaded
   * @param category 'Phones', 'Laptops', or 'Monitors'
   * @returns Number of products found in filtered results
   */
  async filterByCategory(category: 'Phones' | 'Laptops' | 'Monitors'): Promise<number> {
    await this.getCategoryLocator(category).click();
    await this.productItems.first().waitFor({ state: 'visible', timeout: WaitHelper.DEFAULT_TIMEOUT_MS });
    return await this.productItems.count();
  }

  /**
   * Verify product exists in listing
   * @param productName The product name to verify
   */
  async verifyProductInListing(productName: string): Promise<boolean> {
    const product = this.getProductByName(productName);
    return await product.isVisible().catch(() => false);
  }

  /**
   * Verify product exists in cart
   * @param productName The product name to verify
   */
  async verifyProductInCart(productName: string): Promise<boolean> {
    const product = this.getProductInCart(productName);
    try {
      await product.waitFor({ state: 'visible', timeout: WaitHelper.DEFAULT_TIMEOUT_MS });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get product text from first item in listing
   * @returns Product text content
   */
  async getFirstProductText(): Promise<string | null> {
    const text = await this.productItems.first().textContent();
    return text?.trim() || null;
  }

  /**
   * Add product and navigate to checkout modal
   * Encapsulates entire setup workflow for checkout tests
   * @param productName The product to add to cart
   */
  async addProductAndNavigateToCheckout(productName: string): Promise<void> {
    await this.clickProduct(productName);
    await this.waitForPageLoad();
    await this.addToCart();
    await this.waitForAlertToDisappear();
    await this.goToCart();
  }

  /**
   * Verify product persists in cart after page refresh
   * Encapsulates cart navigation, refresh workflow and persistence check
   * @param productName The product to verify persists
   * @returns true if product still visible in cart after refresh
   */
  async verifyProductPersistsAfterRefresh(productName: string): Promise<boolean> {
    // Navigate to cart to check persistence
    await this.goToCart();
    await this.waitForPageLoad();
    
    // Verify initial state in cart
    const initiallyVisible = await this.verifyProductInCart(productName);
    
    // Refresh page
    await this.page.reload();
    await this.waitForPageLoad();
    
    // Wait until the product is visible after refresh (condition-based, not fixed sleep)
    await WaitHelper.waitForCondition(
      async () => await this.verifyProductInCart(productName),
      WaitHelper.DEFAULT_TIMEOUT_MS,
      WaitHelper.SLOW_POLL_INTERVAL_MS
    );
    
    // Check persistence in cart
    const stillVisible = await this.verifyProductInCart(productName);
    
    return initiallyVisible && stillVisible;
  }

  /**
   * Test sequential category navigation and log results
   * Encapsulates entire multi-category filter workflow
   */
  async testSequentialCategoryNavigation(): Promise<void> {
    const laptopsCount = await this.filterByCategory('Laptops');
    this.logger.info(`Laptops: ${laptopsCount} products`);

    const phonesCount = await this.filterByCategory('Phones');
    this.logger.info(`Phones: ${phonesCount} products`);

    const monitorsCount = await this.filterByCategory('Monitors');
    this.logger.info(`Monitors: ${monitorsCount} products`);

    this.logger.info('Sequential Navigation: Filter switching works correctly');
  }

  /**
   * Add multiple products to cart sequentially
   * Encapsulates workflow: add product 1, navigate home, add product 2, navigate to cart
   * @param products Array of product names to add
   */
  async addMultipleProductsToCart(products: string[]): Promise<void> {
    for (const product of products) {
      await this.addProductToCart(product);
      this.logger.info(`${product} added`);
      // Navigate home before adding next product (if not last)
      if (products.indexOf(product) < products.length - 1) {
        const baseUrl = process.env.BASE_URL || 'https://www.demoblaze.com/index.html';
        await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      }
    }
    
    // Navigate to cart after all products added
    await this.goToCart();
  }

  /**
   * Verify multiple products exist in cart
   * @param products Array of product names to verify
   * @returns true if all products are visible
   */
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

  /**
   * Filter products and verify first product text is readable
   * Encapsulates category filter and product verification
   * @param category Category to filter by
   */
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
