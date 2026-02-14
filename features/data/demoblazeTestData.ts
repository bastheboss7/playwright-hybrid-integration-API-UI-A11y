/**
 * Centralized test data facade for demoblaze.com.
 */

import { products, categories } from './homeData';
import { checkoutData, CheckoutFormData } from './cartData';
import { contactFormData } from './contactData';
import { authData } from './authData';

export { products, categories, checkoutData, contactFormData, authData };
export type { CheckoutFormData };

export class DemoblazeTestDataFacade {
  readonly home = { products, categories };
  readonly cart = { checkoutData };
  readonly contact = { contactFormData };
  readonly auth = { authData };
}

export const testData = new DemoblazeTestDataFacade();

