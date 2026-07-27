import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  testMatch: '**/*.e2e-spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? // O reporter `github` publica cada falha como annotation (arquivo, linha e
      // mensagem). Sem ele o GitHub mostra apenas "Process completed with exit
      // code 1" e não há como diagnosticar sem baixar o artefato.
      [['list'], ['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:50789',
    // Rastro e screenshot da falha ficam no relatório enviado como artefato
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'pnpm dev:test',
    url: 'http://localhost:50789',
    reuseExistingServer: !process.env.CI,
  },
});
