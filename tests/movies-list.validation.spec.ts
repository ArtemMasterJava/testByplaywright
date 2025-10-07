import { test, expect } from '../tests/fixtures/listPage';

test.describe('Accessibility Smoke', () => {
  test('key interactive controls have accessible names/roles', async ({ listPage }) => {
    // Verify "Create List" button is accessible
    const createList = await listPage.getByRole('button', { name: /create list/i });
    await expect(createList).toBeVisible();

    // Verify "Add Movie" button is accessible
    const addMovie = await listPage.getByRole('button', { name: /add movie/i });
    await expect(addMovie).toBeVisible();

    // Verify "Edit" button is accessible
    const edit = await listPage.getByRole('button', { name: /edit/i });
    await expect(edit).toBeVisible();

    // Verify "Delete" button is accessible
    const del = await listPage.getByRole('button', { name: /delete/i });
    await expect(del).toBeVisible();
  });
});