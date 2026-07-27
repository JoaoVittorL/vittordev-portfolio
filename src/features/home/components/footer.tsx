import { ArrowUp } from 'lucide-react';
import React from 'react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="pb-safe border-t border-slate-800 pt-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-0">
          <h3 className="text-center text-2xl font-bold md:text-left">
            João Vittor<span className="text-accent-400">.</span>
          </h3>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-800 text-slate-400 transition-colors hover:border-accent-400/50 hover:text-accent-300"
            aria-label="Voltar ao topo"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
