import { test, expect } from '@playwright/test';

test.describe('BetBoard Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the application', async ({ page }) => {
    await expect(page).toHaveTitle(/BetBoard/);
    await expect(page.getByText('BetBoard')).toBeVisible();
  });

  test('should display timeline section', async ({ page }) => {
    await expect(page.getByText('Timeline')).toBeVisible();
  });

  test('should open and close bet editor', async ({ page }) => {
    // Open bet editor
    await page.getByRole('button', { name: /new bet/i }).click();
    await expect(page.getByText('Create New Bet')).toBeVisible();
    
    // Close bet editor
    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page.getByText('Create New Bet')).not.toBeVisible();
  });

  test('should create a new bet', async ({ page }) => {
    await page.getByRole('button', { name: /new bet/i }).click();
    
    // Fill form
    await page.getByLabel('Bet Name *').fill('Test E2E Bet');
    await page.getByLabel('Description').fill('Test description');
    await page.getByLabel('Owner *').fill('Test User');
    
    // Submit
    await page.getByRole('button', { name: /create bet/i }).click();
    
    // Verify success
    await expect(page.getByText('New bet created successfully!')).toBeVisible({ timeout: 5000 });
  });

  test('should filter bets by status', async ({ page }) => {
    // Test filter functionality
    await page.getByRole('combobox', { name: /filter by status/i }).click();
    await page.getByRole('option', { name: /in progress/i }).click();
    
    // Verify filter is applied
    await expect(page.getByText('In Progress')).toBeVisible();
  });

  test('should open settings modal', async ({ page }) => {
    await page.getByRole('button', { name: /settings/i }).click();
    await expect(page.getByText('Settings')).toBeVisible();
    
    // Close modal
    await page.getByRole('button', { name: /close/i }).click();
    await expect(page.getByText('Settings')).not.toBeVisible();
  });

  test('should display existing bet data', async ({ page }) => {
    // Check if there are any existing bets displayed
    const betCards = page.locator('[data-testid="bet-card"]');
    const count = await betCards.count();
    
    if (count > 0) {
      await expect(betCards.first()).toBeVisible();
    }
  });
}); 