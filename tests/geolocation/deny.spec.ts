import { test, expect } from '@playwright/test'

test('Deny geolocation use selector to find stop.', async ({ page }) => {
  await page.goto('https://localhost/')
  await expect(page.getByText('Locating your position')).toBeVisible()
  await expect(
    page.getByText('Location permission denied. Check your OS or browser settings.')
  ).toBeVisible()
  await page.getByRole('button', { name: 'Selector' }).click()
  await page.getByText('Agency').click()
  await page.getByPlaceholder('Agencies ... (64)').fill('toronto')
  await page.getByRole('option', { name: 'Toronto Transit Commission' }).click()
  await page.getByText('Stop', { exact: true }).click()
  await page.getByRole('option', { name: 'Bathurst St At Neptune Dr' }).click()
  await expect(page.getByRole('heading', { name: 'Next Arrivals' })).toBeVisible()
})
