# 🎭 Playwright WebUI Automation Framework
### High-Performance Cross-Browser Testing Ecosystem

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen?style=for-the-badge)
---

## Overview
This is an enterprise-grade, scalable UI/Functional test automation framework built with [Playwright Test Runner](https://playwright.dev/) and TypeScript. The framework is designed for testing Evri's parcel delivery services with focus on reliability, maintainability, and comprehensive test coverage.

## Key Features
- **TypeScript** for type safety and enhanced developer experience
- **Playwright Test Runner** for fast, reliable, cross-browser automation
- **Enterprise Standards**: Robust configuration with CI/CD optimization
- **Multi-browser Support**: Chrome, Firefox, Safari, and mobile devices
- **Comprehensive Reporting**: HTML reports with trace, video, and screenshot capture
- **Scalable Architecture**: Organized test structure for easy expansion

---

## Project Structure
```
Playwright/
├── features/
│   ├── pages/                   # Page Object Model classes
│   │   ├── HomePage.ts
│   │   ├── DeliveryOptionsPage.ts
│   │   ├── ProhibitedItemsPage.ts
│   │   └── ParcelShopPage.ts
│   ├── data/
│   │   └── testData.ts          # Centralized test data with TypeScript interface
│   ├── fixtures.ts              # Playwright test fixtures for DI
│   ├── evri-smoke.spec.ts       # Smoke test - end-to-end validation
│   └── evri-prohibited-items.spec.ts  # Prohibited items validation
├── playwright-report/           # HTML test reports
├── test-results/                # Test execution results
├── .env                         # Environment variables (multi-env config)
├── playwright.config.ts         # Playwright configuration (env-driven)
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## Test Scenarios

### Smoke Test (`evri-smoke.spec.ts`)
- **End-to-end validation**: Single consolidated test covering:
  - Homepage loads with booking form visible
  - Parcel booking form fills correctly (postcodes, weight selection)
  - ParcelShop finder page accessible and responsive

### Prohibited Items Tests (`evri-prohibited-items.spec.ts`)
- **Prohibited items validation**: Validates business rules preventing prohibited items
- **Delivery options flow**: Tests multi-step booking workflow
- **Form validation**: Verifies error states and disabled states

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### 1. Install Dependencies
```sh
npm install
npm run install:browsers
```

### 2. Run Tests
```sh
# Clean and run all tests (equivalent to mvn clean test)
npm run clean:test

# Run all tests
npm test

# Clean test artifacts
npm run clean

# Run in headed mode (see browser)
npm run test:headed

# Run specific browser
npm run test:chrome
npm run test:firefox
npm run test:safari

# Run mobile tests
npm run test:mobile

# Run specific test suite
npm run test:smoke
npm run test:prohibited
```

### 3. Debug Tests
```sh
# Debug mode with Playwright Inspector
npm run test:debug

# UI Mode for interactive debugging
npm run ui

# Generate new tests with Codegen
npm run codegen
```

### 4. View Reports
```sh
# Open HTML report
npm run report
```

## Configuration

### Configuration

**Environment-Driven Setup** (`.env` file):
- **TEST_ENV**: Selector for environment (test/staging/production)
- **BASE_URL_***: Multi-environment URLs (BASE_URL_TEST, BASE_URL_STAGING, BASE_URL_PRODUCTION)
- **Timeouts**: TEST_TIMEOUT, EXPECT_TIMEOUT, ACTION_TIMEOUT, NAVIGATION_TIMEOUT
- **Execution**: CI_RETRIES, PARALLEL_WORKERS, HEADLESS mode, VIEWPORT dimensions
- **Reporting**: TRACE_MODE, SCREENSHOT_MODE, VIDEO_MODE (on, off, only-on-failure)

### Playwright Configuration (`playwright.config.ts`)
- **Base URL**: Resolved from TEST_ENV selector with .env overrides
- **Timeout**: 60 seconds (configurable via .env)
- **Retries**: 2 in CI, 0 locally (via .env)
- **Parallel Execution**: Configurable workers (via .env)
- **Browsers**: Chromium (configurable, Firefox/Safari available)
- **Viewport**: 1920x1080 (configurable via .env)

## Adding New Tests

1. **Create a new test file** in the `features/` folder:
   ```typescript
   import { test, expect } from './fixtures';
   import { testData } from './data/testData';
   
   test.describe('Feature Name', () => {
     test('descriptive test name', async ({ homePage, page }) => {
       // Fixtures automatically handle setup (gotoHome, acceptCookies, etc.)
       // Your test code here
     });
   });
   ```

2. **Follow naming convention**: `evri-<feature-name>.spec.ts`

3. **Use Playwright fixtures** for page object injection:
   - Available fixtures: `homePage`, `deliveryOptionsPage`, `parcelShopPage`, `prohibitedItemsPage`
   - Fixtures automatically handle setup/teardown (no manual instantiation needed)
   - Fixture definition in `features/fixtures.ts`

4. **Add test data** to `features/data/testData.ts` (TypeScript interface-based, not .env)

## Best Practices

### Architecture
- **Page Object Model (POM)**: All pages inherit from `BasePage` in `core/`
- **Fixtures Pattern**: Use Playwright fixtures for dependency injection (not manual instantiation)
- **Test Data**: Centralized in `features/data/testData.ts` with TypeScript interfaces (not .env)
- **Environment Config**: All configuration (timeouts, retries, URLs) driven by `.env` via dotenv

### Test Organization
- Single focused test per spec file when possible (consolidated end-to-end flows)
- Use descriptive test names that explain the complete scenario
- Group related tests using `test.describe()`
- Fixtures handle setup automatically (no manual `beforeEach` hooks needed)

### Selectors
- Prefer `data-test-id` attributes when available
- Use `getByRole` for accessibility-friendly selectors
- Fallback to CSS selectors as last resort
- Keep selectors maintainable and readable

### Assertions
- Use Playwright's auto-waiting assertions (`expect().toBeVisible()`)
- Set appropriate timeouts for dynamic content
- Verify both positive and negative scenarios

### Error Handling
- Use try-catch for expected exceptions
- Add meaningful error messages
- Capture debug information (console logs, network requests)

### Performance
- Minimize unnecessary waits
- Use `page.waitForLoadState('networkidle')` sparingly
- Leverage Playwright's auto-waiting capabilities

## CI/CD Integration
Configure your CI/CD pipeline to run tests automatically:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: npm install
  
- name: Install Playwright browsers
  run: npm run install:browsers
  
- name: Run Playwright tests
  run: npm test
  
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Troubleshooting

### Common Issues

**Tests timing out**
- Increase timeout in playwright.config.ts
- Check network connectivity
- Verify selectors are correct

**Element not found**
- Use Playwright Inspector to verify selectors
- Check if element is in a frame or shadow DOM
- Ensure page is fully loaded before interaction

**Flaky tests**
- Avoid hard-coded waits (`page.waitForTimeout`)
- Use proper assertions with auto-waiting
- Check for race conditions

### Debug Commands
```sh
# Run specific test with debug
npx playwright test evri-smoke.spec.ts --debug

# Show trace viewer
npx playwright show-trace trace.zip

# Generate test code
npx playwright codegen https://www.evri.com
```

---
**Framework Version**: 1.1.0  
**Last Updated**: December 2025  
**Key Updates**: 
- Fixture pattern for DI and clean test structure
- Single consolidated smoke test for critical path
- Environment-driven configuration via .env
- Multi-environment support (test/staging/production)
- Page Object Model with TypeScript interfaces
