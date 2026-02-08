/**
 * Demoblaze Test Data
 * 
 * Centralized, typed test data for demoblaze.com automation.
 * Data is source-controlled and deterministic for reliable test execution.
 * 
 * ENTERPRISE STANDARD: All test data should be defined here, not hardcoded in tests.
 * Benefits:
 * - Single source of truth for test data
 * - Easy environment-specific overrides
 * - Type-safe data access
 * - Maintainability and reusability
 */

import { products, categories } from './homeData';
import { checkoutData, CheckoutFormData } from './cartData';
import { contactFormData } from './contactData';
import { authData } from './authData';

export { products, categories, checkoutData, contactFormData, authData };
export type { CheckoutFormData };

// ============================================================================
// Test Data Facade (Enterprise pattern)
// ============================================================================
export class DemoblazeTestDataFacade {
  readonly home = { products, categories };
  readonly cart = { checkoutData };
  readonly contact = { contactFormData };
  readonly auth = { authData };
}

export const testData = new DemoblazeTestDataFacade();

