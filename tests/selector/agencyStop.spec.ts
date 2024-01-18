import { test, expect } from '@playwright/test'

test('Select an agency and stop to see arrivals.', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('listitem', { name: 'Selector' }).getByRole('button').click()
  await expect(page.getByRole('heading', { name: 'Bus Selector' })).toBeVisible()
  await page.getByText('Agency').click()
  await page.getByRole('option', { name: 'Toronto Transit Commission' }).click()
  await page.getByText('Stop', { exact: true }).click()
  await page.getByRole('option', { name: 'Bathurst St At Neptune Dr' }).click()
  await expect(page.getByRole('heading', { name: 'Next Arrivals' })).toBeVisible()
  await page.locator('button').filter({ hasText: 'Close' }).click()
  await page.getByRole('button', { name: 'Marker' }).click()
  await page.locator('#map').getByText('Bathurst St At Neptune Dr').click()
})
