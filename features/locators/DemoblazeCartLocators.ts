import { Page, Locator } from '@playwright/test';

/**
 * DemoblazeCartLocators - Cart & Checkout Locators
 */
export class DemoblazeCartLocators {
  readonly page: Page;

  // NAVIGATION
  readonly homeLink: Locator;

  // CART
  readonly cartItems: Locator;
  readonly cartTable: Locator;
  readonly totalPrice: Locator;
  readonly deleteButtons: Locator;
  readonly placeOrderButton: Locator;

  // ORDER MODAL
  readonly orderModal: Locator;
  readonly orderName: Locator;
  readonly orderCountry: Locator;
  readonly orderCity: Locator;
  readonly orderCreditCard: Locator;
  readonly orderMonth: Locator;
  readonly orderYear: Locator;
  readonly purchaseButton: Locator;
  readonly orderModalClose: Locator;

  // ALERTS & MESSAGES
  readonly alertBox: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // NAVIGATION
    this.homeLink = page.locator('#nbarBrand');

    // CART
    this.cartItems = page.locator('tr');
    this.cartTable = page.locator('table');
    this.totalPrice = page.locator('h3 strong');
    this.deleteButtons = page.getByRole('button', { name: /Delete/i });
    this.placeOrderButton = page.getByRole('button', { name: /Place Order/i });

    // ORDER MODAL
    this.orderModal = page.locator('#orderModal');
    this.orderName = page.getByLabel(/Name/i).or(page.locator('#name'));
    this.orderCountry = page.getByLabel(/Country/i).or(page.locator('#country'));
    this.orderCity = page.getByLabel(/City/i).or(page.locator('#city'));
    this.orderCreditCard = page.getByLabel(/Credit card/i).or(page.locator('#card'));
    this.orderMonth = page.getByLabel(/Month/i).or(page.locator('#month'));
    this.orderYear = page.getByLabel(/Year/i).or(page.locator('#year'));
    this.purchaseButton = page.getByRole('button', { name: /Purchase/i });
    this.orderModalClose = page.locator('#orderModal .close');

    // ALERTS & MESSAGES
    this.alertBox = page.locator('.sweet-alert');
    this.successMessage = page.locator('.sweet-alert');
  }
}

export default DemoblazeCartLocators;
