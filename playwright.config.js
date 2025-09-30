const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: /.*\.(spec|test)\.(js|ts)/,
  fullyParallel: true,
  forbidOnly: false,
  retries: 0,
  reporter: [
    ['line'],
    ['html', { open: 'always' }],
  ],
  use: { trace: 'on-first-retry', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});