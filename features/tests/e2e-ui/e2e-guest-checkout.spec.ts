import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { testData } from '../../data/demoblazeTestData';

test.describe('@ui E2E Tests: Guest Checkout Flow', () => {
  const { products } = testData.home;
  const { checkoutData } = testData.cart;

  test.beforeEach(async ({ page }) => {
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
  });

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

  });

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

  });
});
