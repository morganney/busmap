import { test, expect } from '@playwright/test'

test.beforeEach(async ({ context }) => {
  await context.clearPermissions()
})

test('Deny geolocation use selector to find stop.', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByText('Location permission denied. Check your OS or browser settings.')
  ).toBeVisible()
  await page.getByRole('listitem', { name: 'Selector' }).getByRole('button').click()
  await expect(page.getByRole('heading', { name: 'Bus Selector' })).toBeVisible()
  await page.getByText('Agency').click()
  await page.getByPlaceholder('Agencies ... (64)').fill('toronto')
  await page.getByRole('option', { name: 'Toronto Transit Commission' }).click()
  await page.getByText('Stop', { exact: true }).click()
  await page.getByRole('option', { name: 'Bathurst St At Neptune Dr' }).click()
  await expect(page.getByRole('heading', { name: 'Next Arrivals' })).toBeVisible()
})
