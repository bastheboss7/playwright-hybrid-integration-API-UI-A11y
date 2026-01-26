# 🛠️ Automation Standards & Technical Governance

> **Purpose:** Enforce consistent, maintainable, and scalable test automation aligned with the [3-Pillar Quality Strategy](../README.md).

---

## 🎯 Strategic Context

These standards ensure:
- **Velocity:** Tests run fast and reliably in CI/CD ([< 10-min feedback loop](./QUALITY_GATES.md))
- **Maintainability:** Clear separation of concerns
- **Scalability:** Framework supports 50+ tests without redesign

---

## 🏗️ Core Automation Principles

### 1. Test Isolation & Independence

**Standard:**
- Each test must be **fully independent** and not rely on state from other tests
- Use fixtures for setup/teardown to guarantee clean state
- Follow "Clean-As-You-Go" data policy

**Implementation:**
```typescript
// ✅ GOOD: Self-contained test using fixtures
test('Complete guest checkout', async ({ demoblazeHomePage, demoblazeCartPage }) => {
  await demoblazeHomePage.goto();
  await demoblazeHomePage.addProductToCart('Samsung galaxy s6');
  // Test creates and cleans up its own state
});

// ❌ BAD: Test depends on previous test's state
test('Verify cart has items', async ({ page }) => {
  // Assumes cart already has items from previous test
  await page.goto('cart.html');
});
```

**Reference:** [Playwright Fixtures](../features/fixtures.ts)

---

### 2. Playwright Fixture Pattern (No Hooks)

**Standard:**
- Use Playwright's fixture pattern instead of traditional `beforeEach`/`afterEach` hooks
- Fixtures provide automatic setup/teardown with type-safe dependency injection
- Page objects are initialized once per test and auto-cleaned

**Implementation:**
```typescript
// filepath: features/fixtures.ts
import { test as base } from '@playwright/test';
import { DemoblazeHomePage } from './pages/DemoblazeHomePage';

type DemoblazeFixtures = {
  demoblazeHomePage: DemoblazeHomePage;
};

export const test = base.extend<DemoblazeFixtures>({
  demoblazeHomePage: async ({ page }, use) => {
    const homePage = new DemoblazeHomePage(page);
    await use(homePage); // Inject into test
    // Automatic cleanup after test
  },
});
```

**Benefits:**
- ✅ Type-safe page object injection
- ✅ No manual instantiation in tests
- ✅ Automatic cleanup
- ✅ Reusable across all specs

**Reference:** [Fixtures Implementation](../features/fixtures.ts)

---

### 3. Semantic Method Naming (Business-Focused)

**Standard:**
- Page Object methods must read like **user actions**, not technical operations
- Tests should read like English sentences
- Hide technical complexity in base layers

**Good Examples:**
```typescript
// ✅ Business-focused (reads like a user story)
await demoblazeHomePage.addProductToCart('Samsung galaxy s6');
await demoblazeCartPage.proceedToCheckout();
await demoblazeCartPage.completePurchase(orderDetails);

// ❌ Technical (exposes implementation details)
await page.click('#add-to-cart-btn');
await page.waitForSelector('.cart-modal');
await page.fill('#name', 'John');
```

**Reference:** [DemoblazeHomePage](../features/pages/DemoblazeHomePage.ts)

---

### 4. Wait Strategy & Flakiness Prevention

**Standard:**
- Use **web-first assertions** (automatic waiting)
- Avoid raw `page.waitForTimeout()`
- Use [`WaitHelper`](../features/utils/WaitHelper.ts) for custom conditions

**Implementation:**
```typescript
// ✅ GOOD: Web-first assertion (auto-waits)
await expect(page.locator('#success-message')).toBeVisible();

// ✅ GOOD: Custom condition with WaitHelper
await WaitHelper.waitForCondition(
  async () => (await page.locator('.items').count()) > 0,
  'Items to load',
  10000
);

// ❌ BAD: Hard-coded timeout (flaky)
await page.waitForTimeout(3000);
```

**Reference:** [WaitHelper Implementation](../features/utils/WaitHelper.ts)

---

### 5. Separation of Concerns (SOC)

**Standard:**
- **Tests:** Business scenarios only (no technical details)
- **Page Objects:** Business-domain interactions
- **BasePage:** Low-level Playwright operations
- **Utilities:** Stateless helper functions
- **Locators:** Element definitions (never interact)

**Layering Rules:**
```
Test Spec
    ↓ (calls semantic method)
Page Object
    ↓ (delegates low-level operations)
BasePage + Utilities
    ↓ (uses)
Locators
    ↓ (returns)
Playwright API
```


