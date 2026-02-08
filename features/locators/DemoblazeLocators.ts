import { Page } from '@playwright/test';
import { DemoblazeHomeLocators } from './DemoblazeHomeLocators';
import { DemoblazeProductLocators } from './DemoblazeProductLocators';
import { DemoblazeCartLocators } from './DemoblazeCartLocators';

/**
 * DemoblazeLocators - Accessibility-First Locator Facade
 * 
 * Refactored to use Playwright's role-based locators following accessibility best practices:
 * - Prioritize getByRole() for semantic elements (buttons, links, headings)
 * - Use getByLabel() for form inputs
 * - Filter by content when multiple elements share the same role
 * - Avoid fragile CSS selectors, XPath, and position-based locators
 * 
 * Benefits:
 * ✅ Self-documenting code (clear intent)
 * ✅ Robust to HTML structure changes
 * ✅ Mirrors real user interaction
 * ✅ Accessibility-compliant
 * ✅ Easier to maintain and debug
 * 
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

    // Backward-compatible facade: expose page-specific locators on this instance
    Object.assign(this, this.home, this.product, this.cart);
  }
}

