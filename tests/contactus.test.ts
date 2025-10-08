import { test, expect } from '@playwright/test';
import { baseUrl } from '../playwright.config';

test('Contact Us Page has KathakalAI Button in title', async ({ page }) => {
  await page.goto('/contact-us');
  await expect(page.getByRole('button', { name: 'KathakalAI' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();

  test.step('Check that the contact us fields are present', async () => {
    await expect(page.getByPlaceholder('Name')).toBeVisible();
    await expect(page.getByPlaceholder('Phone Number')).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Write your inquiry...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
  });
});

test('Clicking on KathakalAI Button in title brings us to the home page', async ({
  page,
}) => {
  await page.goto('/contact-us');
  await expect(page.getByRole('button', { name: 'KathakalAI' })).toBeVisible();
  await page.getByRole('button', { name: 'KathakalAI' }).click();
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  // Check url is /
  expect(page.url()).toBe(`${baseUrl}/`);
});
