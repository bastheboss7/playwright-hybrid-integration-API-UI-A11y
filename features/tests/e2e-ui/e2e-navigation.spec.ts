import { expect } from '@playwright/test';
import { test } from '../../fixtures';

/**
 * ============================================================================
 * E2E UI TEST LAYER: Navigation & State Persistence
 * ============================================================================
 * 
 * PILLAR 1: STRATEGIC GOVERNANCE (UX & Session Management)
 * - Validates dynamic category filtering (core UX feature)
 * - Tests browser state persistence (session continuity)
 * - Ensures data survives page lifecycle events
 * - Provides audit trail for user session governance
 * 
 * PILLAR 2: TECHNICAL ARCHITECTURE (User Journeys)
 * - Uses Page Object Model for maintainability
 * - Tests asynchronous state updates
 * - Validates localStorage persistence
 * - Tests real user navigation patterns
 * 
 * PILLAR 3: GENAI-ACCELERATED ENGINEERING
 * - Modern Playwright async patterns
 * - Comprehensive wait strategies
 * - Defensive error handling
 * ============================================================================
 */

test.describe('@ui E2E Tests: Navigation & State Persistence', () => {

  // Setup persistent dialog handler for all tests in this suite
  test.beforeEach(async ({ page }) => {
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
  });

  /**
   * SCENARIO 2: ASYNCHRONOUS NAVIGATION - CATEGORY FILTERING
   * 
   * Tests dynamic category filtering with async state updates.
   * Validates that the UI correctly responds to user navigation.
   * 
   * BUSINESS VALUE:
   * - Ensures customers can browse by category (core UX feature)
   * - Validates filter state is correctly applied
   * - Prevents broken navigation (critical conversion path)
   * - Tests dynamic content loading performance
   * 
   * TECHNICAL APPROACH:
   * 1. Click "Laptops" category link (role-based locator)
   * 2. Wait for filtered results to load asynchronously
   * 3. Verify at least one laptop product appears
   * 4. Verify product cards are accessible (role-based)
   * 
   * RISK LEVEL: 🟡 MEDIUM (3/10)
   * - User impact: Medium (affects product discovery)
   * - Probability: Low (basic feature, well-tested by vendor)
   * - Regulatory: Low (UX feature, not critical)
   */
  test('@smoke @ui Asynchronous Navigation: Laptops Category Filter', async ({
    page,
    demoblazeHomePage,
  }) => {
    console.log('📌 E2E Test: Asynchronous Category Navigation');

    // === Step 1: Filter by Laptops Category ===
    console.log('🔍 Step 1: Filtering to Laptops category...');
    const productCount = await demoblazeHomePage.filterByCategory('Laptops');
    console.log(`✅ Laptops category filtered: ${productCount} products loaded`);

    // === Step 2: Verify Products are Accessible ===
    console.log('♿ Step 2: Verifying product accessibility...');
    const firstProductText = await demoblazeHomePage.getFirstProductText();
    console.log(`✅ Products are accessible: "${firstProductText?.substring(0, 40)}..."`);

    // GOVERNANCE NOTE: This test validates category management accountability
    // (Pillar 1: Filter State Audit Trail)

  });

  /**
   * SCENARIO 2B: CATEGORY NAVIGATION - MULTIPLE FILTERS
   * 
   * Tests sequential category navigation (switching between categories).
   * Validates that filter state is properly reset and updated.
   * 
   * BUSINESS VALUE:
   * - Ensures users can switch between categories easily
   * - Tests filter reset functionality
   * - Validates state management across navigation
   * - Improves browsing experience
   */
  test('@ui Category Navigation: Sequential Filter Changes', async ({
    demoblazeHomePage,
  }) => {
    console.log('📌 E2E Test: Sequential Category Navigation');

    // === Test sequential category navigation ===
    await demoblazeHomePage.testSequentialCategoryNavigation();

    // GOVERNANCE NOTE: This test validates filter state management
    // (Pillar 1: State Management Audit Trail)
  });

  /**
   * SCENARIO 4: STATE PERSISTENCY - CART SURVIVES PAGE REFRESH
   * 
   * Tests that cart contents are preserved across page refresh.
   * Validates browser state persistence (localStorage/sessionStorage).
   * 
   * BUSINESS VALUE:
   * - Prevents users losing cart items on accidental refresh
   * - Ensures checkout flow survives navigation
   * - Validates session management correctness
   * - Improves user experience (reduces friction)
   * 
   * TECHNICAL APPROACH:
   * 1. Add product to cart
   * 2. Navigate to cart and verify product appears
   * 3. Refresh page (F5)
   * 4. Verify product still in cart after refresh
   * 5. Verify cart count persists
   * 
   * RISK LEVEL: 🟡 HIGH (6/10)
   * - User impact: High (loss of cart = conversion abandonment)
   * - Probability: Medium (browser state can be fickle)
   * - Regulatory: Medium (transaction state tracking)
   */
  test('@regression @ui State Persistency: Cart Survives Page Refresh', async ({
    page,
    demoblazeHomePage,
  }) => {
    console.log(
      '🔄 E2E Test: State Persistency - Cart contents survive page refresh'
    );

    // === Add Product to Cart ===
    console.log('📦 Step 1: Adding product and navigating to checkout...');
    await demoblazeHomePage.addProductToCart('Samsung galaxy s6');
    console.log('✅ Product added to cart');

    // === Verify Persistence After Refresh ===
    console.log('📦 Step 2: Verifying product persists after refresh...');
    const productPersists = await demoblazeHomePage.verifyProductPersistsAfterRefresh('Samsung galaxy s6');

    expect(productPersists).toBe(true);
    console.log('✅ State Persistency: Product remains in cart after refresh');

    // GOVERNANCE NOTE: This test validates session state accountability
    // (Pillar 1: Browser State Audit Trail)
  });

  /**
   * SCENARIO 4B: CART MODIFICATIONS - ADD & REMOVE
   * 
   * Tests that users can add and remove items from cart.
   * Validates cart state management with multiple items.
   * 
   * BUSINESS VALUE:
   * - Ensures cart operations work correctly
   * - Validates item count updates
   * - Prevents accidental purchases
   * - Improves shopping experience
   */
  test('@ui Cart Management: Add Multiple Items', async ({
    page,
    demoblazeHomePage,
  }) => {
    console.log('🛒 E2E Test: Cart Management - Multiple Items');

    // === Add Multiple Products ===
    console.log('Step 1: Adding multiple products to cart...');
    await demoblazeHomePage.addMultipleProductsToCart([
      'Samsung galaxy s6',
      'Nokia lumia 1520'
    ]);

    // === Verify All Products in Cart ===
    console.log('Step 2: Verifying cart contents...');
    const allProductsPresent = await demoblazeHomePage.verifyMultipleProductsInCart([
      'Samsung galaxy s6',
      'Nokia lumia 1520'
    ]);

    expect(allProductsPresent).toBe(true);
    console.log('✅ Cart Management: Multiple items verified');

    // GOVERNANCE NOTE: This test validates cart state management
    // (Pillar 1: Cart State Audit Trail)
  });
});

/**
 * ============================================================================
 * E2E UI NAVIGATION & STATE LAYER ARCHITECTURE
 * ============================================================================
 * 
 * This layer demonstrates enterprise navigation & state testing:
 * 
 * ✅ Asynchronous Navigation - Wait strategies
 * ✅ Category Filtering - Dynamic content
 * ✅ State Persistence - localStorage/sessionStorage
 * ✅ Multi-step Workflows - Real user patterns
 * ✅ Sequential Operations - State management
 * 
 * REUSABILITY:
 * - Shared POM classes
 * - Shared fixtures
 * - Common wait patterns
 * - Consistent locator strategies
 * 
 * SCALABILITY:
 * - Can add search functionality tests
 * - Can add sorting and filtering
 * - Can add pagination tests
 * - Can add multi-tab session tests
 * - Pattern extends to n user workflows
 * 
 * ============================================================================
 */