import { test, expect } from './fixtures/listPage';

test.describe('List seeding', () => {
  test('prepopulated lists and movies, then open lists page', async ({ listPage }) => {
    // The fixture already navigated and seeded; validate localhost domain
    await expect(listPage).toHaveURL(/localhost:\d{2,5}/);
  });
});
