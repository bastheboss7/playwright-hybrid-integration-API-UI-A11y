import { Page } from '@playwright/test';
import { DemoblazeHomeLocators } from './DemoblazeHomeLocators';
import { DemoblazeProductLocators } from './DemoblazeProductLocators';
import { DemoblazeCartLocators } from './DemoblazeCartLocators';

/**
 * Locator facade for page-specific locators.
 */
export class DemoblazeLocators {
  readonly page: Page;
  readonly home: DemoblazeHomeLocators;
  readonly product: DemoblazeProductLocators;
  readonly cart: DemoblazeCartLocators;

  constructor(page: Page) {
    this.page = page;
    this.home = new DemoblazeHomeLocators(page);
    this.product = new DemoblazeProductLocators(page);
    this.cart = new DemoblazeCartLocators(page);

    Object.assign(this, this.home, this.product, this.cart);
  }
}

