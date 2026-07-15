import { expect, test } from '@playwright/test';

test.describe('Página inicial', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('carrega com o título correto', async ({ page }) => {
    await expect(page).toHaveTitle(/Vittordev/);
  });

  test('mostra o hero com nome e badge de disponibilidade', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Vittor');
    await expect(page.getByText('Disponível para novas oportunidades')).toBeVisible();
  });

  test('renderiza as seções visíveis e oculta projetos', async ({ page }) => {
    await expect(page.locator('#hero')).toBeAttached();
    await expect(page.locator('#about')).toBeAttached();
    await expect(page.locator('#skills')).toBeAttached();
    await expect(page.locator('#contact')).toBeAttached();
    await expect(page.locator('#projects')).toHaveCount(0);
  });

  test('revela o conteúdo do hero (animação de entrada)', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveClass(/is-revealed/);
  });

  test('CTA "Vamos conversar" leva à seção de contato', async ({ page }) => {
    await page.getByRole('link', { name: 'Vamos conversar' }).click();
    await expect(page.locator('#contact')).toBeInViewport();
  });
});
