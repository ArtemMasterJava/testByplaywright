import { test, expect } from './fixtures/listPage';

test.describe('Managing Movies in a List (Localhost)', () => {
  test('Reach localhost and ensure fixture executed (smoke)', async ({ listPage }) => {
    await expect(listPage).toHaveURL(/localhost:\d{2,5}/);
  });
});
