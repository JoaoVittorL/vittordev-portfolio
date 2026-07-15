import { vi } from 'vitest';

/**
 * Substitui window.matchMedia por um mock.
 * Passe um mapa de queries → boolean para simular media queries específicas
 * (ex.: { '(prefers-reduced-motion: reduce)': true }).
 */
export function mockMatchMedia(matches: Record<string, boolean> = {}) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}
