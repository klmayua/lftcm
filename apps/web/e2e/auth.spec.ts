import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Login/);
    await expect(page.locator('h1')).toContainText('Sign In');
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/login');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
});

test.describe('Navigation', () => {
  test('should navigate to sermons page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Sermons');
    await expect(page).toHaveURL(/.*sermons/);
    await expect(page.locator('h1')).toContainText('Sermons');
  });

  test('should navigate to giving page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Give');
    await expect(page).toHaveURL(/.*giving/);
  });
});

test.describe('Mobile Navigation', () => {
  test('should show bottom navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('nav[aria-label="Mobile navigation"]')).toBeVisible();
  });

  test('should slide up menu on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.click('text=More');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });
});

test.describe('Offline Mode', () => {
  test('should show offline page when offline', async ({ page, context }) => {
    await page.goto('/');
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('text=You\'re Offline')).toBeVisible();
  });
});
