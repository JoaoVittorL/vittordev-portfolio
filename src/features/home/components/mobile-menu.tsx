import NavLinks from '@/shared/components/nav-link';
import { useScrollLock } from '@/shared/hooks/use-scroll-lock';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface MobileMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
  /** Recebe o hash do destino; o pai navega depois de destravar o scroll. */
  onNavigate: (href: string) => void;
  /** Botão que abre o menu — entra no ciclo de foco e recebe o foco de volta. */
  triggerRef: React.RefObject<HTMLButtonElement>;
}

/**
 * Menu de navegação mobile em tela cheia.
 *
 * Vai para `document.body` via portal de propósito: o header usa
 * `backdrop-filter` quando a página é rolada, e um ancestral com
 * backdrop-filter/filter/transform passa a ser o containing block dos
 * descendentes `position: fixed`. Dentro do header, o overlay `inset-0`
 * encolhia para a caixa do header em vez de cobrir a viewport.
 */
const MobileMenu: React.FC<MobileMenuProps> = ({
  id,
  open,
  onClose,
  onNavigate,
  triggerRef,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      // O botão do header entra no ciclo: é a única forma de fechar pelo teclado
      const focusables = [
        ...(triggerRef.current ? [triggerRef.current] : []),
        ...Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)),
      ];
      if (!focusables.length) return;

      const current = focusables.indexOf(document.activeElement as HTMLElement);
      const step = event.shiftKey ? -1 : 1;
      const next = (current + step + focusables.length) % focusables.length;

      event.preventDefault();
      focusables[next]?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, triggerRef]);

  return createPortal(
    // `invisible` (e não só opacity) tira os links da ordem de tabulação e da
    // árvore de acessibilidade quando fechado.
    <div
      className={`fixed inset-0 z-40 md:hidden ${open ? 'visible' : 'invisible'}`}
      aria-hidden={!open}
    >
      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={`flex h-full w-full flex-col bg-slate-950 transition-opacity duration-300 ease-out ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 6rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)',
          paddingLeft: 'max(1.5rem, env(safe-area-inset-left))',
          paddingRight: 'max(1.5rem, env(safe-area-inset-right))',
        }}
      >
        {/* Textura sutil, o mesmo grid do hero — o menu não fica um vazio chapado */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(30_41_59/0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgb(30_41_59/0.35)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_35%,black,transparent)]"
        />

        {/* flex-1 + justify-center: os links ficam no centro óptico da tela em
            vez de amontoados no topo, e o rodapé segue ancorado embaixo. */}
        <nav
          aria-label="Navegação principal"
          data-open={open}
          className="menu-stagger relative flex flex-1 flex-col justify-center"
        >
          <NavLinks mobile onNavigate={onNavigate} />
        </nav>

        <div className="relative flex items-center justify-between gap-4 border-t border-slate-800 pt-6">
          <span className="eyebrow">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
            </span>
            Disponível
          </span>
          <span className="font-mono text-xs text-slate-600">João Vittor</span>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default MobileMenu;
