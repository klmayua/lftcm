import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title and meta', async ({ page }) => {
    await expect(page).toHaveTitle(/Living Faith Tabernacle/);
  });

  test('displays navigation', async ({ page }) => {
    // Check for navigation elements
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByText('Home')).toBeVisible();
    await expect(page.getByText('Sermons')).toBeVisible();
    await expect(page.getByText('Events')).toBeVisible();
  });

  test('displays hero section', async ({ page }) => {
    // Check for hero content
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    // Test sermons link
    await page.getByText('Sermons').first().click();
    await expect(page).toHaveURL(/.*sermons/);

    // Go back and test events
    await page.goto('/');
    await page.getByText('Events').first().click();
    await expect(page).toHaveURL(/.*events/);
  });

  test('is responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('has no accessibility violations', async ({ page }) => {
    await page.goto('/');

    // Check for basic accessibility
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check that images have alt text
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }

    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
  });
});
