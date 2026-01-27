import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { products, checkoutData } from '../../data/demoblazeTestData';

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
    page,
    demoblazeHomePage,
    demoblazeCartPage,
  }) => {
    console.log('💰 E2E Test: Complete Revenue Path (Add to Cart → Place Order)');

    // === Step 1: Select Product ===
    console.log('📦 Step 1: Selecting product...');
    await demoblazeHomePage.clickProduct(products.samsungGalaxyS6);
    console.log('✅ Product selected');

    // === Step 2: Add to Cart ===
    console.log('🛒 Step 2: Adding to cart...');
    await demoblazeHomePage.addToCart();

    console.log('✅ Product added to cart');

    // === Step 3: Navigate to Cart ===
    console.log('🛍️  Step 3: Navigating to cart...');
    await demoblazeHomePage.goToCart();

    // === Step 4: Verify Product in Cart ===
    await demoblazeCartPage.verifyCartItem(products.samsungGalaxyS6);
    console.log('✅ Product verified in cart');

    // === Step 5: Click Place Order ===
    console.log('📋 Step 5: Opening Place Order modal...');
    await demoblazeCartPage.clickPlaceOrder();

    console.log('✅ Place Order modal opened');

    // === Step 6: Fill Guest Checkout Form ===
    console.log('📝 Step 6: Filling checkout form...');
    await demoblazeCartPage.fillOrderForm(
      checkoutData.validOrder.name,
      checkoutData.validOrder.country,
      checkoutData.validOrder.city,
      checkoutData.validOrder.creditCard,
      checkoutData.validOrder.month,
      checkoutData.validOrder.year
    );
    console.log('✅ Guest Checkout Form: All fields completed');

    // === Step 7: Submit Order ===
    console.log('✨ Step 7: Submitting order...');
    await demoblazeCartPage.completePurchase();

    // === Step 8: Verify Purchase Success ===
    console.log('🎉 Step 8: Verifying success...');
    await demoblazeCartPage.verifyPurchaseSuccess();
    console.log('✅ Purchase Successful: Order confirmed');

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
    page,
    demoblazeHomePage,
    demoblazeCartPage,
  }) => {
    console.log('📋 E2E Test: Form Validation - Empty Submission');

    // === Setup: Add product and navigate to checkout ===
    await demoblazeHomePage.addProductAndNavigateToCheckout(products.samsungGalaxyS6);

    // === Open Place Order modal ===
    await demoblazeCartPage.clickPlaceOrder();

    // === Test: Submit empty form and verify validation ===
    console.log('🔍 Attempting to submit empty form...');
    const { validationWorks, alertMessage } = await demoblazeCartPage.submitEmptyCheckoutAndVerifyValidation();

    await test.step('Error handling: alert displayed to user', async () => {
      expect(alertMessage).toBeTruthy();
      expect(alertMessage as string).not.toMatch(/thank you/i);
    });

    await test.step('Form validation: modal remains open (submission blocked)', async () => {
      await expect(demoblazeCartPage.locators.orderModal).toBeVisible();
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
