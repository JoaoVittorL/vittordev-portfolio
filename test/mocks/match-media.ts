import { vi } from 'vitest';

type ChangeListener = (event: MediaQueryListEvent) => void;

interface QueryState {
  matches: boolean;
  listeners: Set<ChangeListener>;
}

const registry = new Map<string, QueryState>();

/**
 * Substitui window.matchMedia por um mock.
 * Passe um mapa de queries → boolean para simular media queries específicas
 * (ex.: { '(prefers-reduced-motion: reduce)': true }).
 *
 * Use `setMatchMedia` para mudar o resultado depois da renderização e notificar
 * os listeners — necessário para testar reações a breakpoint (girar a tela).
 */
export function mockMatchMedia(matches: Record<string, boolean> = {}) {
  registry.clear();

  Object.entries(matches).forEach(([query, value]) => {
    registry.set(query, { matches: value, listeners: new Set() });
  });

  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    const state = registry.get(query) ?? { matches: false, listeners: new Set() };
    registry.set(query, state);

    return {
      get matches() {
        return state.matches;
      },
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (_type: string, listener: ChangeListener) => {
        state.listeners.add(listener);
      },
      removeEventListener: (_type: string, listener: ChangeListener) => {
        state.listeners.delete(listener);
      },
      dispatchEvent: vi.fn(),
    };
  }) as unknown as typeof window.matchMedia;
}

/** Muda o resultado de uma media query e dispara o evento `change`. */
export function setMatchMedia(query: string, matches: boolean) {
  const state = registry.get(query) ?? { matches, listeners: new Set<ChangeListener>() };
  state.matches = matches;
  registry.set(query, state);

  state.listeners.forEach((listener) =>
    listener({ matches, media: query } as MediaQueryListEvent),
  );
}
