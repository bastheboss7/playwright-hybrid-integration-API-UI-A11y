import { Page, Locator } from '@playwright/test';

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
 * Reference: ACCESSIBILITY_FIRST_LOCATORS_GUIDE.md
 */
export class DemoblazeLocators {
  readonly page: Page;

  // ============================================================================
  // NAVIGATION & CATEGORIES - Role: Link
  // ============================================================================
  readonly phonesCategory: Locator;
  readonly laptopsCategory: Locator;
  readonly monitorsCategory: Locator;
  readonly homeLink: Locator;

  // ============================================================================
  // PRODUCT LISTING
  // ============================================================================
  readonly productItems: Locator;
  readonly productTitles: Locator;

  // ============================================================================
  // LOGIN MODAL - Role: Link (trigger) + Role: Button (actions) + Label (inputs)
  // ============================================================================
  readonly loginLink: Locator;
  readonly loginModal: Locator;
  readonly loginUsername: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly loginModalClose: Locator;

  // ============================================================================
  // CONTACT MODAL - Role: Link (trigger) + Role: Button (actions) + Label (inputs)
  // ============================================================================
  readonly contactLink: Locator;
  readonly contactModal: Locator;
  readonly contactEmail: Locator;
  readonly contactName: Locator;
  readonly contactMessage: Locator;
  readonly contactSendButton: Locator;
  readonly contactModalClose: Locator;

  // ============================================================================
  // PRODUCT DETAIL PAGE
  // ============================================================================
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly addToCartButton: Locator;

  // ============================================================================
  // CART
  // ============================================================================
  readonly cartLink: Locator;
  readonly cartItems: Locator;
  readonly cartTable: Locator;
  readonly totalPrice: Locator;
  readonly deleteButtons: Locator;
  readonly placeOrderButton: Locator;

  // ============================================================================
  // ORDER MODAL - Role: Dialog + Label (form inputs) + Role: Button (actions)
  // ============================================================================
  readonly orderModal: Locator;
  readonly orderName: Locator;
  readonly orderCountry: Locator;
  readonly orderCity: Locator;
  readonly orderCreditCard: Locator;
  readonly orderMonth: Locator;
  readonly orderYear: Locator;
  readonly purchaseButton: Locator;
  readonly orderModalClose: Locator;

  // ============================================================================
  // ALERTS & MESSAGES
  // ============================================================================
  readonly alertBox: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // ========================================================================
    // NAVIGATION & CATEGORIES - Using getByRole('link')
    // ========================================================================
    // Semantic: Use link roles for navigation items
    // Fallback: ID-based for unlabeled nav elements
    this.phonesCategory = page.getByRole('link', { name: /Phones/i });
    this.laptopsCategory = page.getByRole('link', { name: /Laptops/i });
    this.monitorsCategory = page.getByRole('link', { name: /Monitors/i });
    // Home link uses brand ID (no accessible text alternative)
    this.homeLink = page.locator('#nbarBrand');

    // ========================================================================
    // PRODUCT LISTING
    // ========================================================================
    // Product items container (no role, CSS selector acceptable here)
    this.productItems = page.locator('.hrefch');
    // Product titles are headings/content
    this.productTitles = page.locator('.card-title');

    // ========================================================================
    // LOGIN MODAL
    // ========================================================================
    // Trigger: "Login" link (getByRole - semantic)
    this.loginLink = page.getByRole('link', { name: /Login/i });
    // Modal container (ID-based, standard pattern)
    this.loginModal = page.locator('#logInModal');
    // Form inputs: Use getByLabel() for accessibility compliance
    // Fallback: ID-based if labels not present in HTML
    this.loginUsername = page.getByLabel('Username').or(page.locator('#loginusername'));
    this.loginPassword = page.getByLabel('Password').or(page.locator('#loginpassword'));
    // Action: "Log in" button (getByRole - semantic)
    this.loginButton = page.getByRole('button', { name: /Log in/i });
    // Close button: Use aria-label or close icon (fallback to CSS)
    this.loginModalClose = page.locator('#logInModal .close');

    // ========================================================================
    // CONTACT MODAL
    // ========================================================================
    // Trigger: "Contact" link (getByRole - semantic)
    this.contactLink = page.getByRole('link', { name: /Contact/i });
    // Modal container (ID-based)
    this.contactModal = page.locator('#exampleModal');
    // Form inputs: Prefer getByLabel() for semantic form handling
    this.contactEmail = page.getByLabel('Recipient email').or(page.locator('#recipient-email'));
    this.contactName = page.getByLabel('Recipient name').or(page.locator('#recipient-name'));
    this.contactMessage = page.getByLabel('Message').or(page.locator('#message-text'));
    // Action: "Send message" button (getByRole - semantic)
    this.contactSendButton = page.getByRole('button', { name: /Send message/i });
    // Close button: Use aria-label or close icon (fallback to CSS)
    this.contactModalClose = page.locator('#exampleModal .close');

    // ========================================================================
    // PRODUCT DETAIL PAGE
    // ========================================================================
    // Title: Heading element (getByRole - semantic)
    this.productTitle = page.getByRole('heading', { level: 2 }).or(page.locator('h2'));
    // Price: Content-based (CSS acceptable, semantic text would be better)
    this.productPrice = page.locator('.price');
    // Description: Content container (CSS acceptable)
    this.productDescription = page.locator('.product-description');
    // Action: "Add to cart" button (getByRole - semantic)
    this.addToCartButton = page.getByRole('link', { name: 'Add to cart' });

    // ========================================================================
    // CART
    // ========================================================================
    // Trigger: "Cart" link (getByRole - semantic)
    this.cartLink = page.getByRole('link', { name: 'Cart', exact: true })
    // Table rows (data container, CSS acceptable)
    this.cartItems = page.locator('tr');
    // Table (structural, CSS acceptable)
    this.cartTable = page.locator('table');
    // Total price display (content-based, CSS acceptable)
    this.totalPrice = page.locator('h3 strong');
    // Delete actions: "Delete" buttons (getByRole - semantic)
    // Filter to ensure we get the right delete button if multiple exist
    this.deleteButtons = page.getByRole('button', { name: /Delete/i });
    // Action: "Place Order" button (getByRole - semantic)
    this.placeOrderButton = page.getByRole('button', { name: /Place Order/i });

    // ========================================================================
    // ORDER MODAL - Place Order Form
    // ========================================================================
    // Modal container (ID-based, standard pattern)
    this.orderModal = page.locator('#orderModal');

    // Form inputs: Use getByLabel() for accessibility
    // Fallback to ID-based if labels not properly associated
    this.orderName = page.getByRole('textbox', { name: 'Total: 360 Name:' });
    this.orderCountry = page.getByRole('textbox', { name: 'Country:' });
    this.orderCity = page.getByRole('textbox', { name: 'City:' });
    this.orderCreditCard = page.getByRole('textbox', { name: 'Credit card' });
    this.orderMonth = page.getByRole('textbox', { name: 'Month' });
    this.orderYear = page.getByRole('textbox', { name: 'Year' });

    // Action: "Purchase" button (getByRole - semantic)
    this.purchaseButton = page.getByRole('button', { name: /Purchase/i });
    // Close button: Use aria-label or close icon (fallback to CSS)
    this.orderModalClose = page.locator('#orderModal .close');

    // ========================================================================
    // ALERTS & MESSAGES
    // ========================================================================
    // Alert messages (content-based, CSS acceptable for temporary alerts)
    this.alertBox = page.locator('.sweet-alert');
    this.successMessage = page.locator('.sweet-alert');
  }
}

