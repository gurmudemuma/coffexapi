import { test, expect } from '@playwright/test';

test('should display the main page', async ({ page }) => {
  await page.goto('http://localhost:4173');
  await expect(page.locator('h1')).toHaveText('Coffee Export System');
});
