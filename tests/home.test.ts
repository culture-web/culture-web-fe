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
  
  // Wait for calendar to be rendered - wait for loading spinner to disappear first
  // This ensures the calendar data is loaded before checking for month/year
  await page.waitForFunction(
    () => {
      const monthYearElement = document.querySelector('h3');
      if (!monthYearElement) return false;
      const text = monthYearElement.textContent;
      return text && /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/.test(text);
    },
    { timeout: 60000 }
  );
  
  // Check navigation buttons are present - be flexible with selector
  await expect(page.locator('button').filter({ hasText: /[‹<]/ }).first()).toBeVisible({ timeout: 15000 });
  await expect(page.locator('button').filter({ hasText: /[›>]/ }).first()).toBeVisible({ timeout: 15000 });
  
  // Check days of week headers - be more flexible
  await page.locator('span, div, th').filter({ hasText: /^Sun$/ }).waitFor({ timeout: 15000 });
  await page.locator('span, div, th').filter({ hasText: /^Mon$/ }).waitFor({ timeout: 15000 });
  await page.locator('span, div, th').filter({ hasText: /^Sat$/ }).waitFor({ timeout: 15000 });
});

test('Calendar navigation works', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  await expect(page.locator('h2:has-text("Upcoming Cultural Events")')).toBeVisible({ timeout: 45000 });
  await page.locator('h2:has-text("Upcoming Cultural Events")').scrollIntoViewIfNeeded();
  
  // Wait for calendar to be rendered - use waitForFunction to ensure month/year is visible
  await page.waitForFunction(
    () => {
      const monthYearElement = document.querySelector('h3');
      if (!monthYearElement) return false;
      const text = monthYearElement.textContent;
      return text && /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/.test(text);
    },
    { timeout: 60000 }
  );
  
  const monthYearLocator = page.locator('h3').first();
  const initialMonthYear = await monthYearLocator.textContent();
  
  const nextButtonLocator = page.locator('button').filter({ hasText: /[›>]/ }).first();
  await expect(nextButtonLocator).toBeVisible({ timeout: 15000 });
  
  // Click next month
  await nextButtonLocator.click();
  
  await page.waitForTimeout(500); // Brief wait for calendar to update
  
  const newMonthYear = await monthYearLocator.textContent();
  expect(newMonthYear).not.toBe(initialMonthYear);
  
  const prevButtonLocator = page.locator('button').filter({ hasText: /[‹<]/ }).first();
  await prevButtonLocator.click();
  
  await page.waitForTimeout(500); // Brief wait for calendar to update
  
  const backMonthYear = await monthYearLocator.textContent();
  expect(backMonthYear).toBe(initialMonthYear);
});
