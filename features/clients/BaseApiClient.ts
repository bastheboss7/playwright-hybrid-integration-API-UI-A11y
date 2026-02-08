import { Page, APIResponse, expect } from '@playwright/test';
import { ApiConstants } from './ApiConstants';

/**
 * BaseApiClient - Generic API infrastructure layer
 * 
 * Provides reusable HTTP operations and common assertions for API testing.
 * Infrastructure-level class - no business logic.
 * Extended by domain-specific API clients (e.g., DemoblazeApiClient).
 */
export class BaseApiClient {
  constructor(public baseUrl: string) {}

  /**
   * Perform HTTP GET request
   * @param page - Playwright Page instance for request context
   * @param path - API endpoint path (e.g., '/entries')
   * @returns APIResponse object from Playwright
   */
  async fetch(page: Page, path: string): Promise<APIResponse> {
    return await page.request.get(`${this.baseUrl}${path}`);
  }

  /**
   * Fetch entries from /entries endpoint
   * Convenience method for common product catalog operations
   * @param page - Playwright Page instance for request context
   * @returns APIResponse from /entries endpoint
   */
  async fetchEntries(page: Page): Promise<APIResponse> {
    return await this.fetch(page, ApiConstants.paths.entries);
  }

  /**
   * Assert that HTTP response status is 200 OK
   * @param res - APIResponse to validate
   * @throws AssertionError if status is not 200 or response not ok
   */
  async expectStatusOk(res: APIResponse) {
    expect(res.ok()).toBe(true);
    expect(res.status()).toBe(ApiConstants.status.ok);
  }

  /**
   * Assert that JSON response contains 'Items' property and return items
   * @param res - APIResponse containing JSON with Items property
   * @returns Items array from response
   * @throws AssertionError if Items property is missing
   */
  async expectJsonHasItems(res: APIResponse) {
    const apiData = await res.json();
    expect(apiData).toHaveProperty('Items');
    return apiData.Items;
  }

  /**
   * Measure API response time for performance testing
   * @param page - Playwright Page instance for request context
   * @param path - API endpoint path to measure
   * @returns Elapsed time in milliseconds
   */
  async measureResponseTime(page: Page, path: string): Promise<number> {
    const start = Date.now();
    const res = await this.fetch(page, path);
    const elapsed = Date.now() - start;
    return elapsed;
  }

  /**
   * Assert that response Content-Type header contains 'application/json'
   * @param res - APIResponse to validate headers
   * @throws AssertionError if Content-Type is not JSON
   */
  async expectHeaderContentTypeJson(res: APIResponse) {
    const contentType = res.headers()['content-type'] || '';
    expect(contentType).toContain(ApiConstants.headers.jsonContentType);
  }
}

export default BaseApiClient;
