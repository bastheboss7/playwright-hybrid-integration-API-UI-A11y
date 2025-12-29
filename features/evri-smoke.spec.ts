import { test, expect } from './fixtures';
import { testData } from './data/testData';

/**
 * Evri Smoke Test Suite
 * 
 * Purpose: Validates critical paths and core functionality for quick feedback
 * Scope: Homepage, booking form, and ParcelShop finder
 * Execution: Runs on every commit and deployment
 */
test.describe('Evri Smoke Test', () => {
  test('smoke: homepage navigation', async ({ page, homePage }) => {
    // Homepage visible and booking form present
    await expect(page).toHaveTitle(/Evri/);
    await expect(homePage.fromPostcode).toBeVisible();
  });

    test('smoke: booking navigation', async ({ homePage }) => {
    // Fill parcel booking form
    await homePage.fillFromPostcode(testData.fromPostcode);
    await homePage.fillToPostcode(testData.toPostcode);
    await homePage.selectWeight(testData.weight);
    await expect(homePage.sendButton).toBeEnabled();
  });

    test('smoke: parcelshop navigation', async ({ parcelShopPage }) => {
    // Navigate to ParcelShop finder and validate
    await parcelShopPage.gotoParcelShop();
    await parcelShopPage.assertSearchVisible();
  });
});