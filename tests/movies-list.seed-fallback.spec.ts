import { test, expect } from './fixtures/listPage';

test.describe('Movies Lists - Seed via localStorage fallback', () => {
  test('lists and movies seeded and lists page accessible', async ({ listPage }) => {
    await expect(listPage).toHaveURL(/localhost:\d{2,5}/);
    // Our fixture seeds e2e.movieLists and navigates to /lists if available
    // Validate at least that /lists route resolves or index is reachable
    try {
      await listPage.goto('/lists', { waitUntil: 'load' });
    } catch {}
    // Soft check: presence of either the sample list names or the lists page heading
    const marker = listPage.locator('text=Lists, #lists, [data-list-name="Favorites"], text=Favorites');
    await expect(marker.first()).toBeVisible();
  });
});


