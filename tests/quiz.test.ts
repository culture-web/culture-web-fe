import { test, expect } from '@playwright/test';

test.describe('Quiz Page', () => {
  test('Quiz Page loads and renders quest modes', async ({ page }) => {
    await page.goto('/quiz');

    await expect(page.getByText('Learning Arena')).toBeVisible();
    await expect(page.getByText('Choose Your Quest')).toBeVisible();

    await expect(page.getByText('Kathakali Basics')).toBeVisible();
    await expect(page.getByText('Ornaments & Attire')).toBeVisible();
    await expect(page.getByText('Generate from Learning')).toBeVisible();
    await expect(page.getByText('Adaptive Quiz')).toBeVisible();
  });

  test('Adaptive Quiz card indicates sign-in requirement when unauthenticated', async ({
    page,
  }) => {
    await page.goto('/quiz');

    const adaptiveCard = page.locator('.quiz-quest-card', {
      hasText: 'Adaptive Quiz',
    });
    await expect(adaptiveCard).toBeVisible();
    await expect(adaptiveCard.getByText('Sign In Required')).toBeVisible();

    // Clicking adaptive quiz when logged out displays warning message
    await adaptiveCard.click();
    await expect(
      page.getByText('Please sign in to access the personalized Adaptive Quiz.'),
    ).toBeVisible();
  });

  test('Can start a static quiz, answer a question, and return to modes', async ({
    page,
  }) => {
    await page.goto('/quiz');

    const basicsCard = page.locator('.quiz-quest-card', {
      hasText: 'Kathakali Basics',
    });
    await basicsCard.click();

    // Verify back button and questions are displayed
    await expect(
      page.getByRole('button', { name: 'Back to Quiz Modes' }),
    ).toBeVisible();
    await expect(page.locator('.quiz-question-card').first()).toBeVisible();

    // Return to quiz modes
    await page.getByRole('button', { name: 'Back to Quiz Modes' }).click();
    await expect(page.getByText('Choose Your Quest')).toBeVisible();
  });
});
