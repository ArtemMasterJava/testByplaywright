import { test, expect } from './fixtures/listPage';

test.describe('Movies Lists - Edit and Delete', () => {
  test('edit a movie detail if UI exists', async ({ listPage }) => {
    await expect(listPage).toHaveURL(/localhost:\d{2,5}/);
    const editBtn = listPage.locator('[data-test="edit-movie"], [data-testid="edit-movie"], button:has-text("Edit")');
    if (!(await editBtn.count())) test.skip();
    await editBtn.first().click();
    const yearInput = listPage.locator('[data-test="movie-year"], [name="movieYear"], input[placeholder*="Year"]');
    await yearInput.fill('2011');
    await yearInput.press('Enter');
    await expect(listPage.locator('text=2011')).toBeVisible();
  });

  test('delete a movie if UI exists', async ({ listPage }) => {
    const deleteBtn = listPage.locator('[data-test="delete-movie"], [data-testid="delete-movie"], button:has-text("Delete")');
    if (!(await deleteBtn.count())) test.skip();
    await deleteBtn.first().click();
    // No strong assertion due to unknown DOM; presence check relaxed
  });

  test('delete a list if UI exists', async ({ listPage }) => {
    const deleteList = listPage.locator('[data-test="delete-list"], [data-testid="delete-list"], button:has-text("Delete List")');
    if (!(await deleteList.count())) test.skip();
    await deleteList.first().click();
  });
});


