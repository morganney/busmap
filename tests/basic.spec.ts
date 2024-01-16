import { test, expect } from '@playwright/test'

test('has title', async ({ browser }) => {
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true })
  const page = await ctx.newPage()

  await page.goto('/')
  await expect(page).toHaveTitle(/Busmap/)
})
