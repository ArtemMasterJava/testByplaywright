const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: /.*\.(spec|test)\.(js|ts)/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: process.env.CI ? [
    ['dot'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }]
  ] : [
    ['line'],
    ['html', { open: 'on-failure' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://demo.playwright.dev',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },
    // Mobile tests
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: process.env.CI ? undefined : {
    // Uncomment and configure if you have a local dev server
    // command: 'npm run dev',
    // port: 3000,
    // reuseExistingServer: !process.env.CI,
  },
});