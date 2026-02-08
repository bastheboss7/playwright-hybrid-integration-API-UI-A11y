import { Page, expect } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { ApiConstants } from './ApiConstants';

/**
 * DemoblazeApiClient - Business-specific API validation for demoblaze.com
 * 
 * Extends BaseApiClient to inherit generic HTTP operations
 * Adds domain-specific validation methods
 * Maintains SOC: BaseApiClient = infrastructure, DemoblazeApiClient = business domain
 */
export class DemoblazeApiClient extends BaseApiClient {
  private static readonly DEFAULT_RESPONSE_TIME_LIMIT_MS = ApiConstants.limits.defaultResponseTimeMs;

  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * Verify product catalog structure and content
   * 
   * Business validation for product API:
   * - Status 200 OK
   * - Valid JSON schema with 'Items' property
   * - Array of products with required fields (title, price, id)
   * - Correct data types (string, number)
   * - Sample product validation (Samsung exists with valid price)
   * 
   * @param page - Playwright Page instance for request context
   * @throws AssertionError if any validation fails
   */
  async verifyProductCatalog(page: Page): Promise<void> {
    const res = await this.fetchEntries(page);
    await this.expectStatusOk(res);

    const apiData = await res.json();
    expect(apiData).toHaveProperty('Items');
    const products = apiData.Items;

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    const requiredFields = ['title', 'price', 'id'];
    products.forEach((product: any) => {
      requiredFields.forEach((field) => expect(product).toHaveProperty(field));
      expect(typeof product.title).toBe('string');
      expect(typeof product.price).toBe('number');
      expect(typeof product.id).toBe('number');
    });

    const samsungProduct = products.find((p: any) => p.title.toLowerCase().includes('samsung'));
    expect(samsungProduct).toBeDefined();
    expect(samsungProduct.price).toBeGreaterThan(0);
  }

  /**
   * Verify API response time meets SLA requirements
   * 
   * Measures elapsed time from request to response and validates against limit.
   * Default SLA: 2000ms (2 seconds)
   * 
   * @param page - Playwright Page instance for request context
   * @param limitMs - Maximum acceptable response time in milliseconds (default: 2000)
   * @throws AssertionError if response time exceeds limit
   */
  async verifyResponseTime(page: Page, limitMs = DemoblazeApiClient.DEFAULT_RESPONSE_TIME_LIMIT_MS): Promise<void> {
    const elapsed = await this.measureResponseTime(page, ApiConstants.paths.entries);
    expect(elapsed).toBeLessThan(limitMs);
  }

  /**
   * Verify invalid endpoint returns proper HTTP error code
   * 
   * Tests API error handling by requesting non-existent endpoint.
   * Validates that API returns 4xx error codes (404, 400, or 405).
   * Ensures API doesn't leak internal errors (e.g., 500).
   * 
   * @param page - Playwright Page instance for request context
   * @throws AssertionError if response is 200 or not in expected error range
   */
  async verifyInvalidEndpointError(page: Page): Promise<void> {
    const res = await page.request.get(`${this.baseUrl}${ApiConstants.paths.invalidEndpoint}`, { ignoreHTTPSErrors: true });
    expect(res.status()).not.toBe(200);
    expect(ApiConstants.status.validErrorStatuses).toContain(res.status());
  }

  /**
   * Verify response headers and payload size constraints
   * 
   * Validates:
   * - Content-Type header is 'application/json'
   * - HTTP status is 200 OK
   * - Response size is under 1MB (prevents excessive payloads)
   * 
   * @param page - Playwright Page instance for request context
   * @throws AssertionError if headers invalid or payload too large
   */
  async verifyResponseHeaders(page: Page): Promise<void> {
    const res = await this.fetchEntries(page);
    await this.expectHeaderContentTypeJson(res);
    await this.expectStatusOk(res);

    const body = await res.text();
    const responseSize = Buffer.byteLength(body, 'utf8');
    expect(responseSize).toBeLessThan(ApiConstants.limits.maxResponseBytes);
  }
}

export default DemoblazeApiClient;
