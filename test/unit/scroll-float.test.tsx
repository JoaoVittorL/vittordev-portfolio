import { render, screen } from '@testing-library/react';

import ScrollFloat from '@/shared/components/scroll-float';

describe('ScrollFloat', () => {
  it('mantém o nome acessível íntegro apesar de quebrar o texto em letras', () => {
    render(<ScrollFloat>Minhas Habilidades</ScrollFloat>);

    expect(screen.getByRole('heading', { name: 'Minhas Habilidades' })).toBeInTheDocument();
  });

  it('esconde a versão animada do leitor de tela', () => {
    const { container } = render(<ScrollFloat>Meus Projetos</ScrollFloat>);

    const animated = container.querySelector('[aria-hidden="true"]');
    expect(animated).toBeInTheDocument();
    expect(animated!.querySelectorAll('[data-char]').length).toBe('MeusProjetos'.length);
  });

  it('agrupa as letras por palavra para a linha não quebrar no meio', () => {
    const { container } = render(<ScrollFloat>Entre em Contato</ScrollFloat>);

    const words = container.querySelectorAll('.whitespace-nowrap');
    expect(words.length).toBe(3);
    expect(words[0].textContent).toBe('Entre');
    expect(words[2].textContent).toBe('Contato');
  });

  it('repassa a className para o heading', () => {
    render(<ScrollFloat className="text-5xl font-bold">Sobre mim</ScrollFloat>);

    expect(screen.getByRole('heading', { name: 'Sobre mim' }).className).toContain('text-5xl');
  });
});
