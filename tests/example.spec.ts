import { test, expect } from './fixtures/listPage';

test.describe('Sanity check', () => {
  test('fixture loads localhost', async ({ listPage }) => {
    await expect(listPage).toHaveURL(/localhost:\d{2,5}/);
  });
});
