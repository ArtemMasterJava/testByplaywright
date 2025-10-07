import { test, expect } from './fixtures/listPage';

test.describe('Movies List - Performance', () => {
  test('add many movies remains responsive (if UI available)', async ({ listPage }) => {
    await expect(listPage).toHaveURL(/localhost:\d{2,5}/);
    const addMovie = listPage.locator('[data-test="add-movie"], [data-testid="add-movie"], button:has-text("Add Movie")');
    if (!(await addMovie.count())) test.skip();
    const titleSelector = '[data-test="movie-title"], [name="movieTitle"], input[placeholder*="Title"]';
    for (let i = 0; i < 50; i++) {
      await addMovie.first().click();
      await listPage.fill(titleSelector, `Movie ${i}`);
      await listPage.press(titleSelector, 'Enter');
    }
    await expect(listPage.locator('text=Movie 0').first()).toBeVisible();
  });
});


