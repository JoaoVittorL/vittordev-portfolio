import { expect, test } from '@playwright/test';

test.describe('Navegação desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navega para cada seção pelo menu', async ({ page }) => {
    const nav = page.locator('header nav');

    await nav.getByRole('link', { name: 'Habilidades' }).click();
    await expect(page.locator('#skills')).toBeInViewport();

    await nav.getByRole('link', { name: 'Contato' }).click();
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('scrollspy destaca a seção visível', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();

    const activeLink = page.locator('header nav a[aria-current="true"]');
    await expect(activeLink).toHaveText(/Contato/);
  });

  test('header ganha fundo com blur após rolar', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toHaveClass(/bg-transparent/);

    await page.mouse.wheel(0, 600);
    await expect(header).toHaveClass(/bg-slate-950\/80/);
  });
});

test.describe('Navegação mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('abre o menu, navega e fecha ao clicar no link', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir menu' }).click();

    const mobileLink = page.getByRole('link', { name: 'Contato' }).last();
    await expect(mobileLink).toBeVisible();

    await mobileLink.click();

    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeVisible();
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('menu travado não deixa a página rolar por trás', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir menu' }).click();

    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe('hidden');

    await page.getByRole('button', { name: 'Fechar menu' }).click();
    const overflowAfter = await page.evaluate(() => document.body.style.overflow);
    expect(overflowAfter).toBe('');
  });
});
