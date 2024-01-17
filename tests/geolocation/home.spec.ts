import { test, expect } from '@playwright/test'

test.use({
  geolocation: {
    latitude: 32.79578,
    longitude: -95.45166
  },
  permissions: ['geolocation']
})

test('Nearby stops for home address.', async ({ page }) => {
  await page.goto('https://localhost/')
  await page.getByRole('heading', { name: 'Nearby Stops' }).click()
  await expect(page.getByText('Monitoring your location.')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Indianapolis International' })
  ).toBeVisible()
})
