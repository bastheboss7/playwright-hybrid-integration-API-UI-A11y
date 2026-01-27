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

// ============================================================================
// Product Data
// ============================================================================
export const products = {
  samsungGalaxyS6: 'Samsung galaxy s6',
  macbookAir: 'MacBook Air',
  nokiaLumia1520: 'Nokia lumia 1520',
  nexus6: 'Nexus 6',
  iphone6: 'Iphone 6 32gb'
} as const;

// ============================================================================
// Category Data
// ============================================================================
export const categories = {
  phones: 'Phones',
  laptops: 'Laptops',
  monitors: 'Monitors'
} as const;

// ============================================================================
// Guest Checkout Form Data
// ============================================================================
export interface CheckoutFormData {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
}

export const checkoutData = {
  validOrder: {
    name: 'Test User',
    country: 'United Kingdom',
    city: 'London',
    creditCard: '4111111111111111',
    month: '12',
    year: '2025'
  },
  emptyOrder: {
    name: '',
    country: '',
    city: '',
    creditCard: '',
    month: '',
    year: ''
  },
  internationalOrder: {
    name: 'John Doe',
    country: 'United States',
    city: 'New York',
    creditCard: '4532015112830366',
    month: '12',
    year: '2026'
  }
} as const;

// ============================================================================
// Contact Form Data
// ============================================================================
export const contactFormData = {
  email: 'automation@test.com',
  name: 'Test Automation',
  message: 'This is an automated test contact message'
} as const;

// ============================================================================
// Login/Auth Data (for negative testing)
// ============================================================================
export const authData = {
  invalidUsername: 'invalid_user_12345',
  invalidPassword: 'wrong_password_xyz'
} as const;

// ============================================================================
// Legacy Interface (for backward compatibility)
// ============================================================================
export interface DemoblazeTestData {
  // Product Data
  samsungGalaxyS6: string;
  macbookAir: string;
  
  // Login Data
  invalidUsername: string;
  invalidPassword: string;
  
  // Contact Form Data
  contactEmail: string;
  contactName: string;
  contactMessage: string;
  
  // Order Data
  orderName: string;
  orderCountry: string;
  orderCity: string;
  orderCreditCard: string;
  orderMonth: string;
  orderYear: string;
}

/**
 * @deprecated Use named exports (products, categories, checkoutData, etc.) instead.
 * This legacy object is maintained for backward compatibility.
 */
export const demoblazeTestData: DemoblazeTestData = {
  // Product Data
  samsungGalaxyS6: products.samsungGalaxyS6,
  macbookAir: products.macbookAir,
  
  // Login Data - intentionally invalid for negative testing
  invalidUsername: authData.invalidUsername,
  invalidPassword: authData.invalidPassword,
  
  // Contact Form Data - mock data
  contactEmail: contactFormData.email,
  contactName: contactFormData.name,
  contactMessage: contactFormData.message,
  
  // Order Data - mock data for purchase simulation
  orderName: checkoutData.internationalOrder.name,
  orderCountry: checkoutData.internationalOrder.country,
  orderCity: checkoutData.internationalOrder.city,
  orderCreditCard: checkoutData.internationalOrder.creditCard,
  orderMonth: checkoutData.internationalOrder.month,
  orderYear: checkoutData.internationalOrder.year
};

// Backward compatibility export
export const productCategories = categories;
