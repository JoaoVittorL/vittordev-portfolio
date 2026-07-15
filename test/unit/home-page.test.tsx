import { render, screen } from '@testing-library/react';

import { HomePage } from '@/features/home/pages';

describe('HomePage', () => {
  it('renderiza todas as seções visíveis na ordem', () => {
    const { container } = render(<HomePage />);

    expect(container.querySelector('#hero')).toBeInTheDocument();
    expect(container.querySelector('#about')).toBeInTheDocument();
    expect(container.querySelector('#skills')).toBeInTheDocument();
    expect(container.querySelector('#contact')).toBeInTheDocument();
  });

  it('NÃO renderiza a seção de projetos (oculta por decisão)', () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector('#projects')).not.toBeInTheDocument();
  });

  it('renderiza header e footer', () => {
    render(<HomePage />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
