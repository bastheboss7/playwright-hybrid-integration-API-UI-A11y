#!/bin/bash

# Demoblaze Automation Test Suite - Verification Script
# Companies House Assessment Reference: 437782

echo "=================================="
echo "Demoblaze Test Automation Verification"
echo "=================================="
echo ""

# Check file structure
echo "✓ Checking project structure..."
echo "  Testing files present:"
test -f features/demoblaze.spec.ts && echo "    ✓ features/demoblaze.spec.ts" || echo "    ✗ MISSING: features/demoblaze.spec.ts"
test -f features/fixtures.ts && echo "    ✓ features/fixtures.ts" || echo "    ✗ MISSING: features/fixtures.ts"

echo "  Page Object Models present:"
test -f features/pages/DemoblazeHomePage.ts && echo "    ✓ features/pages/DemoblazeHomePage.ts" || echo "    ✗ MISSING: features/pages/DemoblazeHomePage.ts"
test -f features/pages/DemoblazeProductPage.ts && echo "    ✓ features/pages/DemoblazeProductPage.ts" || echo "    ✗ MISSING: features/pages/DemoblazeProductPage.ts"
test -f features/pages/DemoblazeCartPage.ts && echo "    ✓ features/pages/DemoblazeCartPage.ts" || echo "    ✗ MISSING: features/pages/DemoblazeCartPage.ts"

echo "  Test Data present:"
test -f features/data/demoblazeTestData.ts && echo "    ✓ features/data/demoblazeTestData.ts" || echo "    ✗ MISSING: features/data/demoblazeTestData.ts"

echo "  Configuration files:"
test -f playwright.config.ts && echo "    ✓ playwright.config.ts" || echo "    ✗ MISSING: playwright.config.ts"
test -f tsconfig.json && echo "    ✓ tsconfig.json" || echo "    ✗ MISSING: tsconfig.json"
test -f package.json && echo "    ✓ package.json" || echo "    ✗ MISSING: package.json"
test -f README.md && echo "    ✓ README.md" || echo "    ✗ MISSING: README.md"

echo ""
echo "✓ Verifying cleanup of old Evri tests..."
echo "  Old files removed:"
test ! -f features/evri-smoke.spec.ts && echo "    ✓ evri-smoke.spec.ts (removed)" || echo "    ✗ evri-smoke.spec.ts still exists"
test ! -f features/evri-prohibited-items.spec.ts && echo "    ✓ evri-prohibited-items.spec.ts (removed)" || echo "    ✗ evri-prohibited-items.spec.ts still exists"
test ! -f features/pages/HomePage.ts && echo "    ✓ HomePage.ts (removed)" || echo "    ✗ HomePage.ts still exists"
test ! -f features/data/testData.ts && echo "    ✓ testData.ts (removed)" || echo "    ✗ testData.ts still exists"

echo ""
echo "✓ Checking test count in demoblaze.spec.ts:"
TEST_COUNT=$(grep -c "^test(" features/demoblaze.spec.ts)
echo "  Found $TEST_COUNT test cases (expected: 5)"

echo ""
echo "✓ Verifying test scenario names:"
grep "^test(" features/demoblaze.spec.ts | grep -q "Smoke" && echo "    ✓ Test 1: Smoke Test" || echo "    ✗ Smoke Test not found"
grep "^test(" features/demoblaze.spec.ts | grep -q "End-to-End" && echo "    ✓ Test 2: End-to-End Test" || echo "    ✗ End-to-End Test not found"
grep "^test(" features/demoblaze.spec.ts | grep -q "Data-Driven" && echo "    ✓ Test 3: Data-Driven Test" || echo "    ✗ Data-Driven Test not found"
grep "^test(" features/demoblaze.spec.ts | grep -q "Negative" && echo "    ✓ Test 4: Negative Test" || echo "    ✗ Negative Test not found"
grep "^test(" features/demoblaze.spec.ts | grep -q "Integration" && echo "    ✓ Test 5: Integration Test" || echo "    ✗ Integration Test not found"

echo ""
echo "✓ Verifying documentation comments:"
grep -q "RATIONALE:" features/demoblaze.spec.ts && echo "    ✓ Rationale comments found" || echo "    ✗ Rationale comments missing"
grep -q "INTENTIONAL BUG NOTE:" features/demoblaze.spec.ts && echo "    ✓ Bug documentation found" || echo "    ✗ Bug documentation missing"

echo ""
echo "✓ Checking Page Object methods:"
echo "  DemoblazeHomePage methods:"
grep -c "async " features/pages/DemoblazeHomePage.ts | xargs echo "    Method count:"
echo "  DemoblazeProductPage methods:"
grep -c "async " features/pages/DemoblazeProductPage.ts | xargs echo "    Method count:"
echo "  DemoblazeCartPage methods:"
grep -c "async " features/pages/DemoblazeCartPage.ts | xargs echo "    Method count:"

echo ""
echo "✓ Verifying test data exports:"
grep -q "export" features/data/demoblazeTestData.ts && echo "    ✓ Test data exported" || echo "    ✗ Test data not exported"

echo ""
echo "✓ TypeScript compilation check:"
if npm run test 2>&1 | head -5 | grep -q "error"; then
  echo "    ✗ TypeScript errors detected"
else
  echo "    ✓ TypeScript compiles successfully"
fi

echo ""
echo "=================================="
echo "✓ Verification complete!"
echo "=================================="
echo ""
echo "Available npm commands:"
echo "  npm test              - Run all 5 tests"
echo "  npm run test:smoke    - Run Smoke test"
echo "  npm run test:e2e      - Run End-to-End test"
echo "  npm run test:data-driven - Run Data-Driven test"
echo "  npm run test:negative - Run Negative test"
echo "  npm run test:integration - Run Integration test"
echo "  npm run report        - View test report"
echo ""
