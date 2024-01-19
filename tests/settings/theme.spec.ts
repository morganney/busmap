import { test, expect } from '@playwright/test'

test('Change setting theme from light to dark.', async ({ page }) => {
  await page.goto('/')
  const flyout = page.getByTestId('flyout')

  await expect(flyout).toHaveCSS('background', /rgba\(255, 255, 255, 0\.8\)/)
  await page.getByRole('listitem', { name: 'Settings' }).getByRole('button').click()
  await page.getByRole('tab', { name: 'Theme' }).click()
  await page.getByLabel('dark').check()
  await expect(flyout).toHaveCSS('background', /rgba\(25, 25, 25, 0\.8\)/)
  await page.reload()
  await expect(flyout).toHaveCSS('background', /rgba\(25, 25, 25, 0\.8\)/)
})
