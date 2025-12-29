import { test, expect } from './fixtures';
import { testData } from './data/testData';

/**
 * Prohibited Items Validation Test Suite
 * 
 * Purpose: Validates business rules preventing prohibited items from being sent
 * Scope: End-to-end flow through delivery options and item validation
 * Status: Skipped pending selector fixes on live site
 */
test.describe('Prohibited Items Validation', () => {
  test('should prevent user from sending prohibited items', async ({
    homePage,
    deliveryOptionsPage,
    prohibitedItemsPage,
    page,
  }) => {
    // Navigate and prepare booking
    await homePage.fillFromPostcode(testData.fromPostcode);
    await homePage.fillToPostcode(testData.toPostcode);
    await homePage.selectWeight(testData.weight);
    await homePage.clickSendParcel();

    // Select delivery options
    await page.waitForLoadState('networkidle');
    await deliveryOptionsPage.selectStandardSpeed();
    await deliveryOptionsPage.selectCourierMethod();
    await deliveryOptionsPage.continueAfterOptions();

    // Validate prohibited items behavior
    await expect(page).toHaveTitle(/Evri.*Parcel Delivery/);
    await prohibitedItemsPage.enterContents('gun');
    await prohibitedItemsPage.enterValue('100');
    await prohibitedItemsPage.assertProhibitedErrorVisible();
    await prohibitedItemsPage.assertFinalContinueDisabled();
  });
});
