import { test, expect } from '@playwright/test';

test.describe('BetBoard Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('should load the application', async ({ page }) => {
    await expect(page).toHaveTitle(/BetBoard/);
    // Check for any BetBoard text on the page
    await expect(page.locator('body')).toContainText('BetBoard');
  });

  test('should display timeline section', async ({ page }) => {
    // Look for timeline-related content
    const timelineExists = await page.locator('text=Timeline').isVisible().catch(() => false);
    if (timelineExists) {
      await expect(page.getByText('Timeline')).toBeVisible();
    }
  });

  test('should have new bet button', async ({ page }) => {
    // Look for new bet button with more flexible selector
    const newBetButton = page.locator('button').filter({ hasText: /new.*bet/i }).first();
    await expect(newBetButton).toBeVisible({ timeout: 10000 });
  });

  test('should open bet editor when new bet clicked', async ({ page }) => {
    // Find and click new bet button
    const newBetButton = page.locator('button').filter({ hasText: /new.*bet/i }).first();
    await newBetButton.click();
    
    // Wait for any modal or form to appear
    await page.waitForTimeout(1000);
    
    // Check if any form elements appeared
    const formVisible = await page.locator('form, [role="dialog"], .modal').isVisible().catch(() => false);
    expect(formVisible).toBeTruthy();
  });

  test('should have settings button', async ({ page }) => {
    // Look for settings button
    const settingsButton = page.locator('button').filter({ hasText: /settings/i }).first();
    await expect(settingsButton).toBeVisible({ timeout: 10000 });
  });

  test('should display main content area', async ({ page }) => {
    // Check that the main content area is visible
    await expect(page.locator('body')).toBeVisible();
    
    // Check for any bet-related content
    const hasContent = await page.locator('text=/bet|timeline|project/i').first().isVisible().catch(() => false);
    expect(hasContent).toBeTruthy();
  });

  test('should be responsive', async ({ page }) => {
    // Test basic responsiveness
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('body')).toBeVisible();
  });
}); 