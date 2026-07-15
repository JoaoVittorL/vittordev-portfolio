import { render, screen } from '@testing-library/react';

import About from '@/features/home/components/about';

describe('About', () => {
  it('renderiza o título e os cards', () => {
    render(<About />);

    expect(screen.getByRole('heading', { name: 'Sobre mim' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Minha Jornada' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Minhas Competências' })).toBeInTheDocument();
  });

  it('lista as 4 competências', () => {
    render(<About />);

    expect(screen.getByText('Código limpo')).toBeInTheDocument();
    expect(screen.getByText('Responsividade')).toBeInTheDocument();
    expect(screen.getByText('Frontend Frameworks')).toBeInTheDocument();
    expect(screen.getByText('UI/UX')).toBeInTheDocument();
  });
});
