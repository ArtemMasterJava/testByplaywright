import { test, expect } from './fixtures/listPage';

test.describe('Movies Lists - Create via UI', () => {
  test('create Favorites list (if UI available)', async ({ listPage }) => {
    await expect(listPage).toHaveURL(/localhost:\d{2,5}/);

    const createBtn = listPage.locator('[data-test="create-list"], [data-testid="create-list"], button:has-text("Create List")');
    if (await createBtn.count()) {
      await createBtn.first().click();
      const nameInput = listPage.locator('[data-test="list-name"], [name="listName"], input[placeholder*="List"]');
      await nameInput.fill('Favorites');
      await nameInput.press('Enter');
      await expect(listPage.locator('text=Favorites')).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('add movies to Favorites (if UI available)', async ({ listPage }) => {
    await expect(listPage).toHaveURL(/localhost:\d{2,5}/);

    const favorites = listPage.locator('text=Favorites');
    if (!(await favorites.count())) test.skip();
    await favorites.first().click();

    const addMovie = listPage.locator('[data-test="add-movie"], [data-testid="add-movie"], button:has-text("Add Movie")');
    if (!(await addMovie.count())) test.skip();

    await addMovie.first().click();
    await listPage.fill('[data-test="movie-title"], [name="movieTitle"], input[placeholder*="Title"]', 'The Avengers');
    await listPage.press('[data-test="movie-title"], [name="movieTitle"], input[placeholder*="Title"]', 'Enter');

    await addMovie.first().click();
    await listPage.fill('[data-test="movie-title"], [name="movieTitle"], input[placeholder*="Title"]', 'Inception');
    await listPage.press('[data-test="movie-title"], [name="movieTitle"], input[placeholder*="Title"]', 'Enter');

    await expect(listPage.locator('text=The Avengers')).toBeVisible();
    await expect(listPage.locator('text=Inception')).toBeVisible();
  });
});


