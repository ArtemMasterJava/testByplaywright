import { test, expect } from './fixtures/listPage';

test.describe('Movies Lists - Persistence', () => {
  test('lists persist across reload (fallback to localStorage seed)', async ({ listPage }) => {
    await expect(listPage).toHaveURL(/localhost:\d{2,5}/);
    await listPage.reload({ waitUntil: 'load' });
    // Expect either our seeded keys or visible list names
    const favorites = listPage.locator('text=Favorites');
    await expect(favorites.first()).toBeVisible();
  });
});


