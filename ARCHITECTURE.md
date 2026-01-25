# QA Architecture - Separation of Concerns (SOC)

## 🏗️ Architecture Overview

This framework follows **Enterprise Test Architecture** with clear separation between:
- **Base Classes** (Infrastructure)
- **Utilities** (Cross-cutting concerns)
- **Page Objects** (Business domain)
- **Fixtures** (Dependency Injection)
- **Locators** (Element strategy)
- **Test Specs** (Behavior verification)

---

## 📐 Layer Responsibilities

### 1️⃣ **Base Classes** (`features/pages/Base*.ts`)

**Purpose:** Provide **generic, reusable infrastructure** for all page objects.

**Responsibilities:**
- ✅ Low-level Playwright API wrappers
- ✅ Common element interactions (click, getText, isVisible)
- ✅ Wait strategies (waitForLoad, wait)
- ✅ Generic logging/reporting helpers
- ✅ Cross-cutting technical concerns

**What Base Classes Should NOT Do:**
- ❌ Business logic
- ❌ Domain-specific validations
- ❌ Application-aware operations
- ❌ Test assertions (except infrastructure-level)

**Example:**
```typescript
// ✅ GOOD - Generic, reusable
async click(locator: Locator): Promise<void>
async getText(locator: Locator): Promise<string | null>
async waitForLoad(): Promise<void>

// ❌ BAD - Business-specific
async addProductToCart(productName: string)
async verifyCheckoutSuccess()
```

---

### 2️⃣ **Utilities** (`features/utils/*.ts`)

**Purpose:** Provide **specialized, stateless helpers** for specific technical concerns.

**Responsibilities:**
- ✅ Accessibility scanning (AxeBuilder integration)
- ✅ Alert/dialog handling
- ✅ API operations (standalone, not page-bound)
- ✅ Data generators/parsers
- ✅ Date/time utilities
- ✅ File I/O operations
- ✅ Retry mechanisms

**What Utilities Should NOT Do:**
- ❌ Page-specific navigation
- ❌ Stateful operations (should be pure/functional)
- ❌ Direct DOM manipulation (should delegate to BasePage)

**Key Difference from Base Classes:**
- **Base Classes:** Object-oriented, stateful, inheritance-based
- **Utilities:** Functional, stateless, composition-based

**Example:**
```typescript
// ✅ GOOD - Stateless, reusable utility
export class AlertHandler {
  static async captureAlert(page: Page): Promise<string>
}

export class AccessibilityAudit {
  async auditPage(context: string): Promise<AuditResult>
}

// ❌ BAD - Should be in BasePage or PageObject
class NavigationHelper {
  async navigateToHomePage()
}
```

---

### 3️⃣ **Page Objects** (`features/pages/*Page.ts`)

**Purpose:** Encapsulate **business-domain interactions** for specific pages/modules.

**Responsibilities:**
- ✅ High-level business operations (addProductToCart, completePurchase)
- ✅ Domain-specific validations (verifyPurchaseSuccess, verifyCartItem)
- ✅ Workflow orchestration (addProductAndNavigateToCheckout)
- ✅ Business assertions
- ✅ Semantic method names that read like user stories

**What Page Objects Should NOT Do:**
- ❌ Low-level Playwright calls (delegate to BasePage)
- ❌ Generic click/wait logic (use BasePage utilities)
- ❌ Alert handling (delegate to AlertHandler)
- ❌ Accessibility scanning (delegate to AccessibilityAudit)

**Inheritance Pattern:**
```typescript
export class DemoblazeHomePage extends BasePage {
  // ✅ Semantic business methods
  async addProductToCart(productName: string) {
    await this.clickProduct(productName);
    await this.click(this.locators.addToCartButton); // Uses BasePage.click
  }
}
```

---

### 4️⃣ **Locators** (`features/locators/*.ts`)

**Purpose:** Single source of truth for **element location strategies**.

**Responsibilities:**
- ✅ Centralized selector definitions
- ✅ Accessibility-first locator patterns (getByRole, getByLabel)
- ✅ Dynamic locator helpers (getProductByName)
- ✅ Selector documentation

**What Locators Should NOT Do:**
- ❌ Element interaction (no .click(), .fill())
- ❌ Assertions
- ❌ Business logic

---

### 5️⃣ **Fixtures** (`features/fixtures.ts`)

**Purpose:** **Dependency injection** container for test components.

**Responsibilities:**
- ✅ Page object instantiation
- ✅ Setup/teardown orchestration
- ✅ Shared test state management
- ✅ Type-safe fixture injection

**What Fixtures Should NOT Do:**
- ❌ Business logic
- ❌ Test assertions
- ❌ Complex initialization logic (delegate to page constructors)

---

### 6️⃣ **Test Specs** (`features/tests/**/*.spec.ts`)

**Purpose:** Define **executable business requirements** and **acceptance criteria**.

**Responsibilities:**
- ✅ Business-only test narratives
- ✅ High-level expectations (expect statements)
- ✅ Test data management
- ✅ Test lifecycle (describe/it blocks)

