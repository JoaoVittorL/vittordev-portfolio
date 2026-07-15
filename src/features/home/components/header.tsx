import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import NavLinks from '@/shared/components/nav-link';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Trava o scroll da página enquanto o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      {/* Progresso de leitura da página */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-accent-400/80"
        style={{ transform: `scaleX(${progress})` }}
      />
      {/* z-50 relativo: sem ele o overlay do menu mobile (z-40) cobre os botões */}
      <div className="container relative z-50 mx-auto px-4 md:px-6 flex justify-between items-center">

        <a href="#hero" className="font-display font-bold text-lg tracking-tight text-slate-200">
          João Vittor<span className="text-accent-400">.</span>
        </a>

        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks />
        </nav>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-slate-950/95 backdrop-blur z-40 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden flex flex-col justify-center items-center`}
      >
        <div className="flex flex-col space-y-6 text-2xl font-medium">
          <NavLinks mobile onClose={() => setMenuOpen(false)} />
        </div>
      </div>
    </header>
  );
};

export default Header;
