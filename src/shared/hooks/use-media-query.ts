import { useEffect, useState } from 'react';

const supportsMatchMedia = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function';

/**
 * Acompanha uma media query em JS. Útil quando o estado do componente precisa
 * reagir ao breakpoint — ex.: fechar o menu mobile quando a tela passa para
 * desktop (girar o celular), senão o menu fica aberto e invisível.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    supportsMatchMedia() ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    if (!supportsMatchMedia()) return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}
