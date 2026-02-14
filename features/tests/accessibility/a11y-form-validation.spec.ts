import { test } from '../../fixtures';
import { testData } from '../../data/demoblazeTestData';

test.describe('@a11y Accessibility Tests: WCAG 2.1 AA Compliance', () => {
  const { products, categories } = testData.home;

  test.beforeEach(async ({ page }) => {
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
  });

  test('@a11y @smoke Accessibility Audit: Homepage - WCAG 2.1 AA', async ({
    a11yAudit,
    logger,
  }, testInfo) => {
    await test.step('Run WCAG 2.1 AA audit (Homepage)', async () => {
      logger.info('Running WCAG 2.1 AA audit (Homepage)');
      await a11yAudit.auditPage('Homepage');
    });

    await test.step('Attach accessibility violations (if any)', async () => {
      logger.info('Attaching accessibility violations (Homepage)');
      await a11yAudit.attachViolations(testInfo, 'Homepage');
    });

  });

  test('@a11y @regression Accessibility Audit: Place Order Modal - Form Labels & Navigation', async ({
    demoblazeHomePage,
    demoblazeCartPage,
    a11yAudit,
    logger,
  }, testInfo) => {
    await test.step('Setup: Open Place Order modal', async () => {
      logger.info('Opening Place Order modal');
      await demoblazeHomePage.addProductToCart(products.samsungGalaxyS6);
      await demoblazeHomePage.goToCart();
      await demoblazeCartPage.clickPlaceOrder();
    });

    await test.step('Verify form accessibility (labels)', async () => {
      logger.info('Verifying form accessibility (labels)');
      await demoblazeCartPage.verifyFormAccessibilityAndLog();
    });

    await test.step('Check accessibility-first locator compliance', async () => {
      logger.info('Checking accessibility-first locator compliance');
      const missingLabels = await demoblazeCartPage.checkOrderFormLabelCompliance();
      await a11yAudit.attachLocatorFallbacks(testInfo, missingLabels);
    });

    await test.step('Run Axe accessibility scan (modal)', async () => {
      logger.info('Running Axe accessibility scan (modal)');
      await a11yAudit.auditPageWithInclude('Place Order Modal', '.modal');
    });

    await test.step('Attach accessibility violations (if any)', async () => {
      logger.info('Attaching accessibility violations (modal)');
      await a11yAudit.attachViolations(testInfo, 'Place Order Modal');
    });

    await test.step('Verify keyboard navigation (tab order)', async () => {
      logger.info('Verifying keyboard navigation (tab order)');
      await demoblazeCartPage.testKeyboardNavigationAndLog();
    });

  });

  test('@a11y @regression Accessibility Audit: Product Listing Cards', async ({
    demoblazeHomePage,
    a11yAudit,
    logger,
  }, testInfo) => {
    await test.step('Navigate to product listing and verify readability', async () => {
      logger.info('Navigating to product listing and verifying readability');
      await demoblazeHomePage.filterCategoryAndVerifyProductReadability(categories.laptops);
    });

    await test.step('Run Axe accessibility scan (listing)', async () => {
      logger.info('Running Axe accessibility scan (listing)');
      await a11yAudit.auditPage('Product Listing');
    });

    await test.step('Attach accessibility violations (if any)', async () => {
      logger.info('Attaching accessibility violations (listing)');
      await a11yAudit.attachViolations(testInfo, 'Product Listing');
    });

  });
});
