import { test, expect } from '@playwright/test';
import { baseUrl } from '../playwright.config';

test('About Us Page has KathakalAI Button in title', async ({ page }) => {
  await page.goto('/about-us');
  await expect(page.getByRole('button', { name: 'KathakalAI' })).toBeVisible();
});

test('Clicking on Kathakali In About Us Page brings us to Kathakali Information page', async ({
  page,
}) => {
  await page.goto('/about-us');
  await expect(page.getByRole('link', { name: 'Kathakali' })).toBeVisible();
  await page.getByRole('link', { name: 'Kathakali' }).click();
  await expect(page.getByText('Kathakali', { exact: true })).toBeVisible();

  // Check url is /cultures/kathakali
  expect(page.url()).toBe(`${baseUrl}/cultures/kathakali`);
});

test('Clicking on Kootiyattam In About Us Page brings us to Kootiyattam Information page', async ({
  page,
}) => {
  await page.goto('/about-us');
  await expect(page.getByRole('link', { name: 'Kootiyattam' })).toBeVisible();
  await page.getByRole('link', { name: 'Kootiyattam' }).click();
  await expect(page.getByText('Kootiyattam', { exact: true })).toBeVisible();

  // Check url is /cultures/kootiyattam
  expect(page.url()).toBe(`${baseUrl}/cultures/kootiyattam`);
});

// TODO: Test able to upload Character Recognition File

// TODO: Test able to upload Expression Recognition File
