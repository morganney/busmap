import { test, expect } from '@playwright/test'

test.use({
  geolocation: {
    latitude: 43.69786,
    longitude: -79.39712
  },
  permissions: ['geolocation']
})

test('Nearby stops for Toronto Transit Commission.', async ({ page }) => {
  await page.goto('https://localhost/')
  await expect(page.getByRole('heading', { name: 'Nearby Stops' })).toBeVisible()
  await expect(page.getByText('Monitoring your location.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Toronto TTC' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '-Glencairn' }).first()).toBeVisible()
  await page
    .locator('header')
    .filter({ hasText: 'Davisville StationWest - 14' })
    .getByRole('link')
    .click()
  await expect(page.getByRole('heading', { name: 'Next Departures' })).toBeVisible()
  await expect(page.getByText(/You are .+ miles away/)).toBeVisible()

  // Close the flyout menu before clicking map marker (necessary for mobile viewports).
  await page.getByRole('navigation').locator('ul > li:last-child button').click()

  await page.getByRole('button', { name: 'Marker' }).click()
  await expect(page.locator('#map').getByText('Davisville Station')).toBeVisible()
})
