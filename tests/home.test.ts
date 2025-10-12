import { test, expect } from '@playwright/test';
import { baseUrl } from '../playwright.config';

test('Homepage has KathakalAI Button in title', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'KathakalAI Logo KathakalAI' })).toBeVisible();
});

test('Clicking on Learn More About Other Cultures brings us to cultures', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Explore Cultures' })).toBeVisible();
  await page.getByRole('button', { name: 'Explore Cultures' }).click();
  await expect(page.getByRole('heading', { name: 'Cultures' })).toBeVisible();

  // Check url is /cultures
  expect(page.url()).toBe(`${baseUrl}/cultures`);
});

test('Clicking on Learn More About KathakalAI brings us to About Us', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Learn About Us' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Learn About Us' }).click();
  await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();

  // Check url is /about-us
  expect(page.url()).toBe(`${baseUrl}/about-us`);
});

test('Calendar section is visible and functional', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  await expect(page.locator('h2:has-text("Upcoming Cultural Events")')).toBeVisible({ timeout: 45000 });
  
  await page.locator('h2:has-text("Upcoming Cultural Events")').scrollIntoViewIfNeeded();
  
  await expect(page.locator('h3').filter({ hasText: /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/ })).toBeVisible({ timeout: 45000 });
  
  // Check navigation buttons are present
  await expect(page.locator('button:has-text("‹")')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('button:has-text("›")')).toBeVisible({ timeout: 15000 });
  
  // Check days of week headers
  await expect(page.getByText('Sun')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Mon')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Sat')).toBeVisible({ timeout: 15000 });
});

test('Calendar navigation works', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  await expect(page.locator('h2:has-text("Upcoming Cultural Events")')).toBeVisible({ timeout: 45000 });
  await page.locator('h2:has-text("Upcoming Cultural Events")').scrollIntoViewIfNeeded();
  
  const monthYearLocator = page.locator('h3').filter({ hasText: /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/ });
  await expect(monthYearLocator).toBeVisible({ timeout: 45000 });
  
  const initialMonthYear = await monthYearLocator.textContent();
  
  await expect(page.locator('button:has-text("›")')).toBeVisible({ timeout: 15000 });
  
  // Click next month
  await page.locator('button:has-text("›")').click();
  
  await expect(monthYearLocator).not.toHaveText(initialMonthYear || '', { timeout: 15000 });
  
  // Get new month/year and verify it changed
  const newMonthYear = await monthYearLocator.textContent();
  expect(newMonthYear).not.toBe(initialMonthYear);
  
  await page.locator('button:has-text("‹")').click();
  
  await expect(monthYearLocator).toHaveText(initialMonthYear || '', { timeout: 15000 });
  
  const backMonthYear = await monthYearLocator.textContent();
  expect(backMonthYear).toBe(initialMonthYear);
});
