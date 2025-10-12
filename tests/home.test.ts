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
  
  // Scroll to calendar section using the h2 title specifically
  await page.locator('h2:has-text("Upcoming Cultural Events")').scrollIntoViewIfNeeded();
  
  // Check calendar title is visible
  await expect(page.locator('h2:has-text("Upcoming Cultural Events")')).toBeVisible();
  
  // Check navigation buttons are present
  await expect(page.locator('button:has-text("‹")')).toBeVisible();
  await expect(page.locator('button:has-text("›")')).toBeVisible();
  
  // Check days of week headers
  await expect(page.getByText('Sun')).toBeVisible();
  await expect(page.getByText('Mon')).toBeVisible();
  await expect(page.getByText('Sat')).toBeVisible();
});

test('Calendar navigation works', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Scroll to calendar
  await page.locator('h2:has-text("Upcoming Cultural Events")').scrollIntoViewIfNeeded();
  
  // Get initial month/year
  const initialMonthYear = await page.locator('h3').filter({ hasText: /\w+ \d{4}/ }).textContent();
  
  // Click next month
  await page.locator('button:has-text("›")').click();
  await page.waitForTimeout(500);
  
  // Get new month/year and verify it changed
  const newMonthYear = await page.locator('h3').filter({ hasText: /\w+ \d{4}/ }).textContent();
  expect(newMonthYear).not.toBe(initialMonthYear);
  
  await page.locator('button:has-text("‹")').click();
  await page.waitForTimeout(500);
  
  const backMonthYear = await page.locator('h3').filter({ hasText: /\w+ \d{4}/ }).textContent();
  expect(backMonthYear).toBe(initialMonthYear);
});