---

## 🏷️ Tagging & Test Organization

### Tag Strategy

**Required Tags:**
- `@smoke` — Critical path tests (run on PR gate)
- `@regression` — Full coverage tests (run nightly)
- `@a11y` — Accessibility compliance tests

**Implementation:**
```typescript
test('Complete guest checkout @smoke', async ({ demoblazeHomePage }) => {
  // Critical revenue path - must pass before merge
});

test('Contact form validation @regression', async ({ demoblazeHomePage }) => {
  // Important but not blocking PR merge
});
```

**CI/CD Mapping:**
- **Tier 1 (PR Gate):** `@smoke` only (< 10 mins)
- **Tier 2 (Nightly):** `@regression` + multi-browser (< 20 mins)

**Reference:** [CI/CD Pipeline](../.github/workflows/test-automation.yml)

---

## 🎨 Code Quality & Formatting

### TypeScript Standards

**Requirements:**
- ✅ Strict mode enabled ([tsconfig.json](../tsconfig.json))
- ✅ Zero TypeScript errors
- ✅ Explicit return types on public methods
- ✅ No `any` types (use proper typing)

**Example:**
```typescript
// ✅ GOOD: Proper typing
async addProductToCart(productName: string): Promise<void> {
  await this.clickProduct(productName);
  await this.handleAddToCartAlert();
}

// ❌ BAD: Implicit any
async addProductToCart(productName) {
  // Missing types
}
```

---

### Naming Conventions

| Element | Convention | Example |
| :--- | :--- | :--- |
| **Test Files** | `*.spec.ts` | `e2e-guest-checkout.spec.ts` |
| **Page Objects** | `*Page.ts` | `DemoblazeHomePage.ts` |
| **Utilities** | `*Helper.ts` | `WaitHelper.ts` |
| **Fixtures** | `fixtures.ts` | `features/fixtures.ts` |
| **Test Methods** | Descriptive sentence | `'Complete guest checkout @smoke'` |
| **POM Methods** | Business action | `addProductToCart()` |

---

## 📊 Quality Metrics & Enforcement

### Mandatory Standards

**Pre-Commit:**
- ✅ TypeScript strict mode: 0 errors
- ✅ Linting passes (ESLint)
- ✅ No `console.log` in production code

**Pre-Merge (CI/CD):**
- ✅ All `@smoke` tests pass (100%)
- ✅ No flaky tests (>98% pass rate)
- ✅ Playwright trace available for failures

**Reference:** [Quality Gates](./QUALITY_GATES.md)

---

## 🔄 Test Data Management

### Principles

1. **Synthetic Data:** Use non-PII test data only
2. **Test Isolation:** Each test creates/cleans its own data
3. **No Shared State:** Tests run in parallel without conflicts

**Example:**
```typescript
// ✅ GOOD: Test-specific data
const orderDetails = {
  name: 'Test User',
  country: 'UK',
  city: 'London',
  card: '4111111111111111',
  month: '12',
  year: '2025'
};

// ❌ BAD: Shared global data
const SHARED_USER = { name: 'GlobalUser' }; // Causes parallel test conflicts
```

---

## 🚀 CI/CD Integration

### Pipeline Standards

**Tier 1: PR Gate (@smoke)**
- **Trigger:** Pull requests to main
- **Scope:** Critical path tests only
- **Timeout:** < 10 minutes
- **Blocking:** Yes (merge blocked on failure)

**Tier 2: Nightly Regression (@regression)**
- **Trigger:** Scheduled (2 AM UTC)
- **Scope:** Full test suite + multi-browser
- **Timeout:** < 20 minutes
- **Reporting:** Slack alerts on failure

**Reference:** [CI/CD Workflow](../.github/workflows/test-automation.yml)

---

## 🎓 Golden Rules

1. **Tests read like English** — No technical implementation details
2. **PageObjects are business-focused** — Methods named after user actions
3. **BasePage is technical** — Low-level, generic, reusable
4. **Fixtures inject dependencies** — No manual `new PageObject()` in tests
5. **Web-first assertions** — Never use hard-coded waits
6. **Tag everything** — Enable strategic CI/CD execution

---

## 📚 Related Resources

- **[Quality Gates](./QUALITY_GATES.md):** Governance checkpoints
- **[ROI Model](./ROI_MODEL.md):** Business value justification
- **[Test Strategy](../TESTSTRATEGY.md):** Full assessment context

---

> **Strategic Takeaway:** Standards are not bureaucracy—they are **force multipliers**. Consistent patterns reduce cognitive load, accelerate onboarding, and make automation a strategic asset rather than technical debt.