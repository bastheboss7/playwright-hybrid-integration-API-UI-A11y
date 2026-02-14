import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { testData } from '../../data/demoblazeTestData';

test.describe('@ui E2E Tests: Navigation & State Persistence', () => {
  const { products, categories } = testData.home;

  test.beforeEach(async ({ page }) => {
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
  });

  test('@smoke @ui Asynchronous Navigation: Laptops Category Filter', async ({
    page,
    demoblazeHomePage,
    logger,
  }) => {
    logger.step('E2E Test: Asynchronous Category Navigation');

    await test.step('Step 1: Filter to Laptops category', async () => {
      logger.info('Filtering to Laptops category');
      const productCount = await demoblazeHomePage.filterByCategory(categories.laptops);
      logger.info(`Laptops category filtered: ${productCount} products loaded`);
    });

    await test.step('Step 2: Verify product accessibility', async () => {
      logger.info('Verifying product accessibility');
      const firstProductText = await demoblazeHomePage.getFirstProductText();
      logger.info(`Products are accessible: "${firstProductText?.substring(0, 40)}..."`);
    });

  });

  test('@ui Category Navigation: Sequential Filter Changes', async ({
    demoblazeHomePage,
    logger,
  }) => {
    logger.step('E2E Test: Sequential Category Navigation');

    await test.step('Run sequential category navigation', async () => {
      logger.info('Running sequential category navigation');
      await demoblazeHomePage.testSequentialCategoryNavigation();
    });

  });

  test('@regression @ui State Persistency: Cart Survives Page Refresh', async ({
    page,
    demoblazeHomePage,
    logger,
  }) => {
    logger.step('E2E Test: State Persistency - Cart contents survive page refresh');

    await test.step('Step 1: Add product and navigate to checkout', async () => {
      logger.info('Adding product and navigating to checkout');
      await demoblazeHomePage.addProductToCart(products.samsungGalaxyS6);
      logger.info('Product added to cart');
    });

    const productPersists = await test.step('Step 2: Verify product persists after refresh', async () => {
      logger.info('Verifying product persists after refresh');
      return await demoblazeHomePage.verifyProductPersistsAfterRefresh(products.samsungGalaxyS6);
    });

    expect(productPersists).toBe(true);
    logger.info('State Persistency: Product remains in cart after refresh');

  });

  test('@ui Cart Management: Add Multiple Items', async ({
    page,
    demoblazeHomePage,
    logger,
  }) => {
    logger.step('E2E Test: Cart Management - Multiple Items');

    await test.step('Step 1: Add multiple products to cart', async () => {
      logger.info('Adding multiple products to cart');
      await demoblazeHomePage.addMultipleProductsToCart([
        products.samsungGalaxyS6,
        products.nokiaLumia1520
      ]);
    });

    const allProductsPresent = await test.step('Step 2: Verify cart contents', async () => {
      logger.info('Verifying cart contents');
      return await demoblazeHomePage.verifyMultipleProductsInCart([
        products.samsungGalaxyS6,
        products.nokiaLumia1520
      ]);
    });

    expect(allProductsPresent).toBe(true);
    logger.info('Cart Management: Multiple items verified');

  });
});