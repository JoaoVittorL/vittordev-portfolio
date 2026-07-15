import { expect, test } from '@playwright/test';

test.describe('Filtro de habilidades', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#skills').scrollIntoViewIfNeeded();
  });

  test('mostra todas as skills por padrão', async ({ page }) => {
    await expect(page.getByText('React', { exact: true })).toBeVisible();
    await expect(page.getByText('SQL', { exact: true })).toBeVisible();
  });

  test('filtra por categoria Backend', async ({ page }) => {
    await page.getByRole('button', { name: 'Backend' }).click();

    await expect(page.getByText('SQL', { exact: true })).toBeVisible();
    await expect(page.getByText('Node', { exact: true })).toBeVisible();
    await expect(page.getByText('Tailwind CSS', { exact: true })).toHaveCount(0);
  });

  test('volta a mostrar tudo ao clicar em "Tudo"', async ({ page }) => {
    await page.getByRole('button', { name: 'Backend' }).click();
    await page.getByRole('button', { name: 'Tudo' }).click();

    await expect(page.getByText('React', { exact: true })).toBeVisible();
    await expect(page.getByText('SQL', { exact: true })).toBeVisible();
  });
});