**What Test Specs Should NOT Do:**
- ❌ Direct Playwright API calls
- ❌ Locator references (page.locator(), page.getByRole())
- ❌ Implementation details (CSS selectors, waits)
- ❌ Low-level DOM interactions

---

## 🔄 Interaction Flow

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

## 📋 Current Issues & Recommendations

### ❌ **Issue 1: Duplication Between `ApiClient` and `BaseApiClient`**

**Problem:**
- Both classes have similar methods (fetchEntries, expectStatusOk)
- Unclear which to use
- Violates DRY principle

**Recommendation:**
```typescript
// DELETE: ApiClient.ts (merge into BaseApiClient or create inheritance)

// REFACTOR:
export class BaseApiClient {
  // Generic API operations
  async fetch(page: Page, path: string): Promise<APIResponse>
  async expectStatusOk(res: APIResponse): Promise<void>
}

export class DemoblazeApiClient extends BaseApiClient {
  // Business-specific API operations
  async verifyProductCatalog(page: Page): Promise<void>
  async verifyResponseTime(page: Page): Promise<void>
}
```

---

### ❌ **Issue 2: Accessibility Logging in `BasePage`**

**Problem:**
- `logAccessibilityAuditResults()` method is in BasePage
- Should be in `AccessibilityAudit` utility
- BasePage should focus on element interactions, not domain-specific logging

**Recommendation:**
```typescript
// MOVE FROM: BasePage.ts
// MOVE TO: AccessibilityAudit.ts

export class AccessibilityAudit {
  // ... existing methods ...
  
  logAuditResults(results: any, scope: string = 'Page'): void {
    // Current implementation from BasePage
  }
}

// PAGE OBJECT USAGE:
const audit = new AccessibilityAudit(this.page);
const results = await audit.auditPage('Home Page');
audit.logAuditResults(results, 'Home Page');
```

---

### ❌ **Issue 3: Missing Utility for Common Waits**

**Problem:**
- Page objects still use `page.waitForTimeout()` directly
- No centralized retry/polling strategy

**Recommendation:**
```typescript
// CREATE: features/utils/WaitHelper.ts

export class WaitHelper {
  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeoutMs: number = 5000,
    pollIntervalMs: number = 100
  ): Promise<void> {
    // Polling implementation
  }

  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    // Retry implementation
  }
}
```

---

### ❌ **Issue 4: BasePage Has Too Many Responsibilities**

**Problem:**
- Currently 7 methods covering: clicks, waits, getText, accessibility
- Will grow unbounded as more helpers are added

**Recommendation:**
Split BasePage into focused concerns:

```typescript
// BASE INTERACTION LAYER
export class BasePage {
  readonly page: Page;
  constructor(page: Page) { this.page = page; }
}

// ELEMENT INTERACTION MIXIN
export class ElementInteractions extends BasePage {
  async click(locator: Locator): Promise<void>
  async getText(locator: Locator): Promise<string | null>
  async isVisible(locator: Locator): Promise<boolean>
  async fill(locator: Locator, text: string): Promise<void>
}

// NAVIGATION MIXIN
export class NavigationHelpers extends BasePage {
  async waitForLoad(): Promise<void>
  async reload(): Promise<void>
  async goBack(): Promise<void>
}

// PAGE OBJECTS COMPOSE:
export class DemoblazeHomePage extends ElementInteractions {
  // Inherits click, getText, isVisible
}
```

---

## ✅ Refactoring Checklist

### High Priority
- [ ] Merge `ApiClient` and `BaseApiClient` (eliminate duplication)
- [ ] Move `logAccessibilityAuditResults` from `BasePage` to `AccessibilityAudit`
- [ ] Create `WaitHelper` utility for polling/retry logic
- [ ] Remove direct `page.waitForTimeout()` calls from page objects

### Medium Priority
- [ ] Split `BasePage` into focused mixins (ElementInteractions, Navigation)
- [ ] Add `FormHelper` utility for common form operations
- [ ] Create `ValidationHelper` for assertion patterns

### Low Priority
- [ ] Add JSDoc to all Base/Utility classes
- [ ] Create unit tests for utilities
- [ ] Add performance monitoring utility

---

## 📚 Quick Reference

| Layer | Focus | Stateful? | Inheritance? |
|-------|-------|-----------|--------------|
| **BasePage** | Generic Playwright wrappers | Yes (Page instance) | Extended by PageObjects |
| **Utilities** | Specialized helpers | No (stateless) | Used via composition |
| **PageObjects** | Business domain | Yes (Page instance) | Extends BasePage |
| **Locators** | Element strategy | No | Used by PageObjects |
| **Fixtures** | DI container | Yes (test context) | Extended from base.test |
| **Test Specs** | Behavior verification | No | Uses fixtures |

---

## 🎯 Golden Rules

1. **Specs should read like English** - No technical implementation details
2. **PageObjects are business-focused** - Methods named after user actions
3. **BasePage is technical** - Low-level, generic, reusable
4. **Utilities are stateless** - Pure functions with no side effects
5. **Locators never interact** - They only locate, never click/fill
6. **Fixtures inject dependencies** - No manual new PageObject() in tests

---

**Next Step:** Apply refactoring recommendations to achieve clean SOC architecture.
