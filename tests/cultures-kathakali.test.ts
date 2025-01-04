import { test, expect } from '@playwright/test';
import { baseUrl } from '../playwright.config';
import path from 'path';
import { fileURLToPath } from 'url';

// Polyfill for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Cultures Kathakali Page has KathakalAI Button in title', async ({
  page,
}) => {
  await page.goto('/cultures/kathakali');
  await expect(page.getByRole('button', { name: 'KathakalAI' })).toBeVisible();
});

test('Character Recognition Algorithm', async ({ page }) => {
  await page.goto('/cultures/kathakali');

  // Test single image upload functionality
  await page
    .locator('#algorithm1')
    .getByRole('button', { name: 'Upload Image', exact: true })
    .click();
  await expect(
    page.getByRole('dialog').getByRole('button', { name: 'Upload Image' }),
  ).not.toBeEnabled();

  const filePath = path.resolve(__dirname, 'pacha.png');

  // Wait for the file input to be available, then set the file
  const fileInput = await page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
  await page.getByRole('button', { name: 'OK' }).click();

  // Check if the upload button is enabled after the image is selected
  await expect(
    page.getByRole('dialog').getByRole('button', { name: 'Upload Image' }),
  ).toBeEnabled();

  await page.locator('button').filter({ hasText: 'Close' }).click();

  // Test multiple face upload functionality
  await page
    .locator('#algorithm1')
    .getByRole('button', { name: 'Upload Image Multiple (BETA)' })
    .click();

  await expect(
    page.getByRole('dialog').getByRole('button', { name: 'Upload Image' }),
  ).not.toBeEnabled();

  await fileInput.setInputFiles(filePath);
  await page.getByRole('button', { name: 'OK' }).click();

  // Check if the upload button is enabled after the image is selected
  await expect(
    page.getByRole('dialog').getByRole('button', { name: 'Upload Image' }),
  ).toBeEnabled();

  await page.locator('button').filter({ hasText: 'Close' }).click();
});

test('Expression Recognition Algorithm', async ({ page }) => {
  await page.goto('/cultures/kathakali');

  // Test single image upload functionality
  await page
    .locator('#algorithm2')
    .getByRole('button', { name: 'Upload Image', exact: true })
    .click();
  await expect(
    page.getByRole('dialog').getByRole('button', { name: 'Upload Image' }),
  ).not.toBeEnabled();

  const filePath = path.resolve(__dirname, 'pacha.png');

  // Wait for the file input to be available, then set the file
  const fileInput = await page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
  await page.getByRole('button', { name: 'OK' }).click();

  // Check if the upload button is enabled after the image is selected
  await expect(
    page.getByRole('dialog').getByRole('button', { name: 'Upload Image' }),
  ).toBeEnabled();

  await page.locator('button').filter({ hasText: 'Close' }).click();

  // Test multiple face upload functionality
  await page
    .locator('#algorithm2')
    .getByRole('button', { name: 'Upload Image Multiple (BETA)' })
    .click();
  await fileInput.setInputFiles(filePath);
  await page.getByRole('button', { name: 'OK' }).click();

  // Check if the upload button is enabled after the image is selected
  await expect(
    page.getByRole('dialog').getByRole('button', { name: 'Upload Image' }),
  ).toBeEnabled();

  await page.locator('button').filter({ hasText: 'Close' }).click();
});
