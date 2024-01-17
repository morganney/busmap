import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'list',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://localhost',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry'
  },

  /* Configure projects for major browsers */
  projects: process.env.CI
    ? [
        /**
         * Ubuntu and mkcert issues with Chrome / Firefox
         * @see https://github.com/FiloSottile/mkcert/issues/447
         *
         * Other option is to use macos GitHub action runner and
         * install docker, etc. Could also, use `ignoreHTTPSErrors`
         * from playwright in the test specs to cover more browsers.
         */
        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] }
        },

        /* Test against mobile viewports. */
        {
          name: 'Mobile Safari',
          use: { ...devices['iPhone 12'] }
        }
      ]
    : [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] }
        }
      ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: process.env.CI
      ? 'docker compose -f compose.yaml up --attach-dependencies stage'
      : 'docker compose up --attach-dependencies dev',
    ignoreHTTPSErrors: true,
    url: 'https://localhost/healthcheck',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000 * 7
  }
})
