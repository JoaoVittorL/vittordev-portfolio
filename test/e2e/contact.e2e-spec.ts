import { expect, test } from '@playwright/test';

test.describe('Seção de contato', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
  });

  test('mostra erros de validação ao enviar o formulário vazio', async ({ page }) => {
    await page.getByRole('button', { name: 'Enviar' }).click();

    await expect(page.getByText(/O nome .* obrigat/)).toBeVisible();
    await expect(page.getByText(/O email .* obrigat/)).toBeVisible();
  });

  test('envia o formulário com sucesso (rede interceptada)', async ({ page }) => {
    // Intercepta a API do EmailJS — nenhum email real é enviado
    await page.route('https://api.emailjs.com/**', (route) =>
      route.fulfill({ status: 200, contentType: 'text/plain', body: 'OK' }),
    );

    await page.getByPlaceholder('Digite seu nome').fill('Recruiter Teste');
    await page.getByPlaceholder('Digite seu email').fill('recruiter@empresa.com');
    await page.getByPlaceholder('Digite sua mensagem').fill('Gostei do portfólio!');

    await page.getByRole('button', { name: 'Enviar' }).click();

    await expect(page.getByText('Email enviado com sucesso', { exact: false })).toBeVisible();
    // Formulário limpo após sucesso
    await expect(page.getByPlaceholder('Digite seu nome')).toHaveValue('');
  });

  test('mostra toast de erro quando a API falha', async ({ page }) => {
    await page.route('https://api.emailjs.com/**', (route) =>
      route.fulfill({ status: 500, contentType: 'text/plain', body: 'error' }),
    );

    await page.getByPlaceholder('Digite seu nome').fill('Teste');
    await page.getByPlaceholder('Digite seu email').fill('teste@teste.com');
    await page.getByPlaceholder('Digite sua mensagem').fill('mensagem');

    await page.getByRole('button', { name: 'Enviar' }).click();

    await expect(page.getByText('Ocorreu um erro ao enviar a mensagem.')).toBeVisible();
    // Botão volta a ficar habilitado (sem travar em "Enviando...")
    await expect(page.getByRole('button', { name: 'Enviar' })).toBeEnabled();
  });

  test('tem os links de contato direto: WhatsApp, email e redes', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      /wa\.me\/5577981314622/,
    );
    await expect(
      page.getByRole('link', { name: 'vittorsantos234@gmail.com' }),
    ).toHaveAttribute('href', 'mailto:vittorsantos234@gmail.com');
    await expect(page.locator('#contact').getByRole('link', { name: 'GitHub' })).toBeVisible();
    await expect(page.locator('#contact').getByRole('link', { name: 'LinkedIn' })).toBeVisible();
  });
});
