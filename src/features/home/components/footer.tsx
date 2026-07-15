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
    <footer className="border-t border-slate-800 py-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-6 text-center md:mb-0 md:text-left">
            <h3 className="mb-2 text-2xl font-bold">
              João Vittor<span className="text-accent-400">.</span>
            </h3>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <button
              onClick={scrollToTop}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-800 text-slate-400 transition-colors hover:border-accent-400/50 hover:text-accent-300"
              aria-label="Voltar ao topo"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
