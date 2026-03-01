import { defineConfig } from '@playwright/test';


export const baseUrl = 'http://localhost:5173'

export default defineConfig({
    testDir: './tests', // Define the folder where your test files will be stored
    testMatch: '**/*.test.ts', // Define the file pattern for test files
    timeout: 60000, // Maximum test time (in milliseconds)
    retries: 2, // Retry failed tests twice
    webServer: {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },    
    use: {
      headless: true, // Run tests in headless mode
      viewport: { width: 1280, height: 720 },
      video: 'retain-on-failure', // Record video on test failure
      baseURL: baseUrl, // Base URL for all tests
      screenshot: 'only-on-failure', // Take screenshots only on test failure
      actionTimeout: 15000, // Timeout for individual actions
      navigationTimeout: 30000, // Timeout for page navigation
    },
    projects: [
      {
        name: 'chromium',
        use: { browserName: 'chromium' },
      },
      // Just going to test on Chromium so that tests run faster
      // {
      //   name: 'firefox',
      //   use: { browserName: 'firefox' },
      // },
      // {
      //   name: 'webkit',
      //   use: { browserName: 'webkit' },
      // },
    ],
  });