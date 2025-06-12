import { test, expect } from '@playwright/test';

test.describe('BetBoard Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the main page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/BetBoard/);
    
    // Check main heading
    await expect(page.getByText('G\'day BetBoard')).toBeVisible();
    await expect(page.getByText('Digital Delivery Tracker')).toBeVisible();
    
    // Check main action buttons
    await expect(page.getByRole('button', { name: /new bet/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /settings/i })).toBeVisible();
  });

  test('should display timeline section', async ({ page }) => {
    await expect(page.getByText('Timeline')).toBeVisible();
    
    // Check for legend items
    await expect(page.getByText('Open')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();
    await expect(page.getByText('Blocked/Overdue')).toBeVisible();
    await expect(page.getByText('Done')).toBeVisible();
  });

  test('should open and close bet editor', async ({ page }) => {
    // Open bet editor
    await page.getByRole('button', { name: /new bet/i }).click();
    
    // Check if editor is visible
    await expect(page.getByText('New Bet')).toBeVisible();
    await expect(page.getByLabel('Bet Name *')).toBeVisible();
    
    // Close editor using X button
    await page.getByRole('button', { name: '✕' }).click();
    
    // Check if editor is closed
    await expect(page.getByText('New Bet')).not.toBeVisible();
  });

  test('should create a new bet', async ({ page }) => {
    // Open bet editor
    await page.getByRole('button', { name: /new bet/i }).click();
    
    // Fill out the form
    await page.getByLabel('Bet Name *').fill('Test E2E Bet');
    await page.getByLabel('Owner *').selectOption('Steve P');
    await page.getByLabel('Problem Statement *').fill('Test problem for E2E');
    await page.getByLabel('Solution *').fill('Test solution for E2E');
    await page.getByLabel('Due Date *').fill('2025-12-31');
    
    // Submit the form
    await page.getByRole('button', { name: /create bet/i }).click();
    
    // Check if bet was created (should see success toast)
    await expect(page.getByText('New bet created successfully!')).toBeVisible();
  });

  test('should filter bets by owner', async ({ page }) => {
    // Use the owner filter
    await page.getByLabel(/filter by owner/i).selectOption('Steve P');
    
    // Wait for filtering to take effect
    await page.waitForTimeout(500);
    
    // Verify filter is applied
    await expect(page.getByLabel(/filter by owner/i)).toHaveValue('Steve P');
  });

  test('should filter bets by status', async ({ page }) => {
    // Use the status filter
    await page.getByLabel(/filter by status/i).selectOption('Open');
    
    // Wait for filtering to take effect
    await page.waitForTimeout(500);
    
    // Verify filter is applied
    await expect(page.getByLabel(/filter by status/i)).toHaveValue('Open');
  });

  test('should open settings modal', async ({ page }) => {
    // Open settings
    await page.getByRole('button', { name: /settings/i }).click();
    
    // Check if settings modal is visible
    await expect(page.getByText('Settings')).toBeVisible();
    await expect(page.getByText('User Management')).toBeVisible();
    
    // Close settings
    await page.getByRole('button', { name: '✕' }).click();
    
    // Check if settings modal is closed
    await expect(page.getByText('User Management')).not.toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile layout is applied
    await expect(page.getByText('G\'day BetBoard')).toBeVisible();
    
    // Check if buttons are still accessible
    await expect(page.getByRole('button', { name: /new bet/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /settings/i })).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab to the first button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check if New Bet button is focused
    await expect(page.getByRole('button', { name: /new bet/i })).toBeFocused();
    
    // Press Enter to activate
    await page.keyboard.press('Enter');
    
    // Check if editor opens
    await expect(page.getByText('New Bet')).toBeVisible();
    
    // Press Escape to close
    await page.keyboard.press('Escape');
    
    // Check if editor closes
    await expect(page.getByText('New Bet')).not.toBeVisible();
  });

  test('should display existing bets', async ({ page }) => {
    // Check if there are bet cards displayed
    const betCards = page.locator('.bet-card');
    await expect(betCards).toHaveCount(4); // Based on the JSON data
    
    // Check if bet content is visible
    await expect(page.getByText(/Due:/)).toBeVisible();
  });

  test('should edit existing bet', async ({ page }) => {
    // Find and click the first edit button
    const firstEditButton = page.getByText('Edit').first();
    await firstEditButton.click();
    
    // Check if editor opens with existing data
    await expect(page.getByText('Edit Bet')).toBeVisible();
    
    // Modify the bet name
    const betNameField = page.getByLabel('Bet Name *');
    await betNameField.clear();
    await betNameField.fill('Updated E2E Bet');
    
    // Save changes
    await page.getByRole('button', { name: /update bet/i }).click();
    
    // Check for success message
    await expect(page.getByText('Bet updated successfully!')).toBeVisible();
  });
}); 