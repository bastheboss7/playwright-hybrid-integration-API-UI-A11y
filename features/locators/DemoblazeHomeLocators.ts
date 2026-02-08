import { Page, Locator } from '@playwright/test';

/**
 * DemoblazeHomeLocators - Home/Listings Page Locators
 * 
 * Scope: Home page interactions (navigation, listings, login/contact modals)
 * Accessibility-first: role/label based locators where possible.
 */
export class DemoblazeHomeLocators {
  readonly page: Page;

  // NAVIGATION & CATEGORIES
  readonly phonesCategory: Locator;
  readonly laptopsCategory: Locator;
  readonly monitorsCategory: Locator;
  readonly homeLink: Locator;
  readonly cartLink: Locator;

  // PRODUCT LISTING
  readonly productItems: Locator;
  readonly productTitles: Locator;

  // LOGIN MODAL
  readonly loginLink: Locator;
  readonly loginModal: Locator;
  readonly loginUsername: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly loginModalClose: Locator;

  // CONTACT MODAL
  readonly contactLink: Locator;
  readonly contactModal: Locator;
  readonly contactEmail: Locator;
  readonly contactName: Locator;
  readonly contactMessage: Locator;
  readonly contactSendButton: Locator;
  readonly contactModalClose: Locator;

  // PRODUCT DETAIL (used by HomePage workflows)
  readonly addToCartButton: Locator;

  // ALERTS
  readonly alertBox: Locator;

  constructor(page: Page) {
    this.page = page;

    // NAVIGATION & CATEGORIES
    this.phonesCategory = page.getByRole('link', { name: /Phones/i });
    this.laptopsCategory = page.getByRole('link', { name: /Laptops/i });
    this.monitorsCategory = page.getByRole('link', { name: /Monitors/i });
    this.homeLink = page.locator('#nbarBrand');
    this.cartLink = page.getByRole('link', { name: 'Cart', exact: true });

    // PRODUCT LISTING
    this.productItems = page.locator('.hrefch');
    this.productTitles = page.locator('.card-title');

    // LOGIN MODAL
    this.loginLink = page.getByRole('link', { name: /Login/i });
    this.loginModal = page.locator('#logInModal');
    this.loginUsername = page.getByLabel('Username').or(page.locator('#loginusername'));
    this.loginPassword = page.getByLabel('Password').or(page.locator('#loginpassword'));
    this.loginButton = page.getByRole('button', { name: /Log in/i });
    this.loginModalClose = page.locator('#logInModal .close');

    // CONTACT MODAL
    this.contactLink = page.getByRole('link', { name: /Contact/i });
    this.contactModal = page.locator('#exampleModal');
    this.contactEmail = page.getByLabel('Recipient email').or(page.locator('#recipient-email'));
    this.contactName = page.getByLabel('Recipient name').or(page.locator('#recipient-name'));
    this.contactMessage = page.getByLabel('Message').or(page.locator('#message-text'));
    this.contactSendButton = page.getByRole('button', { name: /Send message/i });
    this.contactModalClose = page.locator('#exampleModal .close');

    // PRODUCT DETAIL (workflow from home to product)
    this.addToCartButton = page.getByRole('link', { name: 'Add to cart' });

    // ALERTS
    this.alertBox = page.locator('.sweet-alert');
  }
}

export default DemoblazeHomeLocators;
