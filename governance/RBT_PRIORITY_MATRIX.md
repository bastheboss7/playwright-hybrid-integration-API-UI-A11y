# ⚖️ Risk-Based Testing (RBT) Priority Matrix

> **Philosophy:** "Test what matters." Allocate manual testers where critical thinking wins, and automation where repeatability scales.

This matrix is the bridge between **business priorities** and **testing resources**. It provides a data-driven framework to answer the critical question: *What should we test manually versus what should we automate?*

---

## 🎯 How to Use This Framework

1.  **Assess Features:** During sprint planning, list all new features or changes.
2.  **Calculate Risk Score:** For each feature, determine the **Business Impact** and **Failure Risk** to calculate the **Risk Score**.
3.  **Define Testing Strategy:** Use the score to assign a testing strategy (Manual, Automated, or Hybrid) based on the tables below.
4.  **Allocate Resources:** Use the **Execution Worksheet** to assign specific testing tasks and effort estimates.

---

## The Decision Framework

| Feature Area | Business Impact | Failure Risk | Risk Score | Testing Strategy | Mapped Test File(s) |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **Guest Checkout (E2E)** | 5 | 4 | 20 | **Exhaustive:** 100% automation + senior manual exploratory | features/tests/e2e-ui/e2e-guest-checkout.spec.ts |
| **Navigation & State Persistence** | 4 | 3 | 12 | **Hybrid:** Manual for new logic, automation for regression | features/tests/e2e-ui/e2e-navigation.spec.ts |
| **Product Catalog API** | 4 | 3 | 12 | **API Automation:** Contract validation + integration | features/tests/api/api-product-catalog.spec.ts |
| **Accessibility (WCAG 2.1 AA)** | 5 | 3 | 15 | **Manual + Automated:** Axe-core, keyboard nav, compliance audit | features/tests/accessibility/a11y-form-validation.spec.ts |


---

## 🧮 Risk Score to Strategy Mapping

Use this table to translate a Risk Score into a clear testing strategy. The formula is **Risk Score = Impact (1-5) × Probability (1-5)**.

| Score | Category | Strategy |
| :--- | :--- | :--- |
| **15-25** | 🔴 **Critical** | > **Exhaustive:** Combine 100% automation path coverage with senior manual exploratory testing for edge cases. |
| **8-14** | 🟡 **Medium** | > **Hybrid:** Use manual testing for new business logic and automation for regression and happy paths. |
| **1-7** | 🟢 **Low** | > **Minimal:** Rely primarily on automated smoke tests. Manual testing is on-demand only. |

---

## 🛠️ Execution Worksheet (Sprint Template)

Use this table during the **Three Amigos** or **Sprint Planning** to define the "Definition of Done" for testing, mapped to actual workspace tests.

| Feature Name | Risk Score | Logic Type | Manual Requirement | Automation Requirement | Test File(s) |
| :--- | :---: | :--- | :--- | :--- | :--- |
| Guest Checkout (E2E) | 20 | New | 2 days exploratory (edge cases, payment, error handling) | 100% path coverage (UI) | features/tests/e2e-ui/e2e-guest-checkout.spec.ts |
| Navigation & State Persistence | 12 | New | 1 day functional UI testing | Automate happy path, regression | features/tests/e2e-ui/e2e-navigation.spec.ts |
| Product Catalog API | 12 | Existing | 0.5 day contract review | API contract automation | features/tests/api/api-product-catalog.spec.ts |
| Accessibility (WCAG 2.1 AA) | 15 | New/Existing | Manual keyboard audit, screen reader spot-check | Axe-core automation, HTML validation | features/tests/accessibility/a11y-form-validation.spec.ts |

---

## 🔍 Deep Dive: Critical Logic Strategy (Score 15-25)

### 1. New Critical Logic (Discovery Focus)
> - **Mandatory:** 1x Senior Peer Review of the Test Plan.
> - **Technique:** **Negative Testing** (Invalid inputs, SQL injection attempts, concurrency checks).
> - **Exit Criteria:** 0 Open Defects of any severity.
