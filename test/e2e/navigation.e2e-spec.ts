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

  test('o menu ocupa a tela inteira mesmo com a página rolada', async ({ page }) => {
    // Regressão: o header ganha backdrop-blur ao rolar e, como o painel morava
    // dentro dele, o `position: fixed` passava a se posicionar relativo ao
    // header — o menu encolhia para a altura da barra.
    await page.locator('#about').scrollIntoViewIfNeeded();
    await expect(page.locator('header')).toHaveClass(/backdrop-blur-md/);

    await page.getByRole('button', { name: 'Abrir menu' }).click();

    const dialog = page.getByRole('dialog', { name: 'Menu de navegação' });
    const box = (await dialog.boundingBox())!;
    const viewport = page.viewportSize()!;

    expect(box.height).toBeGreaterThanOrEqual(viewport.height - 1);
    expect(box.width).toBeGreaterThanOrEqual(viewport.width - 1);
    expect(box.x).toBeLessThanOrEqual(1);
    expect(box.y).toBeLessThanOrEqual(1);
    await expect(dialog.getByRole('link', { name: 'Contato' })).toBeVisible();

    // A barra do header some para não cortar o painel ao meio
    await expect(page.locator('header')).not.toHaveClass(/border-b/);
  });

  test('o conteúdo da página não vaza por cima do menu', async ({ page }) => {
    await page.locator('#skills').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Abrir menu' }).click();

    // O painel é opaco: o que está no meio da tela tem de ser um link do menu
    const viewport = page.viewportSize()!;
    const onTop = await page.evaluate(
      ([x, y]) => {
        const el = document.elementFromPoint(x, y);
        return el?.closest('[role="dialog"]') !== null;
      },
      [viewport.width / 2, viewport.height / 2],
    );
    expect(onTop).toBe(true);
  });

  test('navega para a seção ao clicar num link com a página já rolada', async ({ page }) => {
    await page.locator('#skills').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Abrir menu' }).click();

    const dialog = page.getByRole('dialog', { name: 'Menu de navegação' });
    await dialog.getByRole('link', { name: 'Sobre' }).click();

    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeVisible();
    await expect(page.locator('#about')).toBeInViewport();

    // O título não pode ficar escondido atrás do header fixo
    const heading = (await page.getByRole('heading', { name: 'Sobre mim' }).boundingBox())!;
    const headerBox = (await page.locator('header').boundingBox())!;
    expect(heading.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height);
  });

  test('fecha com Escape', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.keyboard.press('Escape');

    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'Menu de navegação' })).not.toBeVisible();
  });

  test('devolve o scroll na posição em que estava ao fechar', async ({ page }) => {
    await page.locator('#skills').scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);

    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('button', { name: 'Fechar menu' }).click();

    const after = await page.evaluate(() => window.scrollY);
    expect(Math.abs(after - before)).toBeLessThan(2);
  });

  test('não gera scroll horizontal', async ({ page }) => {
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflows).toBe(false);
  });
});
