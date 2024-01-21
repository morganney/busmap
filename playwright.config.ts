import { env } from 'node:process'

import { defineConfig, devices } from '@playwright/test'

const { CI, TEST_BASE_URL } = env
const ciBrowsers = [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      ignoreHTTPSErrors: Boolean(CI)
    }
  },
  {
    name: 'Mobile Safari',
    use: { ...devices['iPhone 12'] }
  }
]
const devBrowsers = [
  ...ciBrowsers,
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
  {
    name: 'Mobile Chrome',
    use: {
      ...devices['Pixel 5'],
      ignoreHTTPSErrors: Boolean(CI)
    }
  }
]
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: CI ? 1 : 0,
  workers: CI ? 1 : undefined,
  reporter: 'list',
  /**
   * Shared settings for all the projects below.
   * @see https://playwright.dev/docs/api/class-testoptions
   */
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: TEST_BASE_URL ?? 'https://localhost',
    trace: 'on-first-retry'
  },
  projects: CI ? ciBrowsers : devBrowsers,
  webServer: TEST_BASE_URL
    ? undefined
    : {
        command: CI
          ? 'docker compose -f compose.yaml up --attach-dependencies stage'
          : 'docker compose up --attach-dependencies dev',
        ignoreHTTPSErrors: true,
        url: 'https://localhost/healthcheck',
        reuseExistingServer: !CI,
        timeout: 60_000 * 7
      }
})
