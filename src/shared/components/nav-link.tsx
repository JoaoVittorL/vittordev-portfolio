import { useActiveSection } from '@/shared/hooks/use-active-section';
import React from 'react';

interface NavLinksProps {
  mobile?: boolean;
  /**
   * Só no modo mobile: recebe o hash do destino em vez de deixar o browser
   * navegar. Quem trata precisa destravar o scroll antes de rolar até a seção.
   */
  onNavigate?: (href: string) => void;
}

const links = [
  { href: "#hero", label: "Início" },
  { href: "#about", label: "Sobre" },
  { href: "#skills", label: "Habilidades" },
  // { href: "#projects", label: "Projetos" },
  { href: "#contact", label: "Contato" }
] as const;

const sectionIds = links.map((link) => link.href.slice(1));

const NavLinks: React.FC<NavLinksProps> = ({ mobile, onNavigate }) => {
  const activeSection = useActiveSection(sectionIds);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!mobile || !onNavigate) return;
    // O menu precisa fechar (e destravar o body) antes do scroll — se o browser
    // navegar agora, o pulo para a âncora é engolido pela trava de scroll.
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <>
      {links.map((link, index) => {
        const isActive = activeSection === link.href.slice(1);

        if (mobile) {
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleClick(event, link.href)}
              // aria-label mantém o nome acessível limpo — o número é decorativo
              aria-label={link.label}
              aria-current={isActive ? 'true' : undefined}
              // min-h-[56px]: alvo confortável num menu de tela cheia
              className={`group relative flex min-h-[56px] items-center gap-4 border-b border-slate-800/70 font-display text-3xl font-bold tracking-tight transition-colors duration-200 last:border-b-0 ${
                isActive ? 'text-accent-300' : 'text-slate-200 active:text-accent-300'
              }`}
              style={{ '--reveal-delay': `${index * 60}ms` } as React.CSSProperties}
            >
              <span
                aria-hidden="true"
                className={`font-mono text-xs font-normal tabular-nums ${
                  isActive ? 'text-accent-400' : 'text-slate-600'
                }`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              {link.label}
              <span
                aria-hidden="true"
                className={`ml-auto h-1.5 w-1.5 rounded-full bg-accent-400 transition-opacity duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </a>
          );
        }

        return (
          <a
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'true' : undefined}
            className={`group relative text-sm transition-colors duration-300 hover:text-slate-100 ${
              isActive ? 'text-slate-100' : 'text-slate-400'
            }`}
          >
            {link.label}
            <span
              aria-hidden="true"
              className={`absolute -bottom-1 left-0 h-0.5 bg-accent-400 transition-all duration-300 group-hover:w-full ${
                isActive ? 'w-full' : 'w-0'
              }`}
            />
          </a>
        );
      })}
    </>
  );
};
export default NavLinks;
