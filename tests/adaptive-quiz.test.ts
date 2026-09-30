import { test, expect, Page } from '@playwright/test';

const mockAuthenticatedUser = async (page: Page) => {
  await page.addInitScript(() => {
    const mockSession = {
      access_token: 'mock-token-xyz',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'user-e2e-tester',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'tester@example.com',
        created_at: '2026-01-01T00:00:00.000Z',
        user_metadata: {
          full_name: 'Adaptive Tester',
        },
      },
    };
    localStorage.setItem(
      'sb-rzokzctxdqagnmhqhrqd-auth-token',
      JSON.stringify(mockSession),
    );
    localStorage.setItem('supabase.auth.token', JSON.stringify(mockSession));
  });

  await page.route('**/auth/supabase-kb-login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'mock-admin-token',
        user: { role: 'viewer', email: 'tester@example.com' },
      }),
    });
  });
};

test.describe('Adaptive Quiz Progression & Mastery E2E Suite', () => {
  test('Test 1: Unauthenticated user clicking Adaptive Quiz is warned with notification', async ({
    page,
  }) => {
    await page.goto('/quiz');

    const adaptiveCard = page.locator('.quiz-quest-card', {
      hasText: 'Adaptive Quiz',
    });
    await expect(adaptiveCard).toBeVisible();
    await expect(adaptiveCard.getByText('Sign In Required')).toBeVisible();

    await adaptiveCard.click();
    await expect(
      page.getByText('Please sign in to access the personalized Adaptive Quiz.'),
    ).toBeVisible();
  });

  test('Test 2: Missing baseline profile (404) triggers onboarding modal and redirects to learn', async ({
    page,
  }) => {
    await mockAuthenticatedUser(page);

    await page.route('**/kathakali/generate-adaptive-quiz', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error:
            'No proficiency data found. Complete a learning session before starting an adaptive quiz.',
        }),
      });
    });

    await page.goto('/quiz');

    const adaptiveCard = page.locator('.quiz-quest-card', {
      hasText: 'Adaptive Quiz',
    });
    await expect(adaptiveCard).toBeVisible();
    await expect(adaptiveCard.getByText('Sign In Required')).not.toBeVisible();

    await adaptiveCard.click();

    // Confirm Modal appears targeting Ant Design modal container
    const modalTitle = page.locator('.ant-modal-confirm-title');
    await expect(modalTitle).toBeVisible();
    await expect(modalTitle).toHaveText('Initialize Knowledge Profile');

    const modalContent = page.locator('.ant-modal-confirm-content');
    await expect(modalContent).toContainText(
      'You do not have a tracked knowledge profile yet',
    );

    // Clicking "Go to Learn" redirects to /learn
    const goToLearnBtn = page.getByRole('button', { name: 'Go to Learn' });
    await expect(goToLearnBtn).toBeVisible();
    await goToLearnBtn.click();

    await expect(page).toHaveURL(/.*\/learn/);
  });

  test('Test 3: Incorrect answer displays remediation feedback, explanation, and maintains streak at 0', async ({
    page,
  }) => {
    await mockAuthenticatedUser(page);

    const quizId = 'adaptive-session-test-3';
    let questionAttempted = false;

    await page.route('**/kathakali/generate-adaptive-quiz', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          quizId,
          source: 'adaptive-sequential',
          policyVersion: 'sequential-mastery-v1',
          createdAt: new Date().toISOString(),
          question: {
            backendQuestionId: 'q-paccha-1',
            displayId: 1,
            question: 'What is the dominant facial color of a Paccha character?',
            options: ['Green', 'Red', 'Black', 'Yellow'],
          },
          progress: {
            answered: 0,
            correct: 0,
            maxQuestions: 12,
            masteryStreak: 3,
            completed: false,
            completionReason: null,
            masteredConcepts: 0,
            totalConcepts: 2,
            activeConcept: 'paccha_concept',
            currentStreak: 0,
          },
        }),
      });
    });

    await page.route(`**/kathakali/quiz/${quizId}/answer`, async (route) => {
      questionAttempted = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          quizId,
          result: {
            questionId: 'q-paccha-1',
            correct: false,
            selectedAnswer: 'Red',
            correctAnswer: 'Green',
            explanation:
              'Paccha characters represent satvika (virtuous) kings and gods, denoted by vibrant green face paint.',
          },
          nextQuestion: {
            backendQuestionId: 'q-paccha-remediation',
            displayId: 2,
            question:
              'In Kathakali, which color predominantly symbolizes noble characters?',
            options: ['Green', 'White', 'Black', 'Yellow'],
          },
          nextQuestionError: null,
          progress: {
            answered: 1,
            correct: 0,
            maxQuestions: 12,
            masteryStreak: 3,
            completed: false,
            completionReason: null,
            masteredConcepts: 0,
            totalConcepts: 2,
            activeConcept: 'paccha_concept',
            currentStreak: 0,
          },
          proficiencyUpdatesApplied: [],
        }),
      });
    });

    await page.goto('/quiz');

    const adaptiveCard = page.locator('.quiz-quest-card', {
      hasText: 'Adaptive Quiz',
    });
    await adaptiveCard.click();

    // Verify Quiz Question 1 renders
    await expect(
      page.getByText('What is the dominant facial color of a Paccha character?'),
    ).toBeVisible();
    await expect(page.getByText('Active Concept: Paccha Concept')).toBeVisible();

    // Select incorrect answer 'Red'
    await page.getByLabel('Red').check();
    await page.getByRole('button', { name: 'Submit Answer' }).click();

    // Assert remediation feedback and explanation are displayed
    await expect(
      page.getByText('✗ Incorrect. Correct Answer: Green'),
    ).toBeVisible();
    await expect(
      page.getByText(
        'Paccha characters represent satvika (virtuous) kings and gods, denoted by vibrant green face paint.',
      ),
    ).toBeVisible();
    await expect(
      page.getByText('The next question will reinforce the same concept.'),
    ).toBeVisible();

    // Streak stays at 0 / 3
    await expect(page.getByText('Mastery Streak (0/3)')).toBeVisible();
    expect(questionAttempted).toBe(true);
  });

  test('Test 4: Full Multi-Round Adaptive Progression Journey (Concept X -> Concept Y -> Session 2 Elevation)', async ({
    page,
  }) => {
    await mockAuthenticatedUser(page);

    const session1Id = 'session-round-1';
    const session2Id = 'session-round-2';
    let sessionCount = 0;
    let answerStep = 0;

    await page.route('**/kathakali/generate-adaptive-quiz', async (route) => {
      sessionCount += 1;
      if (sessionCount === 1) {
        // Session 1: Concepts at 1_remember
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            quizId: session1Id,
            source: 'adaptive-sequential',
            policyVersion: 'sequential-mastery-v1',
            createdAt: new Date().toISOString(),
            question: {
              backendQuestionId: 's1-q1',
              displayId: 1,
              question: 'Question 1: Identify the Paccha character attribute.',
              options: ['Green Face', 'Red Beard', 'Black Veil', 'Wooden Club'],
            },
            progress: {
              answered: 0,
              correct: 0,
              maxQuestions: 12,
              masteryStreak: 3,
              completed: false,
              completionReason: null,
              masteredConcepts: 0,
              totalConcepts: 2,
              activeConcept: 'concept_x',
              currentStreak: 0,
            },
          }),
        });
      } else {
        // Session 2: Concept X elevated to 2_understand
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            quizId: session2Id,
            source: 'adaptive-sequential',
            policyVersion: 'sequential-mastery-v1',
            createdAt: new Date().toISOString(),
            question: {
              backendQuestionId: 's2-q1',
              displayId: 1,
              question:
                'Level 2 (Understand): Why does the Paccha character embody moral righteousness?',
              options: [
                'Represents Satvika nature',
                'Represents Tamasic fury',
                'Represents hunters',
                'Represents clowns',
              ],
            },
            progress: {
              answered: 0,
              correct: 0,
              maxQuestions: 12,
              masteryStreak: 3,
              completed: false,
              completionReason: null,
              masteredConcepts: 0,
              totalConcepts: 2,
              activeConcept: 'concept_x',
              currentStreak: 0,
            },
          }),
        });
      }
    });

    await page.route(`**/kathakali/quiz/${session1Id}/answer`, async (route) => {
      answerStep += 1;

      if (answerStep === 1) {
        // Q1 correct -> streak 1
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            quizId: session1Id,
            result: {
              questionId: 's1-q1',
              correct: true,
              selectedAnswer: 'Green Face',
              correctAnswer: 'Green Face',
              explanation: 'Paccha characters are defined by green makeup.',
            },
            nextQuestion: {
              backendQuestionId: 's1-q2',
              displayId: 2,
              question: 'Question 2: Which costume piece matches Concept X?',
              options: ['Kiritam Crown', 'Red Beard', 'Dark Robe', 'Silver Bells'],
            },
            nextQuestionError: null,
            progress: {
              answered: 1,
              correct: 1,
              maxQuestions: 12,
              masteryStreak: 3,
              completed: false,
              completionReason: null,
              masteredConcepts: 0,
              totalConcepts: 2,
              activeConcept: 'concept_x',
              currentStreak: 1,
            },
            proficiencyUpdatesApplied: [],
          }),
        });
      } else if (answerStep === 2) {
        // Q2 correct -> streak 2
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            quizId: session1Id,
            result: {
              questionId: 's1-q2',
              correct: true,
              selectedAnswer: 'Kiritam Crown',
              correctAnswer: 'Kiritam Crown',
              explanation: 'Paccha heroes wear the elaborate Kiritam headgear.',
            },
            nextQuestion: {
              backendQuestionId: 's1-q3',
              displayId: 3,
              question: 'Question 3: Name the primary mudra used in Concept X.',
              options: ['Pataka', 'Simhamukha', 'Hamsasya', 'Mukula'],
            },
            nextQuestionError: null,
            progress: {
              answered: 2,
              correct: 2,
              maxQuestions: 12,
              masteryStreak: 3,
              completed: false,
              completionReason: null,
              masteredConcepts: 0,
              totalConcepts: 2,
              activeConcept: 'concept_x',
              currentStreak: 2,
            },
            proficiencyUpdatesApplied: [],
          }),
        });
      } else if (answerStep === 3) {
        // Q3 correct -> Concept X mastered! Transition to Concept Y
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            quizId: session1Id,
            result: {
              questionId: 's1-q3',
              correct: true,
              selectedAnswer: 'Pataka',
              correctAnswer: 'Pataka',
              explanation: 'Pataka mudra is commonly used for blessing and royalty.',
            },
            nextQuestion: {
              backendQuestionId: 's1-q4',
              displayId: 4,
              question: 'Question 4: Identify the key makeup trait of Concept Y.',
              options: ['Knife mustache', 'Black paint', 'White beard', 'Yellow dress'],
            },
            nextQuestionError: null,
            progress: {
              answered: 3,
              correct: 3,
              maxQuestions: 12,
              masteryStreak: 3,
              completed: false,
              completionReason: null,
              masteredConcepts: 1,
              totalConcepts: 2,
              activeConcept: 'concept_y',
              currentStreak: 0,
            },
            proficiencyUpdatesApplied: [
              {
                conceptId: 'concept_x',
                newLevel: '1_remember',
                misconceptionFlag: false,
              },
            ],
          }),
        });
      } else if (answerStep === 4) {
        // Q4 correct -> Concept Y streak 1
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            quizId: session1Id,
            result: {
              questionId: 's1-q4',
              correct: true,
              selectedAnswer: 'Knife mustache',
              correctAnswer: 'Knife mustache',
              explanation: 'Kathi makeup features a stylized knife pattern.',
            },
            nextQuestion: {
              backendQuestionId: 's1-q5',
              displayId: 5,
              question: 'Question 5: What emotion does Concept Y primarily portray?',
              options: ['Raudra (Anger)', 'Shringara', 'Haasya', 'Karuna'],
            },
            nextQuestionError: null,
            progress: {
              answered: 4,
              correct: 4,
              maxQuestions: 12,
              masteryStreak: 3,
              completed: false,
              completionReason: null,
              masteredConcepts: 1,
              totalConcepts: 2,
              activeConcept: 'concept_y',
              currentStreak: 1,
            },
            proficiencyUpdatesApplied: [],
          }),
        });
      } else if (answerStep === 5) {
        // Q5 correct -> Concept Y streak 2
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            quizId: session1Id,
            result: {
              questionId: 's1-q5',
              correct: true,
              selectedAnswer: 'Raudra (Anger)',
              correctAnswer: 'Raudra (Anger)',
              explanation: 'Kathi characters exhibit arrogant fury.',
            },
            nextQuestion: {
              backendQuestionId: 's1-q6',
              displayId: 6,
              question: 'Question 6: Who is a famous character of type Concept Y?',
              options: ['Ravana', 'Arjuna', 'Kuchela', 'Nala'],
            },
            nextQuestionError: null,
            progress: {
              answered: 5,
              correct: 5,
              maxQuestions: 12,
              masteryStreak: 3,
              completed: false,
              completionReason: null,
              masteredConcepts: 1,
              totalConcepts: 2,
              activeConcept: 'concept_y',
              currentStreak: 2,
            },
            proficiencyUpdatesApplied: [],
          }),
        });
      } else if (answerStep === 6) {
        // Q6 correct -> Concept Y mastered! All concepts completed
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            quizId: session1Id,
            result: {
              questionId: 's1-q6',
              correct: true,
              selectedAnswer: 'Ravana',
              correctAnswer: 'Ravana',
              explanation: 'Ravana is the quintessential Kathi character.',
            },
            nextQuestion: null,
            nextQuestionError: null,
            progress: {
              answered: 6,
              correct: 6,
              maxQuestions: 12,
              masteryStreak: 3,
              completed: true,
              completionReason: 'mastery_criterion_met',
              masteredConcepts: 2,
              totalConcepts: 2,
              activeConcept: null,
              currentStreak: 0,
            },
            proficiencyUpdatesApplied: [
              {
                conceptId: 'concept_y',
                newLevel: '1_remember',
                misconceptionFlag: false,
              },
            ],
          }),
        });
      }
    });

    await page.goto('/quiz');

    // Start Session 1
    const adaptiveCard = page.locator('.quiz-quest-card', {
      hasText: 'Adaptive Quiz',
    });
    await adaptiveCard.click();

    // Step 1: Concept X - Question 1
    await expect(page.getByText('Active Concept: Concept X')).toBeVisible();
    await page.getByLabel('Green Face').check();
    await page.getByRole('button', { name: 'Submit Answer' }).click();
    await expect(page.getByText('1 in a row')).toBeVisible();
    await page.getByRole('button', { name: 'Next Question' }).click();

    // Step 2: Concept X - Question 2
    await page.getByLabel('Kiritam Crown').check();
    await page.getByRole('button', { name: 'Submit Answer' }).click();
    await expect(page.getByText('2 in a row')).toBeVisible();
    await page.getByRole('button', { name: 'Next Question' }).click();

    // Step 3: Concept X - Question 3 (triggers Concept X mastery & toast)
    await page.getByLabel('Pataka').check();
    await page.getByRole('button', { name: 'Submit Answer' }).click();
    await expect(
      page.getByText('The session mastery criterion was met for a concept.'),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Next Question' }).click();

    // Step 4: Concept Y - Question 4
    await expect(page.getByText('Active Concept: Concept Y')).toBeVisible();
    await page.getByLabel('Knife mustache').check();
    await page.getByRole('button', { name: 'Submit Answer' }).click();
    await expect(page.getByText('1 in a row')).toBeVisible();
    await page.getByRole('button', { name: 'Next Question' }).click();

    // Step 5: Concept Y - Question 5
    await page.getByLabel('Raudra (Anger)').check();
    await page.getByRole('button', { name: 'Submit Answer' }).click();
    await expect(page.getByText('2 in a row')).toBeVisible();
    await page.getByRole('button', { name: 'Next Question' }).click();

    // Step 6: Concept Y - Question 6 (triggers session completion)
    await page.getByLabel('Ravana').check();
    await page.getByRole('button', { name: 'Submit Answer' }).click();

    // Verify Completion Screen
    await expect(page.getByText('Adaptive Session Complete!')).toBeVisible();
    await expect(page.getByText('Final Score: 6 / 6')).toBeVisible();
    await expect(page.getByText('Concepts Mastered: 2 / 2')).toBeVisible();

    // Return to Quiz Modes
    await page.getByRole('button', { name: 'Return to Quiz Modes' }).click();
    await expect(page.getByText('Choose Your Quest')).toBeVisible();

    // Start Session 2 (Cross-Session Cognitive Elevation)
    await adaptiveCard.click();
    await expect(page.getByText('Active Concept: Concept X')).toBeVisible();
    await expect(
      page.getByText(
        'Level 2 (Understand): Why does the Paccha character embody moral righteousness?',
      ),
    ).toBeVisible();
    await expect(page.getByLabel('Represents Satvika nature')).toBeVisible();
  });
});
