import { test } from '../../fixtures';

test.describe('@api @smoke API Tests: Product Catalog Integration', () => {
  test('@api Product Catalog Endpoint Returns Valid Data', async ({ page, apiClient, logger }) => {
    await test.step('API Test: Fetch Product Catalog', async () => {
      logger.step('API Test: Fetch Product Catalog');
      await apiClient.verifyProductCatalog(page);
    });
  });

  test('@api Product Catalog API Response Time < 2 Seconds', async ({ page, apiClient, logger }) => {
    await test.step('API Test: Response Time Performance', async () => {
      logger.step('API Test: Response Time Performance');
      await apiClient.verifyResponseTime(page, 2000);
    });
  });

  test('@api API Returns Proper Error for Invalid Endpoint', async ({ page, apiClient, logger }) => {
    await test.step('API Test: Error Handling - Invalid Endpoint', async () => {
      logger.step('API Test: Error Handling - Invalid Endpoint');
      await apiClient.verifyInvalidEndpointError(page);
    });
  });

  test('@api API Response Headers Are Valid', async ({ page, apiClient, logger }) => {
    await test.step('API Test: Response Headers Validation', async () => {
      logger.step('API Test: Response Headers Validation');
      await apiClient.verifyResponseHeaders(page);
    });
  });
});
