import { test, expect } from './fixtures/listPage';

test.describe('Movies List - Validation', () => {
  test('empty list name shows validation (if UI exists)', async ({ listPage }) => {
    await expect(listPage).toHaveURL(/localhost:\d{2,5}/);
    const createBtn = listPage.locator('[data-test="create-list"], [data-testid="create-list"], button:has-text("Create List")');
    if (!(await createBtn.count())) test.skip();
    await createBtn.first().click();
    const nameInput = listPage.locator('[data-test="list-name"], [name="listName"], input[placeholder*="List"]');
    await nameInput.fill('');
    await nameInput.press('Enter');
    const error = listPage.locator('[data-test="list-name-error"], .error:has-text("required")');
    await expect(error.first()).toBeVisible();
  });

  test('duplicate titles allowed or prevented (observe behavior)', async ({ listPage }) => {
    await expect(listPage).toHaveURL(/localhost:\d{2,5}/);
    const addMovie = listPage.locator('[data-test="add-movie"], [data-testid="add-movie"], button:has-text("Add Movie")');
    if (!(await addMovie.count())) test.skip();
    await addMovie.first().click();
    const title = '[data-test="movie-title"], [name="movieTitle"], input[placeholder*="Title"]';
    await listPage.fill(title, 'Duplicate Title');
    await listPage.press(title, 'Enter');
    await addMovie.first().click();
    await listPage.fill(title, 'Duplicate Title');
    await listPage.press(title, 'Enter');
    await expect(listPage.locator('text=Duplicate Title').first()).toBeVisible();
  });
});


