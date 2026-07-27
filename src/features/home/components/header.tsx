import NavLinks from '@/shared/components/nav-link';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { Menu, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import MobileMenu from './mobile-menu';

const MOBILE_MENU_ID = 'mobile-menu';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const pendingHash = useRef<string | null>(null);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Girar o celular para landscape cruza o breakpoint md: a gaveta some por CSS
  // mas o estado continuaria aberto — e o scroll travado sem menu à vista.
  useEffect(() => {
    if (isDesktop) setMenuOpen(false);
  }, [isDesktop]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleNavigate = useCallback((href: string) => {
    pendingHash.current = href;
    setMenuOpen(false);
  }, []);

  // Navega só depois que a trava de scroll caiu (o unlock é um layout effect,
  // então já rodou quando este efeito executa).
  useEffect(() => {
    if (menuOpen || !pendingHash.current) return;

    const href = pendingHash.current;
    pendingHash.current = null;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      window.history.replaceState(null, '', href);
    });
  }, [menuOpen]);

  // Com o menu de tela cheia aberto, a barra some: a moldura do header
  // (fundo, borda, barra de progresso) cortaria o painel ao meio.
  const barSolid = scrolled && !menuOpen;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        barSolid
          ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-3'
          : 'bg-transparent py-5'
      }`}
      style={{
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* Progresso de leitura da página */}
      {!menuOpen && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-accent-400/80"
          style={{ transform: `scaleX(${progress})` }}
        />
      )}

      <div className="container relative mx-auto flex items-center justify-between px-4 md:px-6">
        <a
          href="#hero"
          onClick={closeMenu}
          className="font-display text-lg font-bold tracking-tight text-slate-200"
        >
          João Vittor<span className="text-accent-400">.</span>
        </a>

        <nav aria-label="Navegação principal" className="hidden items-center space-x-8 md:flex">
          <NavLinks />
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          // -mr-2.5 mantém o alinhamento óptico com o alvo de toque de 44px
          className="-mr-2.5 flex h-11 w-11 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100 active:bg-slate-800 md:hidden"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls={MOBILE_MENU_ID}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <MobileMenu
        id={MOBILE_MENU_ID}
        open={menuOpen}
        onClose={closeMenu}
        onNavigate={handleNavigate}
        triggerRef={toggleRef}
      />
    </header>
  );
};

export default Header;
