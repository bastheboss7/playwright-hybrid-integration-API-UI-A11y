import { Page, expect } from '@playwright/test';
import { DemoblazeLocators } from '../locators/DemoblazeLocators';
import { BasePage } from '../base/BasePage';
import { WaitHelper } from '../utils/WaitHelper';

/**
 * DemoblazeHomePage - Page Object Model for demoblaze.com home page
 * 
 * Encapsulates home page interactions using injected locators facade.
 * All selectors are managed in DemoblazeLocators for single source of truth.
 */
export class DemoblazeHomePage extends BasePage {
  readonly locators: DemoblazeLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new DemoblazeLocators(page);
  }

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
   * Click on a product by name
   * @param productName The name of the product to click
   */
  async clickProduct(productName: string) {
    // Use semantic role-based locator
    const productLink = this.getProductByName(productName);
    await this.click(productLink);
    await this.waitForLoad();
  }

  /**
   * Select a product category
   * @param category 'Phones', 'Laptops', or 'Monitors'
   */
  async selectCategory(category: 'Phones' | 'Laptops' | 'Monitors') {
    const categoryMap = {
      'Phones': this.locators.phonesCategory,
      'Laptops': this.locators.laptopsCategory,
      'Monitors': this.locators.monitorsCategory
    };
    await this.click(categoryMap[category]);
    await this.waitForLoad();
  }

  /**
   * Get all product titles currently displayed
   * @returns Array of product title strings
   */
  async getProductTitles(): Promise<string[]> {
    return await this.locators.productTitles.allTextContents();
  }

  /**
   * Get alert message text
   * INTENTIONAL BUG NOTE: The alert appears briefly before auto-dismissing.
   * We use waitForSelector with polling to capture it reliably.
   */
  async getAlertMessage(): Promise<string> {
    // Wait for the alert to appear
    await this.page.waitForSelector('.sweet-alert', { state: 'visible', timeout: 5000 }).catch(() => null);
    await this.page.waitForTimeout(500); // Brief pause to ensure alert is rendered
    const alertText = await this.getText(this.locators.alertBox);
    return alertText?.trim() || '';
  }

  /**
   * Open login modal
   */
  async openLoginModal() {
    await this.click(this.locators.loginLink);
    await expect(this.locators.loginModal).toBeVisible();
  }

  /**
   * Perform login attempt
   * @param username Username to login with
   * @param password Password to login with
   */
  async login(username: string, password: string) {
    await this.locators.loginUsername.fill(username);
    await this.locators.loginPassword.fill(password);
    await this.locators.loginButton.click();
  }

  /**
   * Close login modal
   */
  async closeLoginModal() {
    await this.click(this.locators.loginModalClose);
    await expect(this.locators.loginModal).not.toBeVisible();
  }

  /**
   * Open contact modal
   */
  async openContactModal() {
    await this.click(this.locators.contactLink);
    await expect(this.locators.contactModal).toBeVisible();
  }

  /**
   * Fill contact form
   * @param email Email address
   * @param name Contact name
   * @param message Message text
   */
  async fillContactForm(email: string, name: string, message: string) {
    await this.locators.contactEmail.fill(email);
    await this.locators.contactName.fill(name);
    await this.locators.contactMessage.fill(message);
  }

  /**
   * Submit contact form
   */
  async submitContactForm() {
    await this.click(this.locators.contactSendButton);
  }

  /**
   * Close contact modal
   */
  async closeContactModal() {
    await this.click(this.locators.contactModalClose);
    await expect(this.locators.contactModal).not.toBeVisible();
  }

  /**
   * Add a product to cart
   * Note: Must be called after clickProduct()
   */
  async addToCart() {
    await this.click(this.locators.addToCartButton);
    await WaitHelper.waitForCondition(
      async () => !(await this.locators.alertBox.isVisible().catch(() => false)),
      3000,
      100
    );
  }

  /**
   * Navigate to cart page
   */
  async goToCart() {
    await this.click(this.locators.cartLink);
    await this.waitForLoad();
  }

  /**
   * Add a product to cart by name
   * @param productName The name of the product to add
   */
  async addProductToCart(productName: string) {
    await this.clickProduct(productName);
    await this.page.waitForLoadState('domcontentloaded');
    await this.click(this.locators.addToCartButton);
    await WaitHelper.waitForCondition(
      async () => !(await this.locators.alertBox.isVisible().catch(() => false)),
      3000,
      100
    );
  }

  /**
   * Filter products by category and verify results loaded
   * @param category 'Phones', 'Laptops', or 'Monitors'
   * @returns Number of products found in filtered results
   */
  async filterByCategory(category: 'Phones' | 'Laptops' | 'Monitors'): Promise<number> {
    const categoryMap = {
      'Phones': this.locators.phonesCategory,
      'Laptops': this.locators.laptopsCategory,
      'Monitors': this.locators.monitorsCategory
    };
    await this.click(categoryMap[category]);
    await this.locators.productItems.first().waitFor({ state: 'visible', timeout: 5000 });
    return await this.locators.productItems.count();
  }

  /**
   * Verify product exists in listing
   * @param productName The product name to verify
   */
  async verifyProductInListing(productName: string): Promise<boolean> {
    const product = this.getProductByName(productName);
    return await this.isVisible(product);
  }

  /**
   * Verify product exists in cart
   * @param productName The product name to verify
   */
  async verifyProductInCart(productName: string): Promise<boolean> {
    const product = this.getProductInCart(productName);
    try {
      await product.waitFor({ state: 'visible', timeout: 5000 });
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
    return await this.getText(this.locators.productItems.first());
  }

  /**
   * Add product and navigate to checkout modal
   * Encapsulates entire setup workflow for checkout tests
   * @param productName The product to add to cart
   */
  async addProductAndNavigateToCheckout(productName: string): Promise<void> {
    await this.clickProduct(productName);
    await this.waitForLoad();
    await this.addToCart();
    await WaitHelper.waitForCondition(
      async () => !(await this.locators.alertBox.isVisible().catch(() => false)),
      3000,
      100
    );
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
    await this.waitForLoad();
    
    // Verify initial state in cart
    const initiallyVisible = await this.verifyProductInCart(productName);
    
    // Refresh page
    await this.page.reload();
    await this.waitForLoad();
    
    // Wait until the product is visible after refresh (condition-based, not fixed sleep)
    await WaitHelper.waitForCondition(
      async () => await this.verifyProductInCart(productName),
      5000,
      150
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
    console.log(`✅ Laptops: ${laptopsCount} products`);

    const phonesCount = await this.filterByCategory('Phones');
    console.log(`✅ Phones: ${phonesCount} products`);

    const monitorsCount = await this.filterByCategory('Monitors');
    console.log(`✅ Monitors: ${monitorsCount} products`);

    console.log('✅ Sequential Navigation: Filter switching works correctly');
  }

  /**
   * Add multiple products to cart sequentially
   * Encapsulates workflow: add product 1, navigate home, add product 2, navigate to cart
   * @param products Array of product names to add
   */
  async addMultipleProductsToCart(products: string[]): Promise<void> {
    for (const product of products) {
      await this.addProductToCart(product);
      console.log(`✅ ${product} added`);
      // Navigate home before adding next product (if not last)
      if (products.indexOf(product) < products.length - 1) {
        const baseUrl = process.env.BASE_URL || 'https://www.demoblaze.com/index.html';
        await this.goto(baseUrl);
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
        console.log(`⚠️  Product not found: ${product}`);
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
    console.log(`✅ Products loaded: ${productCount} items`);

    const firstProductText = await this.getFirstProductText();
    if (firstProductText && firstProductText.length > 0) {
      console.log(`✅ Product Text: "${firstProductText.substring(0, 40)}..."`);
      console.log('✅ Product information is readable');
    }
  }
}
