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
