import { test, expect } from '@playwright/test'

test.use({
  geolocation: {
    latitude: 34.10865,
    longitude: -117.325531
  },
  permissions: ['geolocation']
})

test('Nearby stops for OmniTrans.', async ({ page }) => {
  await page.goto('https://localhost/')
  await expect(page.getByRole('heading', { name: 'Omnitrans' })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: '14 Fontana-Foothill-San Bdno' }).first()
  ).toBeVisible()
  await page.getByRole('link', { name: '5th @ Medical Ctr Wb Fs' }).click()
  await expect(page.getByRole('heading', { name: 'Next Arrivals' })).toBeVisible()
  await expect(page.getByText(/You are .+ miles away/)).toBeVisible()
  await page.getByRole('button', { name: 'Marker' }).click()
  await expect(page.locator('#map').getByText('5th @ Medical Ctr Wb Fs')).toBeVisible()
})
