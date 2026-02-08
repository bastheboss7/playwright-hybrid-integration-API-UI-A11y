import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { testData } from '../../data/demoblazeTestData';

/**
 * ============================================================================
 * E2E UI TEST LAYER: Guest Checkout Flow
 * ============================================================================
 * 
 * PILLAR 1: STRATEGIC GOVERNANCE (Revenue Transaction Integrity)
 * - Validates complete purchase journey (most critical business flow)
 * - Ensures guest checkout accessibility
 * - Tests form validation and error handling
 * - Provides audit trail for regulatory compliance (PCI, transaction logging)
 * 
 * PILLAR 2: TECHNICAL ARCHITECTURE (End-to-End UI Flow)
 * - Uses Page Object Model for maintainability
 * - Role-based locators for accessibility
 * - Multi-step transaction validation
 * - Integrates with shared fixtures
 * 
 * PILLAR 3: GENAI-ACCELERATED ENGINEERING
 * - Modern Playwright patterns for UI automation
 * - Comprehensive test documentation
 * - Reusable page objects across test layers
 * ============================================================================
 */

test.describe('@ui E2E Tests: Guest Checkout Flow', () => {
  const { products } = testData.home;
  const { checkoutData } = testData.cart;

  // Setup persistent dialog handler for all tests in this suite
  test.beforeEach(async ({ page }) => {
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
  });

  /**
   * SCENARIO 3: REVENUE PATH - END-TO-END GUEST CHECKOUT
   * 
   * Tests the complete purchase journey from product selection to order confirmation.
   * This is the most critical business flow for e-commerce platforms.
   * 
   * BUSINESS VALUE:
   * - Prevents revenue loss from broken checkout
   * - Validates payment/order flow end-to-end
   * - Ensures guest checkout accessibility (increases conversion)
   * - Critical for regulatory compliance (PCI, transaction logging)
   * 
   * TECHNICAL APPROACH:
   * 1. Navigate to product (Samsung Galaxy S6)
   * 2. Add product to cart
   * 3. Open cart and click Place Order
   * 4. Fill in guest checkout form (name, country, city, card, month, year)
   * 5. Submit order and verify success confirmation
   * 
   * RISK LEVEL: 🔴 CRITICAL (9/10)
   * - Revenue impact: Direct (transaction)
   * - Probability: Low (well-maintained checkout)
   * - Regulatory: High (PCI compliance, audit trail)
   */
  test('@smoke @ui Revenue Path: Complete Guest Checkout Transaction', async ({
    demoblazeHomePage,
    demoblazeCartPage,
    logger,
  }) => {
    await test.step('Step 1: Select product', async () => {
      logger.info('Selecting product');
      await demoblazeHomePage.clickProduct(products.samsungGalaxyS6);
    });

    await test.step('Step 2: Add to cart', async () => {
      logger.info('Adding product to cart');
      await demoblazeHomePage.addToCart();
    });

    await test.step('Step 3: Navigate to cart', async () => {
      logger.info('Navigating to cart');
      await demoblazeHomePage.goToCart();
    });

    await test.step('Step 4: Verify product in cart', async () => {
      logger.info('Verifying product in cart');
      await demoblazeCartPage.verifyCartItem(products.samsungGalaxyS6);
    });

    await test.step('Step 5: Open Place Order modal', async () => {
      logger.info('Opening Place Order modal');
      await demoblazeCartPage.clickPlaceOrder();
    });

    await test.step('Step 6: Fill guest checkout form', async () => {
      logger.info('Filling checkout form');
      await demoblazeCartPage.fillOrderForm(
        checkoutData.validOrder.name,
        checkoutData.validOrder.country,
        checkoutData.validOrder.city,
        checkoutData.validOrder.creditCard,
        checkoutData.validOrder.month,
        checkoutData.validOrder.year
      );
    });

    await test.step('Step 7: Submit order', async () => {
      logger.info('Submitting order');
      await demoblazeCartPage.completePurchase();
    });

    await test.step('Step 8: Verify purchase success', async () => {
      logger.info('Verifying purchase success');
      await demoblazeCartPage.verifyPurchaseSuccess();
    });

    // GOVERNANCE NOTE: This test validates end-to-end transaction integrity
    // (Pillar 1: Revenue Transaction Audit Trail)
  });

  /**
   * SCENARIO 3B: FORM VALIDATION - EMPTY SUBMISSION ERROR HANDLING
   * 
     * Tests that the checkout form rejects empty submissions.
     * Validates both:
     * - Form validation (modal remains open, submission blocked)
     * - Error handling (on-screen alert is shown to the user)
   * 
   * BUSINESS VALUE:
   * - Prevents incomplete orders (data quality)
   * - Ensures validation rules work (form protection)
   * - Provides user feedback for corrections
   * - Prevents bad data in order system
   */
  test('@ui Guest Checkout: Form Validation on Empty Submission', async ({
    demoblazeHomePage,
    demoblazeCartPage,
    logger,
  }) => {
    await test.step('Setup: Add product and navigate to checkout', async () => {
      logger.info('Setup: add product and navigate to checkout');
      await demoblazeHomePage.addProductAndNavigateToCheckout(products.samsungGalaxyS6);
    });

    await test.step('Open Place Order modal', async () => {
      logger.info('Opening Place Order modal');
      await demoblazeCartPage.clickPlaceOrder();
    });

    const { validationWorks, alertMessage } = await test.step('Submit empty form and capture validation', async () => {
      logger.info('Submitting empty form to validate error handling');
      return await demoblazeCartPage.submitEmptyCheckoutAndVerifyValidation();
    });

    await test.step('Error handling: alert displayed to user', async () => {
      expect(alertMessage).toBeTruthy();
      expect(alertMessage as string).not.toMatch(/thank you/i);
    });

    await test.step('Form validation: modal remains open (submission blocked)', async () => {
      await expect(demoblazeCartPage.orderModal).toBeVisible();
      expect(validationWorks).toBe(true);
    });

    // GOVERNANCE NOTE: This test validates form validation governance
    // (Pillar 1: Data Quality Audit Trail)
  });
});

/**
 * ============================================================================
 * E2E UI TEST LAYER ARCHITECTURE
 * ============================================================================
 * 
 * This layer demonstrates enterprise E2E UI testing practices:
 * 
 * ✅ Page Object Model (POM) - Maintainability
 * ✅ Role-based Locators - Accessibility & Resilience
 * ✅ Multi-step Transactions - Real user workflows
 * ✅ Form Validation - Data integrity
 * ✅ Success Verification - Outcome validation
 * 
 * REUSABILITY:
 * - Shared POM classes (DemoblazeHomePage, etc)
 * - Shared fixtures and utilities
 * - Common dialog handling
 * - Consistent test patterns
 * 
 * SCALABILITY:
 * - Can add product detail page tests
 * - Can add login/authentication flows
 * - Can add wishlist/favorites features
 * - Can add search and filter tests
 * - Pattern extends to n user workflows
 * 
 * ============================================================================
 */
