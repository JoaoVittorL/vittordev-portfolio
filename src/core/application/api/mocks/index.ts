import { env } from '@/env';
import { setupWorker } from 'msw/browser';

export const worker = setupWorker();

export async function enableMSW() {
  // Service worker de mock apenas em desenvolvimento.
  // Em 'test' (E2E) ele interceptaria a rede antes do Playwright,
  // impedindo o page.route() de funcionar.
  if (env.MODE !== 'development') {
    return;
  }

  await worker.start();
}