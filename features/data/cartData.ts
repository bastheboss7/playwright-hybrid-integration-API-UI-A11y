/**
 * Cart/Checkout Test Data
 */
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

export default { checkoutData };
