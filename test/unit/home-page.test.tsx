import { render, screen } from '@testing-library/react';

import { HomePage } from '@/features/home/pages';

describe('HomePage', () => {
  it('renderiza todas as seções visíveis na ordem', () => {
    const { container } = render(<HomePage />);

    expect(container.querySelector('#hero')).toBeInTheDocument();
    expect(container.querySelector('#about')).toBeInTheDocument();
    expect(container.querySelector('#skills')).toBeInTheDocument();
    expect(container.querySelector('#projects')).toBeInTheDocument();
    expect(container.querySelector('#contact')).toBeInTheDocument();
  });

  it('coloca Projetos entre Habilidades e Contato', () => {
    const { container } = render(<HomePage />);

    const ids = Array.from(container.querySelectorAll('main > section')).map(
      (section) => section.id,
    );

    expect(ids).toEqual(['hero', 'about', 'skills', 'projects', 'contact']);
  });

  it('renderiza header e footer', () => {
    render(<HomePage />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
