import { test, expect } from '@playwright/test';
import { baseUrl } from '../playwright.config';

// Define the mock data outside so we can reuse it
const mockEvents = [
  {
    id: 1,
    title: 'Kathakali Performance',
    start_time: new Date().toISOString(), // Today
    end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    location: 'Kerala Kalamandalam',
    description: 'A traditional performance.',
    category: 'Kathakali'
  },
  {
    id: 2,
    title: 'Kootiyattam Festival',
    start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    end_time: new Date(Date.now() + 90000000).toISOString(),
    location: 'Temple Grounds',
    description: 'Annual festival.',
    category: 'Kootiyattam'
  }
];

test.beforeEach(async ({ page }) => {
  // 1. Generic Mock (Registered FIRST)
  // Catches any API call to /kathakali/ that isn't handled by a more specific route later.
  // We use fulfill() instead of fallback() so the test doesn't crash if the real backend is down.
  await page.route('**/kathakali/**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Generic mock success' })
    });
  });

  // 2. Specific Events Mock (Registered LAST)
  // Playwright checks this FIRST. If the URL matches 'events', it uses this mock data.
  await page.route('*/**/events*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: mockEvents,
        pagination: {
          limit: 100,
          offset: 0,
          total: mockEvents.length
        }
      }),
    });
  });
});

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
  // Note: buttons use Unicode characters ‹ and › not < and >
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
  
  // Note: buttons use Unicode characters › not >
  const nextButtonLocator = page.locator('button').filter({ hasText: /[›>]/ }).first();
  await expect(nextButtonLocator).toBeVisible({ timeout: 15000 });
  
  // Click next month
  await nextButtonLocator.click();
  
  await page.waitForTimeout(500); // Brief wait for calendar to update
  
  const newMonthYear = await monthYearLocator.textContent();
  expect(newMonthYear).not.toBe(initialMonthYear);
  
  // Note: buttons use Unicode character ‹ not <
  const prevButtonLocator = page.locator('button').filter({ hasText: /[‹<]/ }).first();
  await prevButtonLocator.click();
  
  await page.waitForTimeout(500); // Brief wait for calendar to update
  
  const backMonthYear = await monthYearLocator.textContent();
  expect(backMonthYear).toBe(initialMonthYear);
});
