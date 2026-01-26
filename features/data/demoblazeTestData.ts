/**
 * Demoblaze Test Data
 * 
 * Centralized, typed test data for demoblaze.com automation.
 * Data is source-controlled and deterministic for reliable test execution.
 */

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

export const demoblazeTestData: DemoblazeTestData = {
  // Product Data
  samsungGalaxyS6: 'Samsung galaxy s6',
  macbookAir: 'MacBook Air',
  
  // Login Data - intentionally invalid for negative testing
  invalidUsername: 'invalid_user_12345',
  invalidPassword: 'wrong_password_xyz',
  
  // Contact Form Data - mock data
  contactEmail: 'automation@test.com',
  contactName: 'Test Automation',
  contactMessage: 'This is an automated test contact message',
  
  // Order Data - mock data for purchase simulation
  orderName: 'John Doe',
  orderCountry: 'United States',
  orderCity: 'New York',
  orderCreditCard: '4532015112830366',
  orderMonth: '12',
  orderYear: '2026'
};

export const productCategories = {
  phones: 'Phones',
  laptops: 'Laptops',
  monitors: 'Monitors'
};
