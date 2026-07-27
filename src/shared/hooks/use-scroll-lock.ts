import { useLayoutEffect } from 'react';

/**
 * Trava o scroll da página enquanto um overlay está aberto.
 *
 * `overflow: hidden` no body sozinho não resolve: o iOS Safari ignora e a
 * página continua rolando por trás do overlay. A estratégia confiável é fixar
 * o body na posição atual e devolver o scroll ao destravar.
 *
 * Roda como layout effect para que o destravamento seja síncrono — quem depende
 * de rolar até uma âncora logo depois (ex.: clicar num link do menu) precisa
 * que o body já esteja liberado antes do scroll.
 */
export function useScrollLock(locked: boolean) {
  useLayoutEffect(() => {
    if (!locked) return;

    const { body } = document;
    const html = document.documentElement;
    const scrollY = window.scrollY;
    // Compensa a scrollbar para o conteúdo não "saltar" no desktop (0 no mobile)
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
      overscrollBehavior: html.style.overscrollBehavior,
    };

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    // Impede pull-to-refresh e scroll chaining enquanto o overlay está aberto
    html.style.overscrollBehavior = 'none';

    return () => {
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      body.style.paddingRight = previous.paddingRight;
      html.style.overscrollBehavior = previous.overscrollBehavior;

      // Devolve a posição exata — sem isso o usuário volta pro topo da página.
      // `instant` é obrigatório: o html tem `scroll-behavior: smooth`, então um
      // scrollTo comum animaria a volta e a página deslizaria sozinha.
      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
    };
  }, [locked]);
}
