import { test, expect } from '@playwright/test'

test.use({
  geolocation: {
    latitude: 43.69786,
    longitude: -79.39712
  },
  permissions: ['geolocation']
})

test('Nearby stops for Toronto Transit Commission.', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('listitem', { name: 'Nearby' }).getByRole('button').click()
  await expect(page.getByRole('heading', { name: 'Nearby Stops' })).toBeVisible()
  await expect(page.getByText('Monitoring your location.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Toronto TTC' })).toBeVisible({
    timeout: 10_000
  })

  // Check that route headings are visible
  await expect(page.getByRole('heading', { level: 4 }).first()).toBeVisible()

  // Get the stop title link and save the innerText
  const link = page.getByRole('heading', { level: 5 }).first().getByRole('link')
  const linkText = await link.innerText()

  // Click the stop link and check that predictions are rendered with users distance from stop
  await link.click()
  await expect(page.getByRole('heading', { name: 'Next Departures' })).toBeVisible({
    timeout: 7_000
  })
  await expect(page.getByText(/You are .+ miles away/)).toBeVisible()

  // Close the flyout menu and check the map for user and stop markers
  await page.locator('button').filter({ hasText: 'Close' }).click()
  await page.getByRole('button', { name: 'Marker' }).click()
  await expect(page.locator('.leaflet-marker-icon').first()).toBeVisible()
  await expect(page.locator('#map').getByText(linkText)).toBeVisible()
})
