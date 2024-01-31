import { test, expect } from '@playwright/test'

test('Add and then delete a favorite stop.', async ({ page, context }) => {
  // Navigate to favorites tab
  await page.goto('/')
  await page.getByRole('listitem', { name: 'Favorites' }).getByRole('button').click()

  // Expect empty state
  await expect(page.getByRole('heading', { name: 'Favorite Stops' })).toBeVisible()
  await expect(page.getByText('You can select up to 3')).toBeVisible()

  // Change to bus selector tab
  await page.getByRole('listitem', { name: 'Selector' }).getByRole('button').click()
  await expect(page.getByRole('heading', { name: 'Bus Selector' })).toBeVisible()

  // Select first agency, click first stop
  await page.getByText(/^Agency$/).click()
  await page.getByRole('option').first().click()
  await page.getByText('Stop', { exact: true }).click()

  // Save stop option text, click favorite icon, change to favorites tab
  const stopOption = page.getByRole('option').first()
  const stopOptionText = await stopOption.innerText()
  await stopOption.click()
  await page.getByTestId('favoriteStop').click()
  await page.getByRole('listitem', { name: 'Favorites' }).getByRole('button').click()

  // Expect empty state to be replaced with a corresponding favorite
  await expect(page.getByText('You can select up to 3')).not.toBeVisible()
  const favLink = page.getByTestId('favoriteLink')
  const favLinkText = await favLink.innerText()
  expect(stopOptionText).toEqual(favLinkText)

  // Expect localStorage to contain the favorite
  let storage = await context.storageState()
  let favoritesEntry = storage.origins[0].localStorage.find(
    entry => entry.name === 'busmap-favorites'
  )
  expect(favoritesEntry).toBeTruthy()
  let favorites = JSON.parse(favoritesEntry?.value ?? 'null')
  expect(favorites.length).toEqual(1)
  expect(favorites[0].stop.title).toEqual(stopOptionText)

  // Delete the favorite and restore the empty state
  await page.locator('footer').getByRole('button').first().click()
  await expect(page.getByText('You can select up to 3')).toBeVisible()
  storage = await context.storageState()
  favoritesEntry = storage.origins[0].localStorage.find(
    entry => entry.name === 'busmap-favorites'
  )
  favorites = JSON.parse(favoritesEntry?.value ?? 'null')
  expect(favorites.length).toEqual(0)
})
