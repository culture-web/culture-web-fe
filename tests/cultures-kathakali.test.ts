import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// Polyfill for __dirname in ES modules
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const checkButtonEnabledAndCloseUpload = async (page) => {
  await expect(
    page.getByRole('dialog').getByRole('button', { name: 'Upload Image' }),
  ).not.toBeEnabled();

  const filePath = path.resolve(dirname, 'pacha.png');

  // Wait for the file input to be available, then set the file
  const fileInput = await page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);

  await page.getByRole('button', { name: 'OK' }).click();

  // Check if the upload button is enabled after the image is selected
  await expect(
    page.getByRole('dialog').getByRole('button', { name: 'Upload Image' }),
  ).toBeEnabled();

  await page.locator('button').filter({ hasText: 'Close' }).click();
};

const testSingleImageUpload = async (page, algorithmTitle) => {
  await page
    .locator(algorithmTitle)
    .getByRole('button', { name: 'Upload Image', exact: true })
    .click();
  await checkButtonEnabledAndCloseUpload(page);
};

const testMuiltipleImageUpload = async (page, algorithmTitle) => {
  await page
    .locator(algorithmTitle)
    .getByRole('button', { name: 'Upload Image Multiple (BETA)' })
    .click();

  await checkButtonEnabledAndCloseUpload(page);
};

test('Cultures Kathakali Page has KathakalAI Button in title', async ({
  page,
}) => {
  await page.goto('/cultures/kathakali');
  await expect(page.getByRole('button', { name: 'KathakalAI' })).toBeVisible();
});

test('Character Recognition Algorithm', async ({ page }) => {
  await page.goto('/cultures/kathakali');

  // Test single image upload functionality
  await testSingleImageUpload(page, '#algorithm1');

  // // Test multiple face upload functionality
  // await testMuiltipleImageUpload(page, '#algorithm1');
});

test('Expression Recognition Algorithm', async ({ page }) => {
  await page.goto('/cultures/kathakali');

  // Test single image upload functionality
  await testSingleImageUpload(page, '#algorithm2');

  // // Test multiple face upload functionality
  // await testMuiltipleImageUpload(page, '#algorithm2');
});
