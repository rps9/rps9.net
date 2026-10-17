import { test, expect } from '@playwright/test';

test('homepage renders with working assets and no runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Hi, I'm Ryan Smith/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'github.com/rps9' })).toBeVisible();
  await expect.poll(() => page.locator('img').evaluateAll(images =>
    images.filter(image => !image.complete || image.naturalWidth === 0).length,
  )).toBe(0);
  expect(errors).toEqual([]);
});

test('direct links and sign-in errors work without contacting production', async ({ page }) => {
  await page.route('https://rps9.net/api/**', route => route.fulfill({
    status: 401, contentType: 'application/json',
    body: JSON.stringify({ detail: 'invalid credentials' }),
  }));
  await page.goto('/sign-in');
  await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
  await page.getByLabel('Username', { exact: true }).fill('testuser');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText('invalid credentials', { exact: true })).toBeVisible();
  await page.goto('/darts');
  await expect(page.getByRole('heading').first()).toBeVisible();
});
